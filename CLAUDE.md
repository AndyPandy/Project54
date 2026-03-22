# Project: Apartment Listing Platform
## Purpose
Build a web platform where users can browse apartments for sale/rent, and admins/agents can create and manage listings through a CMS.
## Core Features
### Public Site
- Browse apartment listings
- Filter by:
  - Location
  - Price
  - Size (sqm)
  - Number of rooms
- View apartment details:
  - Title
  - Description
  - Image gallery
  - Price
  - Address
  - Map with location
- Contact form for each listing
### Admin / CMS
- Secure login for admins/agents
- Create, edit, delete listings
- Upload and manage images
- Add:
  - Title
  - Description
  - Price
  - Address
  - Coordinates (lat/lng)
  - Attributes (rooms, size, etc.)
- Draft / publish states
---
## Target Audience
- People looking to buy or rent apartments
- Real estate agents managing listings
---
## Tone & Style
- Professional and trustworthy
- Clear and informative
- Avoid exaggerated marketing language
---
## Tech Stack
### Frontend
- React (Next.js preferred)
- TypeScript
- Tailwind CSS (or similar)
- Map integration (e.g. Google Maps or Mapbox)
### Backend
- Node.js (e.g. Express or Next.js API routes)
- REST or GraphQL API
### Database
- PostgreSQL
### CMS / Admin
- Custom admin panel or headless CMS (e.g. Strapi)
### Storage
- Cloud storage for images (e.g. S3 or similar)
---
## Data Model (Simplified)
### Apartment
- id
- title
- description
- price
- address
- latitude
- longitude
- rooms
- size_sqm
- images (array)
- created_at
- updated_at
- status (draft/published)
### User (Admin/Agent)
- id
- email
- password (hashed)
- role
---
## Design Guidelines
- Clean, modern UI
- Image-focused listings
- Easy-to-scan cards for listings
- Strong filtering UX
- Mobile-first design
---
## SEO Requirements
- Server-side rendering (Next.js)
- Dynamic meta tags per listing
- Clean URLs (e.g. /apartments/{slug})
- Sitemap generation
---
## Performance
- Optimize images (lazy loading, resizing)
- Use caching where possible
- Fast page load is critical
---
## Security
- Authentication for admin routes
- Input validation (backend required)
- Protect file uploads
- Prevent XSS/SQL injection
---
## What Claude Should Help With
- Generating frontend components (React)
- Writing backend endpoints
- Designing database schemas
- Suggesting API structures
- Improving UX and copy
- Debugging code
---
## Constraints
- Code should be modular and maintainable
- Prefer simple solutions over complex ones
- Avoid unnecessary dependencies
---
## Nice-to-Have Features
- Save favorite listings
- Email notifications
- Advanced search (map-based search)
- Multi-language support
---
## Out of Scope (for now)
- Payments
- User accounts for buyers
- Mobile apps
## Local Server 
- **Always server on localhost**