# Authentication System Documentation

## Overview

The Vault Password authentication system provides secure user registration and login with JWT token management and master password storage in React state only.

## Features

✅ **User Registration** - Email + Master Password with validation
✅ **User Login** - JWT token storage in localStorage
✅ **Master Password Security** - Stored only in React state (never localStorage!)
✅ **Protected Routes** - Route guards for authenticated pages
✅ **Toast Notifications** - User-friendly error and success messages
✅ **Dark Mode Support** - Full theme integration
✅ **Form Validation** - Client-side validation with helpful error messages
✅ **Responsive Design** - Mobile-first approach

## Architecture

### Components Structure

```
src/
├── components/
│   ├── Header.jsx              # Navigation header
│   ├── Hero.jsx                # Landing hero section
│   ├── SecurityFeatures.jsx    # Features showcase
│   ├── HowItWorks.jsx          # Process explanation
│   ├── Footer.jsx              # Footer component
│   └── ProtectedRoute.jsx      # Route guard component
├── contexts/
│   ├── AuthContext.jsx         # Authentication state management
│   └── ThemeContext.jsx        # Theme state management
├── pages/
│   ├── Landing.jsx             # Home page
│   ├── Login.jsx               # Login page
│   ├── Register.jsx            # Registration page
│   └── Dashboard.jsx           # Protected dashboard
├── utils/
│   └── api.js                  # Axios instance & API calls
└── App.jsx                     # Main app with routing
```

## API Integration

### Base Configuration

```javascript
// src/utils/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});
```

### Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "master_password": "SecurePass123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "email": "user@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "master_password": "SecurePass123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "email": "user@example.com"
  }
}
```

## Authentication Flow

### Registration Flow

1. User fills out registration form
2. Client-side validation checks:
   - Email format
   - Password minimum 8 characters
   - Password contains uppercase, lowercase, and number
   - Passwords match
3. POST request to `/api/auth/register`
4. On success:
   - JWT token saved to localStorage
   - Master password stored in React state
   - User redirected to `/app`
5. On error:
   - Toast notification displays error message

### Login Flow

1. User enters email and master password
2. Client-side validation
3. POST request to `/api/auth/login`
4. On success:
   - JWT token saved to `localStorage.getItem('jwt_token')`
   - Master password stored in React state: `setMasterPassword(password)`
   - User object stored in state
   - Navigate to `/app` dashboard
5. On error:
   - Toast notification with error message

### Logout Flow

1. User clicks logout button
2. `logout()` function called
3. JWT token removed from localStorage
4. Master password cleared from React state
5. User redirected to `/login`

## Security Considerations

### ✅ What We Do Right

1. **Master Password in Memory Only**
   - Never stored in localStorage
   - Only exists in React state during session
   - Cleared immediately on logout

2. **JWT Token Management**
   - Stored in localStorage for persistence
   - Automatically added to requests via interceptor
   - Removed on 401 response

3. **Password Validation**
   - Minimum 8 characters
   - Must contain uppercase, lowercase, and numbers
   - Passwords must match on registration

4. **HTTPS Required**
   - All API calls should use HTTPS in production
   - Prevents token interception

### 🔒 Security Best Practices

1. **Never log master password**
   ```javascript
   // ❌ NEVER DO THIS
   console.log(masterPassword);
   
   // ✅ CORRECT
   // Don't log it at all
   ```

2. **Use environment variables**
   ```bash
   VITE_API_URL=https://api.vaultpassword.com
   ```

3. **Token expiration**
   - Backend should implement JWT expiration
   - Frontend handles 401 responses

## Usage Examples

### Using Auth Context

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, masterPassword, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // Handle success
    } else {
      // Handle error: result.error
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome {user.email}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Protected Route

```jsx
<Route
  path="/app"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Making Authenticated API Calls

```javascript
import api from '../utils/api';

// Token is automatically added to headers
const response = await api.get('/api/passwords');
```

## Form Validation

### Email Validation
- Required field
- Valid email format: `/\S+@\S+\.\S+/`

### Password Validation
- Required field
- Minimum 8 characters
- Contains uppercase letter: `/[A-Z]/`
- Contains lowercase letter: `/[a-z]/`
- Contains number: `/\d/`

### Confirm Password
- Required field
- Must match password field

## Toast Notifications

```javascript
import toast from 'react-hot-toast';

// Success
toast.success('Login successful!');

// Error
toast.error('Invalid credentials');

// Loading
toast.loading('Logging in...');
```

## Environment Setup

Create `.env` file:

```bash
VITE_API_URL=http://localhost:5000
```

## Testing Checklist

- [ ] Register with valid credentials
- [ ] Register with invalid email
- [ ] Register with weak password
- [ ] Register with non-matching passwords
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Access protected route when logged out
- [ ] Access protected route when logged in
- [ ] Logout functionality
- [ ] Token persistence across page refreshes
- [ ] Form validation error messages
- [ ] Toast notifications display correctly
- [ ] Dark mode compatibility
- [ ] Mobile responsiveness

## Troubleshooting

### Issue: "Network Error"
- Check if backend server is running
- Verify `VITE_API_URL` in `.env`
- Check CORS settings on backend

### Issue: "Token expired"
- Backend JWT has expired
- User needs to login again
- Check JWT expiration time on backend

### Issue: "Master password lost on refresh"
- This is expected behavior for security
- Master password is never persisted
- User must login again

## Future Enhancements

- [ ] Refresh token implementation
- [ ] Password strength meter
- [ ] Two-factor authentication
- [ ] Biometric authentication
- [ ] Session timeout warning
- [ ] Remember me functionality
- [ ] Password recovery flow
- [ ] Account verification via email

---

**Security Note:** Never commit `.env` files to version control. Always use `.env.example` for documentation.
