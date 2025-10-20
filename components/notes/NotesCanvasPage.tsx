'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { notesService, connectionsService, Note, Connection } from '@/lib/firestore-service';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Link as LinkIcon,
  X
} from 'lucide-react';

const noteColors = [
  { name: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-300' },
  { name: 'blue', bg: 'bg-blue-100', border: 'border-blue-300' },
  { name: 'green', bg: 'bg-green-100', border: 'border-green-300' },
  { name: 'purple', bg: 'bg-purple-100', border: 'border-purple-300' },
  { name: 'pink', bg: 'bg-pink-100', border: 'border-pink-300' },
  { name: 'orange', bg: 'bg-orange-100', border: 'border-orange-300' }
];

const CANVAS_MIN_X = 0;
const CANVAS_MIN_Y = 0;
const CANVAS_MAX_X = 3000;
const CANVAS_MAX_Y = 2000;

export function NotesCanvasPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [connectionToDelete, setConnectionToDelete] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    color: 'yellow'
  });
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notesData, connectionsData] = await Promise.all([
        notesService.getAll(),
        connectionsService.getAll()
      ]);
      setNotes(notesData);
      setConnections(connectionsData);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Error al cargar las notas');
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (colorName: string) => {
    return noteColors.find(c => c.name === colorName) || noteColors[0];
  };

  const handleAddNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error('El título y contenido son obligatorios');
      return;
    }

    try {
      const noteId = await notesService.create({
        title: newNote.title,
        content: newNote.content,
        owner: user?.email || 'Desconocido',
        x: 100,
        y: 100,
        width: 250,
        height: 200,
        color: newNote.color
      });

      await loadData();
      setNewNote({ title: '', content: '', color: 'yellow' });
      setShowAddDialog(false);
      toast.success('Nota creada exitosamente');
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Error al crear la nota');
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNote.title.trim() || !editingNote.content.trim()) {
      toast.error('El título y contenido son obligatorios');
      return;
    }

    try {
      await notesService.update(editingNote.id, {
        title: editingNote.title,
        content: editingNote.content,
        color: editingNote.color
      });

      await loadData();
      setEditingNote(null);
      toast.success('Nota actualizada exitosamente');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Error al actualizar la nota');
    }
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      await connectionsService.deleteByNoteId(noteToDelete);
      await notesService.delete(noteToDelete);
      await loadData();
      setNoteToDelete(null);
      toast.success('Nota eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Error al eliminar la nota');
    }
  };

  const handleMouseDown = (e: React.MouseEvent, noteId: string) => {
    if (isConnecting) {
      if (!connectionStart) {
        setConnectionStart(noteId);
        toast.info('Selecciona la nota de destino');
      } else if (connectionStart !== noteId) {
        createConnection(connectionStart, noteId);
      }
      return;
    }

    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    setDraggedNote(noteId);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: (e.clientX - pan.x) / zoom - note.x,
      y: (e.clientY - pan.y) / zoom - note.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    if (draggedNote) {
      const note = notes.find(n => n.id === draggedNote);
      if (!note) return;

      let newX = (e.clientX - pan.x) / zoom - dragOffset.x;
      let newY = (e.clientY - pan.y) / zoom - dragOffset.y;

      newX = Math.max(CANVAS_MIN_X, Math.min(CANVAS_MAX_X - note.width, newX));
      newY = Math.max(CANVAS_MIN_Y, Math.min(CANVAS_MAX_Y - note.height, newY));

      setNotes(notes.map(n =>
        n.id === draggedNote ? { ...n, x: newX, y: newY } : n
      ));
    }
  };

  const handleMouseUp = async () => {
    if (draggedNote) {
      const note = notes.find(n => n.id === draggedNote);
      if (note) {
        try {
          await notesService.update(note.id, { x: note.x, y: note.y });
        } catch (error) {
          console.error('Error updating note position:', error);
        }
      }
      setDraggedNote(null);
    }
    setIsPanning(false);
  };

  const createConnection = async (fromId: string, toId: string) => {
    const existing = connections.find(c =>
      (c.fromNoteId === fromId && c.toNoteId === toId) ||
      (c.fromNoteId === toId && c.toNoteId === fromId)
    );

    if (existing) {
      toast.warning('Esta conexión ya existe');
      setConnectionStart(null);
      setIsConnecting(false);
      return;
    }

    try {
      await connectionsService.create({ fromNoteId: fromId, toNoteId: toId });
      await loadData();
      toast.success('Conexión creada');
    } catch (error) {
      console.error('Error creating connection:', error);
      toast.error('Error al crear la conexión');
    }

    setConnectionStart(null);
    setIsConnecting(false);
  };

  const handleDeleteConnection = async () => {
    if (!connectionToDelete) return;

    try {
      await connectionsService.delete(connectionToDelete);
      await loadData();
      setConnectionToDelete(null);
      toast.success('Conexión eliminada');
    } catch (error) {
      console.error('Error deleting connection:', error);
      toast.error('Error al eliminar la conexión');
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const startPanning = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };

  const getNoteCenter = (note: Note) => ({
    x: note.x + note.width / 2,
    y: note.y + note.height / 2
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <PageHeader
          title="Canvas de Notas"
          description="Organiza ideas y conexiones visualmente"
        >
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant={isConnecting ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setIsConnecting(!isConnecting);
                setConnectionStart(null);
                if (!isConnecting) {
                  toast.info('Haz clic en dos notas para conectarlas');
                }
              }}
              className={isConnecting ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              {isConnecting ? 'Conectando...' : 'Conectar'}
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Nota
            </Button>
          </div>
        </PageHeader>

        <div
          ref={canvasRef}
          className="flex-1 overflow-hidden relative bg-gray-100 cursor-move"
          onMouseDown={startPanning}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`
          }}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              position: 'absolute',
              width: `${CANVAS_MAX_X}px`,
              height: `${CANVAS_MAX_Y}px`
            }}
          >
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1
              }}
            >
              {connections.map(conn => {
                const fromNote = notes.find(n => n.id === conn.fromNoteId);
                const toNote = notes.find(n => n.id === conn.toNoteId);
                if (!fromNote || !toNote) return null;

                const from = getNoteCenter(fromNote);
                const to = getNoteCenter(toNote);

                return (
                  <g key={conn.id}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConnectionToDelete(conn.id);
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {notes.map(note => {
              const colorClasses = getColorClasses(note.color);
              return (
                <div
                  key={note.id}
                  className={`absolute ${colorClasses.bg} ${colorClasses.border} border-2 rounded-lg shadow-lg p-4 cursor-move transition-shadow hover:shadow-xl`}
                  style={{
                    left: note.x,
                    top: note.y,
                    width: note.width,
                    height: note.height,
                    zIndex: draggedNote === note.id ? 100 : 10
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, note.id);
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm line-clamp-1 flex-1">{note.title}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingNote(note);
                        }}
                        className="text-gray-600 hover:text-gray-900 p-1"
                      >
                        <Plus className="h-3 w-3 rotate-45" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNoteToDelete(note.id);
                        }}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs mb-2 overflow-y-auto" style={{ maxHeight: note.height - 80 }}>
                    {note.content}
                  </p>
                  <p className="text-xs text-gray-600 italic border-t pt-2 mt-auto">
                    De: {note.owner}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Nota</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Título de la nota"
              />
            </div>
            <div>
              <Label>Contenido *</Label>
              <Textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Escribe aquí..."
                rows={4}
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 mt-2">
                {noteColors.map(color => (
                  <button
                    key={color.name}
                    className={`w-8 h-8 rounded ${color.bg} ${color.border} border-2 ${
                      newNote.color === color.name ? 'ring-2 ring-teal-600' : ''
                    }`}
                    onClick={() => setNewNote({ ...newNote, color: color.name })}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddNote} className="bg-teal-600 hover:bg-teal-700">
              Crear Nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Nota</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4">
              <div>
                <Label>Título *</Label>
                <Input
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Contenido *</Label>
                <Textarea
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-2">
                  {noteColors.map(color => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded ${color.bg} ${color.border} border-2 ${
                        editingNote.color === color.name ? 'ring-2 ring-teal-600' : ''
                      }`}
                      onClick={() => setEditingNote({ ...editingNote, color: color.name })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNote(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateNote} className="bg-teal-600 hover:bg-teal-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar nota?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la nota y todas sus conexiones. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!connectionToDelete} onOpenChange={() => setConnectionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar conexión?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConnection} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
