# GuyGuy Authentication Flow Test

## API Endpoints

### Public Authentication Routes
- `POST /api/v1/auth/signup` - Create new account with role
- `POST /api/v1/auth/login` - Login and get JWT with dashboard URL
- `POST /api/v1/auth/verify-email` - Email verification (handled by Supabase)

### Protected Authentication Routes (JWT Required)
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `GET /api/v1/auth/client/dashboard` - Client dashboard data
- `GET /api/v1/auth/artisan/dashboard` - Artisan dashboard data

## Request/Response Examples

### 1. Signup (Client)
```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "phone": "+233123456789",
    "role": "client"
  }'
```

**Response:**
```json
{
  "message": "Account created successfully. Please check your email to verify your account.",
  "email": "client@example.com",
  "role": "client",
  "user_id": "uuid-here",
  "next_step": "Verify your email through the link sent to your inbox"
}
```

### 2. Signup (Artisan)
```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "artisan@example.com",
    "password": "password123",
    "full_name": "Jane Smith",
    "phone": "+233123456788",
    "role": "artisan"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "access_token": "mock_jwt_token_uuid-here",
  "refresh_token": "mock_refresh_token_uuid-here",
  "user": {
    "id": "uuid-here",
    "email": "client@example.com",
    "full_name": "John Doe",
    "phone": "+233123456789",
    "role": "client",
    "avatar_url": null
  },
  "dashboard_url": "/client/dashboard",
  "expires_in": 3600,
  "note": "Using mock authentication - integrate with Supabase Auth in production"
}
```

### 4. Access Client Dashboard
```bash
curl -X GET http://localhost:8080/api/v1/auth/client/dashboard \
  -H "Authorization: Bearer mock_jwt_token_uuid-here"
```

**Response:**
```json
{
  "message": "Welcome to your client dashboard",
  "user": {
    "id": "uuid-here",
    "full_name": "John Doe",
    "email": "client@example.com",
    "phone": "+233123456789",
    "avatar_url": null
  },
  "dashboard_type": "client",
  "features": [
    "Browse Artisans",
    "Create Bookings",
    "View Bookings",
    "Make Payments",
    "Leave Reviews",
    "Chat with Artisans"
  ]
}
```

### 5. Access Artisan Dashboard
```bash
curl -X GET http://localhost:8080/api/v1/auth/artisan/dashboard \
  -H "Authorization: Bearer mock_jwt_token_uuid-here"
```

**Response:**
```json
{
  "message": "Welcome to your artisan dashboard",
  "user": {
    "id": "uuid-here",
    "full_name": "Jane Smith",
    "email": "artisan@example.com",
    "phone": "+233123456788",
    "avatar_url": null
  },
  "dashboard_type": "artisan",
  "features": [
    "Manage Profile",
    "View Bookings",
    "Manage Availability",
    "Receive Payments",
    "View Reviews",
    "Chat with Clients"
  ]
}
```

## Authentication Flow

1. **User Signup**: User selects role (client/artisan) and provides email, password, name, phone
2. **Email Verification**: Supabase sends verification email (using built-in templates)
3. **Login**: User provides credentials and receives JWT with role-based dashboard URL
4. **Dashboard Access**: User is routed to appropriate dashboard based on role
5. **Protected Routes**: All dashboard and profile endpoints require valid JWT

## Role-Based Features

### Client Dashboard Features:
- Browse Artisans
- Create Bookings
- View Bookings
- Make Payments
- Leave Reviews
- Chat with Artisans

### Artisan Dashboard Features:
- Manage Profile
- View Bookings
- Manage Availability
- Receive Payments
- View Reviews
- Chat with Clients

## Integration Notes

- **Supabase Auth**: Email verification handled by Supabase built-in templates
- **JWT Validation**: Middleware validates tokens and extracts user role
- **Role-Based Routing**: Dashboard URLs determined by user role
- **Database Sync**: User data stored in PostgreSQL with role information

## Production Setup

1. Configure Supabase project with email templates
2. Set environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET)
3. Replace mock authentication with actual Supabase Auth API calls
4. Configure email templates in Supabase dashboard
5. Set up proper JWT token generation and validation
