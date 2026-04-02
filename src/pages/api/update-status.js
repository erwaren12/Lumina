import { db } from '../../lib/db.js';

export const POST = async ({ request }) => {
    try {
        const data = await request.json();
        const { order_id, status_baru } = data;

        // Update status di tabel orders berdasarkan ID pesanan
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status_baru, order_id]);

        return new Response(JSON.stringify({ message: "Status pesanan berhasil diperbarui!" }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Terjadi kesalahan sistem." }), { status: 500 });
    }
};