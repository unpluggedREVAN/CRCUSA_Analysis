import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ContactsPage } from '@/components/contacts/ContactsPage';

export default function Contacts() {
  return (
    <ProtectedRoute>
      <ContactsPage />
    </ProtectedRoute>
  );
}