import { AsyncLocalStorage } from 'async_hooks';

export interface CustomApiKeys {
  selectedEngine?: string;
  
  // 1. AI Reasoning & LLM
  geminiApiKey?: string;
  geminiEnabled?: boolean;
  nvidiaApiKey?: string;
  nvidiaEnabled?: boolean;
  mistralApiKey?: string;
  mistralEnabled?: boolean;
  groqApiKey?: string;
  groqEnabled?: boolean;
  deepseekApiKey?: string;
  deepseekEnabled?: boolean;
  openrouterApiKey?: string;
  openrouterEnabled?: boolean;
  prismApiKey?: string;
  prismEnabled?: boolean;
  cohereApiKey?: string;
  cohereEnabled?: boolean;
  
  // 2. Search & Academic
  tavilyApiKey?: string;
  tavilyEnabled?: boolean;
  ncbiApiKey?: string;
  ncbiEnabled?: boolean;
  openAlexApiKey?: string;
  openAlexEnabled?: boolean;
  europePmcEnabled?: boolean;

  // 3. Embeddings & Reranker
  jinaApiKey?: string;
  jinaEnabled?: boolean;
  voyageApiKey?: string;
  voyageEnabled?: boolean;
  cohereRerankApiKey?: string;
  cohereRerankEnabled?: boolean;

  // 4. Vector DB & Storage
  qdrantUrl?: string;
  qdrantApiKey?: string;
  qdrantEnabled?: boolean;

  // 5. Document Scraping & Parsing
  firecrawlApiKey?: string;
  firecrawlEnabled?: boolean;
  llamaCloudApiKey?: string;
  llamaCloudEnabled?: boolean;

  // 6. Vision & MCP
  context7ApiKey?: string;
  context7Enabled?: boolean;
  agriBrainEndpoint?: string;
  agriBrainEnabled?: boolean;
  leafEnginesEndpoint?: string;
  leafEnginesApiKey?: string;
  leafEnginesEnabled?: boolean;
  agricultureMcpEndpoint?: string;
  agricultureMcpEnabled?: boolean;

  [key: string]: any;
}

export interface RequestContext {
  customApiKeys?: CustomApiKeys | null;
}

export const contextStorage = new AsyncLocalStorage<RequestContext>();
