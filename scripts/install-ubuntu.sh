#!/bin/bash

# MULTIVUS OS - Ubuntu VPS Installation Script
# Compatible with Ubuntu 20.04+ LTS

set -e

echo "🚀 MULTIVUS OS - Ubuntu VPS Installation"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}This script should not be run as root${NC}" 
   exit 1
fi

# Update system
echo -e "${YELLOW}Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install required packages
echo -e "${YELLOW}Installing required packages...${NC}"
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    nginx \
    certbot \
    python3-certbot-nginx \
    ufw \
    fail2ban

# Install Docker
echo -e "${YELLOW}Installing Docker...${NC}"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
echo -e "${YELLOW}Installing Docker Compose...${NC}"
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (for development)
echo -e "${YELLOW}Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
echo -e "${YELLOW}Installing pnpm...${NC}"
sudo npm install -g pnpm

# Create application directory
echo -e "${YELLOW}Setting up application directory...${NC}"
sudo mkdir -p /opt/multivus
sudo chown $USER:$USER /opt/multivus
cd /opt/multivus

# Clone repository (replace with actual repository URL)
echo -e "${YELLOW}Cloning MULTIVUS OS repository...${NC}"
# git clone https://github.com/your-org/multivus-os.git .

# Create environment file
echo -e "${YELLOW}Creating environment configuration...${NC}"
cat > .env << EOF
# Database Configuration
DATABASE_NAME=multivus_os
DATABASE_USER=multivus
DATABASE_PASSWORD=$(openssl rand -base64 32)

# Redis Configuration
REDIS_PASSWORD=$(openssl rand -base64 32)

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 64)

# Application Configuration
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com

# Email Configuration (configure with your SMTP provider)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# WhatsApp Integration (optional)
WHATSAPP_API_URL=
WHATSAPP_API_TOKEN=

# Backup Configuration
BACKUP_RETENTION_DAYS=30
BACKUP_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
EOF

# Set secure permissions
chmod 600 .env

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Configure fail2ban
echo -e "${YELLOW}Configuring fail2ban...${NC}"
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Create systemd service for MULTIVUS OS
echo -e "${YELLOW}Creating systemd service...${NC}"
sudo tee /etc/systemd/system/multivus.service > /dev/null << EOF
[Unit]
Description=MULTIVUS OS Service Order Management System
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/multivus
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable multivus.service

# Create backup script
echo -e "${YELLOW}Setting up backup system...${NC}"
mkdir -p /opt/multivus/scripts
cat > /opt/multivus/scripts/backup.sh << 'EOF'
#!/bin/bash

# MULTIVUS OS Backup Script
BACKUP_DIR="/opt/multivus/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
docker exec multivus-postgres pg_dump -U multivus multivus_os | gzip > $BACKUP_DIR/database_$DATE.sql.gz

# Files backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /opt/multivus/uploads

# Clean old backups
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $DATE"
EOF

chmod +x /opt/multivus/scripts/backup.sh

# Setup cron for daily backups
echo -e "${YELLOW}Setting up automated backups...${NC}"
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/multivus/scripts/backup.sh >> /var/log/multivus-backup.log 2>&1") | crontab -

# Configure Nginx
echo -e "${YELLOW}Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/multivus << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (will be configured by certbot)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location / {
        proxy_pass http://localhost:80/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    client_max_body_size 100M;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/multivus /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t

echo -e "${GREEN}✅ MULTIVUS OS installation completed!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your domain in /etc/nginx/sites-available/multivus"
echo "2. Run: sudo certbot --nginx -d your-domain.com"
echo "3. Start the application: sudo systemctl start multivus"
echo "4. Check status: sudo systemctl status multivus"
echo ""
echo -e "${YELLOW}Important files:${NC}"
echo "- Application: /opt/multivus"
echo "- Environment: /opt/multivus/.env"
echo "- Logs: /opt/multivus/logs"
echo "- Backups: /opt/multivus/backups"
echo ""
echo -e "${GREEN}Installation log saved to: /var/log/multivus-install.log${NC}"
