-- Enable PostGIS for proximity search
CREATE EXTENSION IF NOT EXISTS postgis;

-- Shared updated_at trigger function (applied to all tables that have updated_at)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

