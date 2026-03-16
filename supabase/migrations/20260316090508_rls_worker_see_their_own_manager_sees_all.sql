CREATE POLICY "Workers see own conversations" 
  ON conversations FOR SELECT 
  USING (
    auth.uid()::text = user_id::text 
    OR 
    EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.role = 'manager')
  );