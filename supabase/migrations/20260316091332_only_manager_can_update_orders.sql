CREATE POLICY "Only managers can update orders" 
  ON production_orders FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.role = 'manager')
  );