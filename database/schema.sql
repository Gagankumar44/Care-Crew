-- MediAR MVP Database Schema
-- PostgreSQL (Supabase)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text,
  name text,
  role text NOT NULL DEFAULT 'patient', -- patient / doctor / hospital / admin
  created_at timestamptz DEFAULT now(),
  profile JSONB,
  clerk_id text UNIQUE -- Clerk user ID
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_clerk_id ON users(clerk_id);

-- HOSPITALS (created before doctors since doctors reference it)
CREATE TABLE hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  state text,
  city text,
  address text,
  contact_phone text,
  facilities JSONB, -- {"ICU": true, "MRI": true, ...}
  avg_cost numeric,
  rating numeric(2,1) DEFAULT 0,
  images text[], -- urls
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_hospitals_state ON hospitals(state);
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_rating ON hospitals(rating);

-- SURGERIES
CREATE TABLE surgeries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  description text
);

CREATE INDEX idx_surgeries_category ON surgeries(category);

-- HOSPITAL SURGERY PRICES
CREATE TABLE hospital_surgery_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(id) ON DELETE CASCADE,
  surgery_id uuid REFERENCES surgeries(id) ON DELETE CASCADE,
  min_cost numeric,
  max_cost numeric,
  avg_cost numeric,
  UNIQUE(hospital_id, surgery_id)
);

CREATE INDEX idx_hospital_surgery_prices_hospital ON hospital_surgery_prices(hospital_id);
CREATE INDEX idx_hospital_surgery_prices_surgery ON hospital_surgery_prices(surgery_id);

-- DOCTORS
CREATE TABLE doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  hospital_id uuid REFERENCES hospitals(id),
  specialization text,
  qualifications text,
  experience_years int,
  rating numeric(2,1) DEFAULT 0,
  profile_summary text,
  availabilities JSONB, -- basic availability blocks
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_doctors_hospital_id ON doctors(hospital_id);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_doctors_rating ON doctors(rating);

-- APPOINTMENTS
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  hospital_id uuid REFERENCES hospitals(id),
  scheduled_at timestamptz,
  type text, -- "virtual" / "in_person"
  status text DEFAULT 'scheduled', -- scheduled, confirmed, cancelled, completed
  reason text,
  created_at timestamptz DEFAULT now(),
  video_call_token text -- WebRTC token for virtual calls
);

CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);

-- PRESCRIPTIONS
CREATE TABLE prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  prescription_pdf_url text,
  notes text,
  medications JSONB, -- [{name, dosage, instructions}]
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_prescriptions_appointment_id ON prescriptions(appointment_id);

-- MEDICAL RECORDS
CREATE TABLE medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text,
  description text,
  file_url text,
  meta JSONB, -- OCR summary, parsed values
  uploaded_at timestamptz DEFAULT now()
);

CREATE INDEX idx_medical_records_user_id ON medical_records(user_id);
CREATE INDEX idx_medical_records_uploaded_at ON medical_records(uploaded_at);

-- LABS
CREATE TABLE labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text,
  state text,
  contact text,
  tests JSONB -- list of tests & prices
);

CREATE INDEX idx_labs_city ON labs(city);
CREATE INDEX idx_labs_state ON labs(state);

-- LAB BOOKINGS
CREATE TABLE lab_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  tests JSONB,
  scheduled_at timestamptz,
  status text DEFAULT 'booked', -- booked, completed, cancelled
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_lab_bookings_patient_id ON lab_bookings(patient_id);
CREATE INDEX idx_lab_bookings_lab_id ON lab_bookings(lab_id);
CREATE INDEX idx_lab_bookings_status ON lab_bookings(status);

-- MESSAGES (secure messaging)
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text,
  attachments text[], -- urls
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false
);

CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- STATES
CREATE TABLE states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE, -- State code (e.g., 'KA', 'TN', 'MH')
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_states_code ON states(code);

-- CITIES
CREATE TABLE cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id uuid REFERENCES states(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(state_id, name)
);

CREATE INDEX idx_cities_state_id ON cities(state_id);
CREATE INDEX idx_cities_name ON cities(name);

-- Update hospitals table to reference states and cities
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS state_id uuid REFERENCES states(id);
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES cities(id);
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS coordinates JSONB; -- {lat, lng}
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS contact_email text;
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS emergency_contact text;
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS air_ambulance_available boolean DEFAULT false;
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS license_number text;
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS nabh_accreditation boolean DEFAULT false;
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;

-- FEEDBACKS/RATINGS
CREATE TABLE feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  hospital_id uuid REFERENCES hospitals(id) ON DELETE CASCADE,
  rating numeric(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, hospital_id)
);

CREATE INDEX idx_feedbacks_hospital_id ON feedbacks(hospital_id);
CREATE INDEX idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX idx_feedbacks_rating ON feedbacks(rating);

-- AIR AMBULANCES
CREATE TABLE air_ambulances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number text UNIQUE NOT NULL,
  base_city text NOT NULL,
  base_state text NOT NULL,
  status text DEFAULT 'available', -- available, on_mission, maintenance, grounded
  capacity integer DEFAULT 1,
  aircraft_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_air_ambulances_status ON air_ambulances(status);
CREATE INDEX idx_air_ambulances_base_state ON air_ambulances(base_state);

-- AIR AMBULANCE MISSIONS
CREATE TABLE missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ambulance_id uuid REFERENCES air_ambulances(id),
  patient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  source_city text NOT NULL,
  source_state text NOT NULL,
  destination_city text NOT NULL,
  destination_state text NOT NULL,
  destination_hospital_id uuid REFERENCES hospitals(id),
  status text DEFAULT 'pending', -- pending, dispatched, in_transit, completed, cancelled
  requested_at timestamptz DEFAULT now(),
  dispatched_at timestamptz,
  completed_at timestamptz,
  patient_info JSONB -- {name, age, condition, urgency}
);

CREATE INDEX idx_missions_ambulance_id ON missions(ambulance_id);
CREATE INDEX idx_missions_patient_id ON missions(patient_id);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_missions_destination_hospital_id ON missions(destination_hospital_id);

-- EMERGENCY LOG
CREATE TABLE emergencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  location JSONB, -- {lat, lng, address}
  contact_person JSONB,
  triggered_at timestamptz DEFAULT now(),
  status text DEFAULT 'open' -- open, resolved, cancelled
);

CREATE INDEX idx_emergencies_user_id ON emergencies(user_id);
CREATE INDEX idx_emergencies_status ON emergencies(status);
CREATE INDEX idx_emergencies_triggered_at ON emergencies(triggered_at);

-- Enable Row Level Security (RLS) - Basic policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can only see their own data)
-- Note: These are simplified - implement proper policies based on roles

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR auth.uid()::text = clerk_id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text OR auth.uid()::text = clerk_id);

CREATE POLICY "Medical records are private" ON medical_records
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Prescriptions are private" ON prescriptions
  FOR SELECT USING (
    auth.uid()::text = patient_id::text OR 
    auth.uid()::text = (SELECT user_id FROM doctors WHERE id = doctor_id)::text
  );

CREATE POLICY "Appointments are private" ON appointments
  FOR SELECT USING (
    auth.uid()::text = patient_id::text OR 
    auth.uid()::text = (SELECT user_id FROM doctors WHERE id = doctor_id)::text
  );

CREATE POLICY "Messages are private" ON messages
  FOR SELECT USING (
    auth.uid()::text = sender_id::text OR 
    auth.uid()::text = receiver_id::text
  );

-- Hospitals and doctors are public (read-only for patients)
CREATE POLICY "Hospitals are public" ON hospitals
  FOR SELECT USING (true);

CREATE POLICY "Doctors are public" ON doctors
  FOR SELECT USING (true);

