# Wander BD

A comprehensive Bangladesh tourism and tour booking platform that connects tourists with tour guides and facilitates seamless tour package booking and payment processing.

## Overview

Wander BD is a full-stack web application designed to promote tourism in Bangladesh by providing a platform where tourists can discover tour packages, book tours, connect with tour guides, and share their travel experiences with a community of fellow travelers.

## Features

### User Management
- User authentication via Firebase (email/password and social login)
- Three user roles: Tourist, Tour Guide, and Admin
- User profile management and editing
- Role-based access control with protected routes

### Tour Package Management
- Browse all available tour packages
- View detailed package information with images and descriptions
- Search and filter tour packages
- Package creation and management (tour guides/admins)

### Booking System
- Create tour bookings with selected packages
- View complete booking history
- Track booking status (Pending, In Review, Confirmed, etc.)
- Cancel bookings before confirmation

### Payment Processing
- Secure payment integration with Stripe
- Create and manage payment intents
- Payment history tracking
- Automatic booking status updates after successful payment

### Tour Guide Features
- Application system to become a tour guide
- Manage assigned tours and bookings
- Create and maintain tour guide profiles
- Showcase specialties and experience

### Community & Stories
- Share travel experiences and stories
- Create, edit, and delete personal stories
- Multi-image support for stories
- Browse and share community content

### Interactive Map
- Coverage map displaying Bangladesh tourism areas
- Interactive Leaflet-based mapping system

### Role-Based Dashboards
- **Tourist Dashboard**: View bookings and payment history
- **Tour Guide Dashboard**: Manage assigned tours and profile
- **Admin Dashboard**: Manage users, approve guide applications, oversee platform

## Tech Stack

### Frontend
- **React 19.1.0** - UI library
- **Vite 7.0.4** - Build tool and development server
- **React Router 7.6.3** - Client-side routing
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **DaisyUI 5.0.46** - Component library
- **Material Tailwind React** - UI components
- **React Hook Form 7.60.0** - Form handling
- **React Query 5.83.0** - Data fetching and state management
- **Axios 1.10.0** - HTTP client
- **Firebase 11.10.0** - Authentication and Firestore
- **Stripe (React)** - Payment processing
- **React Leaflet 5.0.0** - Interactive maps
- **React Hot Toast** - Notifications
- **React Icons 5.5.0** - Icon library
- **SweetAlert2** - Modals and alerts

### Backend
- **Node.js & Express 5.1.0** - Server framework
- **MongoDB 6.18.0** - Database (MongoDB Atlas)
- **Stripe 18.3.0** - Payment processing
- **CORS 2.8.5** - Cross-origin resource sharing
- **Dotenv 17.2.1** - Environment configuration

## Project Structure

```
wander-bd/
├── client/                     # React frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   │   ├── Home/          # Home page sections
│   │   │   ├── Authentication/ # Login/Register
│   │   │   ├── Dashboard/     # User dashboards
│   │   │   ├── Community/     # Community stories
│   │   │   ├── AllTrips/      # Tour packages
│   │   │   └── ...
│   │   ├── components/        # Reusable components
│   │   ├── layouts/           # Layout wrappers
│   │   ├── router/            # Route configuration
│   │   ├── routes/            # Protected routes
│   │   ├── context/           # Auth context
│   │   ├── hooks/             # Custom React hooks
│   │   ├── firebase/          # Firebase config
│   │   └── assets/            # Static assets
│   ├── vite.config.js
│   └── package.json
│
└── server/                     # Express backend
    ├── index.js               # Main server file
    ├── .env                   # Environment variables
    └── package.json
```

## Database Schema

### Collections
- **users** - User accounts with roles and profile information
- **packages** - Tour packages with details and pricing
- **bookings** - User tour bookings and status
- **stories** - Community travel stories with images
- **guideApplications** - Pending tour guide applications
- **tourGuides** - Approved tour guide profiles
- **payments** - Payment transaction records

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase project
- Stripe account
- ImgBB account (for image uploads)

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the client directory:
```env
VITE_APIKEY=your_firebase_api_key
VITE_AUTHDOMAIN=your_firebase_auth_domain
VITE_PROJECTID=your_firebase_project_id
VITE_STORAGEBUCKET=your_firebase_storage_bucket
VITE_MESSAGINGSENDERID=your_firebase_messaging_sender_id
VITE_APPID=your_firebase_app_id
VITE_IMAGE_HOSTING_KEY=your_imgbb_api_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Start the development server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

## API Endpoints

### Users
- `PUT /users/:email` - Create or update user
- `GET /users/:email` - Get user by email
- `GET /users` - Get all users (with filters)
- `DELETE /users/:id` - Delete user

### Packages
- `GET /packages` - Get all tour packages
- `GET /packages/:id` - Get package details
- `POST /packages` - Create new package

### Guide Applications
- `POST /applications` - Submit tour guide application
- `GET /applications` - Get all applications
- `PATCH /applications/:id/accept` - Accept application
- `DELETE /applications/:id` - Reject application

### Tour Guides
- `GET /tour-guides` - Get all tour guides
- `GET /tour-guides/:id` - Get guide details

### Stories
- `POST /stories` - Create story
- `GET /stories` - Get all stories or by author
- `GET /stories/:id` - Get story details
- `PUT /stories/:id` - Update story
- `DELETE /stories/:id` - Delete story

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - Get user's bookings
- `GET /bookings/guide/:email` - Get guide's assigned bookings
- `PATCH /bookings/:id` - Update booking status
- `DELETE /bookings/:id` - Cancel booking

### Payments
- `POST /create-payment-intent` - Create Stripe payment intent
- `POST /payments` - Save payment and update booking

## User Roles & Permissions

### Tourist (Default)
- Browse tour packages
- Book tours
- Make payments
- Share stories
- View and edit profile

### Tour Guide
- All tourist permissions
- Manage assigned tour bookings
- Create tour packages
- Maintain tour guide profile

### Admin
- All permissions
- Manage users (view, delete, change roles)
- Approve/reject tour guide applications
- Full platform oversight

## Development Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

## Contributing

This is a university semester project (Software Development Project - SDP). Contributions are welcome through pull requests.
