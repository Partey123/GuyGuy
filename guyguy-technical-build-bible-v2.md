# GuyGuy — Full Technical Build Bible (v2)
*Revised after full audit — all critical issues resolved*

---

## 1. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + JavaScript | Fast component development, massive ecosystem, team familiarity |
| Styling | Tailwind CSS + Shadcn/ui | Utility-first speed, accessible component primitives |
| State (server) | TanStack Query | Caching, background refetch, loading/error states out of the box |
| State (client) | Zustand | Lightweight, no boilerplate, perfect for auth and notification state |
| Forms | React Hook Form + Zod | Performant forms, schema validation shared across app |
| Routing | React Router v6 | Standard, stable, supports protected and role-based routes |
| Backend | Go (Golang) with Gin | High performance, low memory, excellent for concurrent API requests |
| ORM | GORM | Clean PostgreSQL interaction in Go |
| Database | Supabase (PostgreSQL + PostGIS) | Managed Postgres, built-in auth, realtime, storage, RLS, geospatial |
| Auth | Supabase Auth | Phone OTP — Supabase issues JWTs, Go backend validates them |
| Real-time | Supabase Realtime | Chat and live booking status updates |
| File Storage | Supabase Storage + Cloudinary | ID docs and dispute evidence in Supabase Storage, public images via Cloudinary CDN |
| Hosting (frontend) | Vercel | Zero-config React deployment, edge network |
| Hosting (backend) | Railway | Simple Go container deployment, automatic scaling |
| Hosting (admin) | Vercel (separate project) | Admin panel at admin.guyguy.com.gh — isolated from main app |
| CDN / DNS | Cloudflare | DDoS protection, edge caching, DNS management |
| CI/CD | GitHub Actions | Automated test and deploy pipeline |

### Auth Architecture — Important

**Single auth system. No custom JWTs.**

Supabase Auth handles all authentication. It issues JWTs to the frontend on login. The frontend sends the Supabase JWT as the `Authorization: Bearer` header to the Go backend. The Go backend validates this JWT using the Supabase JWT secret (found in Supabase dashboard → Project Settings → API → JWT Secret).

The Go backend does NOT generate its own JWTs. There is no `JWT_SECRET` or `JWT_EXPIRY_HOURS` in the Go environment. The `golang-jwt/jwt` library is used only to decode and validate the Supabase-issued token, not to generate new ones.

This keeps the frontend Supabase client and the Go backend using the same user identity. `auth.uid()` in RLS policies maps directly to the user making the API request.

---

## 2. Third Party Services and Libraries — Complete List

### Payment and Finance
- **Paystack** — MoMo and card payment processing, escrow initiation
- **Paystack Transfer API** — automated MoMo wallet disbursements to artisans after job completion
- **Paystack Recipient API** — creates transfer recipient records for artisan MoMo numbers at onboarding

### Communication
- **Resend** — transactional emails (booking confirmations, verification approvals, dispute notifications, payout receipts)
- **Arkesel** — Ghana-native SMS for OTP delivery, booking alerts, and payment notifications as push fallback

### Push Notifications
- **Firebase Cloud Messaging (FCM)** — Android push notifications for booking requests, payment releases, chat messages, and dispute updates
- **Firebase Admin SDK (Go)** — server-side push notification dispatch

### Maps and Location
- **Google Maps JavaScript API** — map rendering on web/PWA
- **Google Maps Geocoding API** — converting addresses and place names to coordinates
- **Google Places API** — location autocomplete for artisan service area setup and client address input
- **Google Maps Go Client** — server-side distance calculations and geocoding
- **PostGIS** — Supabase-native geospatial extension for proximity search (`ST_DWithin`, `ST_Distance`)

### Media
- **Cloudinary** — profile photo and portfolio image optimization, resizing, and CDN delivery

### Monitoring and Analytics
- **Sentry** — frontend and backend error tracking and alerting
- **PostHog** — user behavior analytics, funnel tracking, feature flags for gradual rollouts

### Frontend Libraries
```
react
react-dom
react-router-dom
@tanstack/react-query
zustand
react-hook-form
zod
axios
@supabase/supabase-js
tailwindcss
@shadcn/ui
lucide-react
framer-motion
react-hot-toast
date-fns
@paystack/inline-js
firebase (for FCM client)
```

### Backend Libraries (Go)
```
github.com/gin-gonic/gin
gorm.io/gorm
gorm.io/driver/postgres
github.com/golang-jwt/jwt/v5   -- used to VALIDATE Supabase JWTs only, not generate
github.com/joho/godotenv
github.com/gosimple/slug       -- artisan profile slug generation
github.com/resend/resend-go/v2
firebase.google.com/go/v4
googlemaps.github.io/maps
go.uber.org/zap
github.com/cosmtrek/air        -- dev only
```

### DevOps
- **Docker** — containerizing the Go backend
- **Docker Compose** — local development orchestration
- **GitHub Actions** — CI/CD pipelines

---

## 3. Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=
VITE_PAYSTACK_PUBLIC_KEY=
VITE_GOOGLE_MAPS_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_POSTHOG_KEY=
VITE_SENTRY_DSN=
```

### Backend (.env)
```
PORT=8080
APP_ENV=development

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=    # Admin operations only — never expose to frontend
SUPABASE_JWT_SECRET=          # From Supabase dashboard → Project Settings → API → JWT Secret
                               # Used to validate incoming Supabase JWTs in Go middleware

# Database
DATABASE_URL=                  # Direct Postgres connection string for GORM

# Paystack
PAYSTACK_SECRET_KEY=
PAYSTACK_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@guyguy.com.gh

# Arkesel
ARKESEL_API_KEY=
ARKESEL_SENDER_ID=GuyGuy

# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_CREDENTIALS_PATH=

# Google Maps
GOOGLE_MAPS_API_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Sentry
SENTRY_DSN=
```

Note: No `JWT_SECRET` or `JWT_EXPIRY_HOURS`. The Go backend validates Supabase-issued JWTs using `SUPABASE_JWT_SECRET`. It never generates its own tokens.

---

## 4. Database Schema

All tables live in Supabase PostgreSQL. PostGIS is enabled. Row Level Security (RLS) is enabled on every table. Updated_at triggers are applied to every table that has an `updated_at` column.

### Extensions and Shared Trigger

```sql
-- Enable PostGIS for proximity search
CREATE EXTENSION IF NOT EXISTS postgis;

-- Shared updated_at trigger function (applied to all tables below)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'artisan', 'admin')),
  avatar_url TEXT,
  fcm_token TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Supabase auth trigger — auto-create users record on signup

```sql
-- Runs when Supabase Auth creates a new auth.users record.
-- Prevents race condition where auth succeeds but user record creation fails.
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, phone, full_name, role)
  VALUES (
    NEW.id,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();
```

---

### artisan_profiles

```sql
CREATE TABLE artisan_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Profile content
  bio TEXT,
  skill_category VARCHAR(100) NOT NULL,
  skill_tags TEXT[],
  years_experience INTEGER,

  -- Location (PostGIS geography type for proximity queries)
  service_area VARCHAR(255),
  location GEOGRAPHY(POINT, 4326),

  -- Verification
  id_document_url TEXT,
  verification_status VARCHAR(20) DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verification_note TEXT,

  -- Badge and boost
  badge_tier VARCHAR(20) DEFAULT 'none'
    CHECK (badge_tier IN ('none', 'bronze', 'silver', 'gold')),

  -- Reputation
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  jobs_completed INTEGER DEFAULT 0,

  -- Availability
  is_available BOOLEAN DEFAULT true,

  -- Shareable profile
  shareable_slug VARCHAR(100) UNIQUE,

  -- MoMo payout details (collected at onboarding, before first job)
  momo_number VARCHAR(15),
  momo_network VARCHAR(10) CHECK (momo_network IN ('mtn', 'vod', 'tgo')),
  paystack_recipient_code VARCHAR(100),  -- Stored after POST /transferrecipient

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_artisan_profiles_updated_at
  BEFORE UPDATE ON artisan_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Spatial index for proximity queries
CREATE INDEX artisan_location_gist ON artisan_profiles USING GIST(location);

-- Search and filter indexes
CREATE INDEX idx_artisan_verification ON artisan_profiles(verification_status);
CREATE INDEX idx_artisan_skill ON artisan_profiles(skill_category);
CREATE INDEX idx_artisan_badge ON artisan_profiles(badge_tier);
CREATE INDEX idx_artisan_available ON artisan_profiles(is_available);
```

---

### portfolio_items

```sql
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID REFERENCES artisan_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### boost_subscriptions

```sql
CREATE TABLE boost_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID REFERENCES artisan_profiles(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('monthly', 'bronze', 'silver', 'gold')),
  -- monthly  = 30 days  = ₵25  = no badge
  -- bronze   = 3 months = ₵60  = bronze badge
  -- silver   = 6 months = ₵110 = silver badge
  -- gold     = 12 months= ₵200 = gold badge
  duration_months INTEGER NOT NULL,   -- 1, 3, 6, or 12
  amount_paid DECIMAL(10,2) NOT NULL,
  paystack_reference VARCHAR(255) UNIQUE,
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_boost_artisan ON boost_subscriptions(artisan_id, is_active);
```

---

### bookings

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id),
  artisan_id UUID REFERENCES artisan_profiles(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  job_type VARCHAR(20) DEFAULT 'labour_only'
    CHECK (job_type IN ('labour_only', 'labour_and_materials')),
  labour_amount DECIMAL(10,2) NOT NULL,
  materials_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  location_address TEXT,
  location GEOGRAPHY(POINT, 4326),
  job_photos TEXT[],
  scheduled_date DATE,
  scheduled_time TIME,
  status VARCHAR(30) DEFAULT 'pending'
    CHECK (status IN (
      'pending',
      'accepted',
      'declined',
      'in_progress',
      'completed_by_artisan',
      'completed',
      'disputed',
      'cancelled',
      'refunded'
    )),
  artisan_completed_at TIMESTAMPTZ,   -- when artisan marked job done (72h clock starts here)
  client_confirmed_at TIMESTAMPTZ,
  auto_release_at TIMESTAMPTZ,        -- set to artisan_completed_at + 72h
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Dashboard and query indexes
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_artisan ON bookings(artisan_id);
CREATE INDEX idx_bookings_status ON bookings(status);
```

---

### payments

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  payer_id UUID REFERENCES users(id),
  paystack_reference VARCHAR(255) UNIQUE NOT NULL,
  paystack_transaction_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,               -- total amount paid by client
  commission_basis_amount DECIMAL(10,2) NOT NULL, -- amount commission is calculated on
                                                    -- = labour_amount for labour_and_materials
                                                    -- = total_amount for labour_only
  commission_amount DECIMAL(10,2) NOT NULL,    -- commission_basis_amount * 0.10
  artisan_payout_amount DECIMAL(10,2) NOT NULL, -- amount - commission_amount
  currency VARCHAR(10) DEFAULT 'GHS',
  payment_method VARCHAR(30),
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'in_escrow', 'released', 'refunded', 'failed')),
  escrow_released_at TIMESTAMPTZ,
  payout_reference VARCHAR(255),
  payout_status VARCHAR(20) DEFAULT 'pending'
    CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_reference ON payments(paystack_reference);
```

---

### disputes

```sql
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  raised_by UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  evidence_urls TEXT[],   -- populated via POST /disputes/:id/evidence
  status VARCHAR(20) DEFAULT 'open'
    CHECK (status IN ('open', 'under_review', 'resolved_client', 'resolved_artisan', 'resolved_partial')),
  admin_note TEXT,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### messages

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Critical for chat performance
CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_booking_time ON messages(booking_id, created_at);
```

---

### reviews

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) UNIQUE,   -- one review per booking
  client_id UUID REFERENCES users(id),
  artisan_id UUID REFERENCES artisan_profiles(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### notifications

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
```

---

### audit_logs

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Row Level Security Policies

RLS is enabled on every table. The Go backend uses the Supabase service role key and bypasses RLS — this is correct and intentional. RLS protects against direct Supabase JS client access using the anon key.

```sql
-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE boost_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS
-- =============================================
CREATE POLICY "users_own_record" ON users
  FOR ALL USING (auth.uid() = id);

-- =============================================
-- ARTISAN PROFILES
-- =============================================

-- Approved profiles are publicly readable (browse/search)
CREATE POLICY "artisan_profiles_public_read" ON artisan_profiles
  FOR SELECT USING (verification_status = 'approved');

-- Artisan can read and update their own profile regardless of status
CREATE POLICY "artisan_own_profile" ON artisan_profiles
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- PORTFOLIO ITEMS
-- =============================================

-- Public read (shown on artisan profile page)
CREATE POLICY "portfolio_public_read" ON portfolio_items
  FOR SELECT USING (true);

-- Artisan write/delete own portfolio only
CREATE POLICY "portfolio_artisan_write" ON portfolio_items
  FOR ALL USING (
    artisan_id IN (
      SELECT id FROM artisan_profiles WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- BOOST SUBSCRIPTIONS
-- =============================================

-- Artisan reads own subscription only
CREATE POLICY "boost_own_only" ON boost_subscriptions
  FOR ALL USING (
    artisan_id IN (
      SELECT id FROM artisan_profiles WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- BOOKINGS
-- =============================================

-- Only the client and the artisan involved can see a booking
CREATE POLICY "bookings_parties_only" ON bookings
  FOR ALL USING (
    client_id = auth.uid() OR
    artisan_id IN (
      SELECT id FROM artisan_profiles WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- PAYMENTS
-- =============================================

-- Only the paying client or the receiving artisan can read payment records
CREATE POLICY "payments_parties_only" ON payments
  FOR SELECT USING (
    payer_id = auth.uid() OR
    booking_id IN (
      SELECT id FROM bookings
      WHERE artisan_id IN (
        SELECT id FROM artisan_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- =============================================
-- DISPUTES
-- =============================================

-- Only the party who raised the dispute can read it via anon key
-- Admin reads via service role key (bypasses RLS)
CREATE POLICY "disputes_raiser_only" ON disputes
  FOR SELECT USING (raised_by = auth.uid());

-- Either party on the booking can raise a dispute
CREATE POLICY "disputes_parties_insert" ON disputes
  FOR INSERT WITH CHECK (
    raised_by = auth.uid() AND
    booking_id IN (
      SELECT id FROM bookings
      WHERE client_id = auth.uid()
      OR artisan_id IN (
        SELECT id FROM artisan_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- =============================================
-- MESSAGES
-- =============================================

-- Messages only visible to booking participants
CREATE POLICY "messages_booking_parties" ON messages
  FOR ALL USING (
    booking_id IN (
      SELECT id FROM bookings
      WHERE client_id = auth.uid()
      OR artisan_id IN (
        SELECT id FROM artisan_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- =============================================
-- REVIEWS
-- =============================================

-- Reviews are publicly readable
CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (true);

-- Only the client of a completed booking can submit a review
CREATE POLICY "reviews_client_insert" ON reviews
  FOR INSERT WITH CHECK (
    client_id = auth.uid() AND
    booking_id IN (
      SELECT id FROM bookings
      WHERE status = 'completed' AND client_id = auth.uid()
    )
  );

-- =============================================
-- NOTIFICATIONS
-- =============================================

-- Only the recipient can read their notifications
CREATE POLICY "notifications_recipient_only" ON notifications
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- AUDIT LOGS
-- =============================================

-- No access via anon key — admin only, via service role key
CREATE POLICY "audit_logs_no_access" ON audit_logs
  FOR ALL USING (false);
```

---

## 6. Folder Structure

```
guyguy/
│
├── frontend/
│   ├── public/
│   │   ├── icons/
│   │   ├── manifest.json
│   │   └── sw.js
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── artisans.js
│   │   │   ├── bookings.js
│   │   │   ├── payments.js
│   │   │   ├── reviews.js
│   │   │   ├── chat.js
│   │   │   └── admin.js
│   │   │
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── fonts/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── StarRating.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── EmptyState.jsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── BottomNav.jsx
│   │   │   │   └── PageWrapper.jsx
│   │   │   │
│   │   │   ├── artisan/
│   │   │   │   ├── ArtisanCard.jsx
│   │   │   │   ├── ArtisanProfile.jsx
│   │   │   │   ├── ArtisanBadge.jsx
│   │   │   │   ├── PortfolioGrid.jsx
│   │   │   │   ├── AvailabilityToggle.jsx
│   │   │   │   └── EarningsChart.jsx
│   │   │   │
│   │   │   ├── booking/
│   │   │   │   ├── BookingCard.jsx
│   │   │   │   ├── BookingForm.jsx
│   │   │   │   ├── BookingStatus.jsx
│   │   │   │   └── BookingTimeline.jsx
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   └── ChatInput.jsx
│   │   │   │
│   │   │   ├── payment/
│   │   │   │   ├── PaystackButton.jsx
│   │   │   │   ├── EscrowStatus.jsx
│   │   │   │   └── PayoutCard.jsx
│   │   │   │
│   │   │   └── review/
│   │   │       ├── ReviewForm.jsx
│   │   │       └── ReviewList.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── landing/
│   │   │   │   └── Landing.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── OTPVerify.jsx
│   │   │   │   └── RoleSelect.jsx
│   │   │   │
│   │   │   ├── client/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Search.jsx
│   │   │   │   ├── ArtisanDetail.jsx
│   │   │   │   ├── BookingRequest.jsx
│   │   │   │   ├── MyBookings.jsx
│   │   │   │   ├── BookingDetail.jsx
│   │   │   │   └── ClientProfile.jsx
│   │   │   │
│   │   │   ├── artisan/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Requests.jsx
│   │   │   │   ├── ActiveJobs.jsx
│   │   │   │   ├── Earnings.jsx
│   │   │   │   ├── Boost.jsx
│   │   │   │   ├── EditProfile.jsx
│   │   │   │   ├── Portfolio.jsx
│   │   │   │   └── PublicProfile.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── VerificationQueue.jsx
│   │   │       ├── DisputeCenter.jsx
│   │   │       ├── Transactions.jsx
│   │   │       ├── Users.jsx
│   │   │       └── Analytics.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useBooking.js
│   │   │   ├── useChat.js
│   │   │   ├── useLocation.js
│   │   │   ├── useNotifications.js
│   │   │   └── usePaystack.js
│   │   │
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── bookingStore.js
│   │   │   └── notificationStore.js
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase.js
│   │   │   ├── axios.js
│   │   │   ├── firebase.js
│   │   │   ├── utils.js
│   │   │   ├── formatters.js
│   │   │   └── constants.js
│   │   │
│   │   ├── routes/
│   │   │   ├── index.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   │
│   │   ├── styles/
│   │   │   └── index.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
│
├── backend/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go
│   │
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.go          -- validates Supabase JWT using SUPABASE_JWT_SECRET
│   │   │   ├── admin.go         -- checks role = 'admin' after auth middleware passes
│   │   │   ├── cors.go
│   │   │   ├── ratelimit.go
│   │   │   └── logger.go
│   │   │
│   │   ├── handlers/
│   │   │   ├── auth.go
│   │   │   ├── artisan.go
│   │   │   ├── client.go
│   │   │   ├── booking.go
│   │   │   ├── payment.go
│   │   │   ├── chat.go
│   │   │   ├── review.go
│   │   │   ├── dispute.go
│   │   │   ├── notification.go
│   │   │   └── admin.go
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.go
│   │   │   ├── artisan_service.go
│   │   │   ├── booking_service.go
│   │   │   ├── escrow_service.go
│   │   │   ├── payout_service.go
│   │   │   ├── notification_service.go
│   │   │   ├── review_service.go
│   │   │   ├── slug_service.go        -- generates and deduplicates artisan slugs
│   │   │   └── boost_service.go
│   │   │
│   │   ├── repository/
│   │   │   ├── user_repo.go
│   │   │   ├── artisan_repo.go
│   │   │   ├── booking_repo.go
│   │   │   ├── payment_repo.go
│   │   │   ├── review_repo.go
│   │   │   └── boost_repo.go
│   │   │
│   │   ├── models/
│   │   │   ├── user.go
│   │   │   ├── artisan.go
│   │   │   ├── booking.go
│   │   │   ├── payment.go
│   │   │   ├── escrow.go
│   │   │   ├── review.go
│   │   │   ├── boost.go
│   │   │   ├── dispute.go
│   │   │   ├── message.go
│   │   │   └── notification.go
│   │   │
│   │   ├── routes/
│   │   │   └── routes.go
│   │   │
│   │   └── integrations/
│   │       ├── paystack/
│   │       │   ├── paystack.go
│   │       │   ├── escrow.go
│   │       │   ├── transfer.go
│   │       │   └── recipient.go      -- Paystack /transferrecipient calls
│   │       ├── resend/
│   │       │   ├── resend.go
│   │       │   └── templates.go
│   │       ├── arkesel/
│   │       │   └── sms.go
│   │       ├── firebase/
│   │       │   └── fcm.go
│   │       └── googlemaps/
│   │           └── maps.go
│   │
│   ├── pkg/
│   │   ├── logger/
│   │   │   └── logger.go
│   │   ├── validator/
│   │   │   └── validator.go
│   │   └── response/
│   │       └── response.go
│   │
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_artisan_profiles.sql
│   │   ├── 003_create_portfolio_items.sql
│   │   ├── 004_create_boost_subscriptions.sql
│   │   ├── 005_create_bookings.sql
│   │   ├── 006_create_payments.sql
│   │   ├── 007_create_disputes.sql
│   │   ├── 008_create_messages.sql
│   │   ├── 009_create_reviews.sql
│   │   ├── 010_create_notifications.sql
│   │   └── 011_create_audit_logs.sql
│   │
│   ├── .env
│   ├── .air.toml
│   ├── Dockerfile
│   ├── go.mod
│   └── go.sum
│
│
├── supabase/
│   ├── config.toml
│   ├── seed.sql
│   └── functions/
│       └── auto-release-payment/
│           └── index.ts
│
│
├── .github/
│   └── workflows/
│       ├── frontend-deploy.yml
│       └── backend-deploy.yml
│
├── docker-compose.yml
└── README.md
```

---

## 7. API Routes

### Auth
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/verify-otp
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
```

### Artisans
```
GET    /api/v1/artisans                      # Search with filters (proximity via PostGIS)
GET    /api/v1/artisans/:id                  # Public profile
GET    /api/v1/artisans/slug/:slug           # Shareable profile URL
PUT    /api/v1/artisans/profile              # Update own profile
PUT    /api/v1/artisans/availability         # Toggle is_available true/false
POST   /api/v1/artisans/portfolio            # Add portfolio item
DELETE /api/v1/artisans/portfolio/:id        # Remove portfolio item
GET    /api/v1/artisans/earnings             # Own earnings summary
```

### Bookings
```
POST   /api/v1/bookings                      # Client creates booking
GET    /api/v1/bookings                      # List own bookings
GET    /api/v1/bookings/:id                  # Single booking detail
PUT    /api/v1/bookings/:id/accept           # Artisan accepts
PUT    /api/v1/bookings/:id/decline          # Artisan declines (triggers refund)
PUT    /api/v1/bookings/:id/start            # Artisan marks job started
PUT    /api/v1/bookings/:id/complete-artisan # Artisan marks job done (starts 72h clock)
PUT    /api/v1/bookings/:id/complete-client  # Client confirms completion
POST   /api/v1/bookings/:id/dispute          # Client raises dispute
PUT    /api/v1/bookings/:id/cancel           # Cancel booking
```

### Payments
```
POST   /api/v1/payments/initiate             # Initiate Paystack payment
POST   /api/v1/payments/webhook              # Paystack webhook handler (idempotent)
GET    /api/v1/payments/:bookingId           # Payment status for booking
```

### Disputes
```
POST   /api/v1/disputes/:id/evidence         # Upload dispute evidence (photo/file)
```

### Boosts
```
GET    /api/v1/boosts/plans                  # Available plans and pricing
POST   /api/v1/boosts/subscribe              # Initiate boost payment
GET    /api/v1/boosts/status                 # Own boost status and expiry
```

### Chat
```
GET    /api/v1/chat/:bookingId               # Message history
POST   /api/v1/chat/:bookingId               # Send message
```

### Reviews
```
POST   /api/v1/reviews                       # Submit review
GET    /api/v1/reviews/artisan/:id           # Reviews for an artisan
```

### Admin
```
GET    /api/v1/admin/verifications           # Pending verification queue
PUT    /api/v1/admin/verifications/:id       # Approve or reject with note
GET    /api/v1/admin/disputes                # All disputes
PUT    /api/v1/admin/disputes/:id            # Resolve dispute (full/partial/refund)
GET    /api/v1/admin/users                   # All users with filters
GET    /api/v1/admin/transactions            # All transactions
GET    /api/v1/admin/analytics               # Platform metrics
```

---

## 8. Booking State Machine

```
pending
  → accepted         (artisan explicitly accepts)
  → declined         (artisan declines → payment refunded) [terminal]
  → cancelled        (client cancels before artisan accepts → refund) [terminal]

accepted
  → in_progress      (artisan marks job started, or scheduled date reached)
  → cancelled        (either party cancels → refund logic applies)

in_progress
  → completed_by_artisan   (artisan marks job done in app)
                            → artisan_completed_at set to NOW()
                            → auto_release_at set to NOW() + 72 hours
                            → client notified: "Confirm your job is done"

completed_by_artisan
  → completed              (client confirms within 72h → payment release triggered)
  → disputed               (client raises dispute within 24h of artisan completion)
  → completed              (auto-release after 72h if client takes no action)

disputed
  → completed              (admin resolves in artisan's favor → release)
  → refunded               (admin resolves in client's favor → refund)
  → completed (partial)    (admin splits payment)

completed  [terminal — commission deducted, artisan MoMo payout sent]
refunded   [terminal — payment returned to client]
```

**Key rule:** The booking never auto-transitions to `accepted` on payment. Payment webhook sets payment status to `in_escrow` and booking remains `pending` until the artisan manually accepts or declines.

---

## 9. Escrow Payment Flow (Step by Step)

```
1. Client submits booking with job details, job type (labour_only or labour_and_materials),
   labour amount, and materials amount (if applicable). total_amount is computed.

2. Backend creates booking record with status = 'pending'.
   Commission basis is determined:
   - labour_only: commission_basis = total_amount
   - labour_and_materials: commission_basis = labour_amount

3. Client initiates payment via Paystack
   - Frontend calls POST /api/v1/payments/initiate
   - Backend creates payment record with status = 'pending'
   - Backend pre-calculates:
       commission_basis_amount = (see step 2)
       commission_amount = commission_basis_amount * 0.10
       artisan_payout_amount = total_amount - commission_amount
   - Backend stores these on the payment record
   - Backend returns Paystack payment URL or reference

4. Client completes payment on Paystack (MoMo or card)

5. Paystack sends webhook to POST /api/v1/payments/webhook
   - Backend verifies webhook HMAC signature
   - Backend checks idempotency: if payment record for this reference already
     has status != 'pending', return 200 immediately and stop processing
   - Backend updates payment status to 'in_escrow'
   - Booking status remains 'pending' (artisan has NOT accepted yet)
   - Backend sends push notification to artisan: "New paid booking request.
     A client has paid. Review and accept or decline."

6. Artisan receives notification, opens the Requests page, reviews the booking.

   If artisan DECLINES:
   - Booking status → 'declined'
   - Backend calls Paystack refund API for the full amount
   - Client notified: "Your artisan declined. Full refund on the way."

   If artisan ACCEPTS:
   - Booking status → 'accepted'
   - Client notified: "Your booking is confirmed. [Artisan name] is coming."

7. Job happens in the real world.

8. Artisan marks job complete in the app.
   - Booking status → 'completed_by_artisan'
   - booking.artisan_completed_at = NOW()
   - booking.auto_release_at = NOW() + 72 hours
   - Client receives push: "Please confirm your job is complete"

9a. Client confirms completion (within 72h of step 8)
    - Booking status → 'completed'
    - Payment status → 'released'
    - Backend calls Paystack Transfer API using artisan's stored paystack_recipient_code
    - Transfer amount = artisan_payout_amount (already calculated at step 3)
    - payment.payout_status → 'processing'
    - Artisan receives push: "Payment of GHC [X] sent to your MoMo"
    - Client receives prompt to leave a review
    - On Paystack transfer.success webhook: payment.payout_status → 'completed'

9b. Client raises dispute (within 24h of step 8)
    - Booking status → 'disputed'
    - Payment frozen — no payout triggered
    - Admin notified
    - Both parties submit evidence via POST /disputes/:id/evidence
    - Admin reviews and resolves:
        resolved_artisan → full payout to artisan (same as 9a)
        resolved_client → full refund
        resolved_partial → custom split, two separate Transfer/Refund calls

9c. No action from client within 72h of step 8
    - Supabase Edge Function (cron, runs every hour) detects
      status = 'completed_by_artisan' AND auto_release_at <= NOW()
    - Same payout flow as 9a, triggered by the Edge Function
    - Client notified: "72 hours passed. Payment released automatically."
```

---

## 10. Artisan Slug Generation

Slugs are generated server-side in `slug_service.go` when an artisan completes their profile.

```go
// Pseudocode — slug_service.go
func GenerateSlug(db *gorm.DB, fullName string) (string, error) {
    base := slug.Make(fullName)  // "Kwame Asante Boateng" → "kwame-asante-boateng"
    candidate := base
    suffix := 2

    for {
        var count int64
        db.Model(&ArtisanProfile{}).
            Where("shareable_slug = ?", candidate).
            Count(&count)

        if count == 0 {
            return candidate, nil
        }

        candidate = fmt.Sprintf("%s-%d", base, suffix)
        suffix++
    }
}
```

The public profile URL is: `guyguy.com.gh/a/[slug]`
This route is publicly accessible without authentication.

---

## 11. Auth Middleware (Go)

The `auth.go` middleware validates incoming Supabase JWTs. It does not generate tokens.

```go
// internal/middleware/auth.go
func AuthMiddleware(supabaseJWTSecret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenStr := strings.TrimPrefix(
            c.GetHeader("Authorization"), "Bearer ",
        )
        if tokenStr == "" {
            c.AbortWithStatusJSON(401, gin.H{"error": "missing token"})
            return
        }

        token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
            if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method")
            }
            return []byte(supabaseJWTSecret), nil
        })

        if err != nil || !token.Valid {
            c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
            return
        }

        claims := token.Claims.(jwt.MapClaims)
        c.Set("user_id", claims["sub"])   // Supabase user UUID
        c.Set("role", claims["role"])     // from user_metadata

        c.Next()
    }
}
```

The `admin.go` middleware runs after `AuthMiddleware` and checks that `role == "admin"`.

```go
// internal/middleware/admin.go
func AdminOnly() gin.HandlerFunc {
    return func(c *gin.Context) {
        role, _ := c.Get("role")
        if role != "admin" {
            c.AbortWithStatusJSON(403, gin.H{"error": "forbidden"})
            return
        }
        c.Next()
    }
}
```

---

## 12. Proximity Search Query

Artisan search using PostGIS. This is the query that powers the client's Search page.

```sql
-- Find approved, available artisans within radius_meters of the client's location,
-- optionally filtered by skill and badge, ordered by distance then badge tier.

SELECT
  ap.*,
  u.full_name,
  u.avatar_url,
  ST_Distance(
    ap.location,
    ST_GeogFromText('POINT(' || $lon || ' ' || $lat || ')')
  ) AS distance_meters
FROM artisan_profiles ap
JOIN users u ON u.id = ap.user_id
WHERE
  ap.verification_status = 'approved'
  AND ap.is_available = true
  AND ST_DWithin(
    ap.location,
    ST_GeogFromText('POINT(' || $lon || ' ' || $lat || ')'),
    $radius_meters   -- e.g. 5000 for 5km
  )
  AND ($skill_category IS NULL OR ap.skill_category = $skill_category)
  AND ($badge_tier IS NULL OR ap.badge_tier = $badge_tier)
ORDER BY
  CASE ap.badge_tier
    WHEN 'gold'   THEN 1
    WHEN 'silver' THEN 2
    WHEN 'bronze' THEN 3
    ELSE 4
  END,
  distance_meters ASC
LIMIT 50;
```

Boosted artisans appear higher because badge ordering takes priority over distance. Within the same badge tier, closer artisans appear first.

---

## 13. Incremental Build Order

### Step 1 — Landing Page
Build the public-facing landing page. Hero section, how it works, skill categories, artisan CTA, client CTA, social proof placeholder, footer. No auth required. Fully static. Deployable to Vercel immediately.

**Definition of done:** Deployed live URL. Shareable. Explains GuyGuy in under 10 seconds.

**Parallel action:** Submit Paystack business verification for disbursement permissions. Takes 1-2 weeks. Start now.

---

### Step 2 — Auth Pages
Build registration, login, OTP verification, and role selection flows.

Phone number input → OTP sent via Arkesel → verified → role selection screen → profile setup begins.

Supabase Auth handles OTP. The `on_auth_user_created` database trigger (defined in the schema) automatically creates the corresponding `users` record. The Go backend does not need a separate "create user" API call — the trigger handles it atomically.

**Definition of done:** A user can register as either role, verify their phone, and land on the correct dashboard placeholder. No ghost users possible.

---

### Step 3 — Admin Dashboard
Build the web-based admin panel as a separate Vercel project at `admin.guyguy.com.gh`. Start with:
- Verification queue (list of pending artisan applications with documents)
- Approve / Reject actions with note
- User list with basic filters
- Transaction log (empty until payments work)
- Basic analytics cards (total users, total artisans, pending verifications)

Admin routes protected by `AuthMiddleware` + `AdminOnly()` middleware. Backend uses service role Supabase key for unrestricted data access.

**Definition of done:** Admin can log in, see pending verifications, approve or reject with reason.

---

### Step 4 — Database Schema and RLS
With admin panel built, you now know what data you are touching. Run all migration files. Enable PostGIS. Apply all RLS policies. Apply all `updated_at` triggers. Test that each role can only access what they should. Seed with test artisans and test clients.

**Definition of done:** Full schema live in Supabase. PostGIS enabled. RLS tested for all three roles. Seed data in place.

---

### Step 5 — Artisan Onboarding and Profile
Build the artisan signup continuation:
- Profile setup form (bio, skill category, tags, years experience, location picker)
- **MoMo number collection and Paystack recipient creation** — collect momo_number and momo_network, call Paystack `/transferrecipient`, store the returned `paystack_recipient_code` on the artisan profile. Do this at onboarding, not at first payout.
- ID document upload to Supabase Storage (private bucket)
- Portfolio photo upload via Cloudinary
- Profile preview before submission
- Verification pending state screen
- Slug generated and stored on profile submission
- Public shareable profile page at `/artisan/:slug`

**Definition of done:** Artisan can complete full onboarding including MoMo registration, submit for verification, and share their public profile URL. Payout pipe is ready from day one.

---

### Step 6 — Client Browse and Search
Build the client-facing discovery experience:
- Home screen with skill category grid
- Search page with PostGIS proximity results
- Filter by skill, rating, badge tier, availability
- Location input with Google Places autocomplete (converts to lat/lng for query)
- Artisan detail page showing full profile, portfolio, reviews, and Book Now button

**Definition of done:** A client can search by location and skill, filter results, and browse artisan profiles. Book Now button exists but is not yet functional.

---

### Step 7 — Booking Flow
Build the complete booking request experience:
- Booking form (job description, date, time, location, photos, job type, amounts)
- Booking confirmation screen showing cost breakdown (labour, materials, commission basis)
- Booking state tracking for both client and artisan
- Artisan receives booking request notification
- Artisan accepts or declines from their Requests page
- Booking status updates in real time via Supabase Realtime

**Definition of done:** A client can submit a booking. An artisan can accept or decline it. Both see real-time status updates.

---

### Step 8 — Payments and Escrow
Integrate Paystack. Build the full escrow flow:
- Client pays on booking submission (payment must be made before artisan is notified)
- Paystack webhook handler in Go backend — with idempotency check
- Payment status → `in_escrow` on webhook (booking stays `pending` until artisan acts)
- Artisan accepts or declines (decline triggers refund)
- Artisan marks job complete → sets artisan_completed_at and auto_release_at
- Client confirms job completion → commission deducted, Transfer API payout
- 72-hour auto-release via Supabase Edge Function cron job
- Dispute submission and payment freeze logic

**Definition of done:** Full money flow works end to end. Artisan receives MoMo payout after client confirmation. Auto-release fires correctly in test.

---

### Step 9 — In-App Chat
Unlock chat between client and artisan after booking is accepted. Use Supabase Realtime for live message delivery. Store all messages in the `messages` table for dispute reference.

**Definition of done:** Client and artisan can exchange messages within a booking. Messages persist and load on reopen.

---

### Step 10 — Ratings and Reviews
After a booking reaches `completed` status, prompt client to leave a review. Store review. Update artisan's `rating_average` and `rating_count`. Reviews visible on artisan public profile.

Reviews only possible for verified completed bookings. One review per booking (enforced by UNIQUE constraint on `booking_id`).

**Definition of done:** Client can rate and review. Artisan profile shows updated star rating and review list.

---

### Step 11 — Push Notifications
Integrate Firebase Cloud Messaging. Store FCM tokens on user record at login. Backend sends push notifications for all key events: new booking request, booking accepted, job marked complete, payment released, new review, dispute update.

Arkesel SMS as fallback for users who have not granted notification permission.

**Definition of done:** All key events trigger real push notifications on Android devices.

---

### Step 12 — Dispute Evidence and Management
Build dispute submission flow:
- Client raises dispute from booking detail page
- Dispute evidence upload (photos, files) via POST /disputes/:id/evidence
- Evidence stored in Supabase Storage private bucket `dispute-evidence`
- Admin receives notification of new dispute
- Admin dispute center shows all open disputes with evidence
- Admin resolves with outcome: artisan / client / partial split

**Definition of done:** Full dispute lifecycle works. Admin can review evidence and close disputes. Payment is released or refunded based on outcome.

---

### Step 13 — Boost Subscriptions
Build the artisan Boost page:
- Plan comparison (monthly, bronze, silver, gold) with badge explanations
- Paystack payment for chosen plan
- Webhook confirms payment, activates boost, updates badge_tier on artisan_profiles, sets expires_at
- Artisan dashboard shows active boost status and expiry date
- Expiry reminder push notification 3 days before expiry

Search results rank boosted artisans higher based on badge tier (as specified in proximity query above).

**Definition of done:** Artisan can purchase a boost, badge appears on their profile, they rank higher in search, and they are notified before expiry.

---

### Step 14 — Artisan Earnings Dashboard
Build the earnings view:
- Total earned (all time)
- This month earnings
- Pending payouts (jobs completed_by_artisan, awaiting client confirmation)
- Job history with individual amounts and commission breakdown
- Boost subscription history
- CSV export of earnings

**Definition of done:** Artisan has full financial visibility into their platform activity, including exactly how commission was calculated on each job.

---

### Step 15 — PWA Setup
Configure the service worker and web app manifest. Enable Add to Home Screen prompt. Cache critical assets for offline availability. Artisan bookings viewable offline.

**Definition of done:** App installable on Android via browser. Core screens available without internet connection.

---

### Step 16 — Testing, Polish, and Launch Prep
- End to end testing of all flows
- Mobile responsiveness audit across device sizes (320px to 428px)
- Error state handling on all pages
- Empty state designs for zero-data screens
- Performance audit (Lighthouse — target 90+ on mobile)
- Sentry error monitoring confirmed live
- PostHog analytics events firing correctly on all key user actions
- Security review: RLS, rate limiting, webhook HMAC verification, no anon key on backend
- Paystack live key swap — confirm transfer permissions are activated
- Soft launch to first 50 artisans in Kumasi

---

## 14. CI/CD Pipeline

### Frontend (GitHub Actions → Vercel)
```yaml
name: Frontend Deploy
on:
  push:
    branches: [main]
    paths: [frontend/**]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: cd frontend && npm ci
      - run: cd frontend && npm run lint        # lint first
      - run: cd frontend && npm run test        # tests before build
      - run: cd frontend && npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: frontend
```

### Backend (GitHub Actions → Railway)
```yaml
name: Backend Deploy
on:
  push:
    branches: [main]
    paths: [backend/**]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - run: cd backend && go vet ./...        # vet first
      - run: cd backend && go test ./...       # tests before build
      - run: cd backend && go build ./...      # build only after tests pass
      - uses: bervProject/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service: guyguy-backend
```

Tests run before build. If tests fail, the build and deploy never happen.

---

## 15. Docker Setup

### backend/Dockerfile
```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server ./cmd/server

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]
```

### docker-compose.yml (local dev)
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    env_file:
      - ./backend/.env
    volumes:
      - ./backend:/app
    # Uses go run for local dev — air can be used separately if installed globally
    command: go run ./cmd/server

  supabase:
    image: supabase/postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: postgres
```

To use air for live reload locally, install it globally (`go install github.com/cosmtrek/air@latest`) and run `air` directly from the backend directory — not via Docker Compose. The Compose setup above uses `go run` which works reliably without air being in the container.

---

## 16. MVP Scope vs V2

### Must Ship in MVP
- Landing page
- Phone OTP auth with role selection
- Artisan onboarding (including MoMo number and Paystack recipient setup)
- Admin verification queue and approval (separate admin.guyguy.com.gh deployment)
- Client browse and search with PostGIS proximity
- Full booking flow (request, accept, decline)
- Paystack payment and escrow (with idempotent webhook handler)
- Job completion flow (artisan marks done, client confirms, 72h auto-release)
- Commission deducted on labour amount only
- Artisan MoMo payout via Paystack Transfer API
- In-app chat per booking
- Ratings and reviews
- Push notifications (FCM) with Arkesel SMS fallback
- Dispute submission with evidence upload
- Boost subscription (monthly, bronze, silver, gold)
- Artisan earnings dashboard with commission breakdown
- Artisan availability toggle
- PWA installable on Android

### Deferred to V2
- iOS app (React Native or Capacitor wrapper)
- Live artisan location tracking during job
- AI job matching based on description
- Insurance integration at checkout
- Business tools subscription (invoice generator, advanced analytics)
- GuyGuy for Business corporate portal (pilot starts in Phase 2 manually, full portal in V2)
- Multi-city admin panel with city-level analytics
- Video portfolio uploads
- Referral and invite system
- In-app artisan identity verification (live selfie match to ID)
- Custom artisan profile slugs (artisan-chosen handles)
