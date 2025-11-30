# Linkdrop

## Core Features

**Link Management**

- Save URLs with title, description, and notes
- Automatic metadata fetching (title, favicon, preview image from URL)
- Edit and delete saved links
- Mark links as favorites/starred

**Organization**

- Create custom categories/folders
- Add multiple tags per link
- Search across titles, descriptions, notes, and tags
- Filter by category, tags, or favorites

**User Interface**

- Card/grid view and list view options
- Quick add form (browser extension feel)
- Drag-and-drop to move links between categories
- Dark/light mode

## Tech Stack Suggestions

**Frontend**

- React or Vue.js
- Tailwind CSS for styling
- React Query or SWR for data fetching
- React Router for navigation

**Backend**

- Node.js with Express
- PostgreSQL or MongoDB for database
- JWT for authentication
- Cheerio or Puppeteer for URL metadata scraping

**Optional Enhancements**

- Chrome/Firefox extension for quick saving
- Share links publicly via unique URLs
- Import from browser bookmarks
- Archive page content for offline viewing
- Link health checker (detect broken links)

## Database Schema (PostgreSQL example)

```
users
- id, email, password_hash, created_at

links
- id, user_id, url, title, description, notes
- favicon_url, preview_image, created_at, updated_at
- is_favorite

categories
- id, user_id, name, color, created_at

tags
- id, user_id, name, created_at

link_categories (many-to-many)
- link_id, category_id

link_tags (many-to-many)
- link_id, tag_id
```
