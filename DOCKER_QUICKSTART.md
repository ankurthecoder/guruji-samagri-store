# Docker Quick Reference

## 🚀 Quick Start

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🌐 Access URLs

- **Admin Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **API Health**: http://localhost:5001/health
- **Mongo Express (Database UI)**: http://localhost:8081
- **MongoDB**: localhost:27017

> **Note**: Backend runs on port **5001** instead of 5000 to avoid macOS AirPlay Receiver conflict.

## 📝 Default Credentials

**MongoDB**:
- Username: `admin`
- Password: `admin123`
- Database: `guruji-samagri-store`

**Mongo Express (Web UI)**:
- Username: `admin`
- Password: `admin123`
- URL: http://localhost:8081

**Admin Dashboard** (create manually in MongoDB):
- Email: `admin@gurujismagri.com`
- Password: `Admin@123`

## 🛠 Common Commands

```bash
# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View logs
docker-compose logs -f backend
docker-compose logs -f admin-dashboard

# Access MongoDB via CLI
docker exec -it guruji-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# Restart specific service
docker-compose restart backend
```

## 📦 Services

1. **MongoDB** (guruji-mongodb) - Port 27017
2. **Mongo Express** (guruji-mongo-express) - Port 8081 - Database Web UI
3. **Backend API** (guruji-backend) - Port 5001
4. **Admin Dashboard** (guruji-admin) - Port 3000

## 🗄️ Using Mongo Express

1. Open http://localhost:8081
2. Login with username: `admin`, password: `admin123`
3. Select database: `guruji-samagri-store`
4. View/edit collections: users, products, orders

## ⚠️ Important Notes

1. **Firebase Credentials Required**: Place `firebase-service-account.json` in `backend/src/config/` before starting
2. **Port 5001**: Backend uses port 5001 (not 5000) due to macOS AirPlay conflict
3. **Create Admin User**: Use Mongo Express or CLI to create admin user

## 🔧 Create Admin User via Mongo Express

1. Open http://localhost:8081
2. Login and select `guruji-samagri-store`
3. Click on `users` collection
4. Click "New Document"
5. Paste this (change password hash):
```json
{
  "email": "admin@gurujismagri.com",
  "password": "$2a$10$hash_your_password_here",
  "name": "Admin User",
  "role": "admin",
  "phoneNumber": "9999999999",
  "isProfileComplete": true,
  "createdAt": {"$date": "2024-01-01T00:00:00.000Z"},
  "updatedAt": {"$date": "2024-01-01T00:00:00.000Z"}
}
```

For detailed documentation, see [DOCKER.md](./DOCKER.md)
