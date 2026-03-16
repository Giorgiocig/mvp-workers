CREATE POLICY "Users are viewable by everyone" 
  ON users FOR SELECT 
  USING (true);