# 🚀 Panduan Deploy VPS Non-Root (Sudo User) — JokiTugasKu v2

Panduan ini dirancang khusus untuk menjalankan deployment secara aman menggunakan **user non-root** dengan hak akses `sudo`.

---

## 📌 LANGKAH 1: Buat User Non-Root di VPS (Jika Belum Ada)

Jika Anda baru pertama kali login ke VPS sebagai `root`, buat user baru terlebih dahulu (misal: `jokiadmin`):

```bash
# 1. Tambah user baru (buat password saat diminta)
adduser jokiadmin

# 2. Berikan hak akses sudo (administrator) ke user tersebut
usermod -aG sudo jokiadmin

# 3. Beralih ke user non-root
su - jokiadmin
```

*(Jika VPS Anda sudah menggunakan user bawaan seperti `ubuntu` atau `debian`, Anda bisa langsung login dengan user tersebut).*

---

## 📌 LANGKAH 2: Clone Project ke Home Folder User

Sebagai user non-root, clone project langsung di direktori home (`~`):

```bash
cd ~
git clone https://github.com/USERNAME/REPO_ANDA.git jokitugasku
cd ~/jokitugasku
```

---

## 📌 LANGKAH 3: Buat File `.env` & `admin/.env`

Di dalam folder `~/jokitugasku`:

1. **Buat file `.env` (Public)**:
   ```bash
   nano .env
   ```
   Isi dengan kredensial Supabase Anda:
   ```ini
   VITE_SUPABASE_URL=https://harmnnijndrmzmxvwjbj.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhcm1ucmlqbmRybnpteHZ3amJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMTY2MDQsImV4cCI6MjEwMjc5MjYwNH0.P5-x-2FvnduVj5L10ZnjeOtkPTt8q05lANXW14YXB2w
   VITE_SITE_URL=https://jokitugasku.id
   VITE_ADMIN_URL=https://admin.jokitugasku.id
   ```
   *(Tekan `Ctrl+O` lalu `Enter` untuk simpan, `Ctrl+X` untuk keluar).*

2. **Buat file `admin/.env` (Admin Hub)**:
   ```bash
   nano admin/.env
   ```
   Isi dengan:
   ```ini
   VITE_SUPABASE_URL=https://harmnnijndrmzmxvwjbj.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhcm1ucmlqbmRybnpteHZ3amJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMTY2MDQsImV4cCI6MjEwMjc5MjYwNH0.P5-x-2FvnduVj5L10ZnjeOtkPTt8q05lANXW14YXB2w
   VITE_PUBLIC_URL=https://jokitugasku.id
   VITE_ADMIN_URL=https://admin.jokitugasku.id
   VITE_DEMO_MODE=false
   ```

---

## 📌 LANGKAH 4: Eksekusi Skrip Deployment (Non-Root)

Jalankan skrip deploy:
```bash
chmod +x deploy.sh
./deploy.sh
```

*Skrip ini akan mengeksekusi `npm install` dan `npm run build` sebagai user non-root biasa, dan hanya menggunakan `sudo` untuk konfigurasi Nginx dan penyalinan file build ke `/var/www/jokitugasku`.*

---

## 📌 LANGKAH 5: Install SSL Certbot (Opsional / Recommended)

Setelah domain terarah di Cloudflare, pasang sertifikat SSL dengan perintah:
```bash
sudo certbot --nginx -d jokitugasku.id -d www.jokitugasku.id -d admin.jokitugasku.id
```

---

## 🔒 Mengapa Menjalankan Non-Root Lebih Aman?
1. **Mencegah Kerusakan Sistem**: Perintah yang tidak disengaja tidak akan menghapus file sistem Linux penting.
2. **Isolasi Proses Node.js**: Dependency npm tidak memiliki akses langsung ke root filesystem.
3. **Standar Keamanan Linux (Best Practice)**: Hanya perintah terkait server web (Nginx) yang meminta password `sudo`.
