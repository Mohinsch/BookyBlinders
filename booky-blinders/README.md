# 📚 Booky Blinders - Personal Library Management

[![CI](https://github.com/Mohinsch/BookyBlinders/actions/workflows/ci.yml/badge.svg)](https://github.com/Mohinsch/BookyBlinders/actions/workflows/ci.yml)

A mobile-first web application for managing your personal book collection with an industrial 1920s aesthetic. 
Track your reading progress, organize your library, and discover new books effortlessly.

![Booky Blinders Screenshot](/docs/BookyBlinders_PersonalLibrary.pdf)

---

## 🎯 Project Overview

**Booky Blinders** is a modern, full-stack application that combines a sleek vintage interface with contemporary web technologies. It empowers readers to:
- 📖 Create and manage personal book libraries
- 🔍 Search and discover books via Google Books API
- ⏳ Track reading progress and status
- 🎨 Enjoy a responsive, dark-themed UI inspired by the 1920s era

**Technology Stack:**
- **Frontend:** Next.js 16 (React 19) with TypeScript
- **Backend:** Next.js Server Actions for seamless API integration
- **Database:** PostgreSQL with Drizzle ORM for type-safe queries
- **Authentication:** Better-Auth for session management
- **Code Quality:** Biome for linting and formatting
- **Testing:** Vitest for unit and integration tests

---

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- **Node.js:** `^20.x` & **npm:** `^10.x`
- **Docker & Docker Compose** (Optional, but recommended for DB)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Mohinsch/BookyBlinders.git
cd booky-blinders

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your actual values

# 4. Start infrastructure with Docker (PostgreSQL + Adminer)
docker-compose up --build -d

# 5. Initialize the database
npm run db:push

# 6. Start the development server
npm run dev

**Access URLs:**
- App: http://localhost:3000
- Database GUI (Adminer): http://localhost:8080

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Check code style and issues with Biome |
| `npm run format`| Format code automatically with Biome |
| `npm test` | Run all tests |
| `npm run db:push` | Apply migrations to the database |
| `npm run db:studio`| Launch Drizzle Studio for visual DB management |
| `npm run db:seed` | Seed the database with sample data |
| `npm run db:dump` | Dump the database to `db-dumps/` |
| `npm run db:restore` | Restore the database from a dump file |

---

## 🗄️ Database (Seed & Dump)

### Seed (sample data)
From `booky-blinders/`:
```bash
npm run db:seed
```
By default the seed resets the data. To keep existing data:
```bash
SEED_RESET=false npm run db:seed
```

### Backup / Restore (Docker)
```bash
# Dump
npm run db:dump

# Restore (replace the file path)
npm run db:restore
```

---

## 🔧 Developer Environment Setup

### VS Code Extensions
For the best developer experience, install these extensions:
- `biomejs.biome` (Biome - *Set as default formatter*)
- `drizzle-team.drizzle-orm` (Drizzle)
- `dsznajder.es7-react-js-snippets` (React Snippets)

### Troubleshooting
- **Port 3000/5432 taken:** Use `lsof -ti:3000` (or 5432) to find the PID, then `kill <PID>`
- **Dependencies fail:** Run `npm cache clean --force && npm install`
- **Docker/Database error:** Run `docker-compose down -v && docker-compose up --build`

---

## 🔐 Environment Variables

See `.env.example` for a complete template. Key variables:

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/db` |
| `BETTER_AUTH_SECRET` | Authentication session secret | Generated random string |
| `NEXT_PUBLIC_API_URL` | Public API URL | `http://localhost:3000` |
| `GOOGLE_BOOKS_API_KEY` | Google Books API key | Get from Google Cloud Console |

---

## 🏗️ Architecture & Technical Choices

### 1. **Next.js 16 + React 19**
- **Why:** Next.js provides built-in Server Actions, automatic API routes, and excellent TypeScript support.
- **Benefit:** Enables SSR/SSG for SEO and performance; seamless client-server communication.

### 2. **Drizzle ORM**
- **Why:** Type-safe database queries with PostgreSQL, lighter than heavy ORMs.
- **Benefit:** Migrations tracked in Git, auto-generated TypeScript types prevent runtime errors.

### 3. **Better-Auth**
- **Why:** Modern, lightweight authentication without external services.
- **Benefit:** Session management, role-based access, integrated with Next.js Server Actions.

### 4. **Biome for Code Quality**
- **Why:** Single fast tool for linting AND formatting (replaces ESLint + Prettier).
- **Benefit:** 1.5–5x faster than traditional tools; opinionated rules prevent code style debates.

---

## 📝 License & Contributing

- **License:** MIT License - See `LICENSE` file for details.
- **Contributing:** See `CONTRIBUTING.md` for guidelines on code style and pull requests.
- **Testing:** See `TEST_PLAN.md` for our testing strategy and expected behaviors.

**Built with ❤️ by the Booky Blinders team**