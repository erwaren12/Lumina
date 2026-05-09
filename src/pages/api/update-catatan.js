import { db } from '../../lib/db.js';

export async function POST({ request }) {
    try {
        const { order_id, catatan } = await request.json();
        
        if (!order_id) {
            return new Response(JSON.stringify({ message: "ID Pesanan tidak ditemukan" }), { status: 400 });
        }

        // Menyimpan pesan ke kolom 'catatan' di tabel orders
        await db.query('UPDATE orders SET catatan = ? WHERE id = ?', [catatan, order_id]);
        
        return new Response(JSON.stringify({ message: "Pesan berhasil dikirim ke klien!" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Gagal menyimpan pesan" }), { status: 500 });
    }
}