-- ====================================================================
-- ONLINE TICKET BOOKING SYSTEM - SUPABASE POSTGRESQL DDL SCHEMA
-- Team: AIML D1
-- Members:
--   - SHREYA L SHETTY (SRN: R25EA214)
--   - VARALAKSHMI T J (SRN: R25EA239)
--   - S MONISH (SRN: R25EA195)
--   - SAGAR (SRN: R25EA196)
-- Problem Statement: "Users need a centralized platform for discovering events and booking tickets."
-- ====================================================================

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('customer', 'organizer', 'admin')) DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'Music', 'Tech', 'Workshop', 'Sports', 'Conference'
  venue TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  ticket_price NUMERIC(10, 2) DEFAULT 0.00,
  total_capacity INT NOT NULL CHECK (total_capacity > 0),
  available_tickets INT NOT NULL CHECK (available_tickets >= 0),
  banner_url TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT UNIQUE NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE RESTRICT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tickets_count INT NOT NULL CHECK (tickets_count > 0),
  total_amount NUMERIC(10, 2) NOT NULL,
  booking_status TEXT CHECK (booking_status IN ('confirmed', 'cancelled')) DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies
-- Profiles: Users can view all profiles, update only their own
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Events: Everyone can view published events; Organizers can create/edit their own
DROP POLICY IF EXISTS "Anyone can view published events" ON public.events;
CREATE POLICY "Anyone can view published events" ON public.events FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Organizers can insert events" ON public.events;
CREATE POLICY "Organizers can insert events" ON public.events FOR INSERT WITH CHECK (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Organizers can update own events" ON public.events;
CREATE POLICY "Organizers can update own events" ON public.events FOR UPDATE USING (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Organizers can delete own events" ON public.events;
CREATE POLICY "Organizers can delete own events" ON public.events FOR DELETE USING (auth.uid() = organizer_id);

-- Bookings: Customers can read/insert their own bookings; Organizers can view bookings for their events
DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;
CREATE POLICY "Users can read own bookings" ON public.bookings FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() IN (SELECT organizer_id FROM public.events WHERE id = bookings.event_id)
);

DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can cancel their bookings" ON public.bookings;
CREATE POLICY "Users can cancel their bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- 6. Trigger to automatically create a profile entry when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Atomic Ticket Booking Procedure (Prevents overselling)
CREATE OR REPLACE FUNCTION public.book_tickets_atomic(
  p_booking_reference TEXT,
  p_event_id UUID,
  p_user_id UUID,
  p_tickets_count INT,
  p_total_amount NUMERIC
)
RETURNS UUID AS $$
DECLARE
  v_available INT;
  v_booking_id UUID;
BEGIN
  -- Lock the event row for update
  SELECT available_tickets INTO v_available
  FROM public.events
  WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found.';
  END IF;

  IF v_available < p_tickets_count THEN
    RAISE EXCEPTION 'Insufficient tickets remaining. Only % tickets available.', v_available;
  END IF;

  -- Decrement available tickets
  UPDATE public.events
  SET available_tickets = available_tickets - p_tickets_count
  WHERE id = p_event_id;

  -- Create booking record
  INSERT INTO public.bookings (
    booking_reference,
    event_id,
    user_id,
    tickets_count,
    total_amount,
    booking_status
  )
  VALUES (
    p_booking_reference,
    p_event_id,
    p_user_id,
    p_tickets_count,
    p_total_amount,
    'confirmed'
  )
  RETURNING id INTO v_booking_id;

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
