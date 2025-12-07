-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('inbound', 'outbound')),
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT NOT NULL,
  reference_number TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  csv_batch_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_employee_id ON transactions(employee_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_csv_batch_id ON transactions(csv_batch_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Owners can view all users" ON users FOR SELECT USING ((SELECT role FROM users WHERE id = auth.uid()::uuid) = 'owner');

-- RLS Policies for transactions table
CREATE POLICY "Employees can view their own transactions" ON transactions FOR SELECT USING (employee_id = auth.uid()::uuid);
CREATE POLICY "Employees can insert their own transactions" ON transactions FOR INSERT WITH CHECK (employee_id = auth.uid()::uuid);
CREATE POLICY "Owners can view all transactions" ON transactions FOR SELECT USING ((SELECT role FROM users WHERE id = auth.uid()::uuid) = 'owner');
