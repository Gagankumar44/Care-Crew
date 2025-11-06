# Database Schema for Patient Data Service

## Tables

### patient_profiles
```sql
CREATE TABLE patient_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  sync_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  sync_timestamp TIMESTAMP,
  data TEXT NOT NULL -- Encrypted JSON
);

CREATE INDEX idx_patient_profiles_user_id ON patient_profiles(user_id);
CREATE INDEX idx_patient_profiles_sync_status ON patient_profiles(sync_status);
```

### skin_checks
```sql
CREATE TABLE skin_checks (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patient_profiles(id),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  sync_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  sync_timestamp TIMESTAMP,
  image_url TEXT NOT NULL, -- GCS URL
  location_data JSONB,
  risk_assessment JSONB
);

CREATE INDEX idx_skin_checks_patient_id ON skin_checks(patient_id);
CREATE INDEX idx_skin_checks_created_at ON skin_checks(created_at DESC);
```

### rom_records
```sql
CREATE TABLE rom_records (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patient_profiles(id),
  exercise_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  sync_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  sync_timestamp TIMESTAMP,
  angle_data JSONB NOT NULL,
  max_angle REAL,
  min_angle REAL,
  duration_seconds INTEGER
);

CREATE INDEX idx_rom_records_patient_id ON rom_records(patient_id);
CREATE INDEX idx_rom_records_exercise_id ON rom_records(exercise_id);
CREATE INDEX idx_rom_records_created_at ON rom_records(created_at DESC);
```

### sync_queue
```sql
CREATE TABLE sync_queue (
  id UUID PRIMARY KEY,
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  operation VARCHAR(20) NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL,
  data JSONB NOT NULL,
  origin VARCHAR(20) NOT NULL DEFAULT 'patient'
);

CREATE INDEX idx_sync_queue_priority ON sync_queue(priority DESC, created_at ASC);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  user_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
```

## Migration Script

Run these SQL commands to create the schema:

```bash
psql -U mediar_user -d mediar_db -f schema.sql
```

