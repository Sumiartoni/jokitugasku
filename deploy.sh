#!/bin/bash
# ==============================================================================
# JokiTugasKu v2 — Automated Deployment Script for Ubuntu / Debian VPS
# Usage on VPS: chmod +x deploy.sh && ./deploy.sh
# ==============================================================================

set -e

echo "🚀 [1/5] Memulai proses deployment JokiTugasKu v2..."

# 1. Pastikan Node.js 20 LTS dan Nginx terpasang
NODE_MAJOR=0
if command -v node &> /dev/null; then
    NODE_MAJOR=$(node -v | cut -d'.' -f1 | tr -d 'v')
fi

if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "🔄 Menginstall/Mengupdate ke Node.js 20 LTS dan Certbot..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get update
    sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx
fi

# 2. Verifikasi File Environment (.env & admin/.env)
echo "⚙️ [2/5] Memeriksa konfigurasi environment..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "⚠️ .env tidak ditemukan, menyalin dari .env.example..."
        cp .env.example .env
    fi
fi

if [ ! -f admin/.env ]; then
    if [ -f admin/.env.example ]; then
        echo "⚠️ admin/.env tidak ditemukan, menyalin dari admin/.env.example..."
        cp admin/.env.example admin/.env
    fi
fi

# 3. Install dependencies
echo "📦 [3/5] Menginstall dependencies..."
npm install
cd admin && npm install && cd ..

# 4. Melakukan build production
echo "🔨 [4/5] Melakukan build production (Landing & Admin)..."
npm run build
cd admin && npm run build && cd ..

# 5. Konfigurasi Web Server Nginx & Salin File Build
echo "🌐 [5/5] Memperbarui file web server dan konfigurasi Nginx..."
TARGET_DIR="/var/www/jokitugasku"
sudo mkdir -p $TARGET_DIR
sudo mkdir -p $TARGET_DIR/admin

# Copy dist files
sudo rm -rf $TARGET_DIR/dist
sudo rm -rf $TARGET_DIR/admin/dist
sudo cp -r dist $TARGET_DIR/
sudo cp -r admin/dist $TARGET_DIR/admin/

# Set permissions
sudo chown -R www-data:www-data $TARGET_DIR
sudo chmod -R 755 $TARGET_DIR

# Selalu perbarui konfigurasi Nginx agar proxy reverse API (/api/resend/, /api/brevo/) aktif
echo "📋 Memperbarui virtual host Nginx..."
sudo cp nginx/jokitugasku.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/jokitugasku.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test & Reload Nginx
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "========================================================="
echo "🎉 DEPLOYMENT BERHASIL & WEBSITE SIAP DIGUNAKAN!"
echo "👉 Public Site : http://jokitugasku.id (atau https://)"
echo "👉 Admin Hub   : http://admin.jokitugasku.id (atau https://)"
echo "========================================================="
echo "💡 Catatan: Jika baru pertama kali mengarahkan domain,"
echo "   aktifkan SSL gratis dengan:"
echo "   sudo certbot --nginx -d jokitugasku.id -d www.jokitugasku.id -d admin.jokitugasku.id"
echo "========================================================="
