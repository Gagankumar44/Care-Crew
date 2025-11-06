# Database Schema for Ambulance Service

## Tables

### air_ambulances
```sql
CREATE TABLE IF NOT EXISTS air_ambulances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  aircraft_type VARCHAR(100) NOT NULL,
  base_location JSONB NOT NULL, -- {lat, lng, address, city, state}
  status VARCHAR(50) DEFAULT 'available', -- 'available', 'on_mission', 'maintenance', 'grounded'
  crew_size INTEGER DEFAULT 2,
  medical_equipment TEXT[],
  capabilities TEXT[], -- 'critical_care', 'neonatal', 'organ_transport', etc.
  max_range_km INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_air_ambulances_status ON air_ambulances(status);
CREATE INDEX idx_air_ambulances_base_location ON air_ambulances USING GIN(base_location);
```

### ambulance_missions
```sql
CREATE TABLE IF NOT EXISTS ambulance_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambulance_id UUID NOT NULL REFERENCES air_ambulances(id) ON DELETE CASCADE,
  mission_type VARCHAR(100) NOT NULL, -- 'emergency', 'transfer', 'organ_transport', 'disaster_response'
  priority VARCHAR(50) DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'dispatched', 'in_transit', 'completed', 'cancelled'
  origin_location JSONB NOT NULL, -- {lat, lng, address}
  destination_location JSONB NOT NULL, -- {lat, lng, address, hospital_id}
  patient_info JSONB, -- {name, age, condition, urgency}
  estimated_distance_km DECIMAL(10,2),
  estimated_duration_minutes INTEGER,
  actual_duration_minutes INTEGER,
  assigned_crew JSONB, -- [{name, role, license}]
  flight_plan JSONB,
  created_by UUID,
  dispatched_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ambulance_missions_ambulance_id ON ambulance_missions(ambulance_id);
CREATE INDEX idx_ambulance_missions_status ON ambulance_missions(status);
CREATE INDEX idx_ambulance_missions_priority ON ambulance_missions(priority);
CREATE INDEX idx_ambulance_missions_created_at ON ambulance_missions(created_at);
CREATE INDEX idx_ambulance_missions_origin_location ON ambulance_missions USING GIN(origin_location);
CREATE INDEX idx_ambulance_missions_destination_location ON ambulance_missions USING GIN(destination_location);
```

### mission_tracking
```sql
CREATE TABLE IF NOT EXISTS mission_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES ambulance_missions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  location JSONB NOT NULL, -- {lat, lng, altitude}
  status VARCHAR(50) NOT NULL,
  speed_knots DECIMAL(5,2),
  heading_degrees INTEGER,
  fuel_percentage DECIMAL(5,2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mission_tracking_mission_id ON mission_tracking(mission_id);
CREATE INDEX idx_mission_tracking_timestamp ON mission_tracking(timestamp);
CREATE INDEX idx_mission_tracking_location ON mission_tracking USING GIN(location);
```

### ambulance_crew
```sql
CREATE TABLE IF NOT EXISTS ambulance_crew (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(100) NOT NULL, -- 'pilot', 'paramedic', 'nurse', 'doctor'
  certifications TEXT[],
  assigned_ambulance_id UUID REFERENCES air_ambulances(id),
  status VARCHAR(50) DEFAULT 'available', -- 'available', 'on_duty', 'off_duty'
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ambulance_crew_user_id ON ambulance_crew(user_id);
CREATE INDEX idx_ambulance_crew_assigned_ambulance_id ON ambulance_crew(assigned_ambulance_id);
CREATE INDEX idx_ambulance_crew_status ON ambulance_crew(status);
```

