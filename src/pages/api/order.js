import { db } from '../../lib/db.js';

export const POST = async ({ request, cookies }) => {
    try {
        // 1. Validasi Sesi (Hanya yang sudah login yang bisa memesan)
        const session = cookies.get('user_session');
        if (!session) {
            return new Response(JSON.stringify({ message: "Sesi tidak valid. Silakan login terlebih dahulu." }), { status: 401 });
        }

        const userId = session.value;

        // 2. Ambil data dari form Frontend
        const data = await request.json();
        const { jenis_paket, nama_bisnis, catatan } = data;

        // 3. Simpan ke database XAMPP
        await db.query(
            'INSERT INTO orders (user_id, jenis_paket, nama_bisnis, catatan) VALUES (?, ?, ?, ?)',
            [userId, jenis_paket, nama_bisnis, catatan]
        );

        // 4. Beri respons sukses
        return new Response(JSON.stringify({ message: "Pesanan berhasil dibuat! Tim kami akan segera menghubungi Anda." }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Terjadi kesalahan pada server saat memproses pesanan." }), { status: 500 });
    }
};