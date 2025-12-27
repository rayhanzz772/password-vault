<div align="center">
  
# 🔐 Vault Password - Landing Page

### Secure. Modern. Yours.

A beautiful, modern landing page for **Vault Password** - an advanced open-source password manager built with enterprise-grade encryption.

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[Live Demo](#) • [Features](#-features) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

![Vault Password Preview](https://via.placeholder.com/800x400/0ea5e9/ffffff?text=Vault+Password+Landing+Page)

</div>

---

## ✨ Features

### 🔐 **Authentication System**

- Secure user registration and login
- JWT token management
- Master password stored only in React state (never localStorage!)
- Form validation with helpful error messages
- Toast notifications for user feedback
- Protected routes with authentication guards

### 🎨 **Modern Design**

- Glassmorphism effects with beautiful gradients
- Smooth animations powered by Framer Motion
- Professional, futuristic aesthetic
- Pixel-perfect responsive design

### 🌓 **Dark/Light Theme**

- Seamless theme switching
- LocalStorage persistence
- System preference detection
- Smooth transitions

### 📱 **Fully Responsive**

- Mobile-first approach
- Tablet & desktop optimized
- Touch-friendly interactions
- Adaptive layouts

### ⚡ **Performance Optimized**

- Lightning-fast loading with Vite
- Code splitting & lazy loading
- Optimized bundle size
- SEO-friendly structure

### 🎭 **Rich Animations**

- Scroll-triggered effects
- Hover interactions
- Page transitions
- Floating elements

---

## 🏗️ Built With

| Technology                                          | Description                                 |
| --------------------------------------------------- | ------------------------------------------- |
| **[React 19.1](https://react.dev)**                 | Latest React with modern hooks and features |
| **[Vite 7.2](https://vitejs.dev)**                  | Next-generation frontend tooling            |
| **[Tailwind CSS 3](https://tailwindcss.com)**       | Utility-first CSS framework                 |
| **[Framer Motion](https://www.framer.com/motion/)** | Production-ready animation library          |
| **[Lucide React](https://lucide.dev)**              | Beautiful, consistent icon set              |
| **[React Router](https://reactrouter.com)**         | Client-side routing                         |
| **[Axios](https://axios-http.com)**                 | HTTP client for API requests                |
| **[React Hot Toast](https://react-hot-toast.com)**  | Toast notifications                         |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (or yarn/pnpm)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/vault-password-frontend.git
   cd vault-password-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## � Project Structure

```
vault-password-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── Header.jsx     # Navigation with theme toggle
│   │   ├── Hero.jsx       # Hero section with CTA
│   │   ├── SecurityFeatures.jsx  # Feature cards grid
│   │   ├── HowItWorks.jsx # 3-step process section
│   │   └── Footer.jsx     # Footer with links
│   ├── contexts/          # React contexts
│   │   └── ThemeContext.jsx  # Theme management
│   ├── assets/            # Images, icons, etc.
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles + Tailwind
├── index.html             # HTML template
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies & scripts
└── README.md             # You are here!
```

---

## 🔐 Authentication

The app includes a complete authentication system with:

- User registration with email and master password
- Secure login with JWT token management
- Master password stored only in React state (never persisted)
- Protected routes with authentication guards
- Toast notifications for user feedback

**[📖 Full Authentication Documentation →](./AUTHENTICATION.md)**

---

## 🎨 Landing Page Sections

### 🏠 Hero Section

- Eye-catching animated title with gradient effects
- Compelling subtitle highlighting key features
- Two prominent CTAs (Get Started & View on GitHub)
- Animated 3D lock illustration with floating particles
- Real-time statistics display
- Smooth scroll indicator

### 🔒 Security Features Section

6 beautifully designed feature cards:

1. **End-to-End Encryption** - AES-256-GCM with Argon2id
2. **Zero Knowledge Design** - Your master password never leaves your device
3. **Password Breach Detection** - HaveIBeenPwned integration
4. **Activity Logs** - Track all vault actions securely
5. **Rate Limiting & Auto Lock** - Prevent brute force attacks
6. **Per-Item Salted KDF** - Unique Argon2id parameters per entry

Features:

- Gradient icon backgrounds
- Hover lift animations
- Responsive grid layout
- Smooth scroll reveals

### 💻 How It Works Section

3-step process visualization:

1. **Register & Create Master Password** - One password to rule them all
2. **Encrypt & Save Passwords** - Military-grade encryption
3. **Decrypt Instantly** - Local, secure, fast

Features:

- Large numbered backgrounds
- Animated icons with emojis
- Connecting dotted lines
- Scroll-triggered animations
- Bottom CTA section

### 🧭 Header

- Sticky navigation with blur effect
- Logo with gradient background
- Responsive menu (hamburger on mobile)
- Theme toggle with animated icons
- Smooth scroll to sections

### 📄 Footer

- Brand information
- Link columns (Product, Resources, Company, Legal)
- Social media icons
- Copyright information
- Background decorations

---

## 🌙 Theme System

The app includes a sophisticated theme system:

```jsx
import { useTheme } from "./contexts/ThemeContext";

function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return <button onClick={toggleTheme}>Current theme: {theme}</button>;
}
```

**Features:**

- ✅ Light and dark modes
- ✅ LocalStorage persistence
- ✅ System preference detection
- ✅ CSS class-based switching (`class="dark"`)
- ✅ Smooth transitions

---

## 🎯 Available Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start development server at `localhost:5173` |
| `npm run build`   | Build for production in `dist/` folder       |
| `npm run preview` | Preview production build locally             |
| `npm run lint`    | Run ESLint to check code quality             |

---

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#0ea5e9',  // Your brand color
        // ... other shades
      },
    },
  },
}
```

### Animations

Custom animations are defined in `tailwind.config.js`:

```js
animation: {
  'float': 'float 3s ease-in-out infinite',
}
```

### Content

Update component files in `src/components/` to change text, links, and structure.

---

## 📦 Dependencies

### Production

- `react` - UI library
- `react-dom` - React DOM renderer
- `framer-motion` - Animation library
- `lucide-react` - Icon components

### Development

- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `tailwindcss` - CSS framework
- `postcss` - CSS processor
- `autoprefixer` - CSS vendor prefixes
- `eslint` - Code linting

---

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vault-password-frontend)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/vault-password-frontend)

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist/` folder to your hosting provider
3. Configure your server to serve `index.html` for all routes

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is [MIT](LICENSE) licensed.

---

## 🙏 Acknowledgments

- Design inspiration from modern SaaS landing pages
- Icons by [Lucide](https://lucide.dev)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Built with ❤️ for security and privacy

---

## 📧 Contact

**Project Link:** [https://github.com/yourusername/vault-password-frontend](https://github.com/yourusername/vault-password-frontend)

**Website:** [https://vaultpassword.com](#)

---

<div align="center">

Made with ❤️ by the Vault Password Team

⭐ Star this repo if you find it helpful!

</div>
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
