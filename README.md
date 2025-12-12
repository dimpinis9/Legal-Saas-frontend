# Legal SaaS Client (Frontend)

React + TypeScript + Vite application for Greek law firm case & deadline cockpit.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Visit http://localhost:5173

## 📚 Stack

- **Build Tool:** Vite 5
- **Framework:** React 18
- **Language:** TypeScript 5
- **Routing:** React Router v6
- **Data Fetching:** TanStack Query (React Query)
- **UI Library:** Material-UI (MUI)
- **Forms:** React Hook Form
- **HTTP Client:** Axios

## 🔧 Environment

Copy `.env.example` to `.env` and configure:

```env
VITE_API_URL=http://localhost:8080/api
```

## 📜 Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking

## 🔐 Auth Flow

1. User logs in via POST `/auth/login` → receives `{ accessToken }`
2. Token stored in memory & localStorage
3. All API requests automatically include `Authorization: Bearer <token>`
4. Auto-logout on 401 Unauthorized

## 📁 Project Structure

```
src/
├── api/              # API clients & HTTP configuration
├── components/       # Reusable UI components
│   ├── common/       # LoadingState, ErrorState, etc.
│   └── layout/       # AppLayout, Sidebar, Topbar
├── config/           # App configuration (theme, env, etc.)
├── context/          # React Context providers (Auth)
├── features/         # Feature-based modules
│   ├── auth/         # Login page
│   ├── clients/      # Client management
│   ├── cases/        # Case files management
│   ├── deadlines/    # Deadlines tracking
│   ├── tasks/        # Task management
│   └── dashboard/    # Dashboard overview
├── hooks/            # Custom React hooks
├── router/           # Route configuration
├── types/            # TypeScript type definitions
├── App.tsx           # Root application component
└── main.tsx          # Application entry point
```

## 🎯 Features

### Implemented

- ✅ JWT Authentication with auto-logout
- ✅ Protected routes
- ✅ Client management (CRUD)
- ✅ Case files management (CRUD)
- ✅ Deadlines tracking
- ✅ Tasks management
- ✅ Dashboard with statistics
- ✅ Responsive layout with sidebar navigation

### Domain Entities

- **Client** - Law firm clients
- **CaseFile** - Legal cases with status tracking
- **Deadline** - Court hearings, filing deadlines
- **Task** - Internal tasks linked to cases

## 🔥 Improvements & Best Practices

See [`IMPROVEMENTS.md`](./IMPROVEMENTS.md) for:

- Security enhancements
- Performance optimizations
- Code quality improvements
- Testing strategies
- Monitoring setup

See [`QUICK_START.md`](./QUICK_START.md) for ready-to-use code snippets.

## 🛠️ Development

### Code Organization

- Components use `.tsx` extension (JSX)
- Utilities/Types use `.ts` extension
- All imports include file extensions (`.ts` / `.tsx`)
- `moduleResolution: Bundler` in `tsconfig.json`

### Key Patterns

- **Custom hooks** for data fetching
- **React Query** for server state management
- **Centralized API clients** in `src/api/`
- **Feature-based folder structure**
- **Type-safe route definitions**

## 🧪 Testing

```bash
# Install testing dependencies (optional)
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

## 📦 Building for Production

```bash
# Create optimized build
npm run build

# Preview build locally
npm run preview
```

Output will be in `dist/` folder.

## 🌐 Backend Integration

This frontend expects a Spring Boot backend running on port 8080 with endpoints:

- `POST /api/auth/login` - Authentication
- `GET /api/clients` - List clients
- `GET /api/cases` - List cases
- `GET /api/deadlines` - List deadlines
- `GET /api/tasks` - List tasks

## 📄 License

Private - Legal SaaS Project

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run typecheck` to verify TypeScript
4. Submit a pull request

---

**Note:** This is a production-ready foundation. See `IMPROVEMENTS.md` for advanced features and optimizations.
