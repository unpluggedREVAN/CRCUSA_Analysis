'use client';

import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddSponsorDialog } from './AddSponsorDialog';
import { EditSponsorDialog } from './EditSponsorDialog';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import type { Sponsor } from '@/contexts/DataContext';

export function SponsorsPage() {
  const { sponsors, deleteSponsor } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  const uniqueStatuses = Array.from(new Set(sponsors.map(s => s.status).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(sponsors.map(s => s.sponsorshipType).filter(Boolean)));

  const filteredSponsors = sponsors.filter(sponsor => {
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      searchLower === '' ||
      sponsor.name.toLowerCase().includes(searchLower) ||
      sponsor.company.toLowerCase().includes(searchLower) ||
      sponsor.email.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || sponsor.status === statusFilter;
    const matchesType = typeFilter === 'all' || sponsor.sponsorshipType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setShowEditDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este patrocinador?')) {
      try {
        await deleteSponsor(id);
      } catch (error) {
        console.error('Error deleting sponsor:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'Expirado': return 'bg-gray-100 text-gray-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Platino': return 'bg-purple-100 text-purple-800';
      case 'Oro': return 'bg-yellow-100 text-yellow-800';
      case 'Plata': return 'bg-gray-200 text-gray-800';
      case 'Bronce': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          title="Patrocinadores"
          description="Gestiona tus patrocinadores y sus contribuciones"
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar patrocinadores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Patrocinador
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contacto / Empresa</TableHead>
                  <TableHead>Información</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Vigencia</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSponsors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No se encontraron patrocinadores
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSponsors.map((sponsor) => (
                    <TableRow key={sponsor.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sponsor.name}</div>
                          <div className="text-sm text-gray-500">{sponsor.company}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {sponsor.email}
                          </div>
                          {sponsor.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-3 w-3 mr-1 text-gray-400" />
                              {sponsor.phone}
                            </div>
                          )}
                          {sponsor.location && (
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              {sponsor.location}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(sponsor.sponsorshipType)}>
                          {sponsor.sponsorshipType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{sponsor.amount}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(sponsor.status)}>
                          {sponsor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Inicio: {sponsor.startDate}</div>
                          {sponsor.endDate && (
                            <div className="text-gray-500">Fin: {sponsor.endDate}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(sponsor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(sponsor.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      <AddSponsorDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <EditSponsorDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        sponsor={selectedSponsor}
      />
    </div>
  );
}
