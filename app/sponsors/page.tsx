import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SponsorsPage } from '@/components/sponsors/SponsorsPage';

export default function Sponsors() {
  return (
    <ProtectedRoute>
      <SponsorsPage />
    </ProtectedRoute>
  );
}