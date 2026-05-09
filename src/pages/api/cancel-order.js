import { db } from '../../lib/db.js';

export async function POST({ request, cookies }) {
    try {
        const session = cookies.get('user_session');
        if (!session) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        
        const { order_id } = await request.json();
        
        // Cek apakah pesanan masih "Menunggu Pembayaran" (Tanpa as any)
        const [order] = await db.query('SELECT status FROM orders WHERE id = ? AND user_id = ?', [order_id, session.value]);
        
        if (order.length === 0) return new Response(JSON.stringify({ message: "Pesanan tidak ditemukan" }), { status: 404 });
        if (order[0].status !== 'Menunggu Pembayaran') {
            return new Response(JSON.stringify({ message: "Hanya pesanan yang 'Menunggu Pembayaran' yang bisa dibatalkan sendiri." }), { status: 400 });
        }

        // Ubah status jadi Dibatalkan
        await db.query('UPDATE orders SET status = "Dibatalkan" WHERE id = ?', [order_id]);
        return new Response(JSON.stringify({ message: "Pesanan berhasil dibatalkan." }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error server" }), { status: 500 });
    }
}