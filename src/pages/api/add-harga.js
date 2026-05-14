import { db } from '../../lib/db.js';

export async function POST({ request, cookies }) {
    try {
        const session = cookies.get('user_session');
        if (!session) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        const [user] = await db.query('SELECT role FROM users WHERE id = ?', [session.value]);
        if (user.length === 0 || user[0].role !== 'admin') return new Response(JSON.stringify({ message: "Akses Ditolak!" }), { status: 403 });

        const { nama_paket, deskripsi, harga, badge, fitur } = await request.json();
        
        await db.query(
            'INSERT INTO paket_harga (nama_paket, deskripsi, harga, badge, fitur) VALUES (?, ?, ?, ?, ?)', 
            [nama_paket, deskripsi, harga || 0, badge, fitur]
        );
        
        return new Response(JSON.stringify({ message: "Paket Harga berhasil ditambahkan!" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}