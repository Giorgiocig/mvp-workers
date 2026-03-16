CREATE POLICY "Workers can create own conversations" 
  ON conversations FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);