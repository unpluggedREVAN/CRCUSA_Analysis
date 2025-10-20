import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CampaignsPage } from '@/components/campaigns/CampaignsPage';

export default function Campaigns() {
  return (
    <ProtectedRoute>
      <CampaignsPage />
    </ProtectedRoute>
  );
}