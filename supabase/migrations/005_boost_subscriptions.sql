-- =============================================
-- boost_subscriptions
-- =============================================
CREATE TABLE IF NOT EXISTS public.boost_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID REFERENCES public.artisan_profiles(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('monthly', 'bronze', 'silver', 'gold')),
  duration_months INTEGER NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  paystack_reference VARCHAR(255) UNIQUE,
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_boost_artisan ON public.boost_subscriptions(artisan_id, is_active);

