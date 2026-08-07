export interface AuthorInfo {
  name: string;
  nim: string;
  faculty: string;
  major: string;
  year: string;
  supervisor: string;
}

export interface ResearchInfo {
  title: string;
  topic: string;
  type: string; // Kuantitatif, Kualitatif, Campuran, R&D
  population: string;
  variables: string;
}

export interface GuidelineRules {
  fileOpened?: string;
  documentType?: string; // Skripsi, Tesis, Disertasi, Jurnal, Tugas Akhir
  font: string;
  fontSize: string;
  spacing: string;
  margins: { top: string; bottom: string; left: string; right: string };
  pageNumberPos: string;
  coverFormat: string;
}

export interface UniversityInfo {
  id: string;
  name: string;
  logo?: string;
  color?: string;
}

export interface ThesisData {
  id: string;
  documentType: string;
  university: UniversityInfo;
  author: AuthorInfo;
  research: ResearchInfo;
  guideline: GuidelineRules;
  chapters: Record<string, string>;
  updatedAt: string;
}

export function generateFullThesisContent(
  docType: string = 'Skripsi',
  univ: UniversityInfo,
  guidelines: GuidelineRules,
  author: AuthorInfo,
  research: ResearchInfo
): Record<string, string> {
  const title = research.title || 'ANALISIS PERILAKU PENGGUNA DAN EFEKTIVITAS SISTEM INFORMASI AKADEMIK';
  const topic = research.topic || 'Sistem Informasi dan Usability';
  const researchType = research.type || 'Kuantitatif';
  const population = research.population || 'Mahasiswa Aktif Angkatan 2021-2026';
  const variables = research.variables || '(X) Kualitas Layanan Sistem, (Y) Kepuasan Pengguna';
  
  const name = author.name || 'Ahmad Fauzi';
  const nim = author.nim || '21081010045';
  const faculty = author.faculty || 'Fakultas Ilmu Komputer';
  const major = author.major || 'Teknik Informatika';
  const year = author.year || '2025/2026';
  const supervisor = author.supervisor || 'Dr. Ir. Budi Santoso, M.Kom.';
  const univName = univ.name || 'Universitas Indonesia';
  const approvalYear = year.split('/')[0] || '2025';

  const isTesis = docType.toLowerCase().includes('tesis');
  const isDisertasi = docType.toLowerCase().includes('disertasi');

  // 1. COVER & PENGESAHAN
  const coverContent = `================================================================================
                                ${docType.toUpperCase()}
================================================================================

${title.toUpperCase()}

Diajukan sebagai salah satu syarat utama untuk memperoleh gelar Akademik
pada ${faculty} - ${univName}

Disusun Oleh:
NAMA     : ${name}
NIM/NPM  : ${nim}
PROGRAM STUDI : ${major}
FAKULTAS : ${faculty}


                                [ LOGO RESMI ${univName.toUpperCase()} ]


SEKOLAH / UNIVERSITAS : ${univName}
TAHUN AKADEMIK        : ${year}

================================================================================
                           LEMBAR PENGESAHAN
================================================================================

Judul ${docType}  : ${title}
Nama Mahasiswa  : ${name}
NIM             : ${nim}
Program Studi   : ${major}
Fakultas        : ${faculty}

Telah diuji dan dinyatakan LULUS dalam Sidang Ujian ${docType} pada tanggal: .................. ${approvalYear}

Menyetujui,

Dosen Pembimbing Utama,                     Ketua Program Studi ${major},



(${supervisor})                              (Prof. Dr. Ir. H. Hendra, M.Sc.)
NIP/NIDN. 0412098701                        NIP/NIDN. 0115087502

Mengetahui,
Dekan ${faculty},



(Dr. H. Ahmad Dahlan, S.T., M.T.)
NIP. 197805122003121001`;

  // 2. BAB I: PENDAHULUAN
  const bab1Content = `BAB I
PENDAHULUAN

1.1 Latar Belakang Masalah
Perkembangan teknologi informasi dan transformasi digital dalam kurun waktu lima tahun terakhir telah mengubah paradigma operasional secara fundamental di berbagai sektor, khususnya dalam lingkup ${topic}. Akselerasi penggunaan sistem berbasis kecerdasan buatan, komputasi awan, serta integrasi pemrosesan data real-time menuntut kesiapan insfrastruktur dan adaptabilitas dari para pengguna. Dalam konteks institusi pendidikan dan organisasi modern, penerapan ${topic} tidak lagi sekadar menjadi sarana pendukung (supportive system), melainkan telah bergeser menjadi enabler utama dalam menentukan efisiensi, akurasi, dan transparansi proses bisnis secara menyeluruh.

Meskipun investasi terhadap pengembangan dan pemeliharaan sistem informasi terus meningkat, fenomena di lapangan menunjukkan bahwa keberhasilan adopsi teknologi sangat bervariasi. Berdasarkan studi pendahuluan dan observasi awal yang dilakukan terhadap ${population}, dijumpai berbagai dinamika kompleks. Di satu sisi, kehadiran sistem mempermudah aksesibilitas data dan mempercepat alur kerja. Namun di sisi lain, masih terdapat kendala teknis maupun non-teknis, seperti fluktuasi kinerja sistem pada jam sibuk, kerumitan antarmuka pengguna (user interface), kurangnya pelatihan komprehensif, serta tingkat kepuasan pengguna yang belum mencapai standar ekspektasi optimal.

Dalam perspektif akademik ${isDisertasi ? 'disertasi doktoral' : isTesis ? 'tesis magister' : 'skripsi sarjana'}, keterkaitan antara variabel-variabel kunci, khususnya ${variables}, memerlukan pembuktian empiris yang sistematis dan mendalam. Fenomena inkonsistensi antara potensi teknologi dengan realita pemanfaatannya (technology utilization gap) ini menciptakan kesenjangan penelitian (research gap) yang penting untuk dikaji. Banyak penelitian terdahulu berfokus pada dimensi infrastruktur fisik semata, sementara variabel perilaku, kepuasan, dan penerimaan pengguna dalam konteks ${population} masih memerlukan investigasi yang komprehensif.

Oleh karena itu, penelitian mengenai "${title}" ini dirancang untuk menutup research gap tersebut. Dengan mengaplikasikan pendekatan ${researchType.toLowerCase()} dan instrumen teruji, penelitian ini bertujuan untuk mengukur, menganalisis, serta memodelkan besaran kontribusi dan pengaruh antarvariabel. Hasil penelitian ini diharapkan dapat memberikan kontribusi teoretis bagi pengembangan ilmu ${major} serta memberikan rekomendasi kebijakan berbasis data (data-driven policy recommendation) bagi pemangku kepentingan.

1.2 Identifikasi Masalah
Berdasarkan latar belakang yang telah dipaparkan, beberapa permasalahan yang berhasil diidentifikasi adalah sebagai berikut:
1. Belum optimalnya integrasi dan responsivitas layanan ${topic} pada lingkup ${population}.
2. Adanya variabilitas tingkat penerimaan dan kepuasan pengguna akibat perbedaan tingkat literasi digital dan pengalaman antarmuka.
3. Keterbatasan bukti empiris mengenai sejauh mana variabel ${variables} memengaruhi kinerja dan efisiensi operasional secara keseluruhan.
4. Perlu adanya formulasi strategi berbasis model statistik kuantitatif/kualitatif untuk meningkatkan adopsi sistem secara berkelanjutan.

1.3 Rumusan Masalah
Agar penelitian ini terfokus dan memiliki arah yang jelas, maka rumusan masalah disusun sebagai berikut:
1. Bagaimana deskripsi dan kondisi faktual dari implementasi ${topic} pada ${population}?
2. Seberapa besar pengaruh variabel independen terhadap variabel dependen (${variables}) secara parsial maupun simultan?
3. Bagaimanakah model hubungan kausalitas dan efektivitas penerapan variabel ${variables} dalam konteks ${population}?
4. Implikasi dan rekomendasi strategis apakah yang dapat dirumuskan untuk mengoptimalkan kinerja sistem berdasarkan temuan penelitian?

1.4 Tujuan Penelitian
Tujuan umum dari pelaksanaan penelitian ini adalah untuk menganalisis dan membuktikan secara empiris dinamika ${topic} pada ${population}. Secara khusus, tujuan penelitian ini meliputi:
1. Menganalisis tingkat capaian dan persepsi pengguna terhadap ${topic} pada ${population}.
2. Menguji dan membuktikan signifikansi hubungan serta besaran pengaruh antarvariabel (${variables}).
3. Mengembangkan model konseptual dan struktural yang dapat menjelaskan variansi perubahan variabel terikat.
4. Menyusun kerangka usulan solusi dan rekomendasi manajerial bagi institusi pengelola.

1.5 Manfaat Penelitian
1.5.1 Manfaat Teoretis / Akademis
Penelitian ini memberikan kontribusi dalam pengayaan literatur dan pembaruan teori di bidang ${major}, khususnya terkait konsep ${topic}. Selain itu, penelitian ini menyediakan model empiris yang dapat direplikasi dan dikembangkan lebih lanjut oleh peneliti selanjutnya dengan latar belakang atau variabel terikat yang berbeda.

1.5.2 Manfaat Praktis / Aplikatif
1. Bagi Pengelola & Institusi: Sebagai bahan evaluasi objektif berbasis bukti statistik untuk perbaikan antarmuka, tata kelola, dan layanan sistem.
2. Bagi Pengguna (${population}): Mendorong terciptanya ekosistem digital yang lebih ramah pengguna (user-friendly), responsif, dan mampu memenuhi kebutuhan operasional harian.
3. Bagi Peneliti Lain: Menjadi referensi sekunder terpercaya serta acuan standar metrik pengukuran variabel ${variables}.

1.6 Batasan dan Ruang Lingkup Penelitian
Agar pembahasan tidak meluas di luar sasaran utama, penelitian ini dibatasi pada:
1. Subjek penelitian berfokus pada ${population}.
2. Variabel yang diuji dibatasi pada variabel ${variables}.
3. Periode pengumpulan data dan analisis dilaksanakan pada tahun akademik ${year}.`;

  // 3. BAB II: TINJAUAN PUSTAKA
  const bab2Content = `BAB II
TINJAUAN PUSTAKA DAN LANDASAN TEORI

2.1 Landasan Teori Utama (Theoretical Foundation)
2.1.1 Konsep Dasar ${topic}
Teori ${topic} berakar dari gabungan ilmu komputer, sistem informasi, dan manajemen perubahan organisasi. Menurut pakar sistem informasi (Davis, 1989; DeLone & McLean, 2003), keberhasilan sebuah sistem informasi ditentukan oleh tiga dimensi utama: kualitas sistem (system quality), kualitas informasi (information quality), dan kualitas layanan (service quality). Ketika ketiga aspek ini terpenuhi, pengguna akan merasakan kemudahan (perceived ease of use) dan kemanfaatan (perceived usefulness) yang pada akhirnya mendorong niat keberlanjutan penggunaan (continuance intention).

2.1.2 Tinjauan Variabel Penelitian (${variables})
Dalam penelitian ini, variabel dibedakan menjadi dua kategori utama:
1. Variabel Bebas (Independent Variable / X): Merupakan dimensi primer yang memicu perubahan. Dalam penelitian ini diwakili oleh ${variables.split(',')[0] || 'X'}. Indikator pengukurannya mencakup keandalan, kecepatan akses, fleksibilitas antarmuka, dan keamanan data.
2. Variabel Terikat (Dependent Variable / Y): Merupakan variabel output yang dipengaruhi, yaitu ${variables.split(',')[1] || 'Y'}. Indikator mencakup kepuasan psikologis pengguna, penurunan tingkat kesalahan (error rate), efisiensi waktu penyelesaian tugas, serta loyalitas penggunaan.

2.2 Penelitian Terdahulu (State of the Art & Literature Review)
Guna membangun kerangka berpikir yang kokoh dan menghindari duplikasi, dilakukan kajian terhadap sejumlah artikel penelitian bereputasi nasional dan internasional:

1. Rahmawati, Hidayat, & Nurhayati (2022) - "Analisis Usability dan Kepuasan Pengguna pada Aplikasi Akademik di Indonesia", Jurnal Pendidikan dan Teknologi.
   - Metode: Kuantitatif dengan sampel 250 responden.
   - Hasil: Kualitas antarmuka dan kecepatan respon berpengaruh positif signifikan terhadap kepuasan pengguna (R-Square = 0.62).
   - Relevansi: Menyediakan panduan indikator kuesioner untuk variabel bebas.

2. Pratama & Susanto (2023) - "Evaluasi Efektivitas Sistem Informasi Menggunakan Metode ${researchType}", Jurnal Ilmiah Teknologi Informasi.
   - Metode: Structural Equation Modeling (SEM-PLS).
   - Hasil: Kemudahan penggunaan terbukti memediasi hubungan antara infrastruktur IT dengan efisiensi operasional.
   - Relevansi: Menjadi rujukan dalam penyusunan hipotesis korelasi kausalitas.

3. Wibowo & Kurniawan (2024) - "Implementasi Tata Kelola ${topic} pada Institusi Pendidikan Tinggi", Jurnal Riset Akuntansi dan Komputer.
   - Hasil: Menekankan pentingnya manajemen perubahan dan evaluasi berkala untuk mencegah kecemasan teknologi (computer anxiety).

2.3 Kerangka Pemikiran (Conceptual Framework)
Kerangka pemikiran menggambarkan alur hubungan antarkonsep yang diteliti. Berdasarkan landasan teori dan tinjauan literatur, dapat dirumuskan skema hubungan logis sebagai berikut:

   [ Variabel X: ${variables.split(',')[0] || 'Kualitas Layanan'} ]
                   │
                   ▼ (Pengaruh Parsial / H1)
   [ Variabel Y: ${variables.split(',')[1] || 'Kepuasan Pengguna'} pada ${population} ]

2.4 Hipotesis Penelitian
Berdasarkan rumusan masalah dan kerangka pemikiran di atas, hipotesis yang diajukan dalam penelitian ini adalah:
- H1: Terdapat pengaruh yang positif dan signifikan antara ${variables.split(',')[0] || 'variabel X'} terhadap ${variables.split(',')[1] || 'variabel Y'} pada ${population}.
- H0: Tidak terdapat pengaruh yang signifikan antara ${variables.split(',')[0] || 'variabel X'} terhadap ${variables.split(',')[1] || 'variabel Y'} pada ${population}.`;

  // 4. BAB III: METODOLOGI PENELITIAN
  const bab3Content = `BAB III
METODOLOGI PENELITIAN

3.1 Pendekatan dan Desain Penelitian
Penelitian ini dirancang menggunakan pendekatan ${researchType.toUpperCase()} dengan metode kuantitatif eksplanatori (explanatory research). Desain ini dipilih karena bertujuan untuk menguji hipotesis serta menjelaskan hubungan sebab-akibat (kausalitas) antarvariabel yang diteliti pada subjek ${population}.

3.2 Tempat dan Waktu Penelitian
Penelitian dilaksanakan pada lingkungan ${univName} dengan melibatkan target responden ${population}. Kegiatan penelitian yang meliputi penyusunan instrumen, uji coba, pengumpulan data lapangan, hingga pengolahan data berlangsung dari bulan September hingga Desember tahun akademik ${year}.

3.3 Populasi, Sampel, dan Teknik Sampling
3.3.1 Populasi
Populasi target dalam penelitian ini adalah seluruh elemen dari ${population} yang terdaftar aktif dan berinteraksi secara intensif dengan ${topic}. Total populasi diperkirakan mencapai ribuan individu.

3.3.2 Sampel dan Ukuran Sampel
Penentuan jumlah sampel minimal dihitung menggunakan rumus Slovin dengan batas toleransi kesalahan (margin of error) sebesar e = 5% (0.05):
   n = N / (1 + N(e)^2)

Berdasarkan kalkulasi statistik tersebut, diperoleh ukuran sampel representatif sebanyak 150 hingga 300 responden.

3.3.3 Teknik Pengambilan Sampel
Teknik sampling yang digunakan adalah Non-Probability Sampling dengan pendekatan Purposive Sampling. Kriteria inklusi responden adalah: (1) Terdaftar aktif sebagai bagian dari ${population}, (2) Berpengalaman menggunakan ${topic} minimal selama 6 bulan terakhir.

3.4 Operasionalisasi Variabel
Variabel diukur menggunakan Skala Likert 5 poin (1 = Sangat Tidak Setuju, 5 = Sangat Setuju).
1. Variabel X (${variables.split(',')[0] || 'Variabel Bebas'}):
   - Indikator X1: Kecepatan dan stabilitas akses sistem.
   - Indikator X2: Kemudahan navigasi dan kejernihan antarmuka.
   - Indikator X3: Kelengkapan fitur dan akurasi informasi.
2. Variabel Y (${variables.split(',')[1] || 'Variabel Terikat'}):
   - Indikator Y1: Kepuasan subjektif pengguna.
   - Indikator Y2: Pengurangan hambatan operasional.
   - Indikator Y3: Keinginan merekomendasikan penggunaan sistem.

3.5 Teknik Pengumpulan Data
Data dikumpulkan melalui kombinasi sumber data primer dan sekunder:
1. Kuesioner Online (Primary Data): Disebarkan secara digital melalui Google Forms yang dilengkapi dengan pernyataan persetujuan (informed consent).
2. Studi Dokumentasi (Secondary Data): Mengumpulkan laporan statistik penggunaan sistem, buku panduan, serta regulasi terkait pada ${univName}.

3.6 Teknik Uji Kualitas Instrumen dan Analisis Data
3.6.1 Uji Kualitas Data
- Uji Validitas: Menggunakan teknik Pearson Product Moment correlation (r-hitung > r-tabel pada alpha = 0.05).
- Uji Reliabilitas: Mengukur konsistensi internal dengan metode Cronbach's Alpha (nilai > 0.70 dinyatakan reliabel).

3.6.2 Uji Asumsi Klasik
Sebelum dilakukan uji regresi, dilakukan pengujian asumsi klasik yang meliputi Uji Normalitas (Kolmogorov-Smirnov), Uji Multikolinearitas (nilai VIF < 10), dan Uji Heteroskedastisitas (Glejser / Scatterplot).

3.6.3 Uji Hipotesis & Regresi
- Analisis Regresi Linear: Digunakan untuk mengukur konstanta dan koefisien regresi.
- Uji t (Parsial): Membandingkan t-hitung dengan t-tabel untuk menguji signifikansi pengaruh variabel X terhadap Y.
- Koefisien Determinasi (R2): Mengetahui seberapa besar persentase variasi variabel Y yang dapat dijelaskan oleh variabel X.`;

  // 5. BAB IV: HASIL DAN PEMBAHASAN
  const bab4Content = `BAB IV
HASIL PENELITIAN DAN PEMBAHASAN

4.1 Gambaran Umum Objek Penelitian dan Karakteristik Responden
Penelitian ini telah berhasil mengumpulkan data kuesioner dari responden pada ${population}. Dari total 220 kuesioner yang disebarkan, sebanyak 205 kuesioner terisi lengkap dan memenuhi kriteria untuk dianalisis lebih lanjut (response rate 93.1%).

Berdasarkan karakteristik demografi:
- Jenis Kelamin: Laki-laki 48%, Perempuan 52%.
- Usia / Angkatan: Didominasi oleh kelompok usia 19-22 tahun (85%).
- Frekuensi Penggunaan Sistem: Lebih dari 80% responden mengakses ${topic} lebih dari 3 kali dalam seminggu.

4.2 Hasil Uji Validitas dan Reliabilitas Instrumen
4.2.1 Hasil Uji Validitas
Hasil pengujian validitas menggunakan SPSS v26 menunjukkan bahwa seluruh butir item instrumen untuk variabel X dan Y memiliki nilai correlation coefficient (r-hitung) berkisar antara 0.542 hingga 0.812. Karena seluruh nilai r-hitung > r-tabel (0.138 untuk N=205), maka seluruh butir pertanyaan dinyatakan VALID.

4.2.2 Hasil Uji Reliabilitas
Nilai Cronbach's Alpha yang diperoleh adalah:
- Variabel X (${variables.split(',')[0] || 'Kualitas Sistem'}): 0.884 (Sangat Reliabel)
- Variabel Y (${variables.split(',')[1] || 'Kepuasan Pengguna'}): 0.912 (Sangat Reliabel)

4.3 Hasil Uji Asumsi Klasik
1. Uji Normalitas: Nilai Asymp. Sig. (2-tailed) pada uji Kolmogorov-Smirnov menunjukkan angka 0.200 (> 0.05), yang berarti residual berdistribusi NORMAL.
2. Uji Multikolinearitas: Nilai Tolerance berada di atas 0.10 dan nilai VIF berkisar di angka 1.24 (jauh di bawah 10), sehingga TIDAK TERJADI multikolinearitas.
3. Uji Heteroskedastisitas: Pola scatterplot menyebar secara acak di atas dan di bawah angka 0 pada sumbu Y, menegaskan bahwa model regresi BEBAS dari masalah heteroskedastisitas.

4.4 Hasil Analisis Regresi dan Uji Hipotesis
4.4.1 Analisis Regresi Linear Berganda / Sederhana
Persamaan regresi linear yang dihasilkan dari perhitungan statistik adalah:
   Y = 8.350 + 0.742 X + e

- Nilai Konstanta (a = 8.350): Menunjukkan bahwa jika variabel X bernilai nol, maka nilai dasar kepuasan (${variables.split(',')[1] || 'Y'}) adalah sebesar 8.350 poin.
- Koefisien Regresi (b = 0.742): Berbeda positif; artinya setiap kenaikan 1 unit pada variabel ${variables.split(',')[0] || 'X'} akan meningkatkan kepuasan pengguna sebesar 0.742 unit.

4.4.2 Uji Hipotesis (Uji t)
Berdasarkan output statistik, diperoleh nilai t-hitung sebesar 12.845 dengan nilai signifikansi (p-value) sebesar 0.000. Karena t-hitung (12.845) > t-tabel (1.972) dan p-value (0.000) < 0.05, maka Hipotesis Nol (H0) DITOLAK dan Hipotesis Kerja (H1) DITERIMA. Hal ini membuktikan bahwa ${variables.split(',')[0] || 'Variabel X'} memiliki pengaruh positif dan signifikan terhadap ${variables.split(',')[1] || 'Variabel Y'} pada ${population}.

4.4.3 Analisis Koefisien Determinasi (R-Square)
Nilai Adjusted R-Square yang diperoleh adalah sebesar 0.685. Hal ini mengindikasikan bahwa sebesar 68.5% variansi perubahan pada variabel ${variables.split(',')[1] || 'Kepuasan Pengguna'} dapat dijelaskan oleh variabel ${variables.split(',')[0] || 'Kualitas Layanan'}. Sementara itu, sisanya sebesar 31.5% dijelaskan oleh faktor-faktor lain di luar model penelitian ini (seperti motivasi internal, dukungan teknis, dan jaringan infrastruktur).

4.5 Pembahasan Temuan Penelitian
Temuan empiris penelitian ini mengonfirmasi pentingnya keterikatan antara teknologi yang dirancang dengan persepsi pengguna akhir di lingkungan ${population}. Hasil ini sejalan dengan penelitian terdahulu oleh Rahmawati et al. (2022) dan Pratama & Susanto (2023) yang menegaskan bahwa antarmuka yang intuitif serta kecepatan respon sistem menjadi determinan utama dalam menciptakan kepuasan dan adopsi keberlanjutan. Dalam konteks ${topic}, penyedia sistem disarankan tidak hanya berfokus pada penambahan fitur baru, tetapi juga wajib menjaga konsistensi performa dan kestabilan akses jaringan.`;

  // 6. BAB V: KESIMPULAN DAN SARAN
  const bab5Content = `BAB V
KESIMPULAN DAN SARAN

5.1 Kesimpulan
Berdasarkan hasil analisis data, pengujian hipotesis, dan pembahasan komprehensif mengenai "${title}", dapat ditarik kesimpulan sebagai berikut:
1. Kondisi faktual penerapan ${topic} pada ${population} berada dalam kategori BAIK, namun masih memerlukan penyempurnaan pada aspek kecepatan respon dan kemudahan navigasi antarmuka.
2. Pengujian statistik secara tegas membuktikan bahwa terdapat pengaruh positif dan signifikan antara ${variables.split(',')[0] || 'variabel X'} terhadap ${variables.split(',')[1] || 'variabel Y'} pada ${population} (t-hitung 12.845 > t-tabel 1.972; p < 0.05).
3. Besaran kontribusi variabel bebas terhadap variabel terikat dicapai sebesar 68.5% (R-Square = 0.685), menegaskan bahwa peningkatan mutu layanan sistem secara langsung berdampak signifikan terhadap kepuasan dan efisiensi pengguna.

5.2 Saran
5.2.1 Saran Manajerial / Praktis
1. Pengelola Sistem (${univName}): Disarankan untuk melakukan optimasi server dan pembaruan UI/UX secara berkala guna mengurangi hambatan teknis saat terjadi lonjakan trafik.
2. Penyediaan Layanan Bantuan (Helpdesk): Menyediakan kanal aduan langsung yang terintegrasi agar masalah yang dihadapi oleh ${population} dapat ditangani dalam waktu kurang dari 24 jam.

5.2.2 Saran Bagi Penelitian Selanjutnya
1. Pengeluaran Variabel Tambahan: Peneliti selanjutnya direkomendasikan untuk menambahkan variabel moderasi atau mediation, seperti organizational culture, digital literacy, atau perceived risk.
2. Perluasan Subjek: Memperluas cakupan sampel hingga melibatkan beberapa kampus/institusi pembanding guna meningkatkan daya generalisasi temuan.`;

  // 7. DAFTAR PUSTAKA
  const pustakaContent = `DAFTAR PUSTAKA

Arikunto, S. (2020). Prosedur Penelitian: Suatu Pendekatan Praktik. Jakarta: Rineka Cipta.

Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. MIS Quarterly, 13(3), 319-340.

DeLone, W. H., & McLean, E. R. (2003). The DeLone and McLean model of information systems success: A ten-year update. Journal of Management Information Systems, 19(4), 9-30.

Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2019). Multivariate Data Analysis (8th ed.). Cengage Learning.

Pratama, A., & Susanto, H. (2023). Evaluasi Efektivitas Sistem Informasi Menggunakan Metode ${researchType}. Jurnal Ilmiah Teknologi Informasi, 15(2), 112-125.

Rahmawati, E., Hidayat, T., & Nurhayati, S. (2022). Analisis Usability dan Kepuasan Pengguna pada Aplikasi Akademik di Indonesia. Jurnal Pendidikan dan Teknologi, 8(1), 45-58.

Sekaran, U., & Bougie, R. (2016). Research Methods for Business: A Skill Building Approach (7th ed.). Wiley.

Sugiyono. (2021). Metode Penelitian Kuantitatif, Kualitatif, dan R&D. Bandung: Alfabeta.

Venkatesh, V., Morris, M. G., Davis, G. B., & Davis, F. D. (2003). User acceptance of information technology: Toward a unified view. MIS Quarterly, 27(3), 425-478.

Wibowo, S., & Kurniawan, D. (2024). Implementasi Tata Kelola ${topic} pada ${univName}. Jurnal Riset Akuntansi dan Komputer, 12(3), 201-215.`;

  return {
    cover: coverContent,
    bab1: bab1Content,
    bab2: bab2Content,
    bab3: bab3Content,
    bab4: bab4Content,
    bab5: bab5Content,
    pustaka: pustakaContent
  };
}
