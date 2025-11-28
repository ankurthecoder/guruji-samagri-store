# Guruji Samagri Store - Mobile App

React Native mobile application for the Guruji Samagri Store e-commerce platform with Phone OTP authentication and Blinkit-inspired UI.

## Features

- 📱 **Phone OTP Authentication** via Firebase
- 👤 **User Profile Management**
- 🏠 **Blinkit-Style Home Screen** with categories and products
- 🛒 **Shopping Cart** with Zustand state management
- 🎨 **Brand Colors**: #F7CA00 (Accent Yellow), #0C831F (Primary Green)

## Tech Stack

- **Framework**: React Native (Bare Workflow)
- **State Management**: Zustand
- **Navigation**: React Navigation v6
- **Authentication**: Firebase Auth (Phone OTP)
- **API Client**: Axios
- **Storage**: AsyncStorage

## Prerequisites

- Node.js (v16+)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Firebase Project configured

## Setup Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Firebase

1. **For Android**:
   - Download `google-services.json` from Firebase Console
   - Place it in `mobile/android/app/`

2. **For iOS**:
   - Download `GoogleService-Info.plist` from Firebase Console
   - Place it in `mobile/ios/GurujiSamagriStore/`
   - Run `cd ios && pod install && cd ..`

### 3. Update API Configuration

Edit `src/constants/config.js` and update the API base URL to point to your backend:

```javascript
export const API_BASE_URL = 'http://YOUR_BACKEND_IP:5000/api';
```

**Note**: For Android emulator, use `10.0.2.2` instead of `localhost`.

### 4. Run the App

**For Android**:
```bash
npx react-native run-android
```

**For iOS**:
```bash
npx react-native run-ios
```

**Development Server** (Metro):
If not started automatically:
```bash
npx react-native start
```

## Project Structure

```
mobile/
├── src/
│   ├── constants/           # Colors, config, constants
│   ├── stores/              # Zustand stores (auth, cart)
│   ├── services/            # API client, Firebase auth
│   ├── screens/             # Screen components
│   │   ├── auth/            # Authentication screens
│   │   └── HomeScreen.js    # Main home screen
│   ├── components/          # Reusable components
│   └── navigation/          # Navigation setup
├── android/                 # Android native code
├── ios/                     # iOS native code
├── App.js                   # Root component
└── package.json
```

## Screens

### Authentication Flow

1. **PhoneLoginScreen**: Enter phone number → Send OTP
2. **OTPVerifyScreen**: Verify 6-digit OTP → Backend authentication
3. **ProfileSetupScreen** (new users only): Enter name, DOB, gender
4. **HomeScreen**: Main app interface

### Home Screen Features

- Header with user greeting and cart icon (with badge)
- Search bar for product search
- Horizontal category scroller
- Product grid with:
  - Product name, category, price
  - Add to cart button
  - Responsive 2-column layout

## State Management

### Auth Store (`stores/authStore.js`)

- User data
- JWT token
- Authentication status
- Profile completion status
- Persisted to AsyncStorage

### Cart Store (`stores/cartStore.js`)

- Cart items
- Add/remove/update quantity
- Automatic total calculation

## API Integration

### Services

- `services/firebaseAuth.js`: Firebase OTP functions
- `services/apiClient.js`: Axios instance with interceptors
- `services/api.js`: API endpoint functions

### Endpoints Used

- `POST /api/auth/verify-otp` - Authenticate with Firebase token
- `POST /api/user/profile` - Complete user profile
- `GET /api/products` - Get products with filters
- `POST /api/orders` - Create new order

## Environment Configuration

Development vs Production is automatically detected via `__DEV__` constant:

```javascript
// In src/constants/config.js
export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:5000/api'  // Android emulator
  : 'https://your-production-api.com/api';
```

## Troubleshooting

### Common Issues

1. **Firebase not configured**:
   - Ensure `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) are in correct locations
   - Rebuild app after adding config files

2. **Cannot connect to backend**:
   - For Android emulator: Use `10.0.2.2` instead of `localhost`
   - For iOS simulator: Use `localhost` or your machine's IP
   - Ensure backend server is running

3. **OTP not receiving**:
   - Check Firebase Console → Authentication → Sign-in method → Phone is enabled
   - Verify phone number format includes country code (+91)

4. **Build failures**:
   - Clean build: `cd android && ./gradlew clean && cd ..`
   - Clear Metro cache: `npx react-native start --reset-cache`

## Next Steps

- Implement cart screen
- Add product details screen
- Implement checkout flow
- Add order history screen
- Implement user profile screen

## License

ISC
