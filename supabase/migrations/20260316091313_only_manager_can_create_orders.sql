CREATE POLICY "Only managers can create orders" 
  ON production_orders FOR INSERT 
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.role = 'manager')
  );