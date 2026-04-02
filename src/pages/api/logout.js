export const POST = async ({ cookies }) => {
    // Menghapus cookie user_session
    cookies.delete('user_session', { path: '/' });
    
    return new Response(JSON.stringify({ message: "Logout berhasil" }), { status: 200 });
};