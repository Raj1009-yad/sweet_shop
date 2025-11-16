SweetShop — Full-Stack MERN Application

A complete sweet-shop application built using the MERN stack with:

- React (Vite) frontend
- Node.js + Express backend
- MongoDB Atlas database
- JWT authentication
- Admin dashboard
- Stock control (purchase & restock)
- Search, filtering, cart functionality

---

## PROJECT STRUCTURE

/
├── sweetshop-backend/ Express API
├── sweetshop-frontend/ React + Vite UI
└── README.md

---

## FEATURES

AUTHENTICATION:

- User login and registration
- Admin login (from .env)
- JWT token authentication
- Protected admin routes

CUSTOMER FEATURES:

- Browse sweets
- Search sweets
- Filter by category/price
- Add to cart
- Stock automatically decreases on purchase

ADMIN FEATURES:

- Create sweet
- Edit sweet
- Delete sweet
- Restock sweet
- Atomic stock updates

TECH FEATURES:

- Axios client with JWT interceptors
- MongoDB atomic $inc operations
- REST API layered architecture
- Fully responsive UI
- Vite environment variables

---

## INSTALLATION & SETUP

## STEP 1 — Clone the repo

git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

---

## BACKEND SETUP (sweetshop-backend)

1. Install dependencies:
   cd sweetshop-backend
   npm install

2. Create .env (DO NOT commit this file):

3. Start backend:
   npm run dev

Backend runs at:
http://localhost:4000

---

## FRONTEND SETUP (sweetshop-frontend)

1. Install dependencies:
   cd sweetshop-frontend
   npm install

2. Create .env file:

VITE_API_URL=http://localhost:4000/api

3. Start frontend:
   npm run dev

Open:
http://localhost:5173

---

## API ENDPOINTS

AUTH:
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

SWEETS:
GET /api/sweets
GET /api/sweets/search?q=...&category=...
POST /api/sweets (admin)
PUT /api/sweets/:id (admin)
DELETE /api/sweets/:id (admin)
POST /api/sweets/:id/purchase (customer)
POST /api/sweets/:id/restock (admin)

---

## MIGRATION: quantity → stock (optional)

If old DB had "quantity", run:

node scripts/migrateQuantityToStock.js

---

## SCRIPTS

Backend:
npm run dev
npm start
npm run build

Frontend:
npm run dev
npm run build
npm run preview

---

## GITIGNORE IMPORTANT

Your .gitignore MUST include:

node*modules/
.env
.env.\*
*/.env
\_/.env.\*
dist/
build/

This prevents .env from being uploaded to GitHub.

---

## DEPLOYMENT (Render)

BACKEND (Render Web Service):

Build Command:
npm install

Start Command:
npm start

Environment variables:
PORT=10000
MONGO_URI=your_atlas_string
JWT_SECRET=your_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@12345
FRONTEND_URL=https://yourfrontend.onrender.com

FRONTEND (Render Static Site):

Build Command:
npm install && npm run build

Publish Directory:
dist

Environment variable:
VITE_API_URL=https://your-backend.onrender.com/api

---

## ADMIN LOGIN (DEFAULT)

Email: admin@example.com
Password: Admin@12345

These are defined in backend .env.

---


## LICENSE

MIT License

---

## AUTHOR

Made with love to demonstrate a clean MERN full-stack structure with admin functionality.
