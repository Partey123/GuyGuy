# Frontend Integration with Supabase Authentication

## 🎯 Current Status
✅ **Backend**: Complete authentication system using Supabase
✅ **Email Templates**: Beautiful, consistent design system
✅ **API Endpoints**: All authentication routes ready
❌ **Frontend**: Not yet integrated with Supabase auth

## 🔗 Frontend Integration Requirements

### 1. **Authentication Pages to Create**
The frontend needs these pages to match our backend:

#### **Email Verification Page**
- Route: `/verify-email` (matches our `verify-email.html` template)
- Features: OTP input, countdown timer, resend option
- Design: Use our design system (Jakarta/Montserrat fonts, yellow/blue-black colors)

#### **Login Page** 
- Route: `/login` (for existing users)
- Features: Email/password form, remember me, social login options
- Design: Consistent with verification page

#### **Signup Page**
- Route: `/signup` (new user registration)
- Features: Role selection (client/artisan), email/password, phone, terms
- Design: Match our app design system

#### **Dashboard Pages**
- Route: `/client/dashboard` (for client users)
- Route: `/artisan/dashboard` (for artisan users)
- Features: Role-specific functionality based on user type
- Design: Use our unified design system

### 2. **API Integration Points**
The frontend should connect to these backend endpoints:

```javascript
// Authentication API Base URL
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Public endpoints (no auth required)
POST ${API_BASE_URL}/auth/signup
POST ${API_BASE_URL}/auth/login  
POST ${API_BASE_URL}/auth/verify-email

// Protected endpoints (JWT required)
GET ${API_BASE_URL}/auth/profile
PUT ${API_BASE_URL}/auth/profile
GET ${API_BASE_URL}/auth/client/dashboard
GET ${API_BASE_URL}/auth/artisan/dashboard
```

### 3. **Supabase Client Integration**
Install Supabase JavaScript client in frontend:

```bash
npm install @supabase/supabase-js
```

```javascript
// Initialize Supabase client
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'your-project-url',
  'your-anon-key'
)
```

## 🎨 Design System Integration

### **Typography**
```css
/* Use our design system fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-sans: 'Plus Jakarta', 'Montserrat', sans-serif;
  --primary-yellow: #f59e0b;
  --blue-black: #64748b;
  --white: #ffffff;
}
```

### **Color Scheme**
```css
/* Match our backend design system */
:root {
  --primary-500: #f59e0b;  /* Main Yellow */
  --blueblack-500: #64748b;  /* Main Blue-Black */
  --background: #ffffff;     /* White */
}
```

## 📱 Frontend Implementation Steps

### **Step 1: Setup Supabase Client**
```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```

### **Step 2: Authentication Service**
```javascript
// lib/auth.js
import { supabase } from './supabase'

export const authService = {
  async signup(email, password, fullName, phone, role) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: role
        }
      }
    })
    
    if (error) throw error
    return data
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async verifyEmail(token) {
    const { data, error } = await supabase.auth.verifyOtp({
      token,
      type: 'signup'
    })
    
    if (error) throw error
    return data
  },

  async logout() {
    await supabase.auth.signOut()
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}
```

### **Step 3: API Service**
```javascript
// lib/api.js
const API_BASE_URL = 'http://localhost:8080/api/v1'

export const api = {
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getAuthToken()}`
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) throw new Error('API request failed')
    return response.json()
  },

  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`
      }
    })
    
    if (!response.ok) throw new Error('API request failed')
    return response.json()
  }
}
```

### **Step 4: Route Protection**
```javascript
// middleware/auth.js
import { supabase } from '../lib/supabase'

export async function requireAuth(callback) {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return { redirect: '/login' }
  }
  
  const user = session.user
  return callback(user)
}

export async function requireRole(requiredRole, callback) {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return { redirect: '/login' }
  }
  
  const user = session.user
  const userRole = user.user_metadata?.role
  
  if (userRole !== requiredRole) {
    return { redirect: userRole === 'client' ? '/client/dashboard' : '/artisan/dashboard' }
  }
  
  return callback(user)
}
```

## 🎯 Frontend Route Structure

```javascript
// pages/verify-email.js
export default function VerifyEmail() {
  // Use our design system
  // Implement OTP input with countdown timer
  // Match our verify-email.html template design
}

// pages/login.js
export default function Login() {
  // Email/password form
  // Social login options
  // Redirect to appropriate dashboard after login
}

// pages/signup.js
export default function Signup() {
  // Role selection (client/artisan)
  // Registration form
  // Use our design system
}

// pages/client/dashboard.js
export default function ClientDashboard() {
  // Client-specific features
  // Browse artisans, create bookings, etc.
}

// pages/artisan/dashboard.js
export default function ArtisanDashboard() {
  // Artisan-specific features  
  // Manage profile, view bookings, etc.
}
```

## 🚀 Quick Start Commands

### **Backend Terminal**
```bash
cd "c:\Users\HPA HEALTH CENTER\Desktop\GuyGuy\backend"
go run cmd/server/main.go
```

### **Frontend Terminal**
```bash
cd "c:\Users\HPA HEALTH CENTER\Desktop\GuyGuy\frontend"
npm run dev
```

## ✅ Integration Checklist

- [ ] Install Supabase JS client
- [ ] Create authentication pages with our design system
- [ ] Implement API service for backend communication
- [ ] Add route protection middleware
- [ ] Test complete authentication flow
- [ ] Verify role-based dashboard routing
- [ ] Ensure responsive design on all pages

## 🎨 Design Consistency

All frontend pages should use:
- **Typography**: Plus Jakarta, Montserrat fonts
- **Colors**: White (#ffffff), Yellow (#f59e0b), Blue-Black (#64748b)
- **Components**: Consistent buttons, forms, cards
- **Spacing**: Unified spacing system
- **Animations**: Smooth transitions and hover effects

The backend is ready and waiting for frontend integration. All API endpoints are working and the design system is established for consistent UI/UX across the entire application.
