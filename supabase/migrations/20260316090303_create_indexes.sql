CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_orders_status ON production_orders(status);
CREATE INDEX idx_orders_assigned_to ON production_orders(assigned_to);