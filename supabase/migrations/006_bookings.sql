-- =============================================
-- bookings
-- =============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.users(id),
  artisan_id UUID REFERENCES public.artisan_profiles(id),
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
  artisan_completed_at TIMESTAMPTZ,
  client_confirmed_at TIMESTAMPTZ,
  auto_release_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_bookings_client ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_artisan ON public.bookings(artisan_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

