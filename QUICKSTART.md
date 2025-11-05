# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rayhanzz772/password-vault.git
cd password-vault/vault-password-frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env (optional - defaults to localhost:5000)
# VITE_API_URL=http://localhost:5000

# 5. Start development server
npm run dev
```

### 🎉 That's it!

Open http://localhost:5173 in your browser.

## 📍 Available Pages

- **Landing Page**: http://localhost:5173/
- **Login**: http://localhost:5173/login
- **Register**: http://localhost:5173/register
- **Dashboard** (protected): http://localhost:5173/app

## 🧪 Testing Without Backend

The app will work without a backend, but authentication won't function. You can:

1. View the landing page
2. See the login/register UI
3. Test theme switching
4. Test responsive design

## 🔌 Connecting to Backend

1. Make sure your backend server is running on port 5000 (or configure `VITE_API_URL`)
2. Backend should have these endpoints:
   - `POST /api/auth/register`
   - `POST /api/auth/login`

3. Expected request/response format:

**Register:**
```json
// Request
POST /api/auth/register
{
  "email": "user@example.com",
  "master_password": "SecurePass123"
}

// Response
{
  "token": "jwt_token_here",
  "user": {
    "email": "user@example.com"
  }
}
```

**Login:**
```json
// Request
POST /api/auth/login
{
  "email": "user@example.com",
  "master_password": "SecurePass123"
}

// Response
{
  "token": "jwt_token_here",
  "user": {
    "email": "user@example.com"
  }
}
```

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📱 Test on Mobile

```bash
# Start dev server with network access
npm run dev -- --host

# Then access from your phone using your computer's IP
# Example: http://192.168.1.100:5173
```

## 🎨 Customize

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#YOUR_COLOR',
    // ... other shades
  },
}
```

### Change API URL
Edit `.env`:
```bash
VITE_API_URL=https://your-api-url.com
```

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
# Kill the process using port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Cannot connect to API
- Check if backend is running
- Verify `VITE_API_URL` in `.env`
- Check browser console for CORS errors
- Ensure backend allows requests from `http://localhost:5173`

### Dependencies installation fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

- Read [AUTHENTICATION.md](./AUTHENTICATION.md) for auth system details
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
- Check [README.md](./README.md) for full documentation

## 🆘 Need Help?

- Open an issue on GitHub
- Check existing issues for solutions
- Read the full documentation

Happy coding! 🎉
