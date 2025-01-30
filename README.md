# Railway Management System API

A Node.js based railway management system API that allows users to book train tickets and administrators to manage trains and seats.

## Features

- User authentication (register/login)
- Admin operations (add trains, update seats)
- Train availability check
- Seat booking with race condition handling
- Booking details retrieval
- Role-based access control
- Rate limiting
- Security features

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your configuration:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=railway_db
   JWT_SECRET=your_jwt_secret
   ADMIN_API_KEY=your_admin_api_key
   ```
4. Set up the database:
   - Create a new MySQL database
   - Import the schema from `src/db/schema.sql`

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Trains (Admin only)
- POST `/api/trains` - Add a new train
- PUT `/api/trains/:trainId/seats` - Update train seats

### Trains (Users)
- GET `/api/trains` - Get all trains
- GET `/api/trains/availability` - Check seat availability

### Bookings (Users)
- POST `/api/bookings` - Book a seat
- GET `/api/bookings/:bookingId` - Get booking details

## Security Features

1. JWT-based authentication
2. Admin API key protection
3. Rate limiting
4. Request validation
5. SQL injection protection
6. XSS protection via Helmet

## Race Condition Handling

The booking system uses database transactions and row-level locking to prevent race conditions when multiple users try to book seats simultaneously. This ensures that:

1. Seat availability is checked with a lock
2. Only one booking can be processed at a time for the same train
3. Seat count is updated atomically
4. Transactions are rolled back if any step fails

## Assumptions

1. A user can only view their own booking details
2. Seats are not assigned specific numbers, only total availability is tracked
3. Cancellation feature is not implemented
4. One user can make multiple bookings
5. Admin users are created directly in the database
6. All trains are direct routes (no intermediate stations)

## Error Handling

The API includes comprehensive error handling for:
- Invalid requests
- Authentication failures
- Database errors
- Concurrent booking conflicts
- Resource not found errors