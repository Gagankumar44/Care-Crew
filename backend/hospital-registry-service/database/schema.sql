# Database Schema for Hospital Registry Service

## Tables

### hospitals
```sql
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  state_code VARCHAR(10) NOT NULL,
  state_name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  type VARCHAR(100) NOT NULL, -- 'public', 'private', 'charitable'
  accreditation VARCHAR(100),
  beds_total INTEGER DEFAULT 0,
  beds_available INTEGER DEFAULT 0,
  icu_beds INTEGER DEFAULT 0,
  specialties TEXT[],
  coordinates JSONB, -- {lat, lng}
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'pending'
  registration_number VARCHAR(100) UNIQUE,
  registration_date DATE,
  last_inspection_date DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hospitals_state_code ON hospitals(state_code);
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_status ON hospitals(status);
CREATE INDEX idx_hospitals_registration_number ON hospitals(registration_number);
CREATE INDEX idx_hospitals_coordinates ON hospitals USING GIN(coordinates);
```

### hospital_registry_logs
```sql
CREATE TABLE IF NOT EXISTS hospital_registry_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  admin_id UUID,
  action VARCHAR(100) NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hospital_registry_logs_hospital_id ON hospital_registry_logs(hospital_id);
CREATE INDEX idx_hospital_registry_logs_admin_id ON hospital_registry_logs(admin_id);
CREATE INDEX idx_hospital_registry_logs_created_at ON hospital_registry_logs(created_at);
```

### hospital_inspections
```sql
CREATE TABLE IF NOT EXISTS hospital_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  inspector_id UUID,
  inspection_date DATE NOT NULL,
  inspection_type VARCHAR(100) NOT NULL, -- 'scheduled', 'random', 'complaint'
  findings JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'passed', 'failed', 'requires_action'
  report_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hospital_inspections_hospital_id ON hospital_inspections(hospital_id);
CREATE INDEX idx_hospital_inspections_status ON hospital_inspections(status);
CREATE INDEX idx_hospital_inspections_inspection_date ON hospital_inspections(inspection_date);
```

