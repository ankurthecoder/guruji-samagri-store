# Guruji Samagri Store - Full Stack E-commerce Platform

Complete MERN stack e-commerce solution with React Native mobile app and React admin dashboard, featuring Phone OTP authentication and Blinkit-inspired UI.

## 📦 Project Overview

This repository contains three main applications:

1. **Backend API** - Node.js + Express + MongoDB with Firebase Admin SDK
2. **Mobile App** - React Native with Firebase Auth and Zustand state management
3. **Admin Dashboard** - React web app with Material-UI for order management

## 🎨 Design

- **Primary Color**: `#0C831F` (Green)
- **Accent Color**: `#F7CA00` (Yellow/Gold)
- **UI Inspiration**: Blinkit (grocery-focused, clean, fast)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Firebase Project (for Phone OTP)
- Android Studio / Xcode (for mobile development)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Firebase credentials
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Mobile App Setup

```bash
cd mobile
npm install
# Add Firebase config files (google-services.json for Android, GoogleService-Info.plist for iOS)
# Edit src/constants/config.js with your backend URL
npx react-native run-android  # or run-ios
```

### 3. Admin Dashboard Setup

```bash
cd admin-dashboard
npm install
cp .env.example .env
# Edit .env with backend API URL
npm start
```

Dashboard runs on `http://localhost:3000`

## 📁 Project Structure

```
guruji-samagri-store/
├── backend/                 # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/          # Database, Firebase configuration
│   │   ├── models/          # Mongoose models (User, Product, Order)
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation middleware
│   │   └── utils/           # Helper functions
│   ├── server.js
│   └── README.md
│
├── mobile/                  # React Native App
│   ├── src/
│   │   ├── stores/          # Zustand stores (auth, cart)
│   │   ├── services/        # API client, Firebase auth
│   │   ├── screens/         # App screens
│   │   ├── components/      # Reusable components
│   │   ├── navigation/      # React Navigation setup
│   │   └── constants/       # Colors, config
│   ├── App.js
│   └── README.md
│
└── admin-dashboard/         # React Admin Dashboard
    ├── src/
    │   ├── pages/           # Dashboard, Orders, Login
    │   ├── components/      # Layout, ProtectedRoute
    │   ├── context/         # AuthContext
    │   ├── services/        # API client
    │   └── utils/           # Constants
    ├── App.js
    └── README.md
```

## 🔐 Authentication Flows

### Mobile App - Phone OTP Flow

1. User enters phone number
2. Firebase sends OTP via SMS
3. User enters 6-digit OTP
4. React Native verifies with Firebase → gets Firebase ID token
5. Send ID token to backend `/api/auth/verify-otp`
6. Backend verifies token, creates/finds user, returns JWT + profile status
7. If new user → ProfileSetupScreen (name, DOB, gender)
8. If existing user → HomeScreen

### Admin Dashboard - Email/Password Flow

1. Admin enters email & password
2. Send to backend `/api/auth/admin-login`
3. Backend verifies credentials, returns JWT
4. JWT stored in localStorage
5. Protected routes check for valid token

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/verify-otp` - Verify Firebase OTP token
- `POST /api/auth/admin-login` - Admin login

### User Profile
- `GET /api/user/profile` - Get user profile
- `POST /api/user/profile` - Complete profile (first time)
- `PUT /api/user/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` (Admin) - Create product
- `PUT /api/products/:id` (Admin) - Update product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders (user's or all for admin)
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` (Admin) - Update order status

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: Firebase Admin SDK + JWT
- **Validation**: express-validator

### Mobile App
- **Framework**: React Native (Bare Workflow)
- **State Management**: Zustand
- **Navigation**: React Navigation v6
- **Auth**: @react-native-firebase/auth
- **API**: Axios

### Admin Dashboard
- **Framework**: React 18
- **UI**: Material-UI (MUI)
- **Routing**: React Router v6
- **State**: Context API
- **API**: Axios

## 📱 Features

### Mobile App
- ✅ Phone OTP authentication via Firebase
- ✅ One-time profile setup (name, DOB, gender)
- ✅ Blinkit-style home screen with categories
- ✅ Product search and filtering
- ✅ Shopping cart with Zustand
- ✅ Persistent authentication

### Admin Dashboard
- ✅ Email/password admin login
- ✅ Dashboard with metrics (orders, users)
- ✅ Order management with status updates
- ✅ Filter orders by status
- ✅ Responsive Material-UI design

## 🔒 Security Considerations

- JWT tokens for stateless authentication
- Firebase OTP for secure phone verification
- Password hashing with bcrypt (for admin)
- Input validation on both client and server
- Protected API routes with middleware
- CORS configuration
- Environment variables for sensitive data

## 🚧 Future Enhancements

- [ ] Payment gateway integration
- [ ] Real-time order tracking
- [ ] Push notifications
- [ ] Product image upload
- [ ] Order history for users
- [ ] Cart screen in mobile app
- [ ] Product management in admin dashboard
- [ ] Analytics and reporting
- [ ] Address management
- [ ] Wishlist functionality

## 📖 Documentation

Each sub-project has its own detailed README:

- [Backend Documentation](./backend/README.md)
- [Mobile App Documentation](./mobile/README.md)
- [Admin Dashboard Documentation](./admin-dashboard/README.md)

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Check MongoDB is running
   - Verify `.env` file exists with correct values
   - Check Firebase service account file path

2. **Mobile app OTP not working**:
   - Ensure Firebase Auth Phone is enabled
   - Check Firebase config files are in correct locations
   - Verify phone number format includes country code

3. **Admin dashboard can't connect**:
   - Check backend is running
   - Verify `REACT_APP_API_URL` in `.env`
   - Check CORS settings in backend

## 📝 License

ISC

## 👨‍💻 Author

Built with ❤️ for Guruji Samagri Store
