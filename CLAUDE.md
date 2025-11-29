# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wander BD is a full-stack Bangladesh tourism platform with three user roles (Tourist, Tour Guide, Admin) that handles tour package browsing, bookings, payments via Stripe, and community story sharing.

## Development Commands

### Frontend (client/)
```bash
cd client
npm run dev      # Start dev server on http://localhost:5173
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend (server/)
```bash
cd server
npm run dev      # Start dev server with nodemon on http://localhost:5000
npm start        # Start production server
```

## Architecture Overview

### Backend Structure (MVC Pattern)
- **Entry point**: `server/server.js` → loads `src/app.js` → connects to MongoDB
- **Database**: Single MongoDB connection initialized in `src/config/database.js`, exports `getCollections()` for accessing 7 collections (users, packages, bookings, stories, guideApplications, tourGuides, payments)
- **Controllers**: Business logic in `src/controllers/*.controller.js` (user, package, booking, story, tourGuide, application, payment)
- **Routes**: API routes in `src/routes/*.routes.js`, registered in `src/routes/index.js`
- **Middleware**: CORS and error handling in `src/middlewares/`
- **No ORM/ODM**: Direct MongoDB driver usage throughout

### Frontend Structure (React + Vite)
- **Authentication**: Firebase Auth (`client/src/firebase/firebase.init.js`) combined with role fetching from MongoDB backend
- **Auth Flow**: `AuthProvider.jsx` fetches user role from `/users/:email` endpoint on Firebase auth state change, stores in context
- **Protected Routes**: Three route guards in `src/routes/` - `PrivateRoute` (any authenticated user), `AdminRoute` (admin only), `TourGuideRoute` (tour guide only)
- **HTTP Client**: `useAxiosSecure` hook configures axios with `VITE_API_URL` env variable (falls back to localhost:5000)
- **State Management**: React Context for auth, React Query (@tanstack/react-query) for server state
- **Routing**: React Router v7 with three layouts - `RootLayout` (public), `AuthLayout` (login/register), `DashboardLayout` (authenticated)

### Key Architectural Patterns

**Role-Based Access Control (RBAC)**:
- User roles stored in MongoDB `users` collection
- Frontend fetches role on login and stores in AuthContext
- Three role types: "tourist" (default), "tour-guide", "admin"
- Route protection uses role from context to conditionally render or redirect

**Backend API Patterns**:
- Controllers use `getCollections()` to access DB collections
- Standard pattern: `const { collectionName } = getCollections();`
- Error handling in each controller function with try/catch
- Global error handler middleware as last middleware in app.js

**Frontend Data Fetching**:
- `useAxiosSecure` creates axios instance with configurable base URL
- Environment variable `VITE_API_URL` used across multiple components for backend URL
- React Query used for caching and state management of server data

**Payment Flow**:
- Stripe integration on both client and server
- Client uses `@stripe/react-stripe-js` and `@stripe/stripe-js`
- Server creates payment intent via `/create-payment-intent` endpoint
- After successful payment, booking status updated automatically via `/payments` POST endpoint

## Environment Variables

### Client (.env.local)
```
VITE_API_URL=http://localhost:5000        # Backend URL
VITE_apiKey=                              # Firebase API key
VITE_authDomain=                          # Firebase auth domain
VITE_projectId=                           # Firebase project ID
VITE_storageBucket=                       # Firebase storage bucket
VITE_messagingSenderId=                   # Firebase messaging sender ID
VITE_appId=                               # Firebase app ID
VITE_IMAGE_HOSTING_KEY=                   # ImgBB API key for image uploads
VITE_STRIPE_PUBLIC_KEY=                   # Stripe publishable key
```

### Server (.env)
```
PORT=5000                                 # Server port (optional, defaults to 5000)
NODE_ENV=development                      # Environment
CLIENT_URL=http://localhost:5173          # Frontend URL for CORS
DB_USER=                                  # MongoDB Atlas username
DB_PASS=                                  # MongoDB Atlas password
STRIPE_SECRET_KEY=                        # Stripe secret key
```

## Database Schema

**MongoDB Collections** (wanderBD database):
- `users`: User accounts with `role` field ("tourist" | "tour-guide" | "admin")
- `packages`: Tour packages with pricing, images, descriptions
- `bookings`: Tour bookings linking tourists, packages, and guides; `status` field tracks state
- `stories`: Community travel stories with multi-image support
- `guideApplications`: Pending tour guide applications (deleted on rejection, moved to tourGuides on acceptance)
- `tourGuides`: Approved tour guide profiles
- `payments`: Payment transaction records linked to bookings

**Important Fields**:
- Bookings: `touristEmail`, `tourGuideEmail`, `status` ("Pending", "In Review", "Confirmed", etc.)
- Users: `email` (unique identifier), `role`
- Payments: linked to booking via `bookingId`

## Common Development Tasks

### Adding New API Endpoint
1. Create controller function in `server/src/controllers/{resource}.controller.js`
2. Add route in `server/src/routes/{resource}.routes.js`
3. Ensure route is registered in `server/src/routes/index.js`

### Adding Protected Route
1. Create page component in `client/src/pages/`
2. Add route to `client/src/router/router.jsx`
3. Wrap with appropriate route guard: `<PrivateRoute>`, `<AdminRoute>`, or `<TourGuideRoute>`

### Working with MongoDB
- Always use `getCollections()` from `src/config/database.js`
- Use `ObjectId` from 'mongodb' for ID operations: `new ObjectId(id)`
- Collections are accessed as properties: `const { usersCollection } = getCollections();`

### Authentication State
- Access current user via `useAuth()` hook (returns `{ user, loading, logout }`)
- User object includes: `uid`, `email`, `displayName`, `photoURL`, `role`
- Check role with: `if (user?.role === "admin")`
- server is runing. you don't need to run the server