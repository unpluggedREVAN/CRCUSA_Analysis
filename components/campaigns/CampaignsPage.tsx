'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AddCampaignDialog } from './AddCampaignDialog';
import { useData } from '@/contexts/DataContext';
import {
  Plus,
  Search,
  Eye,
  Users,
  Calendar,
  Target,
  Mail,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

export function CampaignsPage() {
  const router = useRouter();
  const { campaigns, loading, deleteCampaign } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const totalCampaigns = campaigns.length;
  const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipients.length, 0);
  const totalSinContestar = campaigns.reduce((sum, c) =>
    sum + c.recipients.filter(r => r.status === 'sin_contestar').length, 0);
  const totalAceptados = campaigns.reduce((sum, c) =>
    sum + c.recipients.filter(r => r.status === 'aceptado').length, 0);

  const stats = [
    { label: 'Total Campañas', value: totalCampaigns.toString(), color: 'text-gray-900', icon: Target },
    { label: 'Total Destinatarios', value: totalRecipients.toString(), color: 'text-blue-600', icon: Users },
    { label: 'Sin Contestar', value: totalSinContestar.toString(), color: 'text-gray-600', icon: Mail },
    { label: 'Aceptados', value: totalAceptados.toString(), color: 'text-green-600', icon: Target }
  ];

  const getStatusCounts = (campaign: any) => {
    const counts = {
      sin_contestar: 0,
      en_espera: 0,
      aceptado: 0,
      rechazado: 0
    };

    campaign.recipients.forEach((r: any) => {
      counts[r.status as keyof typeof counts]++;
    });

    return counts;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getCampaignStatus = (campaign: any): { status: 'active' | 'upcoming' | 'finished'; label: string; color: string } => {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);

    if (now < startDate) {
      return { status: 'upcoming', label: 'Próxima', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    } else if (now > endDate) {
      return { status: 'finished', label: 'Terminada', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    } else {
      return { status: 'active', label: 'Activa', color: 'bg-green-100 text-green-700 border-green-200' };
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;

    try {
      await deleteCampaign(campaignToDelete);
      toast.success('Campaña eliminada exitosamente');
      setCampaignToDelete(null);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Error al eliminar la campaña');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PageHeader
          title="Campañas"
          description="Gestiona campañas de comunicación y marketing para contactos, afiliados y patrocinadores."
        >
          <Button
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Campaña
          </Button>
        </PageHeader>

        <div className="p-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar campañas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color.replace('text-', 'text-').replace('-600', '-500')}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lista de Campañas</h3>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Cargando campañas...</p>
                </div>
              ) : filteredCampaigns.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? 'No se encontraron campañas que coincidan con la búsqueda.' : 'No hay campañas creadas aún.'}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => setShowAddDialog(true)}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primera Campaña
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaña</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fechas</TableHead>
                        <TableHead>Destinatarios</TableHead>
                        <TableHead>Estadísticas</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampaigns.map((campaign) => {
                        const stats = getStatusCounts(campaign);
                        const typeCounts = campaign.recipients.reduce((acc: any, r: any) => {
                          acc[r.type] = (acc[r.type] || 0) + 1;
                          return acc;
                        }, {});

                        const campaignStatus = getCampaignStatus(campaign);

                        return (
                          <TableRow key={campaign.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-gray-900">{campaign.title}</p>
                                <p className="text-sm text-gray-500 line-clamp-1">{campaign.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${campaignStatus.color} font-medium`}>
                                {campaignStatus.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3 w-3 text-gray-400" />
                                  <span>Inicio: {formatDate(campaign.startDate)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3 w-3 text-gray-400" />
                                  <span>Fin: {formatDate(campaign.endDate)}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm font-medium">{campaign.recipients.length} total</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {typeCounts.contact > 0 && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                      {typeCounts.contact} Contactos
                                    </Badge>
                                  )}
                                  {typeCounts.affiliate > 0 && (
                                    <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                                      {typeCounts.affiliate} Afiliados
                                    </Badge>
                                  )}
                                  {typeCounts.sponsor > 0 && (
                                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                      {typeCounts.sponsor} Patrocinadores
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Sin contestar:</span>
                                  <span className="font-medium">{stats.sin_contestar}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">En espera:</span>
                                  <span className="font-medium text-yellow-600">{stats.en_espera}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Aceptados:</span>
                                  <span className="font-medium text-green-600">{stats.aceptado}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Rechazados:</span>
                                  <span className="font-medium text-red-600">{stats.rechazado}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/campaigns/${campaign.id}`)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalles
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setCampaignToDelete(campaign.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddCampaignDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      <AlertDialog open={!!campaignToDelete} onOpenChange={() => setCampaignToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar campaña?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la campaña y toda su información asociada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCampaign}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}