import { db } from '../../lib/db.js';
import bcrypt from 'bcryptjs';

export const POST = async ({ request, cookies }) => {
    try {
        const data = await request.json();
        const { email, password } = data;

        // 1. Cari user di database berdasarkan email
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        // Jika email tidak ditemukan
        if (rows.length === 0) {
            return new Response(JSON.stringify({ message: "Email tidak ditemukan. Silakan daftar terlebih dahulu." }), { status: 404 });
        }

        const user = rows[0];

        // 2. Cocokkan password yang diketik dengan password acak (hash) di database
        const isMatch = await bcrypt.compare(password, user.password);

        // Jika password salah
        if (!isMatch) {
            return new Response(JSON.stringify({ message: "Kata sandi salah!" }), { status: 401 });
        }

        // 3. Jika sukses, kita buat "Sesi" (Cookie) agar user tetap login saat pindah halaman
        cookies.set('user_session', user.id, {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7 // Cookie berlaku selama 1 minggu
        });

        // 4. Kirim respons sukses
        return new Response(JSON.stringify({ message: "Login berhasil!", nama: user.nama }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Terjadi kesalahan pada server." }), { status: 500 });
    }
};