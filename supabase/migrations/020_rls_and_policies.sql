-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boost_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS
-- =============================================
DROP POLICY IF EXISTS "users_own_record" ON public.users;
CREATE POLICY "users_own_record" ON public.users
  FOR ALL USING (auth.uid() = id);

-- =============================================
-- ARTISAN PROFILES
-- =============================================
DROP POLICY IF EXISTS "artisan_profiles_public_read" ON public.artisan_profiles;
CREATE POLICY "artisan_profiles_public_read" ON public.artisan_profiles
  FOR SELECT USING (verification_status = 'approved');

DROP POLICY IF EXISTS "artisan_own_profile" ON public.artisan_profiles;
CREATE POLICY "artisan_own_profile" ON public.artisan_profiles
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- PORTFOLIO ITEMS
-- =============================================
DROP POLICY IF EXISTS "portfolio_public_read" ON public.portfolio_items;
CREATE POLICY "portfolio_public_read" ON public.portfolio_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "portfolio_artisan_write" ON public.portfolio_items;
CREATE POLICY "portfolio_artisan_write" ON public.portfolio_items
  FOR ALL USING (
    artisan_id IN (
      SELECT id FROM public.artisan_profiles WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- BOOST SUBSCRIPTIONS
-- =============================================
DROP POLICY IF EXISTS "boost_own_only" ON public.boost_subscriptions;
CREATE POLICY "boost_own_only" ON public.boost_subscriptions
  FOR ALL USING (
    artisan_id IN (
      SELECT id FROM public.artisan_profiles WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- BOOKINGS
-- =============================================
DROP POLICY IF EXISTS "bookings_parties_only" ON public.bookings;
CREATE POLICY "bookings_parties_only" ON public.bookings
  FOR ALL USING (
    client_id = auth.uid() OR
    artisan_id IN (
      SELECT id FROM public.artisan_profiles WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- PAYMENTS
-- =============================================
DROP POLICY IF EXISTS "payments_parties_only" ON public.payments;
CREATE POLICY "payments_parties_only" ON public.payments
  FOR SELECT USING (
    payer_id = auth.uid() OR
    booking_id IN (
      SELECT id FROM public.bookings
      WHERE artisan_id IN (
        SELECT id FROM public.artisan_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- =============================================
-- DISPUTES
-- =============================================
DROP POLICY IF EXISTS "disputes_raiser_only" ON public.disputes;
CREATE POLICY "disputes_raiser_only" ON public.disputes
  FOR SELECT USING (raised_by = auth.uid());

DROP POLICY IF EXISTS "disputes_parties_insert" ON public.disputes;
CREATE POLICY "disputes_parties_insert" ON public.disputes
  FOR INSERT WITH CHECK (
    raised_by = auth.uid() AND
    booking_id IN (
      SELECT id FROM public.bookings
      WHERE client_id = auth.uid()
      OR artisan_id IN (
        SELECT id FROM public.artisan_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- =============================================
-- MESSAGES
-- =============================================
DROP POLICY IF EXISTS "messages_booking_parties" ON public.messages;
CREATE POLICY "messages_booking_parties" ON public.messages
  FOR ALL USING (
    booking_id IN (
      SELECT id FROM public.bookings
      WHERE client_id = auth.uid()
      OR artisan_id IN (
        SELECT id FROM public.artisan_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- =============================================
-- REVIEWS
-- =============================================
DROP POLICY IF EXISTS "reviews_public_read" ON public.reviews;
CREATE POLICY "reviews_public_read" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "reviews_client_insert" ON public.reviews;
CREATE POLICY "reviews_client_insert" ON public.reviews
  FOR INSERT WITH CHECK (
    client_id = auth.uid() AND
    booking_id IN (
      SELECT id FROM public.bookings
      WHERE status = 'completed' AND client_id = auth.uid()
    )
  );

-- =============================================
-- NOTIFICATIONS
-- =============================================
DROP POLICY IF EXISTS "notifications_recipient_only" ON public.notifications;
CREATE POLICY "notifications_recipient_only" ON public.notifications
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- AUDIT LOGS
-- =============================================
DROP POLICY IF EXISTS "audit_logs_no_access" ON public.audit_logs;
CREATE POLICY "audit_logs_no_access" ON public.audit_logs
  FOR ALL USING (false);

