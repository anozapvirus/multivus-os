# MULTIVUS OS - Installation Guide

## System Requirements

### Minimum Requirements
- **OS**: Ubuntu 20.04 LTS or newer
- **CPU**: 2 cores (4 cores recommended)
- **RAM**: 4GB (8GB recommended)
- **Storage**: 50GB SSD (100GB+ recommended)
- **Network**: Stable internet connection

### Recommended VPS Specifications
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 100GB SSD
- **Bandwidth**: 1TB/month
- **Provider**: DigitalOcean, Linode, AWS, or similar

## Quick Installation

### 1. Automated Installation (Recommended)

\`\`\`bash
# Download and run the installation script
curl -fsSL https://raw.githubusercontent.com/your-org/multivus-os/main/scripts/install-ubuntu.sh | bash
\`\`\`

### 2. Manual Installation

#### Step 1: Update System
\`\`\`bash
sudo apt update && sudo apt upgrade -y
\`\`\`

#### Step 2: Install Docker
\`\`\`bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
\`\`\`

#### Step 3: Clone Repository
\`\`\`bash
git clone https://github.com/your-org/multivus-os.git
cd multivus-os
\`\`\`

#### Step 4: Configure Environment
\`\`\`bash
cp .env.example .env
nano .env  # Edit configuration
\`\`\`

#### Step 5: Start Services
\`\`\`bash
docker-compose up -d
\`\`\`

## Configuration

### Environment Variables

Create a `.env` file with the following configuration:

\`\`\`env
# Database Configuration
DATABASE_NAME=multivus_os
DATABASE_USER=multivus
DATABASE_PASSWORD=your_secure_password

# Redis Configuration
REDIS_PASSWORD=your_redis_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Application Configuration
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# WhatsApp Integration (optional)
WHATSAPP_API_URL=
WHATSAPP_API_TOKEN=

# Backup Configuration
BACKUP_RETENTION_DAYS=30
BACKUP_S3_BUCKET=your-s3-bucket
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
\`\`\`

### SSL Certificate Setup

\`\`\`bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
\`\`\`

## Database Setup

### Initial Migration
\`\`\`bash
# Run database migrations
docker exec multivus-api npx prisma migrate deploy

# Seed initial data
docker exec multivus-api npx prisma db seed
\`\`\`

### Create Admin User
\`\`\`bash
# Access the API container
docker exec -it multivus-api bash

# Create admin user (replace with your details)
npx ts-node scripts/create-admin.ts \
  --email admin@yourdomain.com \
  --password your_secure_password \
  --name "System Administrator"
\`\`\`

## Backup and Restore

### Automated Backups
Backups are automatically created daily at 2 AM via cron job.

### Manual Backup
\`\`\`bash
# Create backup
/opt/multivus/scripts/backup.sh

# List backups
ls -la /opt/multivus/backups/
\`\`\`

### Restore from Backup
\`\`\`bash
# Restore from specific backup
/opt/multivus/scripts/restore.sh 20241208_020000
\`\`\`

## Monitoring and Maintenance

### Service Status
\`\`\`bash
# Check service status
sudo systemctl status multivus

# View logs
docker-compose logs -f

# Check individual services
docker-compose logs api
docker-compose logs web
docker-compose logs postgres
\`\`\`

### Health Checks
\`\`\`bash
# API health check
curl http://localhost:3001/health

# Database connection test
docker exec multivus-postgres pg_isready -U multivus
\`\`\`

### Updates
\`\`\`bash
# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Run migrations if needed
docker exec multivus-api npx prisma migrate deploy
\`\`\`

## Security Considerations

### Firewall Configuration
\`\`\`bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
\`\`\`

### Fail2Ban Setup
\`\`\`bash
# Install and configure fail2ban
sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
\`\`\`

### Regular Security Updates
\`\`\`bash
# Set up automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
\`\`\`

## Troubleshooting

### Common Issues

#### Services Won't Start
\`\`\`bash
# Check Docker status
sudo systemctl status docker

# Check logs
docker-compose logs

# Restart services
docker-compose restart
\`\`\`

#### Database Connection Issues
\`\`\`bash
# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker exec multivus-postgres psql -U multivus -d multivus_os -c "SELECT 1;"
\`\`\`

#### SSL Certificate Issues
\`\`\`bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --dry-run
\`\`\`

### Performance Optimization

#### Database Optimization
\`\`\`sql
-- Connect to database
docker exec -it multivus-postgres psql -U multivus multivus_os

-- Check database size
SELECT pg_size_pretty(pg_database_size('multivus_os'));

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM work_orders WHERE status = 'IN_PROGRESS';
\`\`\`

#### Resource Monitoring
\`\`\`bash
# Monitor resource usage
docker stats

# Check disk usage
df -h
du -sh /opt/multivus/*
\`\`\`

## Support

For technical support and documentation:
- **Documentation**: https://docs.multivus.com
- **Support Email**: support@multivus.com
- **GitHub Issues**: https://github.com/your-org/multivus-os/issues

## License

MULTIVUS OS is licensed under the MIT License. See LICENSE file for details.
