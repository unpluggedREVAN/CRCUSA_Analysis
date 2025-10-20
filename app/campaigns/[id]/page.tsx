import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CampaignDetailPage } from '@/components/campaigns/CampaignDetailPage';

export default function CampaignDetail({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <CampaignDetailPage campaignId={params.id} />
    </ProtectedRoute>
  );
}
