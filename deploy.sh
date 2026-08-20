#!/bin/bash
# ==============================================================================
# JokiTugasKu v2 — Automated Deployment Script for Ubuntu / Debian VPS
# Usage on VPS: chmod +x deploy.sh && ./deploy.sh
# ==============================================================================

set -e

echo "🚀 [1/4] Memulai proses deployment JokiTugasKu v2..."

# 1. Pastikan Node.js 20 LTS dan Nginx terpasang
NODE_MAJOR=0
if command -v node &> /dev/null; then
    NODE_MAJOR=$(node -v | cut -d'.' -f1 | tr -d 'v')
fi

if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "🔄 Menginstall/Mengupdate ke Node.js 20 LTS dan Certbot..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx
fi

echo "📦 [2/4] Menginstall dependencies..."
npm install
cd admin && npm install && cd ..

echo "🔨 [3/4] Melakukan build production..."
npm run build
cd admin && npm run build && cd ..

echo "🌐 [4/4] Mengonfigurasi web server Nginx..."
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

# Install Nginx config if not already installed
if [ ! -f /etc/nginx/sites-available/jokitugasku.conf ]; then
    echo "📋 Memasang konfigurasi virtual host Nginx..."
    sudo cp nginx/jokitugasku.conf /etc/nginx/sites-available/
    sudo ln -sf /etc/nginx/sites-available/jokitugasku.conf /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
fi

sudo nginx -t
sudo systemctl reload nginx

echo "✅ ========================================================="
echo "🎉 DEPLOYMENT BERHASIL!"
echo "👉 Public Site : http://jokitugasku.id"
echo "👉 Admin Hub   : http://admin.jokitugasku.id"
echo "========================================================="
