/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           REXA MUSIC SCHOOL — CHATBOX CONFIGURATION         ║
 * ║                                                              ║
 * ║  Edit this file to update chatbot content, FAQ answers,      ║
 * ║  the AI system prompt, and UI text.                          ║
 * ║  You do NOT need to touch chatbox.js.                        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ─── CONTACT ─────────────────────────────────────────────────────────────────
// Update this if your WhatsApp number changes.

export const WHATSAPP_URL = 'https://wa.me/6287708891665';

// ─── UI TEXT ──────────────────────────────────────────────────────────────────
// Labels, placeholders, and messages shown in the chat widget.

export const UI = {
    headerTitle:      'RMS Assistant',
    headerSubtitle:   'Online — siap membantu!',
    welcomeMessage:   'Halo! 👋 Selamat datang di Rexa Music School. Ada yang bisa kami bantu? Tanya soal program, jadwal, free trial, atau apa saja ya!',
    inputPlaceholder: 'Ketik pertanyaanmu...',
    suggestionsLabel: 'Pertanyaan serupa',
};

// ─── QUICK REPLY BUTTONS ──────────────────────────────────────────────────────
// Buttons shown when the chat first opens.
// Each `faqId` must match an `id` in the FAQ array below.

export const QUICK_REPLIES = [
    { label: 'Program Apa Saja?', faqId: 'programs'  },
    { label: 'Cara Daftar',       faqId: 'register'  },
    { label: 'Free Trial',        faqId: 'trial'      },
    { label: 'Hubungi Kami',      faqId: 'contact'   },
];

// ─── AI SYSTEM PROMPT ─────────────────────────────────────────────────────────
// Instructions for Claude. Edit this to change the AI's persona,
// knowledge, tone, and rules.

export const SYSTEM_PROMPT = `Kamu adalah asisten virtual Rexa Music School, sebuah contemporary music school di Cimahi, West Java, Indonesia.

INFORMASI REXA MUSIC SCHOOL:
- Lokasi: Jl. Purbasari No. 3, Padasuka, Cimahi Utara, West Java
- Berdiri: 2013, di bawah Yayasan Soteria Terpadu
- WhatsApp: +62 877-0889-1665 | Instagram: @rexamusicschool

PROGRAM INSTRUMEN: Acoustic Guitar, Electric Guitar, Piano, Keyboard, Vocal, Violin, Drums, Bass, Saxophone
PROGRAM TAMBAHAN: Theory Class, Students Band, Music Production, Recording Class
EVENT & PROGRAM KOMUNITAS: Annual Home Concert, Music Picnic

KURIKULUM RSL Awards (Rockschool by RSL Awards): Diakui internasional (50+ negara), Level Premiere hingga Grade 8, pendekatan Knowledge + Skills + Attitude

SISWA: Mulai usia 5 tahun.

JAM OPERASIONAL:
- Senin-Jumat: 11.00-19.00
- Sabtu: 09.00-15.00
- Minggu: Tutup

FASILITAS: Ruang kelas ber-AC dan kedap suara. Alat musik tersedia untuk digunakan selama sesi di tempat (tidak bisa dibawa pulang).

HARGA: Tuition fee mulai dari Rp300.000 per bulan (harga starting from, bervariasi tergantung grade dan program). Belum termasuk registration fee, enrollment fee, dan stationery fee. Untuk detail harga, arahkan ke WhatsApp.

KEUNGGULAN REXA MUSIC SCHOOL:
- Fokus pada kesehatan mental murid dan staf, bukan hanya skill musik
- Pendekatan yang hangat, menyenangkan, dan bebas tekanan
- Journal book untuk tracking perkembangan murid secara detail
- Laporan perkembangan digital bulanan dan kuartalan untuk orang tua
- Video sesi belajar yang dikirim ke orang tua
- Hubungan personal yang erat antara instruktur, murid, dan orang tua
- Kesempatan tampil: Home Concert, Music Picnic, kompetisi, konten media sosial
- Presensi digital dan sistem modern yang efisien

KEBIJAKAN: Reschedule maksimal diinfokan 24 jam sebelumnya.

GAYA MENJAWAB:
- Bahasa Indonesia conversational, campur English boleh
- Gunakan "kamu" bukan "Anda"
- MAKSIMAL 3 kalimat, singkat dan padat
- Sesekali pakai emoji yang relevan 🎵 🎸 ✨
- Jika tidak tahu, arahkan ke WhatsApp
- Jika tertarik, tawarkan free trial gratis`;

// ─── FAQ — INSTANT ANSWERS ────────────────────────────────────────────────────
// These questions are answered instantly (no AI call needed).
// Clicking a suggestion or quick reply uses the answer here directly.
//
// Fields:
//   id       — unique key, must match any QUICK_REPLIES entries
//   keywords — words that trigger this suggestion while typing
//   question — displayed as the suggestion text
//   answer   — the bot's reply (keep it under 3–4 sentences)
//   cta      — optional button shown below the answer
//              set to null to show no button, or:
//              { label: 'Button Text', href: 'https://...' }

export const FAQ = [
    {
        id: 'programs',
        keywords: ['program', 'kelas', 'instrumen', 'instrument', 'les apa', 'ada apa', 'pilihan', 'tersedia', 'main apa', 'belajar apa'],
        question: 'Program apa saja yang tersedia?',
        answer: 'Rexa Music School punya 9 program instrumen: Acoustic Guitar, Electric Guitar, Piano, Keyboard, Vocal, Violin, Drums, Bass, dan Saxophone. Plus kelas tambahan: Theory Class, Students Band, Music Production, Recording Class, Annual Home Concert, dan Music Picnic. 🎵',
        cta: null,
    },
    {
        id: 'price',
        keywords: ['biaya', 'harga', 'berapa', 'tarif', 'bayar', 'iuran', 'mahal', 'cost', 'fee', 'pricelist', 'price list', 'daftar harga'],
        question: 'Berapa biaya lesnya?',
        answer: 'Tuition fee mulai dari Rp300.000/bulan (harga bervariasi tergantung grade dan program). Belum termasuk registration, enrollment, dan stationery fee. Untuk detail lengkap, hubungi kami via WhatsApp ya! 😊',
        cta: { label: 'Tanya via WhatsApp', href: WHATSAPP_URL },
    },
    {
        id: 'register',
        keywords: ['daftar', 'mendaftar', 'registrasi', 'enroll', 'cara daftar', 'mulai', 'bergabung'],
        question: 'Bagaimana cara mendaftar?',
        answer: 'Gampang! Hubungi kami via WhatsApp atau klik "Book Free Trial" di website. Kami jadwalkan satu sesi percobaan gratis dulu, tanpa komitmen. ✨',
        cta: { label: 'Book Free Trial', href: WHATSAPP_URL },
    },
    {
        id: 'trial',
        keywords: ['free trial', 'trial', 'coba', 'gratis', 'percobaan', 'sesi pertama', 'test'],
        question: 'Gimana mekanisme free trial?',
        answer: 'Hubungi kami via WhatsApp dan kami jadwalkan satu sesi percobaan gratis bersama instruktur yang sesuai. Tidak ada komitmen, tidak ada tekanan, biar musiknya yang bicara! 🎉',
        cta: { label: 'Daftar Free Trial', href: WHATSAPP_URL },
    },
    {
        id: 'age',
        keywords: ['umur', 'usia', 'berapa tahun', 'anak', 'minimal umur', 'mulai umur', 'tahun', 'balita'],
        question: 'Mulai umur berapa bisa belajar?',
        answer: 'Kami menerima siswa mulai usia 5 tahun. Metode disesuaikan dengan tahap perkembangan tiap usia, anak kecil sampai dewasa punya pendekatan yang berbeda. Tidak ada kata terlambat! 😊',
        cta: null,
    },
    {
        id: 'beginner',
        keywords: ['pemula', 'nol', 'belum bisa', 'tidak bisa', 'baru', 'pertama kali', 'dasar', 'dari nol'],
        question: 'Saya masih pemula total, bisa daftar?',
        answer: 'Justru itu titik terbaik untuk mulai! Kurikulum RSL Awards kami dimulai dari level Premiere, dirancang khusus untuk pemula absolut. Semua orang di Rexa Music School dulu juga mulai dari nol 🎵',
        cta: null,
    },
    {
        id: 'instrument_loan',
        keywords: ['alat musik', 'instrumen sendiri', 'punya alat', 'beli dulu', 'harus bawa', 'belum punya alat'],
        question: 'Harus punya alat musik sendiri dulu?',
        answer: 'Tidak wajib di awal! Alat musik tersedia untuk digunakan selama sesi belajar di tempat. Kami juga akan bantu rekomendasikan alat yang tepat setelah beberapa sesi pertama 🎸',
        cta: null,
    },
    {
        id: 'schedule',
        keywords: ['jadwal', 'schedule', 'kapan', 'hari', 'jam', 'waktu', 'fleksibel', 'malam', 'weekend', 'hari apa', 'operasional', 'buka', 'tutup'],
        question: 'Jam operasional dan jadwal les?',
        answer: 'Kami buka Senin-Jumat pukul 11.00-19.00 dan Sabtu 09.00-15.00. Jadwal les diatur bersama instruktur di awal enrollment sesuai ketersediaan slot 📅',
        cta: null,
    },
    {
        id: 'rsl',
        keywords: ['rsl', 'rsl awards', 'sertifikat', 'sertifikasi', 'internasional', 'grade', 'akreditasi', 'rockschool'],
        question: 'Apa itu RSL Awards?',
        answer: 'Rockschool by RSL Awards adalah lembaga sertifikasi musik kontemporer dari UK, diakui di 50+ negara. Rexa Music School adalah salah satu RSL Accredited Center di West Java, sertifikatmu valid secara internasional! 🌍',
        cta: null,
    },
    {
        id: 'location',
        keywords: ['lokasi', 'alamat', 'dimana', 'cimahi', 'bandung', 'jalan', 'tempat', 'parkir', 'maps'],
        question: 'Di mana lokasi Rexa Music School?',
        answer: 'Kami ada di Jl. Purbasari No. 3, Padasuka, Cimahi Utara, mudah diakses dari Bandung Utara dan Cimahi. Tersedia parkir untuk motor dan mobil 📍',
        cta: null,
    },
    {
        id: 'online',
        keywords: ['online', 'daring', 'zoom', 'virtual', 'remote', 'jarak jauh', 'dari rumah'],
        question: 'Ada kelas online?',
        answer: 'Tersedia untuk kondisi tertentu. Hubungi kami via WhatsApp untuk info lebih lanjut soal opsi hybrid atau kelas online ya!',
        cta: { label: 'Tanya via WhatsApp', href: WHATSAPP_URL },
    },
    {
        id: 'contact',
        keywords: ['kontak', 'hubungi', 'whatsapp', 'wa', 'telepon', 'contact', 'instagram', 'sosmed'],
        question: 'Bagaimana cara menghubungi Rexa Music School?',
        answer: 'Bisa via WhatsApp +62 877-0889-1665 atau Instagram @rexamusicschool. Kami buka Senin-Jumat 11.00-19.00 dan Sabtu 09.00-15.00 📱',
        cta: { label: 'Chat WhatsApp', href: WHATSAPP_URL },
    },
    {
        id: 'instructors',
        keywords: ['instruktur', 'guru', 'pengajar', 'siapa', 'teacher', 'coach', 'tenaga pengajar'],
        question: 'Siapa saja instrukturnya?',
        answer: 'Instruktur kami adalah profesional berpengalaman yang terlatih dalam kurikulum RSL Awards internasional. Untuk info lengkap profil instruktur, kunjungi website kami atau tanya langsung via WhatsApp! 🎶',
        cta: null,
    },
    {
        id: 'compare',
        keywords: ['beda', 'bedanya', 'keunggulan', 'kenapa', 'why', 'les privat', 'dibanding', 'lebih baik'],
        question: 'Apa bedanya Rexa Music School vs les privat biasa?',
        answer: 'Di Rexa Music School kamu dapat kurikulum RSL Awards terstruktur, sertifikasi internasional, journal book perkembangan, laporan digital untuk orang tua, komunitas sesama musisi, dan kesempatan tampil di Home Concert dan Music Picnic 🎵',
        cta: null,
    },
    {
        id: 'mental_health',
        keywords: ['mental', 'kesehatan mental', 'stress', 'stres', 'nyaman', 'aman', 'tekanan', 'fun', 'menyenangkan', 'suasana'],
        question: 'Bagaimana pendekatan kesehatan mental di sini?',
        answer: 'Kami percaya belajar musik harusnya menyenangkan dan bebas tekanan. Kesehatan mental murid adalah prioritas kami, setiap sesi dirancang untuk membangun kepercayaan diri dan rasa nyaman. Musik paling baik dipelajari dengan hati yang bahagia 🧠✨',
        cta: null,
    },
    {
        id: 'music_picnic',
        keywords: ['music picnic', 'picnic', 'piknik', 'outdoor', 'komunitas', 'event', 'acara'],
        question: 'Apa itu Music Picnic?',
        answer: 'Music Picnic adalah program komunitas Rexa Music School di mana murid, keluarga, dan instruktur berkumpul dalam suasana santai di luar ruangan. Ada penampilan akustik, games, dan momen kebersamaan yang memperkuat komunitas kami 🌿🎸',
        cta: null,
    },

    // -------------------------------------------------------------------------
    // ADD NEW FAQ ENTRIES BELOW THIS LINE
    // Copy the block above, give it a unique id, and fill in the fields.
    // -------------------------------------------------------------------------
];
