# Guruji Samagri Store - Backend API

Backend REST API for the Guruji Samagri Store e-commerce application built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Phone OTP Authentication** via Firebase Admin SDK
- 👤 **User Profile Management** with DOB and gender validation
- 📦 **Product Management** with categories, search, and pagination
- 🛒 **Order Management** with status tracking
- 🔒 **JWT-based Authorization**
- 👨‍💼 **Admin Panel Access** with role-based permissions

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Admin SDK + JWT
- **Validation**: express-validator

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Firebase project with Admin SDK credentials

### Installation

1. **Install dependencies**:
```bash
cd backend
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Path to Firebase service account JSON

3. **Set up Firebase**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create/select your project
   - Navigate to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file as `src/config/firebase-service-account.json`

4. **Start the server**:

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "idToken": "firebase-id-token-here"
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt-token",
  "user": { ... },
  "needsProfileSetup": true/false
}
```

#### Admin Login
```http
POST /api/auth/admin-login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### User Profile

#### Get Profile
```http
GET /api/user/profile
Authorization: Bearer <jwt-token>
```

#### Complete Profile (First Time)
```http
POST /api/user/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "John Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "Male"
}
```

#### Update Profile
```http
PUT /api/user/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Jane Doe"
}
```

### Products

#### Get All Products
```http
GET /api/products?category=Groceries&search=rice&page=1&limit=20
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "category": "Groceries",
  "stock": 100,
  "images": ["url1", "url2"]
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "price": 89.99,
  "stock": 150
}
```

### Orders

#### Create Order
```http
POST /api/orders
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product-id-here",
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "fullName": "John Doe",
    "phoneNumber": "9876543210",
    "addressLine1": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "cod"
}
```

#### Get Orders
```http
GET /api/orders?status=pending&page=1&limit=20
Authorization: Bearer <jwt-token>
```

#### Get Order by ID
```http
GET /api/orders/:id
Authorization: Bearer <jwt-token>
```

#### Update Order Status (Admin Only)
```http
PATCH /api/orders/:id/status
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "status": "processing"
}
```

**Valid statuses**: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (DB, Firebase)
│   ├── models/          # Mongoose models
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Helper functions
│   └── app.js           # Express app setup
├── server.js            # Entry point
├── .env.example         # Environment template
└── package.json
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/dbname` |
| `JWT_SECRET` | Secret for JWT signing | Random secure string |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to Firebase credentials | `./config/firebase.json` |
| `CLIENT_URL` | Admin dashboard URL (for CORS) | `http://localhost:3000` |

## Security Notes

- Never commit `.env` or Firebase credentials to version control
- Use strong `JWT_SECRET` in production
- Enable MongoDB authentication in production
- Use HTTPS in production
- Implement rate limiting for production

## License

ISC
