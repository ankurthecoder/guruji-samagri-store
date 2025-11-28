# Guruji Samagri Store - Admin Dashboard

React-based admin dashboard for managing orders, users, and products for the Guruji Samagri Store e-commerce platform.

## Features

- 🔐 **Admin Authentication** with email/password
- 📊 **Dashboard Metrics** - Total orders, active users, delivered/pending orders
- 📦 **Order Management** - View, filter, and update order status
- 🎨 **Material-UI Design System** with brand colors
- 🔒 **Protected Routes** - Secure admin-only access

## Tech Stack

- **Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **API Client**: Axios
- **Charts**: Recharts
- **State Management**: React Context API

## Prerequisites

- Node.js (v16+)
- Backend API running

## Setup Instructions

### 1. Install Dependencies

```bash
cd admin-dashboard
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and update the API URL:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run the Application

**Development Mode**:
```bash
npm start
```

The dashboard will open at `http://localhost:3000`

**Production Build**:
```bash
npm run build
```

## Default Admin Credentials

To create an admin user, you'll need to add one directly to the database or via the backend.

**Example admin user** (as defined in backend `.env`):
- Email: `admin@gurujismagri.com`
- Password: `Admin@123`

## Project Structure

```
admin-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components (Layout, ProtectedRoute)
│   │   ├── dashboard/       # Dashboard-specific components
│   │   └── orders/          # Order-specific components
│   ├── pages/
│   │   ├── Login.js         # Admin login page
│   │   ├── Dashboard.js     # Main dashboard with metrics
│   │   └── Orders.js        # Orders management page
│   ├── context/
│   │   └── AuthContext.js   # Authentication context
│   ├── services/
│   │   └── api.js           # Axios API client
│   ├── utils/
│   │   └── constants.js     # App constants
│   └── App.js               # Root component with routing
└── package.json
```

## Pages

### 1. Login (`/login`)
- Email/password authentication
- Error handling and validation
- Redirects to dashboard on success

### 2. Dashboard (`/`)
- **Metrics Cards**: Total orders, active users, delivered orders, pending orders
- **Recent Orders**: Table showing last 5 orders with status

### 3. Orders Management (`/orders`)
- **Order Table** with:
  - Order ID, customer info, item count, total amount
  - Status badge with color coding
  - Inline status update dropdown
- **Filters**: Filter by order status (pending, processing, shipped, delivered, cancelled)

## Features in Detail

### Authentication
- Session persisted in localStorage
- Automatic redirect to login if token expires
- Logout functionality

### Order Status Management
Admin can update order status to:
- `pending` - Initial state
- `processing` - Order being prepared
-shipped` - Order dispatched
- `delivered` - Order completed
- `cancelled` - Order cancelled

### API Integration
- Automatic token attachment to requests
- Error handling with user-friendly messages
- 401 handling with auto-logout

## API Endpoints Used

```
POST /api/auth/admin-login       - Admin authentication
GET  /api/orders                 - Get all orders (with filters)
PATCH /api/orders/:id/status     - Update order status
```

## Customization

### Brand Colors
Located in `src/utils/constants.js`:
```javascript
export const COLORS = {
  PRIMARY: '#0C831F',   // Green
  ACCENT: '#F7CA00',    // Yellow/Gold
  ...
};
```

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.js`
3. Wrap with `<ProtectedRoute>` and `<Layout>`
4. Add menu item in `src/components/common/Layout.js`

## Deployment

### Build for Production

```bash
npm run build
```

This creates optimized production files in the `build/` directory.

### Deployment Options

1. **Static Hosting** (Netlify, Vercel, GitHub Pages):
   - Upload built files from `build/` directory

2. **Server Deployment**:
   - Use serve package: `npx serve -s build`
   - Configure nginx/Apache to serve static files

### Environment Variables for Production

Update `.env` for production:
```
REACT_APP_API_URL=https://your-production-api.com/api
```

## Troubleshooting

### API Connection Issues
- Ensure backend is running and accessible
- Check CORS configuration in backend
- Verify `REACT_APP_API_URL` is correct

### Authentication Issues
- Clear localStorage and cookies
- Verify admin user exists in database
- Check backend logs for auth errors

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf build`

## Future Enhancements

- [ ] Product management (CRUD operations)
- [ ] User management dashboard
- [ ] Order details modal
- [ ] Analytics and charts
- [ ] Export orders to CSV
- [ ] Real-time notifications

## License

ISC
