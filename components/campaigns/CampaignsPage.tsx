'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Search,
  Filter,
  Send,
  Eye,
  CheckCircle,
  Clock,
  Users,
  Mail,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';

// Mock data for campaigns
const mockCampaigns = [
  {
    id: '1',
    name: 'Bienvenida Nuevos Afiliados Q4 2024',
    objective: 'Dar la bienvenida a nuevos miembros y presentar beneficios',
    targetSegment: 'Afiliados',
    status: 'Activa',
    recipients: 45,
    sent: 45,
    opened: 32,
    confirmed: 18,
    createdAt: '2024-10-01',
    createdBy: 'admin@crcusa.com',
    updatedAt: '2024-10-15'
  },
  {
    id: '2',
    name: 'Invitación Evento Networking Noviembre',
    objective: 'Invitar a evento de networking mensual',
    targetSegment: 'Leads + Afiliados',
    status: 'En Preparación',
    recipients: 120,
    sent: 0,
    opened: 0,
    confirmed: 0,
    createdAt: '2024-10-20',
    createdBy: 'manager@crcusa.com',
    updatedAt: '2024-10-20'
  },
  {
    id: '3',
    name: 'Agradecimiento Patrocinadores 2024',
    objective: 'Agradecer apoyo anual y presentar logros',
    targetSegment: 'Patrocinadores',
    status: 'Cerrada',
    recipients: 12,
    sent: 12,
    opened: 11,
    confirmed: 9,
    createdAt: '2024-09-15',
    createdBy: 'admin@crcusa.com',
    updatedAt: '2024-09-30'
  },
  {
    id: '4',
    name: 'Seguimiento Leads Potenciales',
    objective: 'Reactivar leads con alto potencial de conversión',
    targetSegment: 'Leads',
    status: 'Activa',
    recipients: 28,
    sent: 28,
    opened: 15,
    confirmed: 8,
    createdAt: '2024-10-10',
    createdBy: 'user@crcusa.com',
    updatedAt: '2024-10-22'
  }
];

export function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');

  // Filter campaigns
  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.objective.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesSegment = segmentFilter === 'all' || campaign.targetSegment.includes(segmentFilter);
    
    return matchesSearch && matchesStatus && matchesSegment;
  });

  // Calculate stats
  const totalCampaigns = mockCampaigns.length;
  const activeCampaigns = mockCampaigns.filter(c => c.status === 'Activa').length;
  const totalRecipients = mockCampaigns.reduce((sum, c) => sum + c.recipients, 0);
  const totalSent = mockCampaigns.reduce((sum, c) => sum + c.sent, 0);

  const stats = [
    { label: 'Total Campañas', value: totalCampaigns.toString(), color: 'text-gray-900', icon: Target },
    { label: 'Campañas Activas', value: activeCampaigns.toString(), color: 'text-green-600', icon: CheckCircle },
    { label: 'Total Destinatarios', value: totalRecipients.toString(), color: 'text-blue-600', icon: Users },
    { label: 'Mensajes Enviados', value: totalSent.toString(), color: 'text-purple-600', icon: Send }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activa':
        return <Badge className="bg-green-100 text-green-800">Activa</Badge>;
      case 'En Preparación':
        return <Badge className="bg-yellow-100 text-yellow-800">En Preparación</Badge>;
      case 'Cerrada':
        return <Badge className="bg-gray-100 text-gray-800">Cerrada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getSegmentBadge = (segment: string) => {
    if (segment.includes('+')) {
      return <Badge className="bg-purple-100 text-purple-800">{segment}</Badge>;
    }
    switch (segment) {
      case 'Leads':
        return <Badge className="bg-blue-100 text-blue-800">Leads</Badge>;
      case 'Afiliados':
        return <Badge className="bg-teal-100 text-teal-800">Afiliados</Badge>;
      case 'Patrocinadores':
        return <Badge className="bg-orange-100 text-orange-800">Patrocinadores</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{segment}</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PageHeader 
          title="Campañas"
          description="Gestiona campañas de comunicación y marketing para leads, afiliados y patrocinadores."
        >
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Campaña
          </Button>
        </PageHeader>
        
        <div className="p-8 space-y-6">
          {/* Search and Filters */}
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Activa">Activa</SelectItem>
                <SelectItem value="En Preparación">En Preparación</SelectItem>
                <SelectItem value="Cerrada">Cerrada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los segmentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los segmentos</SelectItem>
                <SelectItem value="Leads">Leads</SelectItem>
                <SelectItem value="Afiliados">Afiliados</SelectItem>
                <SelectItem value="Patrocinadores">Patrocinadores</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Más Filtros
            </Button>
          </div>

          {/* Stats */}
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

          {/* Campaigns Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lista de Campañas</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaña</TableHead>
                      <TableHead>Segmento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Destinatarios</TableHead>
                      <TableHead>Métricas</TableHead>
                      <TableHead>Creada</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{campaign.name}</p>
                            <p className="text-sm text-gray-500">{campaign.objective}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getSegmentBadge(campaign.targetSegment)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(campaign.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">{campaign.recipients}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center space-x-2">
                              <Send className="h-3 w-3 text-blue-500" />
                              <span>{campaign.sent} enviados</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Eye className="h-3 w-3 text-green-500" />
                              <span>{campaign.opened} abiertos</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3 text-purple-500" />
                              <span>{campaign.confirmed} confirmados</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{campaign.createdAt}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredCampaigns.length === 0 && (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron campañas que coincidan con los filtros.</p>
                </div>
              )}
            </div>
          </div>

          {/* Development Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}