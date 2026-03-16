CREATE POLICY "Only managers can delete orders" 
  ON production_orders FOR DELETE 
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.role = 'manager')
  );