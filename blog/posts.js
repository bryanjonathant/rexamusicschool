/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║              REXA MUSIC SCHOOL — BLOG POSTS              ║
 * ║                                                           ║
 * ║  Add new blog posts here. Each post needs a unique slug.  ║
 * ║  To publish a new post:                                   ║
 * ║    1. Add an entry to this array                          ║
 * ║    2. Create blog/<slug>.html using post-template.html    ║
 * ║    3. Fill in the content in the new HTML file            ║
 * ╚═══════════════════════════════════════════════════════════╝
 *
 * Fields:
 *   slug        — URL-friendly identifier, must match the HTML filename
 *                 e.g. "manfaat-les-musik-untuk-anak" → blog/manfaat-les-musik-untuk-anak.html
 *   title       — Post title shown on the listing page and in the post
 *   excerpt     — Short description shown on the listing page (1–2 sentences)
 *   category    — Category label (e.g. "Tips Orang Tua", "Musik & Pendidikan", "Student Stories")
 *   date        — Publication date in "DD MMMM YYYY" format (Indonesian)
 *   readTime    — Estimated reading time (e.g. "4 menit baca")
 *   coverImage  — URL of the cover image (use Unsplash or your own hosted images)
 *   featured    — Set true for ONE post to show it as the hero on the listing page
 */

export const posts = [
    {
        slug: 'manfaat-les-musik-untuk-anak',
        title: '7 Manfaat Les Musik untuk Tumbuh Kembang Anak yang Sering Dilewatkan Orang Tua',
        excerpt: 'Bukan hanya soal bisa main alat musik — les musik ternyata berdampak besar pada kecerdasan emosional, konsentrasi, dan kepercayaan diri anak secara keseluruhan.',
        category: 'Tips Orang Tua',
        date: '5 April 2025',
        readTime: '5 menit baca',
        coverImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop',
        featured: true,
    },
    {
        slug: 'rsl-awards-itu-apa',
        title: 'RSL Awards: Apa Itu dan Kenapa Sertifikasinya Penting buat Musisi Muda?',
        excerpt: 'Rockschool by RSL Awards adalah sistem sertifikasi musik kontemporer internasional dari UK. Ini bedanya dengan les musik biasa dan kenapa ini worth it.',
        category: 'Musik & Pendidikan',
        date: '1 April 2025',
        readTime: '4 menit baca',
        coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop',
        featured: false,
    },
    {
        slug: 'belajar-gitar-dari-nol',
        title: 'Belajar Gitar dari Nol: Panduan Realistis untuk Pemula (dan Orang Tuanya)',
        excerpt: 'Berapa lama belajar gitar sampai bisa main lagu? Alat apa yang perlu dibeli dulu? Semua pertanyaan umum dijawab di sini.',
        category: 'Panduan Instrumen',
        date: '28 Maret 2025',
        readTime: '6 menit baca',
        coverImage: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop',
        featured: false,
    },
];
