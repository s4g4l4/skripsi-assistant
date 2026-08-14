const fs = require('fs');
let code = fs.readFileSync('src/services/aiService.ts', 'utf8');

const targetImport = `import { GoogleGenAI } from '@google/genai';`;
const replacementImport = `import { GoogleGenAI } from '@google/genai';
import { contextStorage } from '../utils/context.js';`;
code = code.replace(targetImport, replacementImport);

const replacementBase = `
const DEFAULT_MODEL = 'gemini-2.0-flash';

// --- Synergy Multi-AI Engine ---
async function callOpenAICompatible(endpoint, apiKey, model, prompt, systemInstruction) {
  const messages = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });
  
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${apiKey}\`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7
    })
  });
  
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(\`API Error (\${endpoint}): \${errText}\`);
  }
  
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function runSynergyEngine(prompt, systemInstruction, fallbackTask) {
  const context = contextStorage.getStore();
  const keys = context?.customApiKeys || {};
  
  // If user selected specific engine (not synergy)
  if (keys.selectedEngine && keys.selectedEngine !== 'multi_synergy' && keys.selectedEngine !== 'gemini-2.0-flash') {
    try {
      if (keys.selectedEngine === 'groq' && keys.groqApiKey) {
        return await callOpenAICompatible('https://api.groq.com/openai/v1/chat/completions', keys.groqApiKey, 'llama-3.1-70b-versatile', prompt, systemInstruction);
      }
      if (keys.selectedEngine === 'deepseek' && keys.deepseekApiKey) {
        return await callOpenAICompatible('https://api.deepseek.com/chat/completions', keys.deepseekApiKey, 'deepseek-chat', prompt, systemInstruction);
      }
      if (keys.selectedEngine === 'openrouter' && keys.openrouterApiKey) {
        return await callOpenAICompatible('https://openrouter.ai/api/v1/chat/completions', keys.openrouterApiKey, 'auto', prompt, systemInstruction);
      }
      if (keys.selectedEngine === 'nvidia' && keys.nvidiaApiKey) {
        return await callOpenAICompatible('https://integrate.api.nvidia.com/v1/chat/completions', keys.nvidiaApiKey, 'meta/llama3-70b-instruct', prompt, systemInstruction);
      }
    } catch (e) {
      console.warn('Selected engine failed, falling back to Gemini:', e);
    }
  }

  // If Synergy Multi-AI is active, dynamically route based on task
  if (keys.selectedEngine === 'multi_synergy') {
    try {
      if (fallbackTask === 'brainstorming' && keys.deepseekApiKey) {
         return await callOpenAICompatible('https://api.deepseek.com/chat/completions', keys.deepseekApiKey, 'deepseek-reasoner', prompt, systemInstruction);
      }
      if (fallbackTask === 'grammar' && keys.groqApiKey) {
         return await callOpenAICompatible('https://api.groq.com/openai/v1/chat/completions', keys.groqApiKey, 'llama3-70b-8192', prompt, systemInstruction);
      }
      if (fallbackTask === 'chat' && keys.openrouterApiKey) {
         return await callOpenAICompatible('https://openrouter.ai/api/v1/chat/completions', keys.openrouterApiKey, 'anthropic/claude-3.5-sonnet', prompt, systemInstruction);
      }
    } catch (e) {
      console.warn('Synergy route failed, falling back to Gemini:', e);
    }
  }

  // Fallback to Gemini
  let actualGeminiKey = keys.geminiApiKey || process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: actualGeminiKey });
  const response = await ai.models.generateContent({ 
    model: DEFAULT_MODEL, 
    contents: prompt,
    config: systemInstruction ? { systemInstruction } : undefined
  });
  return response.text;
}
`;

code = code.replace(`const DEFAULT_MODEL = 'gemini-2.0-flash';`, replacementBase);

// Now patch export functions to use runSynergyEngine instead of direct ai.models.generateContent
// First: generateProposal
code = code.replace(
  `const ai = getAiClient();
  const prompt = PROMPT_TEMPLATES.GENERATE_PROPOSAL(data);
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
  return response.text;`,
  `const prompt = PROMPT_TEMPLATES.GENERATE_PROPOSAL(data);
  return await runSynergyEngine(prompt, 'You are an expert academic proposal generator.', 'brainstorming');`
);

// rewriteText
code = code.replace(
  `const ai = getAiClient();
  const prompt = PROMPT_TEMPLATES.REWRITE_TEXT(text, style);
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
  return response.text;`,
  `const prompt = PROMPT_TEMPLATES.REWRITE_TEXT(text, style);
  return await runSynergyEngine(prompt, 'You are an academic text editor.', 'grammar');`
);

// paraphraseText
code = code.replace(
  `const ai = getAiClient();
  const prompt = PROMPT_TEMPLATES.PARAPHRASE_TEXT(text, level);
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
  return response.text;`,
  `const prompt = PROMPT_TEMPLATES.PARAPHRASE_TEXT(text, level);
  return await runSynergyEngine(prompt, 'You are an expert at academic paraphrasing.', 'grammar');`
);

// brainstormJudul
code = code.replace(
  `const ai = getAiClient();
  const prompt = PROMPT_TEMPLATES.BRAINSTORM_JUDUL(topic, keywords, field);
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
  
  try {`,
  `const prompt = PROMPT_TEMPLATES.BRAINSTORM_JUDUL(topic, keywords, field);
  const responseText = await runSynergyEngine(prompt, 'You are a creative thesis title generator.', 'brainstorming');
  
  try {
    const response = { text: responseText };`
);

// chatConsultation
code = code.replace(
  `const ai = getAiClient();
  const prompt = PROMPT_TEMPLATES.CHAT_CONSULTATION(history, message);
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
  return response.text;`,
  `const prompt = PROMPT_TEMPLATES.CHAT_CONSULTATION(history, message);
  return await runSynergyEngine(prompt, 'You are a helpful thesis consultant.', 'chat');`
);

// generatePresentation
code = code.replace(
  `const ai = getAiClient();
  const prompt = PROMPT_TEMPLATES.GENERATE_PRESENTATION(projectData, selectedBab);
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
  return response.text;`,
  `const prompt = PROMPT_TEMPLATES.GENERATE_PRESENTATION(projectData, selectedBab);
  return await runSynergyEngine(prompt, 'You are an expert at creating presentation structures.', 'brainstorming');`
);

// simulateExaminer
code = code.replace(
  `const ai = getAiClient();
  const prompt = PROMPT_TEMPLATES.SIMULATE_EXAMINER(character, context, question);
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
  return response.text;`,
  `const prompt = PROMPT_TEMPLATES.SIMULATE_EXAMINER(character, context, question);
  return await runSynergyEngine(prompt, 'You are acting as a thesis examiner.', 'chat');`
);

// interpretSPSS
code = code.replace(
  `const ai = getAiClient();
  const prompt = PROMPT_TEMPLATES.INTERPRET_SPSS(resultData);
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
  return response.text;`,
  `const prompt = PROMPT_TEMPLATES.INTERPRET_SPSS(resultData);
  return await runSynergyEngine(prompt, 'You are an expert statistician interpreting SPSS results.', 'brainstorming');`
);

// grammarCheck
code = code.replace(
  `const ai = getAiClient();
  const prompt = PROMPT_TEMPLATES.GRAMMAR_PLAGIARISM(text);
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
    try {
    let rawText = response.text || '';`,
  `const prompt = PROMPT_TEMPLATES.GRAMMAR_PLAGIARISM(text);
  const responseText = await runSynergyEngine(prompt, 'You are a strict Indonesian grammar checker.', 'grammar');
  
  try {
    let rawText = responseText || '';`
);

// checkPlagiarism (keep as is for now since it uses structured outputs, or we can mock it)
// actually, structured output config is not supported across all models via our simple fetch wrapper. 
// let's leave checkPlagiarism, generateBibliography, etc. untouched for Gemini since they use `config: { responseSchema: ... }` which is Gemini specific.

// detectTemplate
code = code.replace(
  `const ai = getAiClient();
  const prompt = PROMPT_TEMPLATES.DETECT_TEMPLATE(docContent);
  const response = await ai.models.generateContent({ model: DEFAULT_MODEL, contents: prompt });
  return response.text;`,
  `const prompt = PROMPT_TEMPLATES.DETECT_TEMPLATE(docContent);
  return await runSynergyEngine(prompt, 'You are a template analyzer.', 'grammar');`
);

fs.writeFileSync('src/services/aiService.ts', code);
console.log('aiService patched for synergy');
