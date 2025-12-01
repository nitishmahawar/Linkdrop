# 🔗 Linkdrop

A modern, feature-rich bookmark manager built with React, TanStack Start, and Prisma. Save, organize, and manage your links with automatic metadata fetching, categories, tags, and a beautiful UI.

![Linkdrop](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 📚 Link Management

- **Save Links**: Add URLs with automatic metadata fetching (title, description, favicon, preview images)
- **Rich Metadata**: Automatically scrapes and displays link information using Cheerio
- **Edit & Delete**: Full CRUD operations for managing your saved links
- **Favorites**: Star/favorite important links for quick access
- **Notes**: Add personal notes to any link

### 🗂️ Organization

- **Categories**: Create custom categories with optional colors
- **Tags**: Add multiple tags to links for flexible organization
- **Search**: Powerful search across titles, descriptions, notes, and URLs
- **Filters**: Filter by category, tags, or favorites
- **Sorting**: Sort by creation date, update date, or title

### 🎨 User Interface

- **Dual View Modes**: Switch between grid and list views
- **Responsive Design**: Fully responsive layout (1-4 columns on different screen sizes)
- **Dark/Light Mode**: Theme support with next-themes
- **Beautiful Cards**: Enhanced link cards with gradient placeholders and hover effects
- **Skeleton Loading**: Smooth loading states with skeleton screens
- **Toast Notifications**: User-friendly feedback with Sonner

### 🔐 Authentication

- **Google OAuth**: Sign in with Google using Better Auth
- **Session Management**: Secure session handling with JWT
- **Protected Routes**: Automatic authentication checks

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React 19](https://react.dev/) with [TanStack Start](https://tanstack.com/start)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State Management**: [TanStack Query](https://tanstack.com/query) (React Query)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom animations
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod v4](https://zod.dev/) validation
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend

- **API Layer**: [ORPC](https://orpc.io/) - Type-safe RPC framework
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Web Scraping**: [Cheerio](https://cheerio.js.org/) for metadata extraction

### Development

- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Testing**: [Vitest](https://vitest.dev/) with Testing Library
- **Linting**: TypeScript ESLint

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher
- **PostgreSQL**: v14 or higher
- **Google OAuth Credentials**: For authentication

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/linkdrop.git
cd linkdrop
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/linkdrop"

# Server (optional, for production)
SERVER_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# (Optional) Seed the database
pnpm prisma db seed
```

### 5. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📦 Available Scripts

```bash
# Development
pnpm dev              # Start development server on port 3000

# Build
pnpm build            # Build for production

# Preview
pnpm serve            # Preview production build

# Testing
pnpm test             # Run tests with Vitest

# Database
pnpm prisma generate  # Generate Prisma Client
pnpm prisma migrate   # Run database migrations
pnpm prisma studio    # Open Prisma Studio
```

## 🗄️ Database Schema

### Core Models

#### User

- Authentication and user profile
- Relations: sessions, accounts, links, categories, tags

#### Link

- URL, title, description, notes
- Favicon and preview image URLs
- Favorite flag
- Relations: user, categories (many-to-many), tags (many-to-many)

#### Category

- Name and optional color
- Relations: user, links (many-to-many)

#### Tag

- Name
- Relations: user, links (many-to-many)

### Authentication Models

- **Session**: User sessions with expiry
- **Account**: OAuth provider accounts
- **Verification**: Email verification tokens

## 🏗️ Project Structure

```
linkdrop/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components (shadcn)
│   │   └── links/           # Link-specific components
│   ├── generated/           # Generated Prisma client
│   ├── lib/                 # Utility functions
│   │   ├── auth.ts         # Authentication utilities
│   │   ├── auth-client.ts  # Client-side auth
│   │   └── prisma.ts       # Prisma client instance
│   ├── orpc/               # ORPC API layer
│   │   ├── client.ts       # ORPC client
│   │   ├── index.ts        # ORPC server setup
│   │   └── router/         # API routes
│   │       ├── links/      # Links endpoints
│   │       ├── categories/ # Categories endpoints
│   │       ├── tags/       # Tags endpoints
│   │       └── metadata/   # Metadata fetching
│   ├── routes/             # TanStack Router routes
│   │   ├── __root.tsx      # Root layout
│   │   ├── index.tsx       # Home page
│   │   ├── login.tsx       # Login page
│   │   └── api.*.ts        # API handlers
│   ├── env.ts              # Environment validation
│   └── main.tsx            # Application entry point
├── .env                     # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔑 Key Features Explained

### Automatic Metadata Fetching

When you add a link, Linkdrop automatically:

1. Fetches the page HTML
2. Extracts title, description, and Open Graph metadata
3. Downloads favicon and preview images
4. Stores everything in the database

### Type-Safe API with ORPC

ORPC provides end-to-end type safety:

- Shared types between client and server
- Automatic validation with Zod v4
- Built-in error handling
- Seamless integration with TanStack Query

### Responsive Grid Layout

The link grid automatically adjusts:

- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3 columns
- **Large Desktop**: 4 columns

### Enhanced Link Cards

Each link card features:

- Preview image or gradient placeholder with first letter
- Favicon with fallback icon
- Clickable card area (opens link in new tab)
- Hover animations and effects
- Category and tag badges
- Action menu (edit, delete, favorite)

## 🎨 Customization

### Adding New UI Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add [component-name]
```

### Modifying Themes

Edit `src/app.css` to customize:

- Color schemes
- Typography
- Spacing
- Animations

### Database Schema Changes

1. Modify `prisma/schema.prisma`
2. Create migration: `pnpm prisma migrate dev --name your-migration-name`
3. Generate client: `pnpm prisma generate`

## 🔒 Security

- **Authentication**: OAuth 2.0 with Google
- **Session Management**: Secure HTTP-only cookies
- **Input Validation**: Zod v4 schemas on all endpoints
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **XSS Protection**: React's built-in escaping
- **CSRF Protection**: Better Auth built-in protection

## 🚀 Deployment

### Environment Variables

Ensure all production environment variables are set:

- `DATABASE_URL`: Production database connection
- `SERVER_URL`: Production server URL
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials
- `BETTER_AUTH_SECRET`: Strong random secret
- `BETTER_AUTH_URL`: Production URL

### Build for Production

```bash
pnpm build
```

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set environment variables
3. Deploy!

The project is configured for serverless deployment with TanStack Start.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TanStack](https://tanstack.com/) for amazing React libraries
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Better Auth](https://better-auth.com/) for authentication
- [ORPC](https://orpc.io/) for type-safe APIs
- [Prisma](https://www.prisma.io/) for database tooling

## 📧 Support

For support, email support@linkdrop.com or open an issue on GitHub.

---

Made with ❤️ by Nitish Mahawar
