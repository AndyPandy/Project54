# ApartmentFind

Apartment listing platform with a public-facing site and a full admin CMS.

## Tech stack

| Layer      | Tech                              |
|------------|-----------------------------------|
| Framework  | Next.js 14 (App Router)           |
| Language   | TypeScript                        |
| Styling    | Tailwind CSS                      |
| Database   | SQLite (dev) → PostgreSQL (prod)  |
| ORM        | Prisma                            |
| Auth       | NextAuth.js (credentials)         |
| Maps       | Leaflet + OpenStreetMap (no key)  |
| Storage    | Local filesystem (`public/uploads`) |

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="<run: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="changeme123"
```

### 3. Set up the database

```bash
npm run db:push    # create tables
npm run db:seed    # create admin user + demo listings
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Pages

| URL                          | Description                     |
|------------------------------|---------------------------------|
| `/`                          | Public listing grid with filters |
| `/apartments/[slug]`         | Apartment detail + map + contact |
| `/admin/login`               | Admin login                     |
| `/admin`                     | Dashboard (stats + recent)      |
| `/admin/listings`            | All listings table              |
| `/admin/listings/new`        | Create listing                  |
| `/admin/listings/[id]/edit`  | Edit listing                    |

---

## API routes

| Method | Path                      | Auth | Description              |
|--------|---------------------------|------|--------------------------|
| GET    | `/api/apartments`         | —    | List published apartments |
| POST   | `/api/apartments`         | ✓    | Create apartment          |
| GET    | `/api/apartments/:id`     | —    | Get single apartment      |
| PUT    | `/api/apartments/:id`     | ✓    | Update apartment          |
| DELETE | `/api/apartments/:id`     | ✓    | Delete apartment          |
| POST   | `/api/upload`             | ✓    | Upload images             |

---

## Moving to PostgreSQL

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` to a Postgres connection string.
3. Run `npm run db:push`.

---

## Production checklist

- [ ] Set a strong `NEXTAUTH_SECRET`
- [ ] Switch to PostgreSQL
- [ ] Replace local file uploads with S3/Cloudflare R2
- [ ] Add email delivery for the contact form (e.g. Resend)
- [ ] Add `NEXTAUTH_URL` to your hosting environment
