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
import { AddAffiliateDialog } from './AddAffiliateDialog';
import { EditAffiliateDialog } from './EditAffiliateDialog';
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
import type { Affiliate } from '@/contexts/DataContext';

export function AffiliatesPage() {
  const { affiliates, deleteAffiliate } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

  const uniqueStatuses = Array.from(new Set(affiliates.map(a => a.status).filter(Boolean)));
  const uniqueTiers = Array.from(new Set(affiliates.map(a => a.tier).filter(Boolean)));

  const filteredAffiliates = affiliates.filter(affiliate => {
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      searchLower === '' ||
      affiliate.name.toLowerCase().includes(searchLower) ||
      affiliate.email.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter;
    const matchesTier = tierFilter === 'all' || affiliate.tier === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  const handleEdit = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setShowEditDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este afiliado?')) {
      try {
        await deleteAffiliate(id);
      } catch (error) {
        console.error('Error deleting affiliate:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'Inactivo': return 'bg-gray-100 text-gray-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Suspendido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
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
          title="Afiliados"
          description="Gestiona tu red de afiliados y sus comisiones"
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar afiliados..."
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

                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueTiers.map(tier => (
                      <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Afiliado
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Comisión</TableHead>
                  <TableHead>Ventas Totales</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAffiliates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No se encontraron afiliados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAffiliates.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{affiliate.name}</div>
                          <div className="text-sm text-gray-500">ID: {affiliate.id.substring(0, 8)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {affiliate.email}
                          </div>
                          {affiliate.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-3 w-3 mr-1 text-gray-400" />
                              {affiliate.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(affiliate.status)}>
                          {affiliate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTierColor(affiliate.tier)}>
                          {affiliate.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>{affiliate.commissionRate}</TableCell>
                      <TableCell className="font-medium">{affiliate.totalSales}</TableCell>
                      <TableCell>
                        {affiliate.location && (
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                            {affiliate.location}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(affiliate)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(affiliate.id)}
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

      <AddAffiliateDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <EditAffiliateDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        affiliate={selectedAffiliate}
      />
    </div>
  );
}
