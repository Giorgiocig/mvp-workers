CREATE POLICY "Workers can update own conversations" 
  ON conversations FOR UPDATE 
  USING (auth.uid()::text = user_id::text);