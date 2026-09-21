-- Elite Tax Services — PostgreSQL schema
-- Active tables: leads, documents. Remaining tables define the future platform
-- (customer dashboard, filings, messaging, payments, scheduling, staff assignment).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS staff (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     text NOT NULL,
  email         text UNIQUE NOT NULL,
  role          text NOT NULL DEFAULT 'preparer', -- preparer | reviewer | admin
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    text NOT NULL,
  last_name     text NOT NULL,
  email         text UNIQUE NOT NULL,
  phone         text,
  customer_type text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Customer accounts (email OTP sign-in)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS email_verified_at timestamptz;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_login_at timestamptz;
CREATE UNIQUE INDEX IF NOT EXISTS customers_email_lower_idx ON customers (lower(email));

CREATE TABLE IF NOT EXISTS auth_otps (
  email         text NOT NULL,
  purpose       text NOT NULL CHECK (purpose IN ('login','register')),
  code_hash     text NOT NULL,
  attempts      int NOT NULL DEFAULT 0,
  payload       jsonb,
  expires_at    timestamptz NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (email, purpose)
);

CREATE TABLE IF NOT EXISTS leads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    text NOT NULL,
  last_name     text NOT NULL,
  email         text NOT NULL,
  phone         text NOT NULL,
  service       text NOT NULL,
  customer_type text NOT NULL,
  tax_year      text NOT NULL,
  message       text,
  source        text,
  estimate      jsonb,
  status        text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','converted','closed')),
  assigned_to   uuid REFERENCES staff(id),
  customer_id   uuid REFERENCES customers(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);

CREATE TABLE IF NOT EXISTS documents (
  id            uuid PRIMARY KEY,
  lead_id       uuid REFERENCES leads(id) ON DELETE SET NULL,
  customer_id   uuid REFERENCES customers(id),
  original_name text NOT NULL,
  mime_type     text NOT NULL,
  size_bytes    bigint NOT NULL,
  category      text,
  storage_key   text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS documents_lead_idx ON documents (lead_id);

CREATE TABLE IF NOT EXISTS tax_filings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   uuid NOT NULL REFERENCES customers(id),
  tax_year      int NOT NULL,
  filing_type   text NOT NULL,            -- federal | state | fbar | itr ...
  status        text NOT NULL DEFAULT 'intake', -- intake | documents | preparing | review | filed | accepted
  assigned_to   uuid REFERENCES staff(id),
  refund_amount numeric(12,2),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   uuid NOT NULL REFERENCES customers(id),
  sender        text NOT NULL, -- customer | staff
  staff_id      uuid REFERENCES staff(id),
  body          text NOT NULL,
  read_at       timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   uuid NOT NULL REFERENCES customers(id),
  filing_id     uuid REFERENCES tax_filings(id),
  amount        numeric(12,2) NOT NULL,
  currency      text NOT NULL DEFAULT 'USD',
  provider      text,           -- stripe | ...
  provider_ref  text,
  status        text NOT NULL DEFAULT 'pending',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id       uuid REFERENCES leads(id),
  customer_id   uuid REFERENCES customers(id),
  staff_id      uuid REFERENCES staff(id),
  starts_at     timestamptz NOT NULL,
  ends_at       timestamptz NOT NULL,
  channel       text NOT NULL DEFAULT 'phone', -- phone | video | office
  status        text NOT NULL DEFAULT 'scheduled',
  created_at    timestamptz NOT NULL DEFAULT now()
);
