# Docker Deployment Guide

Complete guide for running Guruji Samagri Store using Docker and Docker Compose.

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)

## Quick Start

### 1. Setup Firebase Credentials

Before starting, you need to add your Firebase service account JSON file:

```bash
# Place your Firebase service account file here:
backend/src/config/firebase-service-account.json
```

> **How to get Firebase credentials:**
> 1. Go to [Firebase Console](https://console.firebase.google.com/)
> 2. Select your project
> 3. Go to Project Settings → Service Accounts
> 4. Click "Generate New Private Key"
> 5. Save the downloaded JSON file as `firebase-service-account.json`

### 2. Start All Services

```bash
# From the root directory
docker-compose up -d
```

This will start:
- **MongoDB** on port `27017`
- **Backend API** on port `5000`
- **Admin Dashboard** on port `3000`

### 3. Access Applications

- **Admin Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

### 4. Create Admin User

After services are running, create an admin user in MongoDB:

```bash
# Connect to MongoDB
docker exec -it guruji-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# Switch to database
use guruji-samagri-store

# Create admin user
db.users.insertOne({
  email: "admin@gurujismagri.com",
  password: "$2a$10$YourHashedPasswordHere",  // Hash "Admin@123" using bcrypt
  name: "Admin User",
  role: "admin",
  phoneNumber: "9999999999",
  isProfileComplete: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**To hash password:**
```bash
# Using Node.js
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Admin@123', 10).then(hash => console.log(hash));"
```

## Docker Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f admin-dashboard
docker-compose logs -f mongodb
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild Images

```bash
# Rebuild all images
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild and start
docker-compose up -d --build
```

### Access Container Shell

```bash
# Backend container
docker exec -it guruji-backend sh

# MongoDB container
docker exec -it guruji-mongodb mongosh -u admin -p admin123
```

## Configuration

### Environment Variables

You can customize environment variables in `docker-compose.yml`:

**MongoDB**:
- `MONGO_INITDB_ROOT_USERNAME`: MongoDB root username (default: admin)
- `MONGO_INITDB_ROOT_PASSWORD`: MongoDB root password (default: admin123)

**Backend**:
- `PORT`: Backend port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing (⚠️ change in production)
- `JWT_EXPIRE`: Token expiration time (default: 7d)

**Admin Dashboard**:
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

### Using Custom .env File

Create a `.env` file in the root directory:

```bash
cp .env.docker .env
```

Update docker-compose.yml to use it:

```yaml
services:
  backend:
    env_file:
      - .env
```

## Production Deployment

### Security Hardening

1. **Change Default Passwords**:
```yaml
environment:
  MONGO_INITDB_ROOT_PASSWORD: <strong-password>
  JWT_SECRET: <random-secure-string>
```

2. **Use Docker Secrets** (for sensitive data):
```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt
```

3. **Enable HTTPS** (add nginx reverse proxy):
```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
```

### Resource Limits

Add resource constraints:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          memory: 256M
```

### Health Checks

All services have health checks configured. View status:

```bash
docker-compose ps
```

## Volumes

Persistent data is stored in Docker volumes:

- `mongodb_data`: MongoDB database files
- `mongodb_config`: MongoDB configuration

### Backup MongoDB

```bash
# Create backup
docker exec guruji-mongodb mongodump --username admin --password admin123 --authenticationDatabase admin --out /backup

# Copy backup to host
docker cp guruji-mongodb:/backup ./mongodb-backup-$(date +%Y%m%d)
```

### Restore MongoDB

```bash
# Copy backup to container
docker cp ./mongodb-backup guruji-mongodb:/backup

# Restore
docker exec guruji-mongodb mongorestore --username admin --password admin123 --authenticationDatabase admin /backup
```

## Troubleshooting

### Backend Not Connecting to MongoDB

Check if MongoDB is ready:
```bash
docker-compose logs mongodb
```

Wait for: `"Waiting for connections"`

### Admin Dashboard Shows API Error

1. Check backend is running:
```bash
curl http://localhost:5000/health
```

2. Check CORS configuration in `backend/src/app.js`

3. Rebuild admin dashboard with correct API URL:
```bash
docker-compose build admin-dashboard
docker-compose up -d admin-dashboard
```

### Port Already in Use

Change ports in `docker-compose.yml`:
```yaml
ports:
  - "5001:5000"  # Change 5000 to 5001
```

### Container Keeps Restarting

Check logs:
```bash
docker-compose logs backend
```

Common issues:
- Missing Firebase credentials
- MongoDB connection failure
- Invalid environment variables

## Monitoring

### View Resource Usage

```bash
docker stats guruji-backend guruji-admin guruji-mongodb
```

### Monitor Logs in Real-time

```bash
docker-compose logs -f --tail=100
```

## Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker-compose down --rmi all

# Remove volumes (⚠️ deletes data)
docker-compose down -v

# Complete cleanup
docker system prune -a --volumes
```

## Next Steps

After Docker setup:
1. ✅ Access admin dashboard at http://localhost:3000
2. ✅ Login with admin credentials
3. ✅ Test creating products via admin panel
4. ✅ Configure mobile app to point to http://YOUR_IP:5000/api
5. ✅ Test complete flow from mobile → backend → database

## Production Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Add SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Enable logging and monitoring
- [ ] Configure resource limits
- [ ] Use Docker secrets for sensitive data
- [ ] Set up health monitoring
- [ ] Configure log rotation

## Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Verify all containers are running: `docker-compose ps`
3. Check health status: `docker inspect <container_name>`
4. Review environment variables: `docker-compose config`
