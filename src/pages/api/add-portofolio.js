import { db } from '../../lib/db.js';

export async function POST({ request, cookies }) {
    try {
        // Proteksi kemanan (Hanya Admin)
        const session = cookies.get('user_session');
        if (!session) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        const [user] = await db.query('SELECT role FROM users WHERE id = ?', [session.value]);
        if (user.length === 0 || user[0].role !== 'admin') return new Response(JSON.stringify({ message: "Akses Ditolak!" }), { status: 403 });

        const { judul, kategori, gambar_url, link_proyek, deskripsi } = await request.json();
        
        // Simpan ke database
        await db.query(
            'INSERT INTO portfolio (judul, kategori, gambar_url, link_proyek, deskripsi) VALUES (?, ?, ?, ?, ?)', 
            [judul, kategori, gambar_url, link_proyek, deskripsi]
        );
        
        return new Response(JSON.stringify({ message: "Portofolio berhasil ditambahkan!" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}