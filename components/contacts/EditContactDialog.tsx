'use client';

import React, { useState, useEffect } from 'react';
import { useData, Contact } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

interface EditContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
}

export function EditContactDialog({ open, onOpenChange, contact }: EditContactDialogProps) {
  const { updateContact, companies } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyId: '',
    role: '',
    status: 'Primer contacto',
    score: '3/5',
    interest: 'Medio',
    probability: '50%',
    origin: 'Web',
    estimatedValue: '$0',
    location: '',
    isPotential: true
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        companyId: contact.companyId || 'none',
        role: contact.role || '',
        status: contact.status,
        score: contact.score,
        interest: contact.interest,
        probability: contact.probability,
        origin: contact.origin,
        estimatedValue: contact.estimatedValue,
        location: contact.location,
        isPotential: contact.isPotential
      });
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact || !formData.name || !formData.email) return;

    setIsLoading(true);

    try {
      const company = companies.find(c => c.id === formData.companyId);

      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        score: formData.score,
        interest: formData.interest,
        probability: formData.probability,
        origin: formData.origin,
        estimatedValue: formData.estimatedValue,
        location: formData.location,
        isPotential: formData.isPotential
      };

      if (formData.companyId && formData.companyId !== 'none') {
        updateData.companyId = formData.companyId;
        updateData.company = company?.name || '';
      } else {
        updateData.companyId = '';
        updateData.company = '';
      }

      await updateContact(contact.id, updateData);

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating contact:', error);
      alert((error as Error).message || 'Error al actualizar contacto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Contacto</DialogTitle>
          <DialogDescription>
            Modifica la información del contacto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@ejemplo.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="Gerente, CEO, etc."
              />
            </div>
          </div>

          {/* Company Selection */}
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Select value={formData.companyId} onValueChange={(value) => handleInputChange('companyId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar empresa (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin empresa</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sales Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primer contacto">Primer contacto</SelectItem>
                  <SelectItem value="Segundo contacto">Segundo contacto</SelectItem>
                  <SelectItem value="Negociación">Negociación</SelectItem>
                  <SelectItem value="Cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest">Interés</Label>
              <Select value={formData.interest} onValueChange={(value) => handleInputChange('interest', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bajo">Bajo</SelectItem>
                  <SelectItem value="Medio">Medio</SelectItem>
                  <SelectItem value="Alto">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Origen</Label>
              <Select value={formData.origin} onValueChange={(value) => handleInputChange('origin', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Referencia">Referencia</SelectItem>
                  <SelectItem value="Evento">Evento</SelectItem>
                  <SelectItem value="Llamada fría">Llamada fría</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Valor Estimado</Label>
              <Input
                id="estimatedValue"
                value={formData.estimatedValue}
                onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                placeholder="$1,000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ciudad, País"
              />
            </div>
          </div>

          {/* Potential Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isPotential"
              checked={formData.isPotential}
              onCheckedChange={(checked) => handleInputChange('isPotential', checked)}
            />
            <Label htmlFor="isPotential">Marcar como potencial</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name || !formData.email}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}