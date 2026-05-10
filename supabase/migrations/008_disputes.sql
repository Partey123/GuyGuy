-- =============================================
-- disputes
-- =============================================
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id),
  raised_by UUID REFERENCES public.users(id),
  reason TEXT NOT NULL,
  evidence_urls TEXT[],
  status VARCHAR(20) DEFAULT 'open'
    CHECK (status IN ('open', 'under_review', 'resolved_client', 'resolved_artisan', 'resolved_partial')),
  admin_note TEXT,
  resolved_by UUID REFERENCES public.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

