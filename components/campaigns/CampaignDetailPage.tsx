'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { RecipientStatus } from '@/lib/firestore-service';
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Users,
  Calendar,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface CampaignDetailPageProps {
  campaignId: string;
}

export function CampaignDetailPage({ campaignId }: CampaignDetailPageProps) {
  const router = useRouter();
  const { getCampaignById, updateCampaign, updateRecipientStatus, loading } = useData();
  const campaign = getCampaignById(campaignId);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (campaign) {
      setEditForm({
        title: campaign.title,
        description: campaign.description,
        startDate: campaign.startDate,
        endDate: campaign.endDate
      });
    }
  }, [campaign]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <p className="text-gray-500">Cargando campaña...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Campaña no encontrada</p>
            <Button onClick={() => router.push('/campaigns')}>
              Volver a Campañas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!editForm.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    if (!editForm.description.trim()) {
      toast.error('La descripción es obligatoria');
      return;
    }

    if (new Date(editForm.endDate) <= new Date(editForm.startDate)) {
      toast.error('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    try {
      await updateCampaign(campaignId, {
        title: editForm.title,
        description: editForm.description,
        startDate: editForm.startDate,
        endDate: editForm.endDate
      });
      setIsEditing(false);
      toast.success('Campaña actualizada exitosamente');
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast.error('Error al actualizar la campaña');
    }
  };

  const handleCancel = () => {
    setEditForm({
      title: campaign.title,
      description: campaign.description,
      startDate: campaign.startDate,
      endDate: campaign.endDate
    });
    setIsEditing(false);
  };

  const handleStatusChange = async (recipientId: string, newStatus: RecipientStatus) => {
    try {
      await updateRecipientStatus(campaignId, recipientId, newStatus);
      toast.success('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error updating recipient status:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const getStatusBadge = (status: RecipientStatus) => {
    switch (status) {
      case 'sin_contestar':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Sin Contestar</Badge>;
      case 'en_espera':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En Espera</Badge>;
      case 'aceptado':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Aceptado</Badge>;
      case 'rechazado':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rechazado</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'contact':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Contacto</Badge>;
      case 'affiliate':
        return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">Afiliado</Badge>;
      case 'sponsor':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Patrocinador</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const stats = {
    total: campaign.recipients.length,
    sin_contestar: campaign.recipients.filter(r => r.status === 'sin_contestar').length,
    en_espera: campaign.recipients.filter(r => r.status === 'en_espera').length,
    aceptado: campaign.recipients.filter(r => r.status === 'aceptado').length,
    rechazado: campaign.recipients.filter(r => r.status === 'rechazado').length
  };

  const typeCounts = campaign.recipients.reduce((acc: any, r: any) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const statCards = [
    { label: 'Total Destinatarios', value: stats.total, color: 'text-gray-900', icon: Users },
    { label: 'Sin Contestar', value: stats.sin_contestar, color: 'text-gray-600', icon: Mail },
    { label: 'En Espera', value: stats.en_espera, color: 'text-yellow-600', icon: Clock },
    { label: 'Aceptados', value: stats.aceptado, color: 'text-green-600', icon: CheckCircle },
    { label: 'Rechazados', value: stats.rechazado, color: 'text-red-600', icon: XCircle }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PageHeader
          title="Detalles de Campaña"
          description={`Gestiona la información y destinatarios de esta campaña`}
        >
          <Button
            variant="outline"
            onClick={() => router.push('/campaigns')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </PageHeader>

        <div className="p-8 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Información General</h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Título</Label>
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Descripción</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-startDate">Fecha de Inicio</Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={editForm.startDate}
                      onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-endDate">Fecha de Fin</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={editForm.endDate}
                      onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Título</p>
                  <p className="text-lg font-medium text-gray-900">{campaign.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Descripción</p>
                  <p className="text-gray-900">{campaign.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha de Inicio</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{formatDate(campaign.startDate)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha de Fin</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{formatDate(campaign.endDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-6 w-6 ${stat.color.replace('text-', 'text-').replace('-600', '-500')}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Destinatarios</h3>

            {campaign.recipients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay destinatarios en esta campaña</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Actualizar Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaign.recipients.map((recipient) => (
                      <TableRow key={recipient.id}>
                        <TableCell>
                          <p className="font-medium text-gray-900">{recipient.name}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <p className="text-sm text-gray-600">{recipient.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getTypeBadge(recipient.type)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(recipient.status)}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={recipient.status}
                            onValueChange={(value) => handleStatusChange(recipient.id, value as RecipientStatus)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sin_contestar">Sin Contestar</SelectItem>
                              <SelectItem value="en_espera">En Espera de Confirmación</SelectItem>
                              <SelectItem value="aceptado">Aceptado</SelectItem>
                              <SelectItem value="rechazado">Rechazado</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
