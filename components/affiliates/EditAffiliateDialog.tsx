'use client';

import React, { useState, useEffect } from 'react';
import { useData, Affiliate } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface EditAffiliateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  affiliate: Affiliate | null;
}

export function EditAffiliateDialog({ open, onOpenChange, affiliate }: EditAffiliateDialogProps) {
  const { updateAffiliate } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Activo',
    commissionRate: '10%',
    totalSales: '$0',
    tier: 'Bronce',
    location: '',
    performanceScore: '0'
  });

  useEffect(() => {
    if (affiliate) {
      setFormData({
        name: affiliate.name,
        email: affiliate.email,
        phone: affiliate.phone,
        status: affiliate.status,
        commissionRate: affiliate.commissionRate,
        totalSales: affiliate.totalSales,
        tier: affiliate.tier,
        location: affiliate.location,
        performanceScore: affiliate.performanceScore
      });
    }
  }, [affiliate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliate || !formData.name || !formData.email) return;

    setIsLoading(true);

    try {
      await updateAffiliate(affiliate.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        commissionRate: formData.commissionRate,
        totalSales: formData.totalSales,
        tier: formData.tier,
        location: formData.location,
        performanceScore: formData.performanceScore
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating affiliate:', error);
      alert((error as Error).message || 'Error al actualizar afiliado');
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
          <DialogTitle>Editar Afiliado</DialogTitle>
          <DialogDescription>
            Modifica la información del afiliado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="(000) 000-0000"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
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
              <Label htmlFor="tier">Nivel</Label>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Tasa de Comisión</Label>
              <Input
                id="commissionRate"
                value={formData.commissionRate}
                onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                placeholder="10%"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalSales">Ventas Totales</Label>
              <Input
                id="totalSales"
                value={formData.totalSales}
                onChange={(e) => handleInputChange('totalSales', e.target.value)}
                placeholder="$0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="performanceScore">Puntuación de Rendimiento</Label>
            <Input
              id="performanceScore"
              value={formData.performanceScore}
              onChange={(e) => handleInputChange('performanceScore', e.target.value)}
              placeholder="0"
            />
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
