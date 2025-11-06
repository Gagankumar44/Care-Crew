# Database Schema for Admin Service

## Tables

### state_admins
```sql
CREATE TABLE IF NOT EXISTS state_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  state_code VARCHAR(10) NOT NULL,
  state_name VARCHAR(255) NOT NULL,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_state_admins_user_id ON state_admins(user_id);
CREATE INDEX idx_state_admins_state_code ON state_admins(state_code);
```

### hospital_control_logs
```sql
CREATE TABLE IF NOT EXISTS hospital_control_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES state_admins(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hospital_control_logs_admin_id ON hospital_control_logs(admin_id);
CREATE INDEX idx_hospital_control_logs_hospital_id ON hospital_control_logs(hospital_id);
CREATE INDEX idx_hospital_control_logs_created_at ON hospital_control_logs(created_at);
```

### state_settings
```sql
CREATE TABLE IF NOT EXISTS state_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(10) UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_state_settings_state_code ON state_settings(state_code);
```

