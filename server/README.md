# Wander BD Server

Backend server for Wander BD - A tour and travel booking platform.

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
  - [Troubleshooting](#troubleshooting)
- [API Endpoints](#api-endpoints)
  - [Users](#users)
  - [Packages](#packages)
  - [Bookings](#bookings)
  - [Stories](#stories)
  - [Tour Guides](#tour-guides)
  - [Applications](#applications)
  - [Payments](#payments)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [License](#license)

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/
│   │   ├── application.controller.js    # Tour guide applications logic
│   │   ├── booking.controller.js        # Booking management logic
│   │   ├── package.controller.js        # Tour package logic
│   │   ├── payment.controller.js        # Payment processing logic
│   │   ├── story.controller.js          # User stories logic
│   │   ├── tourGuide.controller.js      # Tour guide logic
│   │   └── user.controller.js           # User management logic
│   ├── routes/
│   │   ├── application.routes.js
│   │   ├── booking.routes.js
│   │   ├── package.routes.js
│   │   ├── payment.routes.js
│   │   ├── story.routes.js
│   │   ├── tourGuide.routes.js
│   │   ├── user.routes.js
│   │   └── index.js             # Route aggregator
│   ├── middlewares/
│   │   ├── cors.middleware.js   # CORS configuration
│   │   └── errorHandler.middleware.js
│   └── app.js                   # Express app configuration
├── server.js                    # Server entry point
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Stripe** - Payment processing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **MongoDB Atlas account** - [Sign up here](https://www.mongodb.com/cloud/atlas) or use local MongoDB
- **Stripe account** - [Sign up here](https://stripe.com/) for payment processing
- **Git** - For version control

### Installation

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd server
```

#### Step 2: Install Dependencies
```bash
npm install
```

If you encounter permission errors, try:
```bash
npm install --legacy-peer-deps
```

#### Step 3: Set Up MongoDB

1. **Create MongoDB Atlas Cluster** (if not using local MongoDB):
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier available)
   - Create a database user with username and password
   - Whitelist your IP address or use `0.0.0.0/0` for development
   - Get your connection string

2. **Create Database**:
   - Database name: `wanderBD`
   - Collections will be created automatically when the server starts

#### Step 4: Set Up Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your **Secret Key** from Developers > API keys
3. Save the secret key for the next step

#### Step 5: Configure Environment Variables

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# MongoDB Configuration
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
```

**Important Notes**:
- Replace `your_mongodb_username` with your MongoDB Atlas username
- Replace `your_mongodb_password` with your MongoDB Atlas password
- Replace `your_stripe_secret_key` with your Stripe secret key
- Ensure there are no spaces around the `=` sign
- Don't commit `.env` to version control (already in .gitignore)

#### Step 6: Verify Setup

Test your MongoDB connection:
```bash
npm run dev
```

You should see:
```
✓ Successfully connected to MongoDB!
✓ Server is listening on port 5000
```

### Running the Server

**Development mode** (with auto-reload using nodemon):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

**Test the server**:
```bash
curl http://localhost:5000
# Should return: "server is running"
```

### Troubleshooting

#### MongoDB Connection Issues

**Error**: `MongoServerError: bad auth`
- **Solution**: Check your `DB_USER` and `DB_PASS` in `.env` file
- Ensure the user exists in MongoDB Atlas with correct permissions

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`
- **Solution**: Check your IP whitelist in MongoDB Atlas
- Add `0.0.0.0/0` to whitelist for development
- Verify your internet connection

#### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`
- **Solution**: Kill the process using port 5000:
  ```bash
  # On Linux/Mac
  lsof -ti:5000 | xargs kill -9

  # On Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```
- Or change the `PORT` in `.env` file

#### Stripe Issues

**Error**: `Invalid API Key provided`
- **Solution**: Verify your `STRIPE_SECRET_KEY` in `.env`
- Ensure you're using the secret key (starts with `sk_`), not the publishable key

#### Module Not Found

**Error**: `Cannot find module 'express'`
- **Solution**: Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## API Endpoints

### Users

#### Add or Update User
```http
PUT /users/:email
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "photoURL": "https://example.com/photo.jpg",
  "role": "tourist"
}
```

**Response**:
```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

#### Get User by Email
```http
GET /users/:email
```

**Response**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "photoURL": "https://example.com/photo.jpg",
  "role": "tourist"
}
```

#### Get All Users (with filters)
```http
GET /users?role=tourGuide&search=john
```

**Query Parameters**:
- `role` (optional): Filter by user role (`tourist`, `tourGuide`, `admin`)
- `search` (optional): Search by name or email

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tourGuide"
  }
]
```

#### Delete User
```http
DELETE /users/:id
```

**Response**:
```json
{
  "message": "User deleted successfully"
}
```

---

### Packages

#### Get All Packages
```http
GET /packages
```

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Cox's Bazar Beach Tour",
    "description": "3-day beach tour package",
    "price": 15000,
    "duration": "3 days",
    "location": "Cox's Bazar",
    "images": ["url1.jpg", "url2.jpg"],
    "tourType": "beach",
    "maxGroupSize": 15
  }
]
```

#### Get Package by ID
```http
GET /packages/:id
```

**Response**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Cox's Bazar Beach Tour",
  "description": "3-day beach tour package",
  "price": 15000,
  "duration": "3 days",
  "location": "Cox's Bazar",
  "images": ["url1.jpg", "url2.jpg"],
  "tourType": "beach",
  "maxGroupSize": 15
}
```

#### Add New Package
```http
POST /packages
```

**Request Body**:
```json
{
  "title": "Sundarbans Adventure",
  "description": "Wildlife tour in the mangrove forest",
  "price": 20000,
  "duration": "2 days",
  "location": "Sundarbans",
  "images": ["image1.jpg", "image2.jpg"],
  "tourType": "adventure",
  "maxGroupSize": 10
}
```

**Response**:
```json
{
  "acknowledged": true,
  "insertedId": "507f1f77bcf86cd799439012"
}
```

---

### Bookings

#### Create New Booking
```http
POST /bookings
```

**Request Body**:
```json
{
  "packageId": "507f1f77bcf86cd799439011",
  "packageTitle": "Cox's Bazar Beach Tour",
  "touristEmail": "tourist@example.com",
  "touristName": "John Doe",
  "tourGuideEmail": "guide@example.com",
  "tourGuideName": "Jane Guide",
  "tourDate": "2025-12-15",
  "price": 15000,
  "numberOfPeople": 2
}
```

**Response**:
```json
{
  "acknowledged": true,
  "insertedId": "507f1f77bcf86cd799439013"
}
```

#### Get Bookings by Tourist Email
```http
GET /bookings?email=tourist@example.com
```

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "packageId": "507f1f77bcf86cd799439011",
    "packageTitle": "Cox's Bazar Beach Tour",
    "touristEmail": "tourist@example.com",
    "tourDate": "2025-12-15",
    "status": "Pending",
    "price": 15000
  }
]
```

#### Get Bookings by Guide Email
```http
GET /bookings/guide/:email
```

#### Get Booking by ID
```http
GET /bookings/:id
```

#### Update Booking Status
```http
PATCH /bookings/:id
```

**Request Body**:
```json
{
  "status": "Accepted"
}
```

**Possible Status Values**: `Pending`, `In Review`, `Accepted`, `Rejected`

**Response**:
```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "matchedCount": 1
}
```

---

### Stories

#### Create New Story
```http
POST /stories
```

**Request Body**:
```json
{
  "title": "My Amazing Trip to Sylhet",
  "text": "It was an incredible experience exploring the tea gardens...",
  "authorEmail": "john@example.com",
  "authorName": "John Doe",
  "authorPhoto": "https://example.com/photo.jpg",
  "images": ["img1.jpg", "img2.jpg"],
  "location": "Sylhet"
}
```

**Response**:
```json
{
  "acknowledged": true,
  "insertedId": "507f1f77bcf86cd799439014"
}
```

#### Get All Stories (or filter by email)
```http
GET /stories
GET /stories?email=john@example.com
```

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "title": "My Amazing Trip to Sylhet",
    "text": "It was an incredible experience...",
    "authorEmail": "john@example.com",
    "authorName": "John Doe",
    "images": ["img1.jpg", "img2.jpg"],
    "location": "Sylhet"
  }
]
```

#### Get Story by ID
```http
GET /stories/:id
```

#### Update Story
```http
PUT /stories/:id
```

**Request Body**:
```json
{
  "title": "Updated Title",
  "text": "Updated content...",
  "newImages": ["newimg1.jpg"]
}
```

#### Remove Image from Story
```http
PUT /stories/:id/remove-image
```

**Request Body**:
```json
{
  "image": "img1.jpg"
}
```

#### Delete Story
```http
DELETE /stories/:id
```

---

### Tour Guides

#### Get All Tour Guides
```http
GET /tour-guides
```

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Jane Guide",
    "email": "guide@example.com",
    "photoURL": "https://example.com/guide.jpg",
    "title": "Professional Tour Guide",
    "experience": "5 years",
    "languages": ["English", "Bengali", "Hindi"],
    "specialty": "Historical Tours",
    "cvLink": "https://example.com/cv.pdf",
    "joinedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

#### Get Tour Guide by ID
```http
GET /tour-guides/:id
```

---

### Applications

#### Submit Tour Guide Application
```http
POST /applications
```

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "photoURL": "https://example.com/jane.jpg",
  "title": "Experienced Tour Guide",
  "reason": "I love showing people around Bangladesh",
  "experience": "5 years in tourism",
  "languages": ["English", "Bengali"],
  "specialty": "Cultural and Historical Tours",
  "cvLink": "https://example.com/cv.pdf"
}
```

**Response**:
```json
{
  "acknowledged": true,
  "insertedId": "507f1f77bcf86cd799439016"
}
```

#### Get All Applications
```http
GET /applications
```

#### Accept Application
```http
PATCH /applications/:id/accept
```

**Response**:
```json
{
  "message": "Application accepted, user role updated, and tour guide created.",
  "tourGuideId": "507f1f77bcf86cd799439017"
}
```

**Note**: This endpoint automatically:
1. Updates the user's role to "tourGuide"
2. Creates a tour guide profile
3. Deletes the application

#### Delete Application (Reject)
```http
DELETE /applications/:id
```

---

### Payments

#### Create Payment Intent
```http
POST /create-payment-intent
```

**Request Body**:
```json
{
  "price": 15000
}
```

**Response**:
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

#### Save Payment
```http
POST /payments
```

**Request Body**:
```json
{
  "bookingId": "507f1f77bcf86cd799439013",
  "transactionId": "txn_123456789",
  "amount": 15000,
  "email": "tourist@example.com",
  "date": "2025-11-25T10:30:00.000Z"
}
```

**Response**:
```json
{
  "insertedId": "507f1f77bcf86cd799439018",
  "updated": 1
}
```

**Note**: This endpoint automatically updates the booking status to "In Review"

## Database Schema

Database Name: `wanderBD`

### Collections

#### 1. `users`
Stores user account information.

```javascript
{
  _id: ObjectId,
  name: String,              // User's full name
  email: String,             // Unique email address
  photoURL: String,          // Profile photo URL
  role: String               // "tourist", "tourGuide", or "admin"
}
```

**Indexes**:
- `email` (unique)

---

#### 2. `packages`
Tour package listings.

```javascript
{
  _id: ObjectId,
  title: String,             // Package title
  description: String,       // Detailed description
  price: Number,             // Price in BDT
  duration: String,          // e.g., "3 days", "1 week"
  location: String,          // Destination location
  images: [String],          // Array of image URLs
  tourType: String,          // e.g., "beach", "adventure", "cultural"
  maxGroupSize: Number,      // Maximum number of participants
  inclusions: [String],      // Optional: What's included
  exclusions: [String],      // Optional: What's not included
  itinerary: [Object],       // Optional: Day-by-day plan
  createdAt: Date            // Optional: Creation timestamp
}
```

**Example**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Cox's Bazar Beach Tour",
  "description": "3-day relaxing beach tour",
  "price": 15000,
  "duration": "3 days",
  "location": "Cox's Bazar",
  "images": ["beach1.jpg", "beach2.jpg"],
  "tourType": "beach",
  "maxGroupSize": 15
}
```

---

#### 3. `bookings`
Tour booking records.

```javascript
{
  _id: ObjectId,
  packageId: String,         // Reference to package
  packageTitle: String,      // Package name (denormalized)
  touristEmail: String,      // Tourist's email
  touristName: String,       // Tourist's name
  tourGuideEmail: String,    // Assigned tour guide email
  tourGuideName: String,     // Tour guide name
  tourDate: String,          // Date of tour (ISO format)
  price: Number,             // Total price
  numberOfPeople: Number,    // Number of participants
  status: String,            // "Pending", "In Review", "Accepted", "Rejected"
  transactionId: String,     // Payment transaction ID (after payment)
  createdAt: Date,           // Booking creation time
  updatedAt: Date            // Last update time
}
```

**Status Flow**:
1. `Pending` → Initial state after booking creation
2. `In Review` → After payment is completed
3. `Accepted` → Tour guide accepts the booking
4. `Rejected` → Tour guide rejects the booking

**Indexes**:
- `touristEmail`
- `tourGuideEmail`
- `status`

---

#### 4. `stories`
User-generated travel stories.

```javascript
{
  _id: ObjectId,
  title: String,             // Story title
  text: String,              // Story content
  authorEmail: String,       // Author's email
  authorName: String,        // Author's name
  authorPhoto: String,       // Author's photo URL
  images: [String],          // Array of story image URLs
  location: String,          // Location of the story
  createdAt: Date,           // Creation timestamp
  updatedAt: Date,           // Last update timestamp
  likes: Number,             // Optional: Number of likes
  views: Number              // Optional: Number of views
}
```

**Example**:
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "title": "My Amazing Trip to Sylhet",
  "text": "The tea gardens were breathtaking...",
  "authorEmail": "john@example.com",
  "authorName": "John Doe",
  "authorPhoto": "photo.jpg",
  "images": ["sylhet1.jpg", "sylhet2.jpg"],
  "location": "Sylhet"
}
```

**Indexes**:
- `authorEmail`
- `location`

---

#### 5. `tourGuides`
Approved tour guide profiles.

```javascript
{
  _id: ObjectId,
  name: String,              // Guide's full name
  email: String,             // Unique email address
  photoURL: String,          // Profile photo URL
  title: String,             // Professional title
  reason: String,            // Reason for being a guide
  experience: String,        // Years/description of experience
  languages: [String],       // Languages spoken
  specialty: String,         // Tour specialty/niche
  cvLink: String,            // CV/Resume URL
  joinedAt: Date,            // Date approved as tour guide
  rating: Number,            // Optional: Average rating
  totalTours: Number         // Optional: Number of tours completed
}
```

**Example**:
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "name": "Jane Guide",
  "email": "guide@example.com",
  "title": "Professional Tour Guide",
  "experience": "5 years",
  "languages": ["English", "Bengali", "Hindi"],
  "specialty": "Historical Tours",
  "joinedAt": "2024-01-15T00:00:00.000Z"
}
```

**Indexes**:
- `email` (unique)
- `specialty`

---

#### 6. `guideApplications`
Pending tour guide applications.

```javascript
{
  _id: ObjectId,
  name: String,              // Applicant's name
  email: String,             // Applicant's email
  photoURL: String,          // Photo URL
  title: String,             // Desired professional title
  reason: String,            // Why they want to be a guide
  experience: String,        // Experience description
  languages: [String],       // Languages spoken
  specialty: String,         // Tour specialty
  cvLink: String,            // CV URL
  appliedAt: Date,           // Application submission date
  status: String             // "Pending", "Accepted", "Rejected"
}
```

**Note**: When an application is accepted:
1. A new document is created in `tourGuides` collection
2. The user's role in `users` collection is updated to "tourGuide"
3. The application is deleted from `guideApplications`

**Indexes**:
- `email`
- `status`

---

#### 7. `payments`
Payment transaction records.

```javascript
{
  _id: ObjectId,
  bookingId: String,         // Reference to booking
  transactionId: String,     // Stripe transaction ID
  amount: Number,            // Payment amount in BDT
  email: String,             // Payer's email
  date: Date,                // Payment date
  status: String,            // "success", "pending", "failed"
  paymentMethod: String,     // "card", "mobile banking", etc.
  currency: String           // "BDT"
}
```

**Example**:
```json
{
  "_id": "507f1f77bcf86cd799439018",
  "bookingId": "507f1f77bcf86cd799439013",
  "transactionId": "txn_123456789",
  "amount": 15000,
  "email": "tourist@example.com",
  "date": "2025-11-25T10:30:00.000Z",
  "status": "success",
  "currency": "BDT"
}
```

**Indexes**:
- `bookingId`
- `email`
- `transactionId` (unique)

---

### Database Relationships

```
users (role: "tourist")
  └─→ bookings (touristEmail)
        ├─→ packages (packageId)
        └─→ payments (bookingId)

users (role: "tourGuide")
  ├─→ tourGuides (email)
  └─→ bookings (tourGuideEmail)

users
  └─→ stories (authorEmail)

guideApplications
  └─→ users (email) → becomes tourGuides when accepted
```

### Indexing Strategy

For optimal performance, create these indexes:

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });

// Bookings
db.bookings.createIndex({ touristEmail: 1 });
db.bookings.createIndex({ tourGuideEmail: 1 });
db.bookings.createIndex({ status: 1 });

// Stories
db.stories.createIndex({ authorEmail: 1 });

// Tour Guides
db.tourGuides.createIndex({ email: 1 }, { unique: true });

// Payments
db.payments.createIndex({ bookingId: 1 });
db.payments.createIndex({ transactionId: 1 }, { unique: true });
```

## Environment Variables

See `.env.example` for required environment variables.

## Development

The codebase follows the MVC (Model-View-Controller) pattern with clear separation of concerns:

- **Controllers**: Handle business logic
- **Routes**: Define API endpoints and map to controllers
- **Middlewares**: Handle cross-cutting concerns (CORS, error handling)
- **Config**: Centralize configuration (database connection)

## License

ISC
