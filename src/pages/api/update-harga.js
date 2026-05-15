import { db } from '../../lib/db.js';

export async function POST({ request, cookies }) {
    try {
        const session = cookies.get('user_session');
        if (!session) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        const [user] = await db.query('SELECT role FROM users WHERE id = ?', [session.value]);
        if (user.length === 0 || user[0].role !== 'admin') return new Response(JSON.stringify({ message: "Akses Ditolak!" }), { status: 403 });

        const { id, nama_paket, deskripsi, harga, siklus_tagihan, badge, fitur } = await request.json();
        
        await db.query(
            'UPDATE paket_harga SET nama_paket = ?, deskripsi = ?, harga = ?, siklus_tagihan = ?, badge = ?, fitur = ? WHERE id = ?', 
            [nama_paket, deskripsi, harga || 0, siklus_tagihan || '', badge, fitur, id]
        );
        
        return new Response(JSON.stringify({ message: "Data paket berhasil diperbarui!" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}