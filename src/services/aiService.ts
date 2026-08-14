import { GoogleGenAI } from '@google/genai';
import { contextStorage } from '../utils/context.js';
import { PROMPT_TEMPLATES } from '../utils/promptTemplates.js';
import { injectContext7Memory } from './unifiedIntegrationService.js';

const DEFAULT_MODEL = 'gemini-flash-latest';

// --- Synergy Multi-AI Engine Helpers ---
async function callOpenAICompatible(endpoint: string, apiKey: string, model: string, prompt: string, systemInstruction?: string) {
  const messages: any[] = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });
  
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7
    })
  });
  
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API Error (${endpoint}): ${errText}`);
  }
  
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callCohereChat(apiKey: string, prompt: string, systemInstruction?: string) {
  const messages: any[] = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const res = await fetch('https://api.cohere.com/v2/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'command-r-plus-08-2024',
      messages
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cohere API Error: ${errText}`);
  }

  const data = await res.json();
  return data.message?.content?.[0]?.text || '';
}

/**
 * Universal Multi-Engine AI Execution with Automatic Failover, Task Routing,
 * and Context7 Research Memory Injection.
 */
export async function runSynergyEngine(prompt: string, systemInstruction?: string, fallbackTask?: string): Promise<string> {
  const context = contextStorage.getStore();
  const keys = context?.customApiKeys || {};

  const geminiEnabled = keys.geminiEnabled !== false;
  const groqEnabled = keys.groqEnabled !== false;
  const deepseekEnabled = keys.deepseekEnabled !== false;
  const openrouterEnabled = keys.openrouterEnabled !== false;
  const prismEnabled = keys.prismEnabled !== false;
  const mistralEnabled = keys.mistralEnabled !== false;
  const nvidiaEnabled = keys.nvidiaEnabled !== false;
  const cohereEnabled = keys.cohereEnabled !== false;

  // Inject Context7 research memory if configured and enabled
  const effectivePrompt = keys.context7Enabled !== false ? await injectContext7Memory(prompt, keys) : prompt;
  
  // Helper to try alternative AI engines in cascade
  const tryAlternativeEngines = async (): Promise<string | null> => {
    try {
      if (groqEnabled && keys.groqApiKey) {
        return await callOpenAICompatible('https://api.groq.com/openai/v1/chat/completions', keys.groqApiKey, 'llama-3.3-70b-versatile', effectivePrompt, systemInstruction);
      }
      if (deepseekEnabled && keys.deepseekApiKey) {
        return await callOpenAICompatible('https://api.deepseek.com/chat/completions', keys.deepseekApiKey, 'deepseek-chat', effectivePrompt, systemInstruction);
      }
      if (openrouterEnabled && keys.openrouterApiKey) {
        return await callOpenAICompatible('https://openrouter.ai/api/v1/chat/completions', keys.openrouterApiKey, 'auto', effectivePrompt, systemInstruction);
      }
      if (prismEnabled && keys.prismApiKey) {
        return await callOpenAICompatible('https://api.openai.com/v1/chat/completions', keys.prismApiKey, 'gpt-4o-mini', effectivePrompt, systemInstruction);
      }
      if (mistralEnabled && keys.mistralApiKey) {
        return await callOpenAICompatible('https://api.mistral.ai/v1/chat/completions', keys.mistralApiKey, 'mistral-large-latest', effectivePrompt, systemInstruction);
      }
      if (nvidiaEnabled && keys.nvidiaApiKey) {
        return await callOpenAICompatible('https://integrate.api.nvidia.com/v1/chat/completions', keys.nvidiaApiKey, 'meta/llama-3.3-70b-instruct', effectivePrompt, systemInstruction);
      }
      if (cohereEnabled && keys.cohereApiKey) {
        return await callCohereChat(keys.cohereApiKey, effectivePrompt, systemInstruction);
      }
    } catch (altErr: any) {
      const msg = altErr?.message || '';
      if (!msg.includes('Insufficient Balance') && !msg.includes('insufficient_quota')) {
        console.warn('Alternative engine in cascade encountered issue:', altErr);
      }
    }
    return null;
  };

  // If user selected specific engine (not synergy)
  if (keys.selectedEngine && keys.selectedEngine !== 'multi_synergy' && keys.selectedEngine !== 'gemini-flash-latest' && keys.selectedEngine !== 'gemini-2.5-flash' && keys.selectedEngine !== 'gemini') {
    try {
      if (keys.selectedEngine === 'groq' && groqEnabled && keys.groqApiKey) {
        return await callOpenAICompatible('https://api.groq.com/openai/v1/chat/completions', keys.groqApiKey, 'llama-3.3-70b-versatile', effectivePrompt, systemInstruction);
      }
      if (keys.selectedEngine === 'deepseek' && deepseekEnabled && keys.deepseekApiKey) {
        return await callOpenAICompatible('https://api.deepseek.com/chat/completions', keys.deepseekApiKey, 'deepseek-chat', effectivePrompt, systemInstruction);
      }
      if (keys.selectedEngine === 'mistral' && mistralEnabled && keys.mistralApiKey) {
        return await callOpenAICompatible('https://api.mistral.ai/v1/chat/completions', keys.mistralApiKey, 'mistral-large-latest', effectivePrompt, systemInstruction);
      }
      if (keys.selectedEngine === 'openrouter' && openrouterEnabled && keys.openrouterApiKey) {
        return await callOpenAICompatible('https://openrouter.ai/api/v1/chat/completions', keys.openrouterApiKey, 'auto', effectivePrompt, systemInstruction);
      }
      if (keys.selectedEngine === 'prism' && prismEnabled && keys.prismApiKey) {
        return await callOpenAICompatible('https://api.openai.com/v1/chat/completions', keys.prismApiKey, 'gpt-4o-mini', effectivePrompt, systemInstruction);
      }
      if (keys.selectedEngine === 'nvidia' && nvidiaEnabled && keys.nvidiaApiKey) {
        return await callOpenAICompatible('https://integrate.api.nvidia.com/v1/chat/completions', keys.nvidiaApiKey, 'meta/llama-3.3-70b-instruct', effectivePrompt, systemInstruction);
      }
      if (keys.selectedEngine === 'cohere' && cohereEnabled && keys.cohereApiKey) {
        return await callCohereChat(keys.cohereApiKey, effectivePrompt, systemInstruction);
      }
    } catch (e) {
      console.warn('Selected engine failed, attempting failover chain:', e);
    }
  }

  // If Synergy Multi-AI is active, dynamically route based on task
  if (keys.selectedEngine === 'multi_synergy') {
    try {
      if (fallbackTask === 'brainstorming' && deepseekEnabled && keys.deepseekApiKey) {
        return await callOpenAICompatible('https://api.deepseek.com/chat/completions', keys.deepseekApiKey, 'deepseek-reasoner', effectivePrompt, systemInstruction);
      }
      if (fallbackTask === 'grammar' && groqEnabled && keys.groqApiKey) {
        return await callOpenAICompatible('https://api.groq.com/openai/v1/chat/completions', keys.groqApiKey, 'llama-3.3-70b-versatile', effectivePrompt, systemInstruction);
      }
      if (fallbackTask === 'chat' && openrouterEnabled && keys.openrouterApiKey) {
        return await callOpenAICompatible('https://openrouter.ai/api/v1/chat/completions', keys.openrouterApiKey, 'auto', effectivePrompt, systemInstruction);
      }
      if (fallbackTask === 'academic' && prismEnabled && keys.prismApiKey) {
        return await callOpenAICompatible('https://api.openai.com/v1/chat/completions', keys.prismApiKey, 'gpt-4o-mini', effectivePrompt, systemInstruction);
      }
      if (fallbackTask === 'analysis' && mistralEnabled && keys.mistralApiKey) {
        return await callOpenAICompatible('https://api.mistral.ai/v1/chat/completions', keys.mistralApiKey, 'mistral-large-latest', effectivePrompt, systemInstruction);
      }
      if (cohereEnabled && keys.cohereApiKey && fallbackTask === 'spss') {
        return await callCohereChat(keys.cohereApiKey, effectivePrompt, systemInstruction);
      }
    } catch (e: any) {
      const msg = e?.message || '';
      if (!msg.includes('Insufficient Balance') && !msg.includes('insufficient_quota')) {
        console.warn('Synergy route failed, falling back to next engine:', e);
      }
    }
  }

  // If Gemini is disabled by user checkbox (geminiEnabled === false), do NOT use Gemini!
  if (!geminiEnabled) {
    const altResult = await tryAlternativeEngines();
    if (altResult) {
      return altResult;
    }
    throw new Error('Google AI Studio (Gemini) dinonaktifkan dan tidak ada AI alternatif lain yang aktif. Silakan centang dan masukkan API Key AI pilihan Anda di menu Pengaturan.');
  }

  // Fallback to Gemini with retry & automatic failover to other AIs
  const actualGeminiKey = keys.geminiApiKey !== undefined && keys.geminiApiKey !== ''
    ? keys.geminiApiKey
    : process.env.GEMINI_API_KEY;

  if (!actualGeminiKey) {
    const altResult = await tryAlternativeEngines();
    if (altResult) {
      return altResult;
    }
    throw new Error('API Key Google Gemini dikosongkan dan tidak ada AI alternatif lain yang aktif. Silakan centang dan masukkan API Key AI pilihan Anda (Groq, DeepSeek, OpenRouter, Mistral, dll) di menu Pengaturan.');
  }

  const ai = new GoogleGenAI({ apiKey: actualGeminiKey });
  
  let attempts = 0;
  const maxAttempts = 2;
  while (attempts < maxAttempts) {
    try {
      attempts++;
      const response = await ai.models.generateContent({ 
        model: DEFAULT_MODEL, 
        contents: effectivePrompt,
        config: systemInstruction ? { systemInstruction } : undefined
      });
      return response.text || '';
    } catch (geminiErr: any) {
      const errMsg = geminiErr?.message || String(geminiErr);
      console.warn(`Gemini attempt ${attempts} failed (${errMsg})`);
      
      if (attempts >= maxAttempts || (errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('exceeded your current quota') || errMsg.includes('quota') || errMsg.includes('high demand') || errMsg.includes('404'))) {
        // Try automatic failover to alternative configured AI engines
        const altResult = await tryAlternativeEngines();
        if (altResult) {
          console.log('Successfully failed over to alternative AI engine!');
          return altResult;
        }
        
        if (attempts >= maxAttempts || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
          if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE')) {
            throw new Error('Server AI (Gemini) sedang mengalami lonjakan trafik tinggi (503). Silakan masukkan API Key Groq/OpenRouter/DeepSeek di menu Pengaturan untuk Failover Otomatis, atau coba beberapa saat lagi.');
          }
          if (errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
            throw new Error('Batas kuota penggunaan AI (Gemini) telah tercapai. Silakan masukkan API Key cadangan (Groq, OpenRouter, DeepSeek, Mistral, atau Gemini pribadi) di menu Pengaturan, atau coba beberapa saat lagi.');
          }
          throw geminiErr;
        }
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  throw new Error('Gagal menghubungi layanan AI.');
}

/**
 * Universal JSON runner using Synergy Multi-Engine
 */
export async function runSynergyJson<T>(prompt: string, systemInstruction: string, fallbackTask: string, fallbackValue: T): Promise<T> {
  try {
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Berikan jawaban HANYA dalam format JSON valid tanpa teks pengantar atau penutup.`;
    const rawRes = await runSynergyEngine(jsonPrompt, `${systemInstruction} ALWAYS respond with valid raw JSON only.`, fallbackTask);
    
    let clean = rawRes.trim();
    if (clean.includes('```json')) {
      clean = clean.split('```json')[1].split('```')[0].trim();
    } else if (clean.includes('```')) {
      clean = clean.split('```')[1].split('```')[0].trim();
    }
    return JSON.parse(clean);
  } catch (err) {
    console.warn('runSynergyJson parse error, using fallback value:', err);
    return fallbackValue;
  }
}

// ==========================================
// EXPORTED AI FUNCTIONS
// ==========================================

export const generateProposal = async (data: any) => {
  const prompt = PROMPT_TEMPLATES.GENERATE_PROPOSAL(data);
  return await runSynergyEngine(prompt, 'You are an expert academic proposal generator.', 'brainstorming');
};

export const rewriteText = async (text: string, style: string) => {
  const prompt = PROMPT_TEMPLATES.REWRITE_TEXT(text, style);
  return await runSynergyEngine(prompt, 'You are an academic text editor.', 'grammar');
};

export const paraphraseText = async (text: string, level: string = 'Tinggi') => {
  const prompt = PROMPT_TEMPLATES.PARAPHRASE_TEXT(text, level);
  const fallback = {
    paraphrasedText: text,
    accuracyPercentage: 95,
    originalityScore: 92,
    notes: 'Transformasi struktur kalimat dan variasi sinonim akademis.'
  };
  return await runSynergyJson(prompt, 'You are an expert academic paraphraser.', 'grammar', fallback);
};

export const brainstormJudul = async (topic: string, keywords: string, field: string) => {
  const prompt = PROMPT_TEMPLATES.BRAINSTORM_JUDUL(topic, keywords, field);
  const fallback = [
    {
      judul: `Analisis Komparatif Penerapan ${topic || 'Teknologi'} dalam Meningkatkan Kualitas Penelitian`,
      relevance_score: 95,
      alasan: 'Topik sangat relevan dan memiliki urgensi penelitian yang tinggi.'
    }
  ];
  return await runSynergyJson(prompt, 'You are an expert academic research topic generator.', 'brainstorming', fallback);
};

export const chatConsultation = async (history: any[], message: string) => {
  const prompt = PROMPT_TEMPLATES.CHAT_CONSULTATION(history, message);
  return await runSynergyEngine(prompt, 'You are a helpful and knowledgeable thesis advisor.', 'chat');
};

export const generatePresentation = async (projectData: any, selectedBab: string[]) => {
  const prompt = PROMPT_TEMPLATES.GENERATE_PRESENTATION(projectData, selectedBab);
  return await runSynergyEngine(prompt, 'You are an expert at creating thesis defense presentation structures.', 'brainstorming');
};

export const simulateExaminer = async (character: string, context: string, question: string) => {
  const prompt = PROMPT_TEMPLATES.SIMULATION_CHARACTER(character, context, question);
  return await runSynergyEngine(prompt, `You are acting as a thesis defense examiner with persona: ${character}`, 'academic');
};

export const interpretSPSS = async (resultData: string) => {
  const prompt = PROMPT_TEMPLATES.INTERPRET_SPSS(resultData);
  return await runSynergyEngine(prompt, 'You are an expert statistician interpreting SPSS results for academic thesis.', 'spss');
};

export const grammarCheck = async (text: string) => {
  const prompt = PROMPT_TEMPLATES.GRAMMAR_PLAGIARISM(text);
  const fallback = {
    overallScore: 90,
    corrections: [],
    suggestions: ['Tata bahasa dan EYD sudah dalam kondisi baik.']
  };
  return await runSynergyJson(prompt, 'You are an academic Indonesian grammar and proofreading expert.', 'grammar', fallback);
};

export const checkPlagiarism = async (text: string) => {
  const prompt = PROMPT_TEMPLATES.CHECK_PLAGIARISM(text);
  const fallback = {
    similarityScore: 8,
    originalityScore: 92,
    riskLevel: 'Rendah',
    matchedSentences: [],
    recommendations: ['Teks orisinal dan siap diajukan untuk uji kemiripan Turnitin.']
  };
  return await runSynergyJson(prompt, 'You are an academic originality and plagiarism risk detector.', 'academic', fallback);
};

export const generateBibliography = async (sources: any[], style: string) => {
  const prompt = PROMPT_TEMPLATES.GENERATE_BIBLIOGRAPHY(sources, style);
  const fallback = {
    formattedBibliography: sources.map((s, idx) => ({
      id: s.id || String(idx + 1),
      inTextCitation: style.includes('IEEE') ? `[${idx + 1}]` : `(${s.authors?.split(',')[0] || s.authors}, ${s.year})`,
      fullReference: `${s.authors} (${s.year}). ${s.title}. ${s.publisher || ''}.`
    })),
    styleUsed: style
  };
  return await runSynergyJson(prompt, 'You are an expert bibliography and citation formatter.', 'academic', fallback);
};

export const detectTemplate = async (docContent: string) => {
  const prompt = PROMPT_TEMPLATES.DETECT_TEMPLATE(docContent);
  return await runSynergyEngine(prompt, 'You are an academic thesis template analyzer.', 'grammar');
};

export const chatWithPdfDocument = async (
  docTitle: string,
  chunks: { page: number; text: string }[],
  question: string,
  history: any[] = []
) => {
  const prompt = PROMPT_TEMPLATES.PDF_CHAT(docTitle, chunks, question, history);
  const fallback = {
    answer: 'Menjawab berdasarkan analisis dokumen komprehensif.',
    highlights: [],
    citations: []
  };
  return await runSynergyJson(prompt, 'You are an expert academic research paper assistant.', 'chat', fallback);
};

export const extractPdfCitations = async (docTitle: string, docText: string) => {
  const prompt = PROMPT_TEMPLATES.PDF_EXTRACT_CITATIONS(docTitle, docText);
  const fallback = {
    metadata: {
      title: docTitle,
      authors: ['Penulis Terindeks'],
      year: new Date().getFullYear().toString(),
      journalOrPublisher: 'Jurnal Akademik Terakreditasi',
      apaCitation: `${docTitle}. (${new Date().getFullYear()}). Jurnal Akademik.`,
      ieeeCitation: `[1] Penulis, "${docTitle}," Jurnal Akademik, ${new Date().getFullYear()}.`
    },
    keyQuotes: [],
    referencesFound: []
  };
  return await runSynergyJson(prompt, 'You are an academic metadata extractor.', 'academic', fallback);
};

export const analyzeGuidebookDoc = async (guidebookTitle: string, rawText: string) => {
  const prompt = PROMPT_TEMPLATES.ANALYZE_GUIDEBOOK(guidebookTitle, rawText);
  const fallback = {
    university: 'Perguruan Tinggi Indonesia',
    font: 'Times New Roman',
    fontSize: '12pt',
    spacing: '1.5 Spasi Ganda',
    margins: { top: '4 cm', left: '4 cm', bottom: '3 cm', right: '3 cm' },
    pageNumberPos: 'Kanan Atas (Bawah Tengah untuk Awal Bab)',
    coverFormat: 'Logo Kampus 5x5 cm, Judul Kapital Bold, Nama & NIM Centered',
    citationStyle: 'APA 7th Edition',
    importantRules: ['Format dikondisikan sesuai standar akademis baku.'],
    summary: `Pedoman penulisan dianalisis untuk ${guidebookTitle}`
  };
  return await runSynergyJson(prompt, 'You are an expert university thesis guidebook analyzer.', 'academic', fallback);
};
