-- =============================================
-- artisan_profiles
-- =============================================
CREATE TABLE IF NOT EXISTS public.artisan_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

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

  -- MoMo payout details
  momo_number VARCHAR(15),
  momo_network VARCHAR(10) CHECK (momo_network IN ('mtn', 'vod', 'tgo')),
  paystack_recipient_code VARCHAR(100),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_artisan_profiles_updated_at ON public.artisan_profiles;
CREATE TRIGGER set_artisan_profiles_updated_at
  BEFORE UPDATE ON public.artisan_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Spatial index for proximity queries
CREATE INDEX IF NOT EXISTS artisan_location_gist ON public.artisan_profiles USING GIST(location);

-- Search and filter indexes
CREATE INDEX IF NOT EXISTS idx_artisan_verification ON public.artisan_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_artisan_skill ON public.artisan_profiles(skill_category);
CREATE INDEX IF NOT EXISTS idx_artisan_badge ON public.artisan_profiles(badge_tier);
CREATE INDEX IF NOT EXISTS idx_artisan_available ON public.artisan_profiles(is_available);

