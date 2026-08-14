export interface EuropePmcAuthor {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  initials?: string;
  authorId?: {
    type: string;
    value: string;
  };
}

export interface EuropePmcFullTextUrl {
  availability: string;
  availabilityCode: string;
  documentStyle: string;
  site: string;
  url: string;
}

export interface EuropePmcJournalInfo {
  journal?: {
    title?: string;
    medlineAbbreviation?: string;
    essn?: string;
    issn?: string;
  };
  yearOfPublication?: number;
  monthOfPublication?: number;
  volume?: string;
  issue?: string;
  pageInfo?: string;
}

export interface EuropePmcArticle {
  id: string;
  source: string;
  pmid?: string;
  pmcid?: string;
  doi?: string;
  title: string;
  authorString?: string;
  authorList?: {
    author: EuropePmcAuthor[];
  };
  journalInfo?: EuropePmcJournalInfo;
  journalTitle?: string;
  pubYear?: string;
  pageInfo?: string;
  abstractText?: string;
  isOpenAccess?: 'Y' | 'N';
  inEPMC?: 'Y' | 'N';
  inPMC?: 'Y' | 'N';
  hasPDF?: 'Y' | 'N';
  hasBook?: 'Y' | 'N';
  hasSuppl?: 'Y' | 'N';
  citedByCount?: number;
  fullTextUrlList?: {
    fullTextUrl: EuropePmcFullTextUrl[];
  };
  relevanceScore?: number;
}

export interface EuropePmcSearchResponse {
  version?: string;
  hitCount: number;
  nextCursorMark?: string;
  resultList?: {
    result: EuropePmcArticle[];
  };
}

export interface SearchOptions {
  pageSize?: number;
  page?: number;
  openAccessOnly?: boolean;
  sortBy?: 'relevance' | 'cited' | 'date';
  synonym?: boolean;
  unifiedMultiSource?: boolean;
}

/**
 * Searches Europe PMC, PubMed (NCBI API), OpenAlex, Tavily AI Search, and applies Cohere Rerank.
 */
export async function searchEuropePmc(
  query: string,
  options: SearchOptions = {}
): Promise<{ articles: EuropePmcArticle[]; hitCount: number; reranked?: boolean }> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { articles: [], hitCount: 0 };
  }

  const {
    pageSize = 12,
    page = 1,
    openAccessOnly = false,
    sortBy = 'relevance',
    synonym = true,
    unifiedMultiSource = true
  } = options;

  // 1. Try Unified Multi-Source Endpoint First (Europe PMC + PubMed + OpenAlex + Tavily + Cohere Rerank)
  if (unifiedMultiSource) {
    try {
      const res = await fetch('/api/citations/search-unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed, limit: pageSize })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          const mappedArticles: EuropePmcArticle[] = data.results.map((r: any) => ({
            id: r.id,
            source: r.source || 'MED',
            doi: r.doi,
            title: r.title,
            authorString: r.authors,
            journalTitle: r.journalOrPublisher,
            pubYear: r.year,
            abstractText: r.abstract,
            isOpenAccess: r.isOpenAccess ? 'Y' : 'N',
            citedByCount: r.citationCount || 0,
            relevanceScore: r.relevanceScore,
            fullTextUrlList: r.url ? { fullTextUrl: [{ url: r.url, availability: 'Free', availabilityCode: 'F', documentStyle: 'pdf', site: r.source }] } : undefined
          }));

          return {
            articles: mappedArticles,
            hitCount: data.totalFound || mappedArticles.length,
            reranked: data.rerankedWithCohere
          };
        }
      }
    } catch (e) {
      console.warn('Unified multi-source search fallback to direct Europe PMC:', e);
    }
  }

  // 2. Direct Europe PMC Search fallback
  let builtQuery = trimmed;
  if (openAccessOnly) {
    builtQuery = `(${builtQuery}) AND (OPEN_ACCESS:y)`;
  }

  const params = new URLSearchParams();
  params.set('query', builtQuery);
  params.set('format', 'json');
  params.set('resultType', 'core');
  params.set('pageSize', pageSize.toString());
  params.set('page', page.toString());
  if (synonym) params.set('synonym', 'true');

  if (sortBy === 'cited') {
    params.set('sort', 'CITED desc');
  } else if (sortBy === 'date') {
    params.set('sort', 'P_PD_DATE desc');
  }

  // Direct public API call to Europe PMC
  const directUrl = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?${params.toString()}`;
  
  try {
    const res = await fetch(directUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      const data: EuropePmcSearchResponse = await res.json();
      return {
        articles: data.resultList?.result || [],
        hitCount: data.hitCount || 0
      };
    }
  } catch (directErr) {
    console.warn('Europe PMC direct fetch failed, trying proxy...', directErr);
  }

  // Server-side proxy endpoint fallback
  try {
    const proxyUrl = `/api/citations/europepmc/search?${params.toString()}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const data: EuropePmcSearchResponse = await res.json();
      return {
        articles: data.resultList?.result || [],
        hitCount: data.hitCount || 0
      };
    }
  } catch (proxyErr) {
    console.error('Europe PMC proxy failed:', proxyErr);
  }

  return { articles: [], hitCount: 0 };
}

/**
 * Strips HTML formatting from abstract text
 */
export function cleanAbstract(abstractText?: string): string {
  if (!abstractText) return 'Abstrak tidak tersedia untuk publikasi ini.';
  return abstractText
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Converts Europe PMC or Multi-Source article to Citation Manager Source format
 */
export function convertEuropePmcToSource(article: EuropePmcArticle) {
  const cleanTitle = article.title?.replace(/\.$/, '') || 'Untitled Publication';
  const journalName = article.journalTitle || 
                     article.journalInfo?.journal?.title || 
                     (article.source === 'PPR' ? 'Europe PMC Preprint' : `${article.source || 'Europe PMC'} Academic Index`);
  
  const authors = article.authorString || 
                  article.authorList?.author?.map(a => a.fullName || `${a.lastName || ''} ${a.initials || ''}`).filter(Boolean).join(', ') || 
                  'Penulis Akademik';
  
  const year = article.pubYear || 
               (article.journalInfo?.yearOfPublication ? String(article.journalInfo.yearOfPublication) : String(new Date().getFullYear()));

  const pdfUrl = article.fullTextUrlList?.fullTextUrl?.find(u => u.documentStyle === 'pdf')?.url ||
                 article.fullTextUrlList?.fullTextUrl?.[0]?.url ||
                 (article.doi ? `https://doi.org/${article.doi}` : `https://europepmc.org/article/${article.source}/${article.id}`);

  return {
    id: `${article.source || 'cite'}-${article.id}`,
    type: 'Journal' as const,
    title: cleanTitle,
    authors,
    year,
    publisher: journalName,
    doi: article.doi,
    url: pdfUrl,
    selected: true
  };
}

/**
 * Formats article into ready-to-copy citation string
 */
export function formatQuickCitation(article: EuropePmcArticle, style: 'APA' | 'IEEE' | 'Harvard' | 'BibTeX' = 'APA'): string {
  const source = convertEuropePmcToSource(article);
  const firstAuthor = source.authors.split(',')[0] || source.authors;

  switch (style) {
    case 'IEEE':
      return `${source.authors}, "${source.title}," ${source.publisher}, ${source.year}${source.doi ? `, doi: ${source.doi}` : ''}.`;
    case 'Harvard':
      return `${source.authors} (${source.year}) '${source.title}', ${source.publisher}${source.doi ? `, doi: ${source.doi}` : ''}.`;
    case 'BibTeX': {
      const citeKey = firstAuthor.replace(/[^a-zA-Z]/g, '').toLowerCase() + source.year;
      return `@article{${citeKey},\n  author = {${source.authors}},\n  title = {${source.title}},\n  journal = {${source.publisher}},\n  year = {${source.year}},\n  ${source.doi ? `doi = {${source.doi}},\n  ` : ''}${source.url ? `url = {${source.url}},\n  ` : ''}}`;
    }
    case 'APA':
    default:
      return `${source.authors} (${source.year}). ${source.title}. ${source.publisher}${source.doi ? `. https://doi.org/${source.doi}` : ''}`;
  }
}
