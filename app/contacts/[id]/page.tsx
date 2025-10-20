import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ContactDetailPage } from '@/components/contacts/ContactDetailPage';

export default function ContactDetail({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <ContactDetailPage contactId={params.id} />
    </ProtectedRoute>
  );
}