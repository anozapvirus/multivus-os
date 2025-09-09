#!/bin/bash

# MULTIVUS OS Backup Script
# Runs daily via cron to backup database and files

set -e

# Configuration
BACKUP_DIR="/opt/multivus/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}
LOG_FILE="/var/log/multivus-backup.log"

# Create backup directory
mkdir -p $BACKUP_DIR

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "Starting backup process..."

# Database backup
log "Backing up PostgreSQL database..."
docker exec multivus-postgres pg_dump -U multivus multivus_os | gzip > $BACKUP_DIR/database_$DATE.sql.gz

# Files backup
log "Backing up uploaded files..."
if [ -d "/opt/multivus/uploads" ]; then
    tar -czf $BACKUP_DIR/files_$DATE.tar.gz -C /opt/multivus uploads
fi

# Configuration backup
log "Backing up configuration..."
cp /opt/multivus/.env $BACKUP_DIR/env_$DATE.backup
cp /opt/multivus/docker-compose.yml $BACKUP_DIR/docker-compose_$DATE.yml

# Clean old backups
log "Cleaning old backups (older than $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.backup" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.yml" -mtime +$RETENTION_DAYS -delete

# Upload to S3 if configured
if [ ! -z "$BACKUP_S3_BUCKET" ] && [ ! -z "$AWS_ACCESS_KEY_ID" ]; then
    log "Uploading backup to S3..."
    aws s3 cp $BACKUP_DIR/database_$DATE.sql.gz s3://$BACKUP_S3_BUCKET/multivus/database_$DATE.sql.gz
    aws s3 cp $BACKUP_DIR/files_$DATE.tar.gz s3://$BACKUP_S3_BUCKET/multivus/files_$DATE.tar.gz
fi

# Calculate backup size
BACKUP_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
log "Backup completed successfully. Total backup size: $BACKUP_SIZE"

# Send notification if webhook is configured
if [ ! -z "$BACKUP_WEBHOOK_URL" ]; then
    curl -X POST "$BACKUP_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{\"message\": \"MULTIVUS OS backup completed successfully\", \"size\": \"$BACKUP_SIZE\", \"date\": \"$DATE\"}"
fi
