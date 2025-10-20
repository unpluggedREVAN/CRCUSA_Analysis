'use client';

import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddAffiliateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAffiliateDialog({ open, onOpenChange }: AddAffiliateDialogProps) {
  const { contacts, convertContactToAffiliate } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    status: 'Activo',
    commissionRate: '10%',
    tier: 'Bronce'
  });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContactId) return;

    setIsLoading(true);

    try {
      await convertContactToAffiliate(selectedContactId, {
        status: formData.status,
        commissionRate: formData.commissionRate,
        tier: formData.tier
      });

      setSelectedContactId('');
      setSearchTerm('');
      setFormData({
        status: 'Activo',
        commissionRate: '10%',
        tier: 'Bronce'
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error adding affiliate:', error);
      alert('Error al convertir contacto a afiliado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Convertir Contacto a Afiliado</DialogTitle>
          <DialogDescription>
            Selecciona un contacto y completa la información adicional para el afiliado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Seleccionar Contacto *</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar contacto por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="h-[200px] border rounded-lg p-2">
              <div className="space-y-2">
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron contactos
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContactId(contact.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedContactId === contact.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-600">{contact.email}</div>
                      {contact.phone && (
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      )}
                      {contact.location && (
                        <div className="text-sm text-gray-500">{contact.location}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {selectedContact && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-medium text-blue-900 mb-2">Contacto Seleccionado:</div>
                <div className="text-sm space-y-1">
                  <div><span className="font-medium">Nombre:</span> {selectedContact.name}</div>
                  <div><span className="font-medium">Email:</span> {selectedContact.email}</div>
                  {selectedContact.phone && (
                    <div><span className="font-medium">Teléfono:</span> {selectedContact.phone}</div>
                  )}
                  {selectedContact.location && (
                    <div><span className="font-medium">Ubicación:</span> {selectedContact.location}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Información de Afiliado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Suspendido">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier">Nivel *</Label>
                <Select value={formData.tier} onValueChange={(value) => handleInputChange('tier', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bronce">Bronce</SelectItem>
                    <SelectItem value="Plata">Plata</SelectItem>
                    <SelectItem value="Oro">Oro</SelectItem>
                    <SelectItem value="Platino">Platino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionRate">Tasa de Comisión *</Label>
                <Select value={formData.commissionRate} onValueChange={(value) => handleInputChange('commissionRate', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5%">5%</SelectItem>
                    <SelectItem value="10%">10%</SelectItem>
                    <SelectItem value="15%">15%</SelectItem>
                    <SelectItem value="20%">20%</SelectItem>
                    <SelectItem value="25%">25%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !selectedContactId}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Convirtiendo...
                </>
              ) : (
                'Convertir a Afiliado'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
