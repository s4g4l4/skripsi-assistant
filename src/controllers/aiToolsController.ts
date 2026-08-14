import { Request, Response } from 'express';
import { runSynergyEngine } from '../services/aiService.js';

export const generateAIToolResult = async (req: Request, res: Response) => {
  try {
    const { toolName, toolCategory, toolDescription, inputVal } = req.body;

    if (!toolName || !inputVal) {
      return res.status(400).json({ error: 'toolName and inputVal are required' });
    }

    const prompt = `Anda adalah Dukun Skripsi, seorang asisten ahli akademik, penelitian, dan penulisan skripsi tingkat akhir.
Tugas Anda adalah bertindak sebagai alat: "${toolName}" (Kategori: ${toolCategory}).
Deskripsi Alat: ${toolDescription}

Input dari mahasiswa/pengguna:
"""
${inputVal}
"""

Berikan output/hasil yang profesional, sistematis, sesuai standar penulisan akademik di Indonesia (menggunakan bahasa Indonesia yang baku namun tidak kaku), dan penuhi fungsi alat tersebut dengan sangat baik. 
Format output menggunakan markdown yang rapi (gunakan list, heading, tabel, atau bold jika perlu). Jangan berikan pengantar atau penjelasan tambahan, langsung berikan hasilnya.`;

    const result = await runSynergyEngine(prompt, 'You are an expert academic research assistant.', 'brainstorming');

    res.json({ result });
  } catch (error: any) {
    console.error('AI Tool Error:', error);
    res.status(500).json({ error: error.message || 'Gagal memproses permintaan AI. Silakan coba beberapa saat lagi atau masukkan API Key alternatif di menu Pengaturan.' });
  }
};
