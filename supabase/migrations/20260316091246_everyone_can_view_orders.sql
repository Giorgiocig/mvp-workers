CREATE POLICY "Everyone can view orders" 
  ON production_orders FOR SELECT 
  USING (true);