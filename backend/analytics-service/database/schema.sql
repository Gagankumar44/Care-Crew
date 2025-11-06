# Database Schema for Analytics Service

## Tables

### surgery_demand_history
```sql
CREATE TABLE IF NOT EXISTS surgery_demand_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID,
  state_code VARCHAR(10),
  surgery_type VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  demand_count INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_surgery_demand_history_hospital_id ON surgery_demand_history(hospital_id);
CREATE INDEX idx_surgery_demand_history_state_code ON surgery_demand_history(state_code);
CREATE INDEX idx_surgery_demand_history_date ON surgery_demand_history(date);
CREATE INDEX idx_surgery_demand_history_surgery_type ON surgery_demand_history(surgery_type);
CREATE INDEX idx_surgery_demand_history_specialty ON surgery_demand_history(specialty);
```

### surgery_demand_predictions
```sql
CREATE TABLE IF NOT EXISTS surgery_demand_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID,
  state_code VARCHAR(10),
  surgery_type VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  predicted_demand INTEGER NOT NULL,
  confidence_level DECIMAL(5,2) DEFAULT 0.0,
  prediction_date DATE NOT NULL,
  forecast_period_days INTEGER DEFAULT 30,
  model_version VARCHAR(50),
  factors JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_surgery_demand_predictions_hospital_id ON surgery_demand_predictions(hospital_id);
CREATE INDEX idx_surgery_demand_predictions_state_code ON surgery_demand_predictions(state_code);
CREATE INDEX idx_surgery_demand_predictions_prediction_date ON surgery_demand_predictions(prediction_date);
CREATE INDEX idx_surgery_demand_predictions_surgery_type ON surgery_demand_predictions(surgery_type);
```

### analytics_reports
```sql
CREATE TABLE IF NOT EXISTS analytics_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type VARCHAR(100) NOT NULL,
  scope VARCHAR(50) NOT NULL, -- 'national', 'state', 'hospital'
  scope_id UUID,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  report_data JSONB NOT NULL,
  generated_by UUID,
  generated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_reports_report_type ON analytics_reports(report_type);
CREATE INDEX idx_analytics_reports_scope ON analytics_reports(scope);
CREATE INDEX idx_analytics_reports_scope_id ON analytics_reports(scope_id);
CREATE INDEX idx_analytics_reports_generated_at ON analytics_reports(generated_at);
```

### resource_utilization
```sql
CREATE TABLE IF NOT EXISTS resource_utilization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID,
  state_code VARCHAR(10),
  resource_type VARCHAR(100) NOT NULL, -- 'operating_room', 'icu_bed', 'surgeon', etc.
  resource_name VARCHAR(255),
  utilization_percentage DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resource_utilization_hospital_id ON resource_utilization(hospital_id);
CREATE INDEX idx_resource_utilization_state_code ON resource_utilization(state_code);
CREATE INDEX idx_resource_utilization_date ON resource_utilization(date);
CREATE INDEX idx_resource_utilization_resource_type ON resource_utilization(resource_type);
```

