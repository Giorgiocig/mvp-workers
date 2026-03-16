-- Triggers for updated_at
CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
 
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON production_orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
 