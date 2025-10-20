import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AIAssistantPage } from '../../components/ai-assistant/AIAssistantPage';

export default function AIAssistant() {
  return (
    <ProtectedRoute>
      <AIAssistantPage />
    </ProtectedRoute>
  );
}