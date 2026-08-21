#!/bin/bash
# ==============================================================================
# JokiTugasKu v2 — Automated Deployment Script for Ubuntu / Debian VPS
# Usage on VPS: chmod +x deploy.sh && ./deploy.sh
# ==============================================================================

set -e

echo "🚀 [1/6] Memulai proses deployment JokiTugasKu v2..."

# 1. Pastikan Node.js 20 LTS, Nginx, Certbot & PM2 terpasang
NODE_MAJOR=0
if command -v node &> /dev/null; then
    NODE_MAJOR=$(node -v | cut -d'.' -f1 | tr -d 'v')
fi

if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "🔄 Menginstall/Mengupdate ke Node.js 20 LTS, Nginx, dan Certbot..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get update
    sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx
fi

# Pastikan PM2 terpasang untuk mengelola server backend
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Memasang PM2 Process Manager..."
    sudo npm install -g pm2
fi

# 2. Verifikasi File Environment (.env, admin/.env, server/.env)
echo "⚙️ [2/6] Memeriksa konfigurasi environment..."
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

if [ ! -f server/.env ]; then
    if [ -f server/.env.example ]; then
        echo "⚠️ server/.env tidak ditemukan, menyalin dari server/.env.example..."
        cp server/.env.example server/.env
    fi
fi

# Auto-fix URL typo in existing .env files if present
if [ -f .env ]; then
    sed -i 's/harmnnijndrmzmxvwjbj/harmnrijndrnzmxvwjbj/g' .env
fi
if [ -f admin/.env ]; then
    sed -i 's/harmnnijndrmzmxvwjbj/harmnrijndrnzmxvwjbj/g' admin/.env
fi
if [ -f server/.env ]; then
    sed -i 's/harmnnijndrmzmxvwjbj/harmnrijndrnzmxvwjbj/g' server/.env
fi

# 3. Install dependencies & build backend server
echo "📦 [3/6] Menginstall dependencies & build Backend Server..."
cd server
npm install
npm run build
cd ..

# 4. Install dependencies & build Frontend (Landing & Admin)
echo "🔨 [4/6] Melakukan build production frontend..."
npm install
npm run build
cd admin
npm install
npm run build
cd ..

# 5. Jalankan / Reload Backend API Server via PM2
echo "⚡ [5/6] Menjalankan Server Backend via PM2..."
cd server
if pm2 describe jokitugasku-api > /dev/null 2>&1; then
    pm2 reload jokitugasku-api
else
    pm2 start dist/index.js --name jokitugasku-api
fi
pm2 save
cd ..

# 6. Konfigurasi Web Server Nginx & Salin File Build
echo "🌐 [6/6] Memperbarui file web server dan konfigurasi Nginx..."
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

# Selalu perbarui konfigurasi Nginx agar reverse proxy /api/ aktif
echo "📋 Memperbarui virtual host Nginx..."
sudo cp nginx/jokitugasku.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/jokitugasku.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test & Reload Nginx
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "========================================================="
echo "🎉 DEPLOYMENT BERHASIL & DEDICATED BACKEND AKTIF!"
echo "👉 Public Site   : http://jokitugasku.id (atau https://)"
echo "👉 Admin Hub     : http://admin.jokitugasku.id (atau https://)"
echo "👉 Backend API   : Running on port 4000 (PM2 Managed)"
echo "========================================================="
echo "💡 Cek status backend kapan saja dengan: pm2 status"
echo "========================================================="
