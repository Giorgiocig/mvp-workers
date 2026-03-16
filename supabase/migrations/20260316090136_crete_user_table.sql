CREATE TABLE users (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('worker', 'manager')),
  password_hash TEXT, -- Only for manager
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);