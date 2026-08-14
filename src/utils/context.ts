import { AsyncLocalStorage } from 'async_hooks';

export interface CustomApiKeys {
  selectedEngine?: string;
  geminiApiKey?: string;
  nvidiaApiKey?: string;
  mistralApiKey?: string;
  groqApiKey?: string;
  deepseekApiKey?: string;
  openrouterApiKey?: string;
  prismApiKey?: string;
  cohereApiKey?: string;
  
  // Search & Academic
  tavilyApiKey?: string;
  ncbiApiKey?: string;
  openAlexApiKey?: string;

  // Embeddings & Reranker
  jinaApiKey?: string;
  voyageApiKey?: string;
  cohereRerankApiKey?: string;

  // Vector DB & Storage
  qdrantUrl?: string;
  qdrantApiKey?: string;

  // Document Scraping & Parsing
  firecrawlApiKey?: string;
  llamaCloudApiKey?: string;

  // Vision & MCP
  context7ApiKey?: string;
  agriBrainEndpoint?: string;
  leafEnginesEndpoint?: string;
  leafEnginesApiKey?: string;
  agricultureMcpEndpoint?: string;
}

export interface RequestContext {
  customApiKeys?: CustomApiKeys | null;
}

export const contextStorage = new AsyncLocalStorage<RequestContext>();
