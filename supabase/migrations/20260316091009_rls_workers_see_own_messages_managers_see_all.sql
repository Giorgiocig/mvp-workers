-- Messages: Same logic as conversations
CREATE POLICY "Workers see own messages, managers see all" 
  ON messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (
        conversations.user_id::text = auth.uid()::text 
        OR 
        EXISTS (SELECT 1 FROM users WHERE users.id::text = auth.uid()::text AND users.role = 'manager')
      )
    )
  );