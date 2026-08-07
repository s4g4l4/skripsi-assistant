export interface UniversityTemplate {
  id: string;
  name: string;
  code?: string;
  category: 'PTN' | 'PTS' | 'PTKIN' | 'Politeknik' | 'Sekolah Tinggi' | 'Lainnya';
  province: string;
  city: string;
  formatPreset: {
    font: string;
    fontSize: string;
    lineSpacing: string;
    margins: {
      top: string;
      bottom: string;
      left: string;
      right: string;
    };
    pageNumberPos: string;
    coverFormat: string;
    chapterFormat: string;
    citationStyle: string;
  };
}

export const DEFAULT_UNIVERSITIES: UniversityTemplate[] = [
  // PTN
  {
    id: 'ui',
    name: 'Universitas Indonesia (UI)',
    code: '001001',
    category: 'PTN',
    province: 'Jawa Barat',
    city: 'Depok',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas / Bawah Tengah',
      coverFormat: 'Huruf Kapital Bold, Logo UI Warna 5cm, NIM & Nama Pasca Judul',
      chapterFormat: 'BAB I PENDAHULUAN (Kapital, Bold, Center)',
      citationStyle: 'APA Style 7th Edition'
    }
  },
  {
    id: 'ugm',
    name: 'Universitas Gadjah Mada (UGM)',
    code: '001002',
    category: 'PTN',
    province: 'DI Yogyakarta',
    city: 'Sleman',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas / Bawah Tengah',
      coverFormat: 'Logo Simbol UGM, Judul Kapital Bold, Font Size 14pt',
      chapterFormat: 'BAB 1 PENDAHULUAN (Center, Simetris)',
      citationStyle: 'APA / IEEE / Chicago'
    }
  },
  {
    id: 'itb',
    name: 'Institut Teknologi Bandung (ITB)',
    code: '001003',
    category: 'PTN',
    province: 'Jawa Barat',
    city: 'Bandung',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '3 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Format Tugas Akhir / Tesis ITB, Logo ITB Hitam/Putih',
      chapterFormat: 'Bab 1 Pendahuluan (Capital Each Word)',
      citationStyle: 'IEEE / Author-Date'
    }
  },
  {
    id: 'ipb',
    name: 'IPB University (Institut Pertanian Bogor)',
    code: '001004',
    category: 'PTN',
    province: 'Jawa Barat',
    city: 'Bogor',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Bawah Tengah',
      coverFormat: 'Pedoman Penulisan Karya Ilmiah IPB',
      chapterFormat: 'PENDAHULUAN (Tanpa Angka Bab)',
      citationStyle: 'Harvard / IPB Style'
    }
  },
  {
    id: 'unair',
    name: 'Universitas Airlangga (UNAIR)',
    code: '001005',
    category: 'PTN',
    province: 'Jawa Timur',
    city: 'Surabaya',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '2.0',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Garuda Unair, Judul Kapital Spasi 1.0',
      chapterFormat: 'BAB 1 PENDAHULUAN',
      citationStyle: 'APA Style 7th'
    }
  },
  {
    id: 'its',
    name: 'Institut Teknologi Sepuluh Nopember (ITS)',
    code: '001006',
    category: 'PTN',
    province: 'Jawa Timur',
    city: 'Surabaya',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '3 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Standard Tugas Akhir ITS, Logo Lambang ITS 4.5cm',
      chapterFormat: 'BAB 1 PENDAHULUAN',
      citationStyle: 'IEEE Style'
    }
  },
  {
    id: 'undip',
    name: 'Universitas Diponegoro (UNDIP)',
    code: '001007',
    category: 'PTN',
    province: 'Jawa Tengah',
    city: 'Semarang',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Logo Undip Warna, Judul Kapital Bold 14pt',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA / Vancouver'
    }
  },
  {
    id: 'ub',
    name: 'Universitas Brawijaya (UB)',
    code: '001008',
    category: 'PTN',
    province: 'Jawa Timur',
    city: 'Malang',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Tesis/Skripsi UB',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unpad',
    name: 'Universitas Padjadjaran (UNPAD)',
    code: '001009',
    category: 'PTN',
    province: 'Jawa Barat',
    city: 'Sumedang',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Logo Unpad Resmi, Kertas A4 80gr',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA / Harvard'
    }
  },
  {
    id: 'uns',
    name: 'Universitas Sebelas Maret (UNS)',
    code: '001010',
    category: 'PTN',
    province: 'Jawa Tengah',
    city: 'Surakarta',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Tugas Akhir UNS, Lambang Cakra UNS',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA 7th'
    }
  },
  {
    id: 'unhas',
    name: 'Universitas Hasanuddin (UNHAS)',
    code: '001011',
    category: 'PTN',
    province: 'Sulawesi Selatan',
    city: 'Makassar',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Logo Ayam Jantan Unhas, Layout Standard Unhas',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA / IEEE'
    }
  },
  {
    id: 'usu',
    name: 'Universitas Sumatera Utara (USU)',
    code: '001012',
    category: 'PTN',
    province: 'Sumatera Utara',
    city: 'Medan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Logo USU, Pedoman Tugas Akhir USU',
      chapterFormat: 'BAB 1 PENDAHULUAN',
      citationStyle: 'APA / Harvard'
    }
  },
  {
    id: 'unand',
    name: 'Universitas Andalas (UNAND)',
    code: '001013',
    category: 'PTN',
    province: 'Sumatera Barat',
    city: 'Padang',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Karya Ilmiah Unand',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unp',
    name: 'Universitas Negeri Padang (UNP)',
    code: '001014',
    category: 'PTN',
    province: 'Sumatera Barat',
    city: 'Padang',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Logo UNP, Sampul Kuning/Biru',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA 7th'
    }
  },
  {
    id: 'unj',
    name: 'Universitas Negeri Jakarta (UNJ)',
    code: '001015',
    category: 'PTN',
    province: 'DKI Jakarta',
    city: 'Jakarta Timur',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi UNJ',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'uny',
    name: 'Universitas Negeri Yogyakarta (UNY)',
    code: '001016',
    category: 'PTN',
    province: 'DI Yogyakarta',
    city: 'Sleman',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman TAS/Tugas Akhir Skripsi UNY',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'um',
    name: 'Universitas Negeri Malang (UM)',
    code: '001017',
    category: 'PTN',
    province: 'Jawa Timur',
    city: 'Malang',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Karya Ilmiah UM',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA / UM Style'
    }
  },
  {
    id: 'unesa',
    name: 'Universitas Negeri Surabaya (UNESA)',
    code: '001018',
    category: 'PTN',
    province: 'Jawa Timur',
    city: 'Surabaya',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi Unesa',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unnes',
    name: 'Universitas Negeri Semarang (UNNES)',
    code: '001019',
    category: 'PTN',
    province: 'Jawa Tengah',
    city: 'Semarang',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Karya Ilmiah UNNES',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style 7th'
    }
  },
  {
    id: 'unsri',
    name: 'Universitas Sriwijaya (UNSRI)',
    code: '001020',
    category: 'PTN',
    province: 'Sumatera Selatan',
    city: 'Palembang',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi Unsri',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unlam',
    name: 'Universitas Lambung Mangkurat (ULM / UNLAM)',
    code: '001021',
    category: 'PTN',
    province: 'Kalimantan Selatan',
    city: 'Banjarmasin',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Karya Ilmiah ULM',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unmul',
    name: 'Universitas Mulawarman (UNMUL)',
    code: '001022',
    category: 'PTN',
    province: 'Kalimantan Timur',
    city: 'Samarinda',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi Unmul',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unsrat',
    name: 'Universitas Sam Ratulangi (UNSRAT)',
    code: '001023',
    category: 'PTN',
    province: 'Sulawesi Utara',
    city: 'Manado',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Tugas Akhir Unsrat',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'untad',
    name: 'Universitas Tadulako (UNTAD)',
    code: '001024',
    category: 'PTN',
    province: 'Sulawesi Tengah',
    city: 'Palu',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi Untad',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unej',
    name: 'Universitas Jember (UNEJ)',
    code: '001025',
    category: 'PTN',
    province: 'Jawa Timur',
    city: 'Jember',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Karya Ilmiah UNEJ',
      chapterFormat: 'BAB 1. PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unram',
    name: 'Universitas Mataram (UNRAM)',
    code: '001026',
    category: 'PTN',
    province: 'Nusa Tenggara Barat',
    city: 'Mataram',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi Unram',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unud',
    name: 'Universitas Udayana (UNUD)',
    code: '001027',
    category: 'PTN',
    province: 'Bali',
    city: 'Denpasar',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Tugas Akhir Unud',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'uncend',
    name: 'Universitas Cenderawasih (UNCEN)',
    code: '001028',
    category: 'PTN',
    province: 'Papua',
    city: 'Jayapura',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi Uncen',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unsoed',
    name: 'Universitas Jenderal Soedirman (UNSOED)',
    code: '001029',
    category: 'PTN',
    province: 'Jawa Tengah',
    city: 'Purwokerto',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Tugas Akhir Unsoed',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unimed',
    name: 'Universitas Negeri Medan (UNIMED)',
    code: '001031',
    category: 'PTN',
    province: 'Sumatera Utara',
    city: 'Medan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi Unimed',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style 7th'
    }
  },
  {
    id: 'unila',
    name: 'Universitas Lampung (UNILA)',
    code: '001030',
    category: 'PTN',
    province: 'Lampung',
    city: 'Bandar Lampung',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Format Karya Tulis Ilmiah Unila',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },

  // PTKIN
  {
    id: 'uinsu',
    name: 'UIN Sumatera Utara (UINSU Medan)',
    code: '201008',
    category: 'PTKIN',
    province: 'Sumatera Utara',
    city: 'Medan / Deli Serdang',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi & Tesis UINSU',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'Chicago Footnote / APA Style'
    }
  },
  {
    id: 'uin-jkt',
    name: 'UIN Syarif Hidayatullah Jakarta',
    code: '201001',
    category: 'PTKIN',
    province: 'Banten',
    city: 'Tangerang Selatan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Karya Tulis Ilmiah UIN Syarif Hidayatullah',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'Footnote Chicago / Turabian / APA'
    }
  },
  {
    id: 'uin-suka',
    name: 'UIN Sunan Kalijaga Yogyakarta',
    code: '201002',
    category: 'PTKIN',
    province: 'DI Yogyakarta',
    city: 'Sleman',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi UIN Sunan Kalijaga',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'Footnote / Bodynote APA'
    }
  },
  {
    id: 'uin-sgd',
    name: 'UIN Sunan Gunung Djati Bandung',
    code: '201003',
    category: 'PTKIN',
    province: 'Jawa Barat',
    city: 'Bandung',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Karya Ilmiah UIN SGD',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'Turabian / Footnote / APA'
    }
  },
  {
    id: 'uin-sa',
    name: 'UIN Sunan Ampel Surabaya',
    code: '201004',
    category: 'PTKIN',
    province: 'Jawa Timur',
    city: 'Surabaya',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi UINSA',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'Turabian / APA'
    }
  },
  {
    id: 'uin-malang',
    name: 'UIN Maulana Malik Ibrahim Malang',
    code: '201005',
    category: 'PTKIN',
    province: 'Jawa Timur',
    city: 'Malang',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi UIN Maliki',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA / Footnote Style'
    }
  },
  {
    id: 'uin-raniry',
    name: 'UIN Ar-Raniry Banda Aceh',
    code: '201006',
    category: 'PTKIN',
    province: 'Aceh',
    city: 'Banda Aceh',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Karya Tulis UIN Ar-Raniry',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'Footnote / APA'
    }
  },
  {
    id: 'uin-alauddin',
    name: 'UIN Alauddin Makassar',
    code: '201007',
    category: 'PTKIN',
    province: 'Sulawesi Selatan',
    city: 'Gowa / Makassar',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Karya Ilmiah UIN Alauddin',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'Turabian / Chicago Footnote'
    }
  },

  // PTS
  {
    id: 'telkom',
    name: 'Telkom University (Tel-U)',
    code: '041001',
    category: 'PTS',
    province: 'Jawa Barat',
    city: 'Bandung',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '3 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Standard Tugas Akhir Telkom University, Logo Telkom Merah/Hitam',
      chapterFormat: 'BAB 1 PENDAHULUAN',
      citationStyle: 'IEEE / APA 7th'
    }
  },
  {
    id: 'binus',
    name: 'Bina Nusantara University (BINUS)',
    code: '031001',
    category: 'PTS',
    province: 'DKI Jakarta',
    city: 'Jakarta Barat',
    formatPreset: {
      font: 'Calibri / Times New Roman',
      fontSize: '11pt',
      lineSpacing: '1.5',
      margins: { top: '2.5 cm', bottom: '2.5 cm', left: '3.5 cm', right: '2.5 cm' },
      pageNumberPos: 'Kanan Bawah',
      coverFormat: 'Format Thesis / Internship Report Binus',
      chapterFormat: 'CHAPTER 1 INTRODUCTION',
      citationStyle: 'APA Style 7th'
    }
  },
  {
    id: 'uii',
    name: 'Universitas Islam Indonesia (UII)',
    code: '051001',
    category: 'PTS',
    province: 'DI Yogyakarta',
    city: 'Sleman',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Tugas Akhir UII',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA / IEEE Style'
    }
  },
  {
    id: 'umy',
    name: 'Universitas Muhammadiyah Yogyakarta (UMY)',
    code: '051002',
    category: 'PTS',
    province: 'DI Yogyakarta',
    city: 'Bantul',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi UMY',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style 7th'
    }
  },
  {
    id: 'umm',
    name: 'Universitas Muhammadiyah Malang (UMM)',
    code: '071001',
    category: 'PTS',
    province: 'Jawa Timur',
    city: 'Malang',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi UMM',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'ums',
    name: 'Universitas Muhammadiyah Surakarta (UMS)',
    code: '061001',
    category: 'PTS',
    province: 'Jawa Tengah',
    city: 'Sukoharjo',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Tugas Akhir UMS',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unpar',
    name: 'Universitas Katolik Parahyangan (UNPAR)',
    code: '041002',
    category: 'PTS',
    province: 'Jawa Barat',
    city: 'Bandung',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '3 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi Unpar',
      chapterFormat: 'BAB 1 PENDAHULUAN',
      citationStyle: 'APA / Chicago'
    }
  },
  {
    id: 'atmajaya-jkt',
    name: 'Universitas Katolik Indonesia Atma Jaya Jakarta',
    code: '031002',
    category: 'PTS',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi Atma Jaya Jakarta',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style 7th'
    }
  },
  {
    id: 'trisakti',
    name: 'Universitas Trisakti',
    code: '031003',
    category: 'PTS',
    province: 'DKI Jakarta',
    city: 'Jakarta Barat',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi Trisakti',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'tarumanagara',
    name: 'Universitas Tarumanagara (UNTAR)',
    code: '031004',
    category: 'PTS',
    province: 'DKI Jakarta',
    city: 'Jakarta Barat',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi Untar',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'gunadarma',
    name: 'Universitas Gunadarma',
    code: '031005',
    category: 'PTS',
    province: 'Jawa Barat',
    city: 'Depok',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Penulisan Ilmiah / Skripsi Gunadarma',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'IEEE / APA'
    }
  },
  {
    id: 'mercubuana',
    name: 'Universitas Mercu Buana (UMB)',
    code: '031006',
    category: 'PTS',
    province: 'DKI Jakarta',
    city: 'Jakarta Barat',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Tugas Akhir UMB',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style 7th'
    }
  },
  {
    id: 'ubhara',
    name: 'Universitas Bhayangkara Jakarta Raya (Ubhara Jaya)',
    code: '031007',
    category: 'PTS',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan / Bekasi',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi Ubhara Jaya',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unas',
    name: 'Universitas Nasional (UNAS)',
    code: '031008',
    category: 'PTS',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi UNAS',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unpas',
    name: 'Universitas Pasundan (UNPAS)',
    code: '041003',
    category: 'PTS',
    province: 'Jawa Barat',
    city: 'Bandung',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi Unpas',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unisba',
    name: 'Universitas Islam Bandung (UNISBA)',
    code: '041004',
    category: 'PTS',
    province: 'Jawa Barat',
    city: 'Bandung',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi Unisba',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },

  // PTS SUMATERA UTARA (LLDIKTI WILAYAH I)
  {
    id: 'umsu',
    name: 'Universitas Muhammadiyah Sumatera Utara (UMSU)',
    code: '011001',
    category: 'PTS',
    province: 'Sumatera Utara',
    city: 'Medan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi UMSU, Logo Muhammadiyah 5cm',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style 7th Edition'
    }
  },
  {
    id: 'uisu',
    name: 'Universitas Islam Sumatera Utara (UISU)',
    code: '011002',
    category: 'PTS',
    province: 'Sumatera Utara',
    city: 'Medan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi & Tugas Akhir UISU',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style / Footnote'
    }
  },
  {
    id: 'ulb',
    name: 'Universitas Labuhanbatu (ULB)',
    code: '011003',
    category: 'PTS',
    province: 'Sumatera Utara',
    city: 'Rantauprapat (Labuhanbatu)',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi Fakultas & Pascasarjana ULB',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style 7th Edition'
    }
  },
  {
    id: 'unpab',
    name: 'Universitas Pembangunan Panca Budi (UNPAB)',
    code: '011004',
    category: 'PTS',
    province: 'Sumatera Utara',
    city: 'Medan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Tugas Akhir & Skripsi UNPAB Medan',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'uhn',
    name: 'Universitas HKBP Nommensen (UHN)',
    code: '011005',
    category: 'PTS',
    province: 'Sumatera Utara',
    city: 'Medan / Pematangsiantar',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi UHN Nommensen',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'unpri',
    name: 'Universitas Prima Indonesia (UNPRI)',
    code: '011006',
    category: 'PTS',
    province: 'Sumatera Utara',
    city: 'Medan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Karya Tulis Ilmiah & Tesis UNPRI Medan',
      chapterFormat: 'BAB 1 PENDAHULUAN',
      citationStyle: 'APA / Vancouver Style'
    }
  },
  {
    id: 'uma',
    name: 'Universitas Medan Area (UMA)',
    code: '011007',
    category: 'PTS',
    province: 'Sumatera Utara',
    city: 'Medan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi UMA Medan',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style 7th'
    }
  },
  {
    id: 'umn-alwashliyah',
    name: 'Universitas Muslim Nusantara Al-Washliyah (UMN Al-Washliyah)',
    code: '011008',
    category: 'PTS',
    province: 'Sumatera Utara',
    city: 'Medan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi UMN Al Washliyah',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'ust',
    name: 'Universitas Katolik Santo Thomas',
    code: '011009',
    category: 'PTS',
    province: 'Sumatera Utara',
    city: 'Medan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi Unika Santo Thomas Medan',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },
  {
    id: 'una',
    name: 'Universitas Asahan (UNA)',
    code: '011010',
    category: 'PTS',
    province: 'Sumatera Utara',
    city: 'Kisaran (Asahan)',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Skripsi Universitas Asahan',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style'
    }
  },

  // POLITEKNIK
  {
    id: 'polmed',
    name: 'Politeknik Negeri Medan (POLMED)',
    code: '005005',
    category: 'Politeknik',
    province: 'Sumatera Utara',
    city: 'Medan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Laporan Akhir & Skripsi Terapan POLMED',
      chapterFormat: 'BAB 1 PENDAHULUAN',
      citationStyle: 'IEEE / APA Style'
    }
  },
  {
    id: 'pkn-stan',
    name: 'Politeknik Keuangan Negara STAN (PKN STAN)',
    code: '301001',
    category: 'Politeknik',
    province: 'Banten',
    city: 'Tangerang Selatan',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan KTI PKN STAN',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style 7th'
    }
  },
  {
    id: 'polban',
    name: 'Politeknik Negeri Bandung (POLBAN)',
    code: '005001',
    category: 'Politeknik',
    province: 'Jawa Barat',
    city: 'Bandung Barat',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '3 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Tugas Akhir Polban',
      chapterFormat: 'BAB 1 PENDAHULUAN',
      citationStyle: 'IEEE / APA'
    }
  },
  {
    id: 'pnj',
    name: 'Politeknik Negeri Jakarta (PNJ)',
    code: '005002',
    category: 'Politeknik',
    province: 'Jawa Barat',
    city: 'Depok',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Tugas Akhir PNJ',
      chapterFormat: 'BAB 1 PENDAHULUAN',
      citationStyle: 'IEEE / APA'
    }
  },
  {
    id: 'pens',
    name: 'Politeknik Elektronika Negeri Surabaya (PENS)',
    code: '005003',
    category: 'Politeknik',
    province: 'Jawa Timur',
    city: 'Surabaya',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '3 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Proyek Akhir PENS',
      chapterFormat: 'BAB 1 PENDAHULUAN',
      citationStyle: 'IEEE Style'
    }
  },
  {
    id: 'polinema',
    name: 'Politeknik Negeri Malang (POLINEMA)',
    code: '005004',
    category: 'Politeknik',
    province: 'Jawa Timur',
    city: 'Malang',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Tugas Akhir Polinema',
      chapterFormat: 'BAB 1 PENDAHULUAN',
      citationStyle: 'APA / IEEE'
    }
  },
  {
    id: 'stis',
    name: 'Politeknik Statistika STIS (STIS Jakarta)',
    code: '301002',
    category: 'Sekolah Tinggi',
    province: 'DKI Jakarta',
    city: 'Jakarta Timur',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas',
      coverFormat: 'Pedoman Penulisan Skripsi STIS',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style 7th'
    }
  },
  {
    id: 'auto-detect',
    name: 'Deteksi Otomatis AI (Rekomendasi Berdasarkan Judul/Fakultas)',
    code: '000000',
    category: 'Lainnya',
    province: 'Seluruh Indonesia',
    city: 'Nasional',
    formatPreset: {
      font: 'Times New Roman',
      fontSize: '12pt',
      lineSpacing: '1.5',
      margins: { top: '4 cm', bottom: '3 cm', left: '4 cm', right: '3 cm' },
      pageNumberPos: 'Kanan Atas (Default Kemendikdasmen)',
      coverFormat: 'Format Standar Dikti Kemendikdasmen',
      chapterFormat: 'BAB I PENDAHULUAN',
      citationStyle: 'APA Style 7th Edition'
    }
  }
];

export function getUniversityNamesList(): string[] {
  return DEFAULT_UNIVERSITIES.map(u => u.name);
}

export function findUniversityByName(name: string): UniversityTemplate | undefined {
  return DEFAULT_UNIVERSITIES.find(u => 
    u.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(u.name.toLowerCase())
  );
}
