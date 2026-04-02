import mysql from 'mysql2/promise';

// Konfigurasi koneksi ke MySQL XAMPP bawaan
export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',        // User default XAMPP
    password: '',        // Password default XAMPP (kosong)
    database: 'aliftech_db' // Nama database yang kamu buat di phpMyAdmin
});