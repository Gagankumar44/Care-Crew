# Database Schema for RPM Data Service

## Tables

### health_data
```sql
CREATE TABLE health_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patient_profiles(id),
  source VARCHAR(50) NOT NULL, -- 'healthkit', 'health_connect', 'rpm_device'
  data_type VARCHAR(50) NOT NULL, -- 'heart_rate', 'blood_pressure', 'steps', 'sleep', etc.
  value DOUBLE PRECISION NOT NULL,
  unit VARCHAR(20),
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_health_data_patient_id ON health_data(patient_id);
CREATE INDEX idx_health_data_timestamp ON health_data(timestamp DESC);
CREATE INDEX idx_health_data_type ON health_data(data_type);
CREATE INDEX idx_health_data_source ON health_data(source);
CREATE INDEX idx_health_data_patient_type ON health_data(patient_id, data_type);
```

## Migration Script

Run these SQL commands to create the schema:

```bash
psql -U mediar_user -d mediar_db -f schema.sql
```

## Supported Data Types

- `heart_rate` - Heart rate in BPM
- `blood_pressure_systolic` - Systolic BP in mmHg
- `blood_pressure_diastolic` - Diastolic BP in mmHg
- `steps` - Step count
- `sleep_duration` - Sleep duration in minutes
- `blood_glucose` - Blood glucose in mg/dL
- `oxygen_saturation` - SpO2 percentage
- `weight` - Weight in kg
- `body_temperature` - Temperature in Celsius

## Supported Sources

- `healthkit` - Apple HealthKit (iOS)
- `health_connect` - Google Health Connect (Android)
- `rpm_device` - Direct RPM device integration
- `manual` - Manually entered data

