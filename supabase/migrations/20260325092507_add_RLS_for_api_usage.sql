-- Enable RLS
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
 
-- Only managers can view API usage
CREATE POLICY "Only managers can view API usage" 
  ON api_usage FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'manager')
  );
 
-- System can insert (from API route)
CREATE POLICY "System can insert API usage" 
  ON api_usage FOR INSERT 
  WITH CHECK (true);