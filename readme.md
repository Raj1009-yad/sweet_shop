SweetShop — Full-Stack MERN Application
=======================================

A complete sweet-shop application built using the MERN stack with:

- React (Vite) frontend
- Node.js + Express backend
- MongoDB Atlas database
- JWT authentication
- Admin dashboard
- Stock control (purchase & restock)
- Search, filtering, cart functionality

---------------------------------------
PROJECT STRUCTURE
---------------------------------------

/
├── sweetshop-backend/     (Express API)
├── sweetshop-frontend/    (React + Vite UI)
└── README.md

---------------------------------------
FEATURES
---------------------------------------

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
- Stock decreases on purchase
- Cart total & quantity calculations

ADMIN FEATURES:
- Create sweet
- Edit sweet
- Delete sweet
- Restock sweet
- Atomic stock updates with MongoDB
- Admin-only UI controls

TECH FEATURES:
- Axios client with JWT interceptors
- MongoDB atomic $inc operations
- REST API layered architecture
- Fully responsive UI
- Environment variables via Vite (frontend) and dotenv (backend)

---------------------------------------
INSTALLATION & SETUP
---------------------------------------

STEP 1 — Clone the repository
-----------------------------
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

---------------------------------------
BACKEND SETUP (sweetshop-backend)
---------------------------------------

1. Install dependencies:
   cd sweetshop-backend
   npm install

2. Create .env (DO NOT commit this file):
   MONGO_URI=your_mongo_atlas_uri
   JWT_SECRET=your_secret_key
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=Admin@12345
   FRONTEND_URL=http://localhost:5173

3. Start backend:
   npm run dev

Backend URL:
http://localhost:4000

---------------------------------------
FRONTEND SETUP (sweetshop-frontend)
---------------------------------------

1. Install dependencies:
   cd sweetshop-frontend
   npm install

2. Create .env file:
   VITE_API_URL=http://localhost:4000/api

3. Start frontend:
   npm run dev

Open frontend:
http://localhost:5173

---------------------------------------
API ENDPOINTS
---------------------------------------

AUTH:
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

SWEETS:
GET /api/sweets
GET /api/sweets/search?q=...&category=...
POST /api/sweets               (admin)
PUT /api/sweets/:id            (admin)
DELETE /api/sweets/:id         (admin)
POST /api/sweets/:id/purchase  (customer)
POST /api/sweets/:id/restock   (admin)

---------------------------------------
MIGRATION: quantity → stock
---------------------------------------

If your old DB had a "quantity" field, convert it using:

node scripts/migrateQuantityToStock.js

---------------------------------------
NPM SCRIPTS
---------------------------------------

Backend:
- npm run dev
- npm start
- npm run build

Frontend:
- npm run dev
- npm run build
- npm run preview

---------------------------------------
GITIGNORE IMPORTANT
---------------------------------------

Your .gitignore MUST include:

node_modules/
.env
.env.*
*/.env
/.env.
dist/
build/

This prevents .env from being pushed to GitHub.

---------------------------------------
DEPLOYMENT (Render)
---------------------------------------

BACKEND (Render Web Service):
--------------------------------
Build Command:   npm install
Start Command:   npm start

Environment Variables:
PORT=10000
MONGO_URI=your_atlas_string
JWT_SECRET=your_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@12345
FRONTEND_URL=https://yourfrontend.onrender.com

FRONTEND (Render Static Site):
--------------------------------
Build Command:     npm install && npm run build
Publish Directory: dist

Environment Variables:
VITE_API_URL=https://your-backend.onrender.com/api

---------------------------------------
DEFAULT ADMIN LOGIN
---------------------------------------

Email:    admin@example.com  
Password: Admin@12345  
(Set in backend .env)

---------------------------------------
AI USAGE IN THIS PROJECT
---------------------------------------

This project was built with continuous assistance from AI (ChatGPT) in multiple phases of development.

AI was used ONLY for engineering support purposes:

1. TEST CASE DESIGN
   - Generated structured test cases
   - Helped with input validation tests
   - Helped design realistic user flows

2. EDGE CASE DISCOVERY
   - Prevented negative stock
   - Fixed stock becoming “Infinity”
   - Identified role mismatch issues
   - Prevented REST endpoints from silently failing
   - Helped with optimistic UI update problems

3. BRAINSTORMING FUNCTIONALITIES
   - Admin permission logic
   - Stock control behavior
   - Token decoding recovery logic
   - Perfecting database update patterns

4. DEBUGGING SUPPORT
   - Fixed Axios misconfigurations
   - Fixed TypeScript build issues during deployment
   - Helped resolve mismatched field names (quantity vs stock)
   - Helped debug MongoDB, Express route issues, and CORS

5. REFACTORING / CLEANUP
   - Cleaner client.ts Axios instance
   - Removal of unused imports
   - Proper folder structure and layering
   - More robust admin-only UI checks

This demonstrates transparent academic and engineering use of AI.

---------------------------------------
DETAILED TEST CASES
---------------------------------------

TEST CASE 1 — Register a new user
---------------------------------------
Purpose: Verify user registration works.

Steps:
1. Open /register
2. Enter user details
3. Click Register

Expected:
- JWT returned
- User stored in localStorage
- Redirect to Home

TEST CASE 2 — Login as Admin
---------------------------------------
Steps:
1. Open /login
2. Enter admin@example.com / Admin@12345
3. Click Login

Expected:
- Role = admin
- Admin dashboard unlocked

TEST CASE 3 — Create a new sweet (Admin)
---------------------------------------
Steps:
1. Login as Admin
2. Go to /admin
3. Create sweet

Expected:
- Sweet appears in list
- Toast: Created

TEST CASE 4 — Edit sweet
---------------------------------------
Steps:
1. Click Edit on a sweet
2. Modify fields
3. Save

Expected:
- Sweet updates instantly

TEST CASE 5 — Purchase sweet (Stock decreases)
---------------------------------------
Steps:
1. Buy a sweet
2. Refresh list

Expected:
- Stock decreased by 1
- No Infinity or negative values

TEST CASE 6 — Restock sweet (Admin)
---------------------------------------
Steps:
1. Restock 10 units

Expected:
- Stock increased correctly

TEST CASE 7 — Delete sweet
---------------------------------------
Expected:
- Item removed
- Toast: Deleted

TEST CASE 8 — Search filter
---------------------------------------
Expected:
- Debounced search returns correct matches

TEST CASE 9 — Token Recovery
---------------------------------------
Expected:
- If user removed but token exists → decodeToken restores user

TEST CASE 10 — Unauthorized API Call
---------------------------------------
Expected:
- 401 “no token”

---------------------------------------
LICENSE
---------------------------------------

MIT License

---------------------------------------
AUTHOR
---------------------------------------

Created as a full-stack MERN project with admin features, sweet shop logic, and AI-assisted development through ChatGPT.
