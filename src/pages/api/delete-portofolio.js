import { db } from '../../lib/db.js';

export async function POST({ request, cookies }) {
    try {
        const session = cookies.get('user_session');
        if (!session) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        
        const [user] = await db.query('SELECT role FROM users WHERE id = ?', [session.value]);
        if (user.length === 0 || user[0].role !== 'admin') return new Response(JSON.stringify({ message: "Akses Ditolak!" }), { status: 403 });

        const { id } = await request.json();
        
        await db.query('DELETE FROM portfolio WHERE id = ?', [id]);
        return new Response(JSON.stringify({ message: "Portofolio berhasil dihapus!" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message || "Error server" }), { status: 500 });
    }
}