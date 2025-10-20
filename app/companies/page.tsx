import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CompaniesPage } from '@/components/companies/CompaniesPage';

export default function Companies() {
  return (
    <ProtectedRoute>
      <CompaniesPage />
    </ProtectedRoute>
  );
}