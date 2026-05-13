import { db } from '../../lib/db.js';

export async function POST({ request, cookies }) {
    try {
        const session = cookies.get('user_session');
        if (!session) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        const [user] = await db.query('SELECT role FROM users WHERE id = ?', [session.value]);
        if (user.length === 0 || user[0].role !== 'admin') return new Response(JSON.stringify({ message: "Akses Ditolak!" }), { status: 403 });

        const { nama_template, tipe, gambar_preview, demo_url, harga_dasar } = await request.json();
        
        await db.query(
            'INSERT INTO templates (nama_template, tipe, gambar_preview, demo_url, harga_dasar) VALUES (?, ?, ?, ?, ?)', 
            [nama_template, tipe, gambar_preview, demo_url, harga_dasar || 0]
        );
        
        return new Response(JSON.stringify({ message: "Template berhasil ditambahkan!" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}