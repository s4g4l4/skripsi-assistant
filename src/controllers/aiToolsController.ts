import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API
let ai: GoogleGenAI | null = null;
const getGemini = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const generateAIToolResult = async (req: Request, res: Response) => {
  try {
    const { toolName, toolCategory, toolDescription, inputVal } = req.body;

    if (!toolName || !inputVal) {
      return res.status(400).json({ error: 'toolName and inputVal are required' });
    }

    const aiClient = getGemini();

    const prompt = `Anda adalah Dukun Skripsi, seorang asisten ahli akademik, penelitian, dan penulisan skripsi tingkat akhir.
Tugas Anda adalah bertindak sebagai alat: "${toolName}" (Kategori: ${toolCategory}).
Deskripsi Alat: ${toolDescription}

Input dari mahasiswa/pengguna:
"""
${inputVal}
"""

Berikan output/hasil yang profesional, sistematis, sesuai standar penulisan akademik di Indonesia (menggunakan bahasa Indonesia yang baku namun tidak kaku), dan penuhi fungsi alat tersebut dengan sangat baik. 
Format output menggunakan markdown yang rapi (gunakan list, heading, tabel, atau bold jika perlu). Jangan berikan pengantar atau penjelasan tambahan, langsung berikan hasilnya.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error('AI Tool Error:', error);
    res.status(500).json({ error: error.message || 'Gagal memproses permintaan' });
  }
};
