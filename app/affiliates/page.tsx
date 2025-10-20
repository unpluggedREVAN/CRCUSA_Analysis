import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AffiliatesPage } from '@/components/affiliates/AffiliatesPage';

export default function Affiliates() {
  return (
    <ProtectedRoute>
      <AffiliatesPage />
    </ProtectedRoute>
  );
}