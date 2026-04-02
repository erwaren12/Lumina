import { db } from '../../lib/db.js';
import bcrypt from 'bcryptjs';

export const POST = async ({ request }) => {
    try {
        // 1. Ambil data yang dikirim dari form Frontend
        const data = await request.json();
        const { nama, email, password } = data;

        // 2. Cek apakah email sudah terdaftar sebelumnya
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return new Response(JSON.stringify({ message: "Email sudah terdaftar!" }), { status: 400 });
        }

        // 3. Enkripsi (Hash) password demi keamanan
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Simpan data ke database XAMPP
        await db.query(
            'INSERT INTO users (nama, email, password) VALUES (?, ?, ?)', 
            [nama, email, hashedPassword]
        );

        // 5. Beri respons sukses ke Frontend
        return new Response(JSON.stringify({ message: "Pendaftaran berhasil!" }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Terjadi kesalahan pada server." }), { status: 500 });
    }
};