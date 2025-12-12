# 🔗 Linkdrop

A modern bookmark manager built with TanStack Start. Save, organize, and manage your links with automatic metadata fetching, categories, and tags.

## ✨ Features

- **Link Management** - Save URLs with automatic metadata fetching (title, description, favicon, preview images)
- **Organization** - Categories with colors, tags, favorites, and search
- **Filtering** - Multi-select filters for categories and tags with combined filtering
- **Views** - Grid and list views with infinite scroll
- **Dark/Light Mode** - Theme support
- **Google OAuth** - Authentication with Better Auth

## 🛠️ Tech Stack

| Layer    | Technologies                                                    |
| -------- | --------------------------------------------------------------- |
| Frontend | React 19, TanStack Start/Router/Query, Tailwind CSS 4, Radix UI |
| Backend  | ORPC, PostgreSQL, Drizzle ORM, Better Auth                      |
| Dev      | Vite 7, TypeScript 5.7, pnpm                                    |

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- pnpm v8+
- PostgreSQL v14+
- Google OAuth Credentials

### Setup

```bash
# Clone and install
git clone https://github.com/nitishmahawar/Linkdrop.git
cd linkdrop
pnpm install

# Create .env file
DATABASE_URL="postgresql://user:password@localhost:5432/linkdrop"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Push schema to database (no migrations)
pnpm db:push

# Start dev server
pnpm dev
```

## 📦 Scripts

| Command          | Description                   |
| ---------------- | ----------------------------- |
| `pnpm dev`       | Start dev server on port 3000 |
| `pnpm build`     | Build for production          |
| `pnpm db:push`   | Push schema to database       |
| `pnpm db:studio` | Open Drizzle Studio           |
| `pnpm test`      | Run tests                     |

## 📁 Project Structure

```
src/
├── components/       # React components (ui/, links/, categories/, tags/)
├── db/              # Drizzle ORM (schema/, index.ts)
├── lib/             # Utilities (auth.ts, auth-client.ts)
├── orpc/            # API layer (router/links, categories, tags, metadata)
└── routes/          # TanStack Router routes
```

## 📝 License

MIT License - see [LICENSE](LICENSE)

---

Made with ❤️ by Nitish Mahawar
