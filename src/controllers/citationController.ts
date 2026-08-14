import { Request, Response } from 'express';
import { generateBibliography as aiGenerateBibliography } from '../services/aiService.js';
import { 
  searchPubMed, 
  searchOpenAlex, 
  searchTavily, 
  rerankWithCohere, 
  scrapeUrlToMarkdown, 
  computeEmbedding, 
  queryQdrantVector, 
  upsertToQdrant,
  queryMcpServer,
  getActiveApiKeys,
  AcademicSearchResult
} from '../services/unifiedIntegrationService.js';

const citations: any[] = [];

export const createCitation = (req: Request, res: Response) => {
  const citation = { id: Date.now().toString(), ...req.body };
  citations.push(citation);
  res.status(201).json({ message: 'Citation added', citation });
};

export const getCitations = (req: Request, res: Response) => {
  res.json({ citations });
};

export const getCitationDetail = (req: Request, res: Response) => {
  const citation = citations.find(c => c.id === req.params.id);
  if (!citation) return res.status(404).json({ error: 'Citation not found' });
  res.json({ citation });
};

export const updateCitation = (req: Request, res: Response) => {
  const index = citations.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Citation not found' });
  citations[index] = { ...citations[index], ...req.body };
  res.json({ message: 'Citation updated', citation: citations[index] });
};

export const deleteCitation = (req: Request, res: Response) => {
  const index = citations.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Citation not found' });
  citations.splice(index, 1);
  res.json({ message: 'Citation deleted' });
};

export const generateBibliography = async (req: Request, res: Response) => {
  const { style, sources, citationIds } = req.body;
  const sourcesToFormat = sources && sources.length > 0
    ? sources
    : citations.filter(c => citationIds?.includes(c.id));
  
  if (!sourcesToFormat || sourcesToFormat.length === 0) {
    return res.status(400).json({ error: 'Tidak ada sumber referensi yang dipilih' });
  }

  const result = await aiGenerateBibliography(sourcesToFormat, style || 'APA 7th Edition');
  res.json({ message: 'Daftar Pustaka berhasil dibuat', ...result });
};

export const importFromScholar = (req: Request, res: Response) => {
  const { query } = req.body;
  const imported = {
    id: Date.now().toString(),
    title: `Imported paper for query: ${query}`,
    authors: 'John Doe',
    year: new Date().getFullYear(),
    source: 'Google Scholar'
  };
  citations.push(imported);
  res.status(201).json({ message: 'Citation imported from Google Scholar', citation: imported });
};

export const getStyles = (req: Request, res: Response) => {
  const styles = ['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE'];
  res.json({ styles });
};

/**
 * Direct Europe PMC proxy
 */
export const searchEuropePmcHandler = async (req: Request, res: Response) => {
  try {
    const query = String(req.query.query || '');
    if (!query.trim()) {
      return res.status(400).json({ error: 'Query pencarian diperlukan' });
    }

    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.page) || 1;
    const resultType = String(req.query.resultType || 'core');
    const synonym = req.query.synonym !== 'false';
    const sort = req.query.sort ? String(req.query.sort) : undefined;

    const params = new URLSearchParams({
      query,
      format: 'json',
      resultType,
      pageSize: String(pageSize),
      page: String(page),
      synonym: String(synonym)
    });

    if (sort) {
      params.set('sort', sort);
    }

    const targetUrl = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?${params.toString()}`;
    const epmcRes = await fetch(targetUrl, {
      headers: { 'Accept': 'application/json' }
    });

    if (!epmcRes.ok) {
      return res.status(epmcRes.status).json({ error: 'Gagal mengambil data dari Europe PMC API' });
    }

    const data = await epmcRes.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Europe PMC Proxy Error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan saat memproses pencarian Europe PMC', details: error.message });
  }
};

/**
 * Multi-Source Unified Academic Search with Europe PMC, PubMed (NCBI API Key),
 * OpenAlex (OpenAlex API Key), Tavily AI Search (Tavily Key), and Cohere Rerank (Cohere Key).
 */
export const searchUnifiedAcademic = async (req: Request, res: Response) => {
  try {
    const query = String(req.query.query || req.body.query || '');
    if (!query.trim()) {
      return res.status(400).json({ error: 'Query pencarian diperlukan' });
    }

    const limit = Number(req.query.limit || req.body.limit) || 12;
    const keys = getActiveApiKeys();

    // 1. Concurrent Multi-Source Fetching
    const [pubmedDocs, openAlexDocs, tavilyDocs] = await Promise.all([
      searchPubMed(query, keys, 8),
      searchOpenAlex(query, keys, 8),
      searchTavily(query, keys, 4)
    ]);

    // Also fetch Europe PMC
    let europePmcDocs: AcademicSearchResult[] = [];
    try {
      const epmcRes = await fetch(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&pageSize=8&resultType=core`);
      if (epmcRes.ok) {
        const epmcData = await epmcRes.json();
        const results = epmcData?.resultList?.result || [];
        europePmcDocs = results.map((r: any) => ({
          id: `epmc-${r.id}`,
          source: 'Europe PMC' as const,
          title: r.title?.replace(/\.$/, '') || 'Untitled Paper',
          authors: r.authorString || 'Unknown Author',
          year: r.pubYear || new Date().getFullYear().toString(),
          journalOrPublisher: r.journalTitle || r.journalInfo?.journal?.title || 'Europe PMC Journal',
          abstract: r.abstractText?.replace(/<[^>]+>/g, '') || 'Abstrak tersedia di portal resmi Europe PMC.',
          doi: r.doi,
          url: r.doi ? `https://doi.org/${r.doi}` : `https://europepmc.org/article/${r.source}/${r.id}`,
          isOpenAccess: r.isOpenAccess === 'Y',
          citationCount: r.citedByCount || 0
        }));
      }
    } catch (e) {
      console.warn('Europe PMC search in unified failed:', e);
    }

    // Merge all sources
    let allDocuments: AcademicSearchResult[] = [
      ...europePmcDocs,
      ...pubmedDocs,
      ...openAlexDocs,
      ...tavilyDocs
    ];

    // Deduplicate by title similarity
    const uniqueDocs: AcademicSearchResult[] = [];
    const seenTitles = new Set<string>();
    for (const doc of allDocuments) {
      const normalizedTitle = doc.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 40);
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueDocs.push(doc);
      }
    }

    // 2. Cohere Rerank if API Key configured
    const rerankedDocs = await rerankWithCohere(query, uniqueDocs, keys);
    const finalResults = rerankedDocs.slice(0, limit);

    return res.json({
      query,
      totalFound: finalResults.length,
      rerankedWithCohere: Boolean(keys.cohereRerankApiKey),
      sourcesUsed: {
        europePmc: europePmcDocs.length > 0,
        pubmed: pubmedDocs.length > 0,
        openAlex: openAlexDocs.length > 0,
        tavily: tavilyDocs.length > 0
      },
      results: finalResults
    });
  } catch (error: any) {
    console.error('Unified Academic Search Error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan saat memproses multi-source search', details: error.message });
  }
};

/**
 * Web Scraper API using Firecrawl or Jina Reader
 */
export const scrapeAcademicUrl = async (req: Request, res: Response) => {
  try {
    const url = String(req.body.url || req.query.url || '');
    if (!url || !url.startsWith('http')) {
      return res.status(400).json({ error: 'URL valid diperlukan (http:// atau https://)' });
    }

    const keys = getActiveApiKeys();
    const result = await scrapeUrlToMarkdown(url, keys);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: 'Gagal melakukan scraping URL', details: error.message });
  }
};

/**
 * Vector Search & Embeddings API (Qdrant + Voyage AI / Jina)
 */
export const vectorSearchHandler = async (req: Request, res: Response) => {
  try {
    const { queryText, limit = 5, collectionName = 'thesis_documents' } = req.body;
    if (!queryText) {
      return res.status(400).json({ error: 'queryText diperlukan' });
    }

    const keys = getActiveApiKeys();
    const embedding = await computeEmbedding(queryText, keys);
    if (!embedding) {
      return res.status(400).json({ error: 'Gagal menghitung embedding. Pastikan Voyage AI atau Jina AI key terkonfigurasi.' });
    }

    const qdrantResults = await queryQdrantVector(embedding, limit, collectionName, keys);
    return res.json({
      query: queryText,
      results: qdrantResults,
      vectorDimension: embedding.length
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Vector search error', details: error.message });
  }
};

/**
 * MCP Server Query API (AgriBrain, LeafEngines, Agriculture MCP)
 */
export const mcpQueryHandler = async (req: Request, res: Response) => {
  try {
    const { serverType, queryText } = req.body;
    if (!serverType || !queryText) {
      return res.status(400).json({ error: 'serverType dan queryText diperlukan' });
    }

    const keys = getActiveApiKeys();
    const result = await queryMcpServer(serverType, queryText, keys);
    return res.json({
      serverType,
      result: result || { message: `MCP ${serverType} offline atau merespons tanpa payload.` }
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Gagal menghubungi MCP Server', details: error.message });
  }
};
