import { contextStorage, CustomApiKeys } from '../utils/context.js';

export interface AcademicSearchResult {
  id: string;
  source: 'Europe PMC' | 'PubMed' | 'OpenAlex' | 'Tavily' | 'Direct';
  title: string;
  authors: string;
  year: string;
  journalOrPublisher: string;
  abstract: string;
  doi?: string;
  url?: string;
  isOpenAccess: boolean;
  citationCount?: number;
  relevanceScore?: number;
}

/**
 * Retrieves the currently active custom API keys from AsyncLocalStorage.
 */
export function getActiveApiKeys(): CustomApiKeys {
  const store = contextStorage.getStore();
  return store?.customApiKeys || {};
}

// ==========================================
// 1. ACADEMIC MULTI-SOURCE SEARCH & RERANK
// ==========================================

/**
 * Searches PubMed (NCBI E-Utilities) with optional ncbiApiKey for 10 req/s rate limits.
 */
export async function searchPubMed(query: string, keys: CustomApiKeys, limit: number = 10): Promise<AcademicSearchResult[]> {
  try {
    const apiKeyParam = keys.ncbiApiKey ? `&api_key=${encodeURIComponent(keys.ncbiApiKey)}` : '';
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=${limit}${apiKeyParam}`;
    
    const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': 'DukunSkripsiAcademic/2.0' } });
    if (!searchRes.ok) return [];
    
    const searchData = await searchRes.json();
    const idList: string[] = searchData?.esearchresult?.idlist || [];
    if (idList.length === 0) return [];

    // Fetch summaries
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idList.join(',')}&retmode=json${apiKeyParam}`;
    const summaryRes = await fetch(summaryUrl, { headers: { 'User-Agent': 'DukunSkripsiAcademic/2.0' } });
    if (!summaryRes.ok) return [];

    const summaryData = await summaryRes.json();
    const resultObj = summaryData?.result || {};

    const results: AcademicSearchResult[] = [];
    for (const id of idList) {
      const item = resultObj[id];
      if (!item) continue;

      const authors = Array.isArray(item.authors) 
        ? item.authors.map((a: any) => a.name).slice(0, 3).join(', ') + (item.authors.length > 3 ? ' et al.' : '')
        : 'Unknown Author';
      const year = item.pubdate ? String(item.pubdate).substring(0, 4) : new Date().getFullYear().toString();
      const doi = item.articleids?.find((aid: any) => aid.idtype === 'doi')?.value || '';

      results.push({
        id: `pubmed-${id}`,
        source: 'PubMed',
        title: item.title?.replace(/<[^>]+>/g, '') || 'Untitled Article',
        authors,
        year,
        journalOrPublisher: item.source || item.fulljournalname || 'PubMed Central',
        abstract: item.sorttitle || 'Abstrak tersedia di portal resmi PubMed/NCBI.',
        doi: doi || undefined,
        url: doi ? `https://doi.org/${doi}` : `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        isOpenAccess: true,
        citationCount: item.pmcrefcount || 0
      });
    }

    return results;
  } catch (err) {
    console.warn('PubMed Search failed:', err);
    return [];
  }
}

/**
 * Searches OpenAlex Open Science Catalog (250M+ works) with optional openAlexApiKey.
 */
export async function searchOpenAlex(query: string, keys: CustomApiKeys, limit: number = 10): Promise<AcademicSearchResult[]> {
  try {
    const headers: Record<string, string> = { 'User-Agent': 'DukunSkripsi/2.0 (mailto:academic@dukunofficial.ac.id)' };
    if (keys.openAlexApiKey) {
      headers['api_key'] = keys.openAlexApiKey;
    }

    const openAlexUrl = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=${limit}`;
    const res = await fetch(openAlexUrl, { headers });
    if (!res.ok) return [];

    const data = await res.json();
    const works = data?.results || [];

    return works.map((w: any) => {
      const authors = Array.isArray(w.authorships)
        ? w.authorships.map((a: any) => a.author?.display_name).slice(0, 3).join(', ') + (w.authorships.length > 3 ? ' et al.' : '')
        : 'Unknown Author';

      return {
        id: `openalex-${w.id?.replace('https://openalex.org/', '') || Date.now()}`,
        source: 'OpenAlex' as const,
        title: w.title || 'Untitled Work',
        authors,
        year: w.publication_year ? String(w.publication_year) : new Date().getFullYear().toString(),
        journalOrPublisher: w.primary_location?.source?.display_name || w.host_venue?.display_name || 'OpenAlex Scientific Index',
        abstract: w.abstract_inverted_index ? 'Abstrak terindeks di basis data OpenAlex Open Science.' : 'Abstrak lengkap dapat diakses via DOI sumber.',
        doi: w.doi ? w.doi.replace('https://doi.org/', '') : undefined,
        url: w.doi || w.primary_location?.landing_page_url || w.id,
        isOpenAccess: Boolean(w.open_access?.is_oa),
        citationCount: w.cited_by_count || 0
      };
    });
  } catch (err) {
    console.warn('OpenAlex search failed:', err);
    return [];
  }
}

/**
 * Searches Tavily AI Search for scientific and web academic grounding.
 */
export async function searchTavily(query: string, keys: CustomApiKeys, limit: number = 5): Promise<AcademicSearchResult[]> {
  if (!keys.tavilyApiKey) return [];
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: keys.tavilyApiKey,
        query: `${query} academic research paper journal filetype:pdf OR doi`,
        search_depth: 'advanced',
        include_answer: true,
        max_results: limit
      })
    });

    if (!res.ok) return [];
    const data = await res.json();
    const results = data?.results || [];

    return results.map((r: any, idx: number) => ({
      id: `tavily-${Date.now()}-${idx}`,
      source: 'Tavily' as const,
      title: r.title || 'Academic Reference Source',
      authors: 'Web / Research Portal',
      year: new Date().getFullYear().toString(),
      journalOrPublisher: new URL(r.url).hostname || 'Online Research Source',
      abstract: r.content || 'Informasi ringkas dan temuan ilmiah tervalidasi oleh Tavily Research AI.',
      url: r.url,
      isOpenAccess: true,
      relevanceScore: r.score || 0.95
    }));
  } catch (err) {
    console.warn('Tavily search failed:', err);
    return [];
  }
}

/**
 * Reranks academic search results using Cohere Rerank v3.
 */
export async function rerankWithCohere(query: string, documents: AcademicSearchResult[], keys: CustomApiKeys): Promise<AcademicSearchResult[]> {
  if (!keys.cohereRerankApiKey || documents.length <= 1) return documents;

  try {
    const docsForRerank = documents.map(d => `${d.title}. ${d.abstract || ''}`);
    const res = await fetch('https://api.cohere.com/v2/rerank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keys.cohereRerankApiKey}`
      },
      body: JSON.stringify({
        model: 'rerank-v3.5',
        query,
        documents: docsForRerank,
        top_n: documents.length
      })
    });

    if (!res.ok) {
      console.warn('Cohere Rerank API response not ok, returning original order');
      return documents;
    }

    const data = await res.json();
    const rankedResults: AcademicSearchResult[] = [];
    if (Array.isArray(data.results)) {
      for (const item of data.results) {
        const originalDoc = documents[item.index];
        if (originalDoc) {
          rankedResults.push({
            ...originalDoc,
            relevanceScore: item.relevance_score
          });
        }
      }
      return rankedResults.length > 0 ? rankedResults : documents;
    }
  } catch (err) {
    console.warn('Cohere Rerank error, using fallback sort:', err);
  }

  return documents;
}

// ==========================================
// 2. DOCUMENT SCRAPING & WEB PARSING (Firecrawl & Jina Reader)
// ==========================================

/**
 * Scrapes any research webpage, university portal, or DOI link into clean Markdown.
 * Prioritizes Firecrawl API, then Jina Reader API, then standard fetch.
 */
export async function scrapeUrlToMarkdown(url: string, keys?: CustomApiKeys): Promise<{ markdown: string; title?: string; success: boolean; engineUsed: string }> {
  const activeKeys = keys || getActiveApiKeys();

  // 1. Try Firecrawl Scrape API
  if (activeKeys.firecrawlApiKey) {
    try {
      const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKeys.firecrawlApiKey}`
        },
        body: JSON.stringify({
          url,
          formats: ['markdown'],
          onlyMainContent: true
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data?.markdown) {
          return {
            markdown: data.data.markdown,
            title: data.data.metadata?.title,
            success: true,
            engineUsed: 'Firecrawl Scraper'
          };
        }
      }
    } catch (e) {
      console.warn('Firecrawl scrape error, falling back to Jina Reader:', e);
    }
  }

  // 2. Try Jina Reader API (https://r.jina.ai/)
  try {
    const jinaHeaders: Record<string, string> = { 'Accept': 'text/markdown' };
    if (activeKeys.jinaApiKey) {
      jinaHeaders['Authorization'] = `Bearer ${activeKeys.jinaApiKey}`;
    }

    const jinaRes = await fetch(`https://r.jina.ai/${encodeURI(url)}`, { headers: jinaHeaders });
    if (jinaRes.ok) {
      const mdText = await jinaRes.text();
      if (mdText && mdText.length > 20) {
        return {
          markdown: mdText,
          success: true,
          engineUsed: activeKeys.jinaApiKey ? 'Jina Reader (Authenticated)' : 'Jina Reader (Standard)'
        };
      }
    }
  } catch (e) {
    console.warn('Jina Reader error:', e);
  }

  // 3. Fallback direct fetch
  try {
    const rawRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    const htmlText = await rawRes.text();
    const cleanText = htmlText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                              .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                              .replace(/<[^>]+>/g, ' ')
                              .replace(/\s+/g, ' ')
                              .trim();
    return {
      markdown: cleanText.substring(0, 15000),
      success: true,
      engineUsed: 'Native Web Scraper'
    };
  } catch (err: any) {
    return {
      markdown: `Gagal membaca konten tautan: ${err.message}`,
      success: false,
      engineUsed: 'Failed'
    };
  }
}

// ==========================================
// 3. VECTOR EMBEDDINGS & QDRANT CLOUD
// ==========================================

/**
 * Computes vector embeddings using Voyage AI or Jina Embeddings.
 */
export async function computeEmbedding(text: string, keys?: CustomApiKeys): Promise<number[] | null> {
  const activeKeys = keys || getActiveApiKeys();

  // 1. Voyage AI Embeddings
  if (activeKeys.voyageApiKey) {
    try {
      const res = await fetch('https://api.voyageai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKeys.voyageApiKey}`
        },
        body: JSON.stringify({
          input: [text.substring(0, 4000)],
          model: 'voyage-3'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.[0]?.embedding) {
          return data.data[0].embedding;
        }
      }
    } catch (e) {
      console.warn('Voyage AI embedding error:', e);
    }
  }

  // 2. Jina AI Embeddings
  if (activeKeys.jinaApiKey) {
    try {
      const res = await fetch('https://api.jina.ai/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKeys.jinaApiKey}`
        },
        body: JSON.stringify({
          input: [text.substring(0, 4000)],
          model: 'jina-embeddings-v3'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.[0]?.embedding) {
          return data.data[0].embedding;
        }
      }
    } catch (e) {
      console.warn('Jina AI embedding error:', e);
    }
  }

  return null;
}

/**
 * Stores vector point in Qdrant Cloud Vector Database.
 */
export async function upsertToQdrant(
  pointId: string | number,
  vector: number[],
  payload: Record<string, any>,
  collectionName: string = 'thesis_documents',
  keys?: CustomApiKeys
): Promise<boolean> {
  const activeKeys = keys || getActiveApiKeys();
  if (!activeKeys.qdrantUrl) return false;

  try {
    const qdrantBase = activeKeys.qdrantUrl.replace(/\/+$/, '');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (activeKeys.qdrantApiKey) {
      headers['api-key'] = activeKeys.qdrantApiKey;
    }

    const res = await fetch(`${qdrantBase}/collections/${collectionName}/points`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        points: [
          {
            id: pointId,
            vector,
            payload
          }
        ]
      })
    });

    return res.ok;
  } catch (err) {
    console.warn('Qdrant upsert failed:', err);
    return false;
  }
}

/**
 * Queries Qdrant Cloud Vector Database.
 */
export async function queryQdrantVector(
  vector: number[],
  limit: number = 5,
  collectionName: string = 'thesis_documents',
  keys?: CustomApiKeys
): Promise<any[]> {
  const activeKeys = keys || getActiveApiKeys();
  if (!activeKeys.qdrantUrl) return [];

  try {
    const qdrantBase = activeKeys.qdrantUrl.replace(/\/+$/, '');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (activeKeys.qdrantApiKey) {
      headers['api-key'] = activeKeys.qdrantApiKey;
    }

    const res = await fetch(`${qdrantBase}/collections/${collectionName}/points/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        vector,
        limit,
        with_payload: true
      })
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.result || [];
  } catch (err) {
    console.warn('Qdrant search failed:', err);
    return [];
  }
}

// ==========================================
// 4. COMPLEX PDF PARSING (LlamaCloud / LlamaParse)
// ==========================================

export async function parseWithLlamaCloud(fileBuffer: Buffer, fileName: string, keys?: CustomApiKeys): Promise<string | null> {
  const activeKeys = keys || getActiveApiKeys();
  if (!activeKeys.llamaCloudApiKey) return null;

  try {
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    formData.append('file', blob, fileName);

    const uploadRes = await fetch('https://api.cloud.llamaindex.ai/api/parsing/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeKeys.llamaCloudApiKey}`
      },
      body: formData
    });

    if (!uploadRes.ok) return null;
    const uploadData = await uploadRes.json();
    const jobId = uploadData.id;

    // Poll for completion (max 5 iterations)
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 1500));
      const statusRes = await fetch(`https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}/result/markdown`, {
        headers: { 'Authorization': `Bearer ${activeKeys.llamaCloudApiKey}` }
      });
      if (statusRes.ok) {
        const md = await statusRes.text();
        if (md && md.length > 50) return md;
      }
    }
  } catch (e) {
    console.warn('LlamaCloud parsing error:', e);
  }

  return null;
}

// ==========================================
// 5. MCP (MODEL CONTEXT PROTOCOL) & CONTEXT7
// ==========================================

export async function queryMcpServer(
  serverType: 'agribrain' | 'leafengines' | 'agriculture',
  queryText: string,
  keys?: CustomApiKeys
): Promise<any> {
  const activeKeys = keys || getActiveApiKeys();
  let endpoint = '';
  let apiKey = '';

  if (serverType === 'agribrain') {
    endpoint = activeKeys.agriBrainEndpoint || 'http://localhost:8000/sse';
  } else if (serverType === 'leafengines') {
    endpoint = activeKeys.leafEnginesEndpoint || 'https://api.leafengines.mcp/v1/sse';
    apiKey = activeKeys.leafEnginesApiKey || '';
  } else if (serverType === 'agriculture') {
    endpoint = activeKeys.agricultureMcpEndpoint || 'http://localhost:8080/mcp';
  }

  if (!endpoint) return null;

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        method: 'tools/call',
        params: {
          name: 'query_agricultural_knowledge',
          arguments: { query: queryText }
        }
      })
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`MCP Server (${serverType}) connection skipped or offline:`, err);
  }

  return null;
}

/**
 * Injects Context7 Research Memory into prompt if context7ApiKey is configured.
 */
export async function injectContext7Memory(prompt: string, keys?: CustomApiKeys): Promise<string> {
  const activeKeys = keys || getActiveApiKeys();
  if (!activeKeys.context7ApiKey) return prompt;

  try {
    const res = await fetch('https://api.context7.com/v1/context/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeKeys.context7ApiKey}`
      },
      body: JSON.stringify({ query: prompt.substring(0, 300), limit: 3 })
    });

    if (res.ok) {
      const data = await res.json();
      const memories = data.memories || [];
      if (memories.length > 0) {
        const memoryContext = memories.map((m: any) => `- ${m.content}`).join('\n');
        return `[Context7 Academic Research Memory]:\n${memoryContext}\n\n[User Prompt]:\n${prompt}`;
      }
    }
  } catch (e) {
    console.warn('Context7 memory query skipped:', e);
  }

  return prompt;
}
