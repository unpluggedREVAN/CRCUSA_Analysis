import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NotesCanvasPage } from '@/components/notes/NotesCanvasPage';

export default function NotesCanvas() {
  return (
    <ProtectedRoute>
      <NotesCanvasPage />
    </ProtectedRoute>
  );
}