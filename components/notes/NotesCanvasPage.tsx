'use client';

import React, { useState, useRef } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  StickyNote,
  Palette,
  Tag,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react';

// Mock notes data
interface Note {
  id: string;
  text: string;
  tags: string[];
  color: string;
  position: { x: number; y: number };
  createdAt: string;
  updatedAt: string;
}

const mockNotes: Note[] = [
  {
    id: '1',
    text: 'Seguimiento con Luis Bolaños - Land & Ocean. Interesado en membresía premium.',
    tags: ['lead', 'premium', 'seguimiento'],
    color: 'yellow',
    position: { x: 100, y: 100 },
    createdAt: '2024-10-20',
    updatedAt: '2024-10-20'
  },
  {
    id: '2',
    text: 'Evento networking noviembre - confirmar catering y ubicación',
    tags: ['evento', 'networking', 'logística'],
    color: 'blue',
    position: { x: 350, y: 150 },
    createdAt: '2024-10-18',
    updatedAt: '2024-10-19'
  },
  {
    id: '3',
    text: 'Revisar propuesta de patrocinio para Pollo Tico - categoría Oro',
    tags: ['patrocinio', 'oro', 'propuesta'],
    color: 'green',
    position: { x: 200, y: 300 },
    createdAt: '2024-10-15',
    updatedAt: '2024-10-15'
  },
  {
    id: '4',
    text: 'Campaña Q4 - preparar contenido para nuevos afiliados',
    tags: ['campaña', 'contenido', 'afiliados'],
    color: 'purple',
    position: { x: 500, y: 200 },
    createdAt: '2024-10-12',
    updatedAt: '2024-10-20'
  }
];

const noteColors = [
  { name: 'yellow', bg: 'bg-yellow-200', border: 'border-yellow-300', text: 'text-yellow-900' },
  { name: 'blue', bg: 'bg-blue-200', border: 'border-blue-300', text: 'text-blue-900' },
  { name: 'green', bg: 'bg-green-200', border: 'border-green-300', text: 'text-green-900' },
  { name: 'purple', bg: 'bg-purple-200', border: 'border-purple-300', text: 'text-purple-900' },
  { name: 'pink', bg: 'bg-pink-200', border: 'border-pink-300', text: 'text-pink-900' },
  { name: 'orange', bg: 'bg-orange-200', border: 'border-orange-300', text: 'text-orange-900' }
];

export function NotesCanvasPage() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    text: '',
    tags: '',
    color: 'yellow'
  });
  const canvasRef = useRef<HTMLDivElement>(null);

  const getColorClasses = (colorName: string) => {
    return noteColors.find(c => c.name === colorName) || noteColors[0];
  };

  const handleAddNote = () => {
    if (!newNote.text.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      text: newNote.text,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      color: newNote.color,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setNotes(prev => [...prev, note]);
    setNewNote({ text: '', tags: '', color: 'yellow' });
    setShowAddDialog(false);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      text: note.text,
      tags: note.tags.join(', '),
      color: note.color
    });
    setShowAddDialog(true);
  };

  const handleUpdateNote = () => {
    if (!editingNote || !newNote.text.trim()) return;

    setNotes(prev => prev.map(note => 
      note.id === editingNote.id 
        ? {
            ...note,
            text: newNote.text,
            tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            color: newNote.color,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : note
    ));

    setEditingNote(null);
    setNewNote({ text: '', tags: '', color: 'yellow' });
    setShowAddDialog(false);
  };

  const handleDragStart = (noteId: string) => {
    setDraggedNote(noteId);
  };

  const handleDragEnd = (noteId: string, event: React.DragEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, position: { x: Math.max(0, x - 100), y: Math.max(0, y - 50) } }
        : note
    ));

    setDraggedNote(null);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setEditingNote(null);
    setNewNote({ text: '', tags: '', color: 'yellow' });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <PageHeader 
          title="Canvas de Notas"
          description="Espacio visual para organizar ideas, recordatorios y comentarios."
        >
          <Button 
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Nota
          </Button>
        </PageHeader>
        
        {/* Canvas Area */}
        <div 
          ref={canvasRef}
          className="relative w-full h-full bg-gray-100 overflow-auto"
          style={{ minHeight: 'calc(100vh - 120px)' }}
        >
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Notes */}
          {notes.map((note) => {
            const colorClasses = getColorClasses(note.color);
            return (
              <div
                key={note.id}
                draggable
                onDragStart={() => handleDragStart(note.id)}
                onDragEnd={(e) => handleDragEnd(note.id, e)}
                className={`absolute w-64 p-4 rounded-lg shadow-md cursor-move transform hover:scale-105 transition-transform ${colorClasses.bg} ${colorClasses.border} border-2`}
                style={{
                  left: note.position.x,
                  top: note.position.y,
                  zIndex: draggedNote === note.id ? 1000 : 1
                }}
              >
                {/* Note Header */}
                <div className="flex items-center justify-between mb-2">
                  <StickyNote className={`h-4 w-4 ${colorClasses.text}`} />
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-white/50"
                      onClick={() => handleEditNote(note)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-white/50 text-red-600"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Note Content */}
                <p className={`text-sm mb-3 ${colorClasses.text}`}>
                  {note.text}
                </p>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {note.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        className={`text-xs px-2 py-0 ${colorClasses.text} bg-white/50`}
                      >
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Note Footer */}
                <div className={`text-xs ${colorClasses.text} opacity-70`}>
                  {note.updatedAt}
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {notes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <StickyNote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Canvas vacío</h3>
                <p className="text-gray-500 mb-4">Crea tu primera nota para comenzar a organizar tus ideas</p>
                <Button 
                  className="bg-teal-600 hover:bg-teal-700"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Nota
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Note Dialog */}
        <Dialog open={showAddDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? 'Editar Nota' : 'Nueva Nota'}
              </DialogTitle>
              <DialogDescription>
                {editingNote ? 'Modifica el contenido de la nota.' : 'Crea una nueva nota para el canvas.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contenido</label>
                <Textarea
                  placeholder="Escribe el contenido de la nota..."
                  value={newNote.text}
                  onChange={(e) => setNewNote(prev => ({ ...prev, text: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (separados por comas)</label>
                <Input
                  placeholder="lead, seguimiento, importante"
                  value={newNote.tags}
                  onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex space-x-2">
                  {noteColors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded-full border-2 ${color.bg} ${
                        newNote.color === color.name ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      onClick={() => setNewNote(prev => ({ ...prev, color: color.name }))}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={editingNote ? handleUpdateNote : handleAddNote}
                disabled={!newNote.text.trim()}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingNote ? 'Actualizar' : 'Crear'} Nota
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Development Notice */}
        <div className="absolute bottom-4 right-4 max-w-sm">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <StickyNote className="h-3 w-3 text-blue-600" />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}