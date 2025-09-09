#!/bin/bash

# MULTIVUS OS Restore Script
# Restores database and files from backup

set -e

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <backup_date>"
    echo "Example: $0 20241208_020000"
    exit 1
fi

BACKUP_DATE=$1
BACKUP_DIR="/opt/multivus/backups"
LOG_FILE="/var/log/multivus-restore.log"

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "Starting restore process for backup: $BACKUP_DATE"

# Check if backup files exist
DATABASE_BACKUP="$BACKUP_DIR/database_$BACKUP_DATE.sql.gz"
FILES_BACKUP="$BACKUP_DIR/files_$BACKUP_DATE.tar.gz"

if [ ! -f "$DATABASE_BACKUP" ]; then
    log "ERROR: Database backup not found: $DATABASE_BACKUP"
    exit 1
fi

# Stop services
log "Stopping MULTIVUS OS services..."
sudo systemctl stop multivus

# Restore database
log "Restoring PostgreSQL database..."
docker exec multivus-postgres dropdb -U multivus multivus_os --if-exists
docker exec multivus-postgres createdb -U multivus multivus_os
zcat $DATABASE_BACKUP | docker exec -i multivus-postgres psql -U multivus multivus_os

# Restore files if backup exists
if [ -f "$FILES_BACKUP" ]; then
    log "Restoring uploaded files..."
    rm -rf /opt/multivus/uploads
    tar -xzf $FILES_BACKUP -C /opt/multivus
fi

# Start services
log "Starting MULTIVUS OS services..."
sudo systemctl start multivus

# Wait for services to be ready
sleep 30

# Verify restoration
log "Verifying restoration..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    log "✅ Restore completed successfully!"
else
    log "❌ Restore may have failed - service not responding"
    exit 1
fi
