/**
 * Rexa Music School — AI Chatbox Widget
 * AI: Claude Haiku (Anthropic) via direct fetch — no SDK required
 * Features: Local FAQ instant answers + Claude fallback + live suggestions while typing
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const getApiKey = () => {
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLAUDE_API_KEY) {
            return import.meta.env.VITE_CLAUDE_API_KEY;
        }
    } catch (e) {}
    return '';
};

const CLAUDE_API_KEY = getApiKey();
const MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `Kamu adalah asisten virtual Rexa Music School (RMS), sebuah contemporary music school di Cimahi, West Java, Indonesia.

INFORMASI RMS:
- Lokasi: Jl. Purbasari No. 3, Padasuka, Cimahi Utara, West Java
- Berdiri: 2013, di bawah Yayasan Soteria Terpadu
- WhatsApp: +62 812 3456 789 | Instagram: @rexamusicschool

PROGRAM: Guitar, Piano, Vocal, Drums & Percussion, Violin, Music Production, Theory Class, Recording Class
EVENT: Annual Home Concert, Workshops & Camps

KURIKULUM RSL Awards: Diakui internasional (50+ negara), Level Premiere–Grade 8, pendekatan Knowledge + Skills + Attitude

SISWA: Mulai usia 5 tahun. Slot weekday & weekend termasuk malam hari.

FASILITAS: Ruang ber-AC kedap suara. Studio dengan Logic Pro/Pro Tools. Siswa bisa pinjam instrumen.

PROMO:
- Diskon 10% jika langsung daftar di hari yang sama dengan free trial
- Cashback Rp 50.000 untuk referral teman baru ("Bawa Teman")

KEBIJAKAN: Reschedule max diinfokan 24 jam sebelumnya.

HARGA: Jangan sebutkan angka spesifik — ada paket 1, 3, dan 6 bulan. Arahkan ke WhatsApp untuk detail.

GAYA MENJAWAB:
- Bahasa Indonesia conversational, campur English boleh
- Gunakan "kamu" bukan "Anda"
- MAKSIMAL 3 kalimat — singkat dan padat
- Sesekali pakai emoji yang relevan 🎵 🎸 ✨
- Jika tidak tahu, arahkan ke WhatsApp
- Jika tertarik, tawarkan free trial gratis`;

// ─── LOCAL FAQ (instant answers — zero API call) ──────────────────────────────

const FAQ = [
    {
        id: 'programs',
        keywords: ['program', 'kelas', 'instrumen', 'instrument', 'les apa', 'ada apa', 'pilihan', 'tersedia', 'main apa', 'belajar apa'],
        question: 'Program apa saja yang tersedia?',
        answer: 'RMS punya 6 program utama: Guitar, Piano, Vocal, Drums & Percussion, Violin, dan Music Production. Ada juga Theory Class, Recording Class, dan event tahunan Annual Home Concert. Semua tersedia dari anak-anak sampai dewasa! 🎵',
        cta: null,
    },
    {
        id: 'price',
        keywords: ['biaya', 'harga', 'berapa', 'tarif', 'bayar', 'iuran', 'mahal', 'cost', 'fee'],
        question: 'Berapa biaya lesnya?',
        answer: 'Biaya bervariasi tergantung program. Ada paket bulanan, 3 bulan, dan 6 bulan (makin lama makin hemat!). Untuk harga terkini, hubungi kami via WhatsApp — kami bantu pilihkan paket yang paling pas 😊',
        cta: { label: 'Tanya via WhatsApp', href: 'https://wa.me/628123456789' },
    },
    {
        id: 'register',
        keywords: ['daftar', 'mendaftar', 'registrasi', 'enroll', 'cara daftar', 'mulai', 'bergabung'],
        question: 'Bagaimana cara mendaftar?',
        answer: 'Gampang! Hubungi kami via WhatsApp atau klik "Book Free Trial" di website. Kami jadwalkan satu sesi percobaan gratis, tanpa komitmen. Daftar di hari yang sama dapat diskon 10%! ✨',
        cta: { label: 'Book Free Trial', href: 'https://wa.me/628123456789' },
    },
    {
        id: 'trial',
        keywords: ['free trial', 'trial', 'coba', 'gratis', 'percobaan', 'sesi pertama', 'test'],
        question: 'Gimana mekanisme free trial?',
        answer: 'Daftar via WhatsApp dan kami jadwalkan satu sesi gratis dengan instruktur yang sesuai. Tidak ada komitmen, tidak ada tekanan. Kalau langsung daftar di hari yang sama, ada diskon 10%! 🎉',
        cta: { label: 'Daftar Free Trial', href: 'https://wa.me/628123456789' },
    },
    {
        id: 'age',
        keywords: ['umur', 'usia', 'berapa tahun', 'anak', 'minimal umur', 'mulai umur', 'tahun', 'balita'],
        question: 'Mulai umur berapa bisa belajar?',
        answer: 'Kami menerima siswa mulai usia 5 tahun. Metode disesuaikan dengan tahap perkembangan tiap usia — anak kecil sampai dewasa punya pendekatan yang berbeda. Tidak ada kata terlambat! 😊',
        cta: null,
    },
    {
        id: 'beginner',
        keywords: ['pemula', 'nol', 'belum bisa', 'tidak bisa', 'baru', 'pertama kali', 'dasar', 'dari nol'],
        question: 'Saya masih pemula total, bisa daftar?',
        answer: 'Justru itu titik terbaik untuk mulai! Kurikulum RSL Awards kami dimulai dari level Premiere — dirancang khusus untuk pemula absolut. Semua orang di RMS dulu juga mulai dari nol 🎵',
        cta: null,
    },
    {
        id: 'instrument_loan',
        keywords: ['alat musik', 'instrumen sendiri', 'punya alat', 'beli dulu', 'harus bawa', 'belum punya alat'],
        question: 'Harus punya alat musik sendiri dulu?',
        answer: 'Tidak wajib di awal! Alat musik tersedia di sekolah selama sesi belajar, dan siswa boleh meminjam untuk latihan (selama slot kosong). Kami bantu rekomendasikan alat yang tepat setelah beberapa sesi 🎸',
        cta: null,
    },
    {
        id: 'schedule',
        keywords: ['jadwal', 'schedule', 'kapan', 'hari', 'jam', 'waktu', 'fleksibel', 'malam', 'weekend', 'hari apa'],
        question: 'Jadwal lesnya fleksibel nggak?',
        answer: 'Cukup fleksibel! Ada slot weekday dan weekend, termasuk sore dan malam hari untuk yang sibuk kerja atau sekolah. Jadwal diatur bersama instrukturmu di awal enrollment 📅',
        cta: null,
    },
    {
        id: 'rsl',
        keywords: ['rsl', 'rsl awards', 'sertifikat', 'sertifikasi', 'internasional', 'grade', 'akreditasi', 'sertifikat internasional'],
        question: 'Apa itu RSL Awards?',
        answer: 'RSL Awards adalah lembaga sertifikasi musik kontemporer dari UK, diakui di 50+ negara. RMS adalah salah satu dari sedikit RSL Accredited Center di West Java — sertifikatmu valid di seluruh dunia! 🌍',
        cta: null,
    },
    {
        id: 'location',
        keywords: ['lokasi', 'alamat', 'dimana', 'cimahi', 'bandung', 'jalan', 'tempat', 'parkir', 'maps', 'google maps'],
        question: 'Di mana lokasi RMS?',
        answer: 'Kami ada di Jl. Purbasari No. 3, Padasuka, Cimahi Utara — mudah diakses dari Bandung Utara dan Cimahi. Tersedia parkir untuk motor dan mobil 📍',
        cta: null,
    },
    {
        id: 'online',
        keywords: ['online', 'daring', 'zoom', 'virtual', 'remote', 'jarak jauh', 'dari rumah'],
        question: 'Ada kelas online?',
        answer: 'Tersedia untuk kondisi tertentu. Hubungi kami via WhatsApp untuk info lebih lanjut soal opsi hybrid atau kelas online ya!',
        cta: { label: 'Tanya via WhatsApp', href: 'https://wa.me/628123456789' },
    },
    {
        id: 'contact',
        keywords: ['kontak', 'hubungi', 'whatsapp', 'wa', 'telepon', 'contact', 'instagram', 'sosmed'],
        question: 'Bagaimana cara menghubungi RMS?',
        answer: 'Bisa via WhatsApp +62 812 3456 789 atau Instagram @rexamusicschool. Tim kami siap bantu Senin–Sabtu! 📱',
        cta: { label: 'Chat WhatsApp', href: 'https://wa.me/628123456789' },
    },
    {
        id: 'instructors',
        keywords: ['instruktur', 'guru', 'pengajar', 'siapa', 'teacher', 'coach', 'tenaga pengajar'],
        question: 'Siapa saja instrukturnya?',
        answer: 'Instruktur kami profesional berpengalaman: Rexa (Founder & Guitar, 15+ tahun), Maya (Piano & Theory, spesialis anak usia dini), dan Andi (Vocal Coach, penyanyi profesional). Semua terlatih kurikulum RSL Awards! 🎶',
        cta: null,
    },
    {
        id: 'compare',
        keywords: ['beda', 'bedanya', 'keunggulan', 'kenapa', 'why', 'les privat', 'dibanding', 'lebih baik'],
        question: 'Apa bedanya RMS vs les privat biasa?',
        answer: 'Di RMS kamu dapat kurikulum RSL Awards terstruktur, sertifikasi diakui global, komunitas sesama musisi, dan kesempatan tampil di Annual Home Concert — bukan sekadar hafal lagu, tapi tumbuh sebagai musisi 🎵',
        cta: null,
    },
    {
        id: 'promo',
        keywords: ['promo', 'diskon', 'discount', 'cashback', 'referral', 'bawa teman', 'hemat', 'potongan'],
        question: 'Ada promo atau diskon?',
        answer: 'Ada! Diskon 10% kalau langsung daftar di hari yang sama dengan free trial. Plus promo "Bawa Teman" — cashback Rp 50.000 untuk siswa yang ajak teman baru bergabung! 🎉',
        cta: { label: 'Daftar Sekarang', href: 'https://wa.me/628123456789' },
    },
];

// ─── SUGGESTION MATCHING ──────────────────────────────────────────────────────

const getSuggestions = (query) => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/).filter(w => w.length >= 2);

    return FAQ.map(faq => {
        let score = 0;
        for (const kw of faq.keywords) {
            if (q.includes(kw))          score += 3;
            else for (const w of words) {
                if (kw.startsWith(w))    score += 2;
                else if (kw.includes(w) || w.includes(kw)) score += 1;
            }
        }
        return { faq, score };
    })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(x => x.faq);
};

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

    :root {
        --rms-red: #8B0000;
        --rms-white: #FFFFFF;
        --rms-bg: #f7f7f7;
        --rms-text: #2a2a2a;
        --rms-muted: #777;
        --rms-shadow: 0 12px 30px rgba(0,0,0,0.18);
        --rms-ease: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #rms-chat-widget {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 9999;
        font-family: 'Montserrat', sans-serif;
    }

    /* ── Trigger Button ── */
    #rms-chat-trigger {
        width: 58px;
        height: 58px;
        background-color: var(--rms-red);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: var(--rms-shadow);
        transition: var(--rms-ease);
        position: relative;
        border: none;
    }

    #rms-chat-trigger:hover { transform: scale(1.08); }
    #rms-chat-trigger svg { width: 26px; height: 26px; fill: white; }

    #rms-chat-trigger.pulse::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: var(--rms-red);
        opacity: 0.5;
        z-index: -1;
        animation: rms-pulse 2.2s infinite;
    }

    @keyframes rms-pulse {
        0%   { transform: scale(1);   opacity: 0.5; }
        100% { transform: scale(1.7); opacity: 0; }
    }

    #rms-unread-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #e53e3e;
        color: white;
        font-size: 10px;
        font-weight: 700;
        width: 19px;
        height: 19px;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
    }

    /* ── Chat Window ── */
    #rms-chat-window {
        position: absolute;
        bottom: 74px;
        right: 0;
        width: 355px;
        height: 530px;
        background: var(--rms-white);
        border-radius: 20px;
        box-shadow: var(--rms-shadow);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: translateY(18px) scale(0.92);
        opacity: 0;
        pointer-events: none;
        transition: var(--rms-ease);
        transform-origin: bottom right;
    }

    #rms-chat-window.active {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: all;
    }

    /* ── Header ── */
    #rms-chat-header {
        background: var(--rms-red);
        padding: 16px 18px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
    }

    .rms-header-left { display: flex; align-items: center; gap: 11px; }

    .rms-header-avatar {
        width: 34px;
        height: 34px;
        background: rgba(255,255,255,0.18);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .rms-header-info h3 { margin: 0; font-size: 14px; font-weight: 700; }
    .rms-header-info p  { margin: 2px 0 0; font-size: 11px; opacity: 0.85; }

    .rms-online-dot {
        display: inline-block;
        width: 7px; height: 7px;
        background: #68d391;
        border-radius: 50%;
        margin-right: 4px;
        vertical-align: middle;
    }

    #rms-chat-close {
        background: rgba(255,255,255,0.15);
        border: none;
        color: white;
        cursor: pointer;
        width: 28px; height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--rms-ease);
        flex-shrink: 0;
    }

    #rms-chat-close:hover { background: rgba(255,255,255,0.3); }

    /* ── Messages ── */
    #rms-chat-messages {
        flex: 1;
        padding: 14px 14px 8px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: var(--rms-bg);
        min-height: 0;
        scroll-behavior: smooth;
    }

    #rms-chat-messages::-webkit-scrollbar { width: 3px; }
    #rms-chat-messages::-webkit-scrollbar-track { background: transparent; }
    #rms-chat-messages::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 2px; }

    .rms-msg {
        max-width: 83%;
        padding: 9px 13px;
        border-radius: 16px;
        font-size: 13px;
        line-height: 1.55;
        animation: rms-pop 0.18s ease-out;
    }

    @keyframes rms-pop {
        from { transform: scale(0.94); opacity: 0.6; }
        to   { transform: scale(1);    opacity: 1; }
    }

    .rms-msg-bot {
        align-self: flex-start;
        background: white;
        color: var(--rms-text);
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.07);
    }

    .rms-msg-user {
        align-self: flex-end;
        background: var(--rms-red);
        color: white;
        border-bottom-right-radius: 4px;
    }

    .rms-timestamp {
        font-size: 9.5px;
        color: var(--rms-muted);
        margin-top: 5px;
        display: block;
    }

    .rms-msg-user .rms-timestamp { color: rgba(255,255,255,0.6); text-align: right; }

    /* Typing bubble (appended dynamically inside messages) */
    .rms-typing-bubble {
        align-self: flex-start;
        background: white;
        padding: 10px 14px;
        border-radius: 16px;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.07);
    }

    .rms-dots { display: flex; gap: 4px; }

    .rms-dot {
        width: 6px; height: 6px;
        background: #bbb;
        border-radius: 50%;
        animation: rms-bounce 1.3s infinite ease-in-out both;
    }

    .rms-dot:nth-child(1) { animation-delay: -0.32s; }
    .rms-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes rms-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40%           { transform: scale(1); }
    }

    /* CTA button inside bot messages */
    .rms-context-btn {
        display: inline-block;
        margin-top: 9px;
        background: var(--rms-red);
        color: white !important;
        padding: 6px 13px;
        border-radius: 7px;
        font-size: 11.5px;
        font-weight: 700;
        text-decoration: none !important;
        transition: var(--rms-ease);
    }

    .rms-context-btn:hover { opacity: 0.85; transform: translateY(-1px); }

    /* ── Quick Replies ── */
    #rms-quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 9px 14px 11px;
        background: var(--rms-bg);
        border-top: 1px solid rgba(0,0,0,0.05);
        flex-shrink: 0;
    }

    .rms-quick-btn {
        background: white;
        border: 1.5px solid var(--rms-red);
        color: var(--rms-red);
        padding: 5px 11px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--rms-ease);
        font-family: inherit;
    }

    .rms-quick-btn:hover { background: var(--rms-red); color: white; }

    /* ── Suggestions Panel ── */
    #rms-suggestions {
        background: white;
        border-top: 1px solid rgba(0,0,0,0.06);
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.22s ease;
        flex-shrink: 0;
    }

    #rms-suggestions.active { max-height: 190px; overflow-y: auto; }

    #rms-suggestions::-webkit-scrollbar { width: 3px; }
    #rms-suggestions::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }

    .rms-suggest-label {
        padding: 7px 14px 3px;
        font-size: 9.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: #aaa;
    }

    .rms-suggest-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        cursor: pointer;
        font-size: 12px;
        color: var(--rms-text);
        border-top: 1px solid rgba(0,0,0,0.04);
        font-family: inherit;
        background: none;
        border-left: none;
        border-right: none;
        border-bottom: none;
        text-align: left;
        width: 100%;
        transition: background 0.12s ease, color 0.12s ease;
    }

    .rms-suggest-item:first-of-type { border-top: none; }
    .rms-suggest-item:hover { background: #fff5f5; color: var(--rms-red); }

    .rms-suggest-item svg { flex-shrink: 0; color: #ccc; transition: color 0.12s ease; }
    .rms-suggest-item:hover svg { color: var(--rms-red); }

    /* ── Input Area ── */
    #rms-chat-input-container {
        padding: 11px 14px;
        border-top: 1px solid rgba(0,0,0,0.07);
        display: flex;
        gap: 8px;
        align-items: flex-end;
        background: white;
        flex-shrink: 0;
    }

    #rms-chat-input {
        flex: 1;
        border: 1.5px solid #e8e8e8;
        border-radius: 18px;
        outline: none;
        font-family: inherit;
        font-size: 12.5px;
        resize: none;
        max-height: 72px;
        padding: 7px 13px;
        line-height: 1.45;
        color: var(--rms-text);
        background: #fafafa;
        transition: border-color 0.2s ease;
    }

    #rms-chat-input:focus { border-color: var(--rms-red); background: white; }
    #rms-chat-input::placeholder { color: #c0c0c0; }

    #rms-chat-send {
        background: var(--rms-red);
        border: none;
        color: white;
        cursor: pointer;
        width: 34px; height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: var(--rms-ease);
    }

    #rms-chat-send:hover   { background: #6a0000; transform: scale(1.06); }
    #rms-chat-send:disabled { opacity: 0.45; cursor: default; transform: none; }
    #rms-chat-send svg { width: 15px; height: 15px; fill: white; }

    /* ── Mobile ── */
    @media (max-width: 768px) {
        #rms-chat-widget { bottom: 18px; right: 16px; }

        #rms-chat-window {
            position: fixed;
            bottom: 0; right: 0; left: 0;
            width: 100%;
            height: 91dvh;
            border-radius: 20px 20px 0 0;
            transform: translateY(100%);
        }

        #rms-chat-window.active { transform: translateY(0); }
    }
`;

// ─── HTML ─────────────────────────────────────────────────────────────────────

const widgetHTML = `
    <button id="rms-chat-trigger" class="pulse" aria-label="Buka chat RMS">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        <div id="rms-unread-badge" aria-hidden="true">1</div>
    </button>

    <div id="rms-chat-window" role="dialog" aria-label="Rexa Music School Chat">
        <div id="rms-chat-header">
            <div class="rms-header-left">
                <div class="rms-header-avatar" aria-hidden="true">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
                        <path d="M9 18V5l12-2v13M6 21a2 2 0 100-4 2 2 0 000 4zm12-2a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                </div>
                <div class="rms-header-info">
                    <h3>RMS Assistant</h3>
                    <p><span class="rms-online-dot" aria-hidden="true"></span>Online — siap membantu!</p>
                </div>
            </div>
            <button id="rms-chat-close" aria-label="Tutup chat">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>

        <div id="rms-chat-messages" aria-live="polite" aria-relevant="additions"></div>

        <div id="rms-quick-replies" aria-label="Pertanyaan populer">
            <button class="rms-quick-btn" data-faq="programs">Program Apa Saja?</button>
            <button class="rms-quick-btn" data-faq="register">Cara Daftar</button>
            <button class="rms-quick-btn" data-faq="trial">Free Trial</button>
            <button class="rms-quick-btn" data-faq="contact">Hubungi Kami</button>
        </div>

        <div id="rms-suggestions" role="listbox" aria-label="Saran pertanyaan"></div>

        <div id="rms-chat-input-container">
            <textarea
                id="rms-chat-input"
                placeholder="Ketik pertanyaanmu..."
                rows="1"
                aria-label="Ketik pesan"
                autocomplete="off"
            ></textarea>
            <button id="rms-chat-send" aria-label="Kirim pesan">
                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
        </div>
    </div>
`;

// ─── INJECT ───────────────────────────────────────────────────────────────────

const widgetEl = document.createElement('div');
widgetEl.id = 'rms-chat-widget';
widgetEl.innerHTML = widgetHTML;
document.body.appendChild(widgetEl);

const styleEl = document.createElement('style');
styleEl.textContent = styles;
document.head.appendChild(styleEl);

// ─── DOM REFS ─────────────────────────────────────────────────────────────────

const triggerEl     = document.getElementById('rms-chat-trigger');
const windowEl      = document.getElementById('rms-chat-window');
const closeBtn      = document.getElementById('rms-chat-close');
const messagesEl    = document.getElementById('rms-chat-messages');
const quickReplies  = document.getElementById('rms-quick-replies');
const suggestionsEl = document.getElementById('rms-suggestions');
const inputEl       = document.getElementById('rms-chat-input');
const sendBtn       = document.getElementById('rms-chat-send');
const badge         = document.getElementById('rms-unread-badge');

// ─── STATE ────────────────────────────────────────────────────────────────────

let isOpen           = false;
let firstInteraction = false;
let chatHistory      = []; // Claude format: [{role: "user"|"assistant", content: "..."}]
let typingBubble     = null;
let suggestTimer     = null;

// ─── UTILITIES ────────────────────────────────────────────────────────────────

const now = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const escHtml = (str) =>
    String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');

const scrollBottom = () => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
};

const trimHistory = () => {
    // Keep last 10 messages (5 turns). Always trim from the front in pairs.
    while (chatHistory.length > 10) chatHistory.splice(0, 2);
};

// ─── MESSAGE RENDERING ────────────────────────────────────────────────────────

const addUserMessage = (text) => {
    const el = document.createElement('div');
    el.className = 'rms-msg rms-msg-user';
    el.innerHTML = `${escHtml(text)}<span class="rms-timestamp">${now()}</span>`;
    messagesEl.appendChild(el);
    scrollBottom();

    if (!firstInteraction) {
        quickReplies.style.display = 'none';
        firstInteraction = true;
    }
};

const addBotMessage = (text, cta = null) => {
    // Remove typing bubble if present
    if (typingBubble) { typingBubble.remove(); typingBubble = null; }

    const el = document.createElement('div');
    el.className = 'rms-msg rms-msg-bot';

    // Determine CTA button
    let ctaHtml = '';
    if (cta) {
        ctaHtml = `<br><a href="${cta.href}" class="rms-context-btn" target="_blank" rel="noopener">${escHtml(cta.label)} →</a>`;
    } else if (/free trial|daftar sekarang|booking/i.test(text)) {
        ctaHtml = `<br><a href="https://wa.me/628123456789" class="rms-context-btn" target="_blank" rel="noopener">Book Free Trial →</a>`;
    }

    el.innerHTML = `${escHtml(text)}${ctaHtml}<span class="rms-timestamp">${now()}</span>`;
    messagesEl.appendChild(el);
    scrollBottom();
};

const showTyping = () => {
    if (typingBubble) return;
    typingBubble = document.createElement('div');
    typingBubble.className = 'rms-typing-bubble';
    typingBubble.innerHTML = `<div class="rms-dots">
        <div class="rms-dot"></div>
        <div class="rms-dot"></div>
        <div class="rms-dot"></div>
    </div>`;
    messagesEl.appendChild(typingBubble);
    scrollBottom();
};

const hideTyping = () => {
    if (typingBubble) { typingBubble.remove(); typingBubble = null; }
};

// ─── SUGGESTIONS ─────────────────────────────────────────────────────────────

const renderSuggestions = (items) => {
    if (!items.length) { hideSuggestions(); return; }

    suggestionsEl.innerHTML =
        `<div class="rms-suggest-label">Pertanyaan serupa</div>` +
        items.map(f => `
            <button class="rms-suggest-item" data-faq-id="${f.id}" role="option">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                ${escHtml(f.question)}
            </button>
        `).join('');

    suggestionsEl.classList.add('active');

    suggestionsEl.querySelectorAll('.rms-suggest-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const faq = FAQ.find(f => f.id === btn.dataset.faqId);
            if (faq) instantAnswer(faq);
        });
    });
};

const hideSuggestions = () => {
    suggestionsEl.classList.remove('active');
    clearTimeout(suggestTimer);
};

// ─── INSTANT ANSWER (local FAQ — no API call) ─────────────────────────────────

const instantAnswer = (faq) => {
    inputEl.value = '';
    inputEl.style.height = 'auto';
    hideSuggestions();

    addUserMessage(faq.question);
    chatHistory.push({ role: 'user', content: faq.question });

    showTyping();
    setTimeout(() => {
        addBotMessage(faq.answer, faq.cta);
        chatHistory.push({ role: 'assistant', content: faq.answer });
        trimHistory();
    }, 320);
};

// ─── CLAUDE API ───────────────────────────────────────────────────────────────

const callClaude = async (userMsg) => {
    chatHistory.push({ role: 'user', content: userMsg });
    trimHistory();

    showTyping();
    sendBtn.disabled = true;

    // No API key configured — fall back to closest FAQ or default message
    if (!CLAUDE_API_KEY) {
        setTimeout(() => {
            const matches = getSuggestions(userMsg);
            if (matches.length) {
                addBotMessage(matches[0].answer, matches[0].cta);
                chatHistory.push({ role: 'assistant', content: matches[0].answer });
            } else {
                const fallback = 'Untuk info lebih lanjut, tim kami siap membantu via WhatsApp ya! 📱';
                addBotMessage(fallback, { label: 'Chat WhatsApp', href: 'https://wa.me/628123456789' });
                chatHistory.push({ role: 'assistant', content: fallback });
            }
            sendBtn.disabled = false;
        }, 300);
        return;
    }

    try {
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 300,
                system: SYSTEM_PROMPT,
                messages: chatHistory,
            }),
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.error?.message || `HTTP ${resp.status}`);
        }

        const data = await resp.json();
        const text = data.content?.[0]?.text?.trim();

        if (text) {
            addBotMessage(text);
            chatHistory.push({ role: 'assistant', content: text });
        } else {
            throw new Error('Empty response');
        }
    } catch (e) {
        console.error('[RMS Chat] Claude error:', e);
        chatHistory.pop(); // remove unresponded user message
        if (/rate.?limit|overload/i.test(e.message)) {
            addBotMessage('Kami sedang ramai! Coba lagi dalam beberapa detik ya 😊');
        } else {
            addBotMessage(
                'Maaf, ada gangguan teknis. Hubungi kami langsung via WhatsApp ya! 🙏',
                { label: 'Chat WhatsApp', href: 'https://wa.me/628123456789' }
            );
        }
    } finally {
        hideTyping();
        sendBtn.disabled = false;
    }
};

// ─── SEND ─────────────────────────────────────────────────────────────────────

const handleSend = () => {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    inputEl.style.height = 'auto';
    hideSuggestions();
    addUserMessage(text);
    callClaude(text);
};

// ─── TOGGLE ───────────────────────────────────────────────────────────────────

const toggleChat = () => {
    isOpen = !isOpen;
    windowEl.classList.toggle('active', isOpen);

    if (isOpen) {
        badge.style.display = 'none';
        triggerEl.classList.remove('pulse');
        inputEl.focus();

        if (messagesEl.children.length === 0) {
            const greeting = 'Halo! 👋 Selamat datang di Rexa Music School. Ada yang bisa kami bantu? Tanya soal program, jadwal, free trial, atau apa saja ya!';
            addBotMessage(greeting);
            chatHistory.push({ role: 'assistant', content: greeting });
        }
    } else {
        hideSuggestions();
    }
};

// ─── EVENTS ───────────────────────────────────────────────────────────────────

triggerEl.addEventListener('click', toggleChat);
closeBtn.addEventListener('click', toggleChat);
sendBtn.addEventListener('click', handleSend);

inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    if (e.key === 'Escape') hideSuggestions();
});

inputEl.addEventListener('input', () => {
    // Auto-resize textarea
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 72) + 'px';

    // Debounced suggestion lookup (pure local — no API call)
    clearTimeout(suggestTimer);
    const val = inputEl.value.trim();
    if (val.length < 2) { hideSuggestions(); return; }
    suggestTimer = setTimeout(() => renderSuggestions(getSuggestions(val)), 140);
});

// Quick reply buttons → instant local answers
document.querySelectorAll('.rms-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const faq = FAQ.find(f => f.id === btn.dataset.faq);
        if (faq) {
            instantAnswer(faq);
        } else {
            const text = btn.textContent.trim();
            if (!firstInteraction) { quickReplies.style.display = 'none'; firstInteraction = true; }
            addUserMessage(text);
            callClaude(text);
        }
    });
});

// Show badge after 3 s to attract attention
setTimeout(() => { if (!isOpen) badge.style.display = 'flex'; }, 3000);
