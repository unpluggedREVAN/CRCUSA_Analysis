import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CompanyDetailPage } from '@/components/companies/CompanyDetailPage';

export default function CompanyDetail({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <CompanyDetailPage companyId={params.id} />
    </ProtectedRoute>
  );
}