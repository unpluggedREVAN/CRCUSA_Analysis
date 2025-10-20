'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContactCard } from './ContactCard';
import { AddContactDialog } from './AddContactDialog';
import { ImportCSVDialog } from './ImportCSVDialog';
import { useData } from '@/contexts/DataContext';
import { 
  Upload, 
  Download, 
  Plus, 
  Search,
  Filter
} from 'lucide-react';


export function ContactsPage() {
  const { contacts, exportContactsToCSV } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [originFilter, setOriginFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesOrigin = originFilter === 'all' || contact.origin === originFilter;
    
    return matchesSearch && matchesStatus && matchesOrigin;
  });

  // Calculate stats
  const totalContacts = contacts.length;
  const filteredCount = filteredContacts.length;
  const primerContactoCount = contacts.filter(c => c.status === 'Primer contacto').length;
  const cerradosCount = contacts.filter(c => c.status === 'Cerrado').length;

  const stats = [
    { label: 'Total Contactos', value: totalContacts.toString(), color: 'text-gray-900' },
    { label: 'Filtrados', value: filteredCount.toString(), color: 'text-teal-600' },
    { label: 'Primer Contacto', value: primerContactoCount.toString(), color: 'text-blue-600' },
    { label: 'Cerrados', value: cerradosCount.toString(), color: 'text-green-600' }
  ];

  const handleExportCSV = () => {
    const csvContent = exportContactsToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contactos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PageHeader 
          title="Contactos"
          description="Gestiona tu base de datos de contactos."
        >
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>
          <Button 
            variant="outline" 
            className="border-green-600 text-green-600 hover:bg-green-50"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button 
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir Nuevo Contacto
          </Button>
        </PageHeader>
        
        <div className="p-8 space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar contactos..."
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
                <SelectItem value="Primer contacto">Primer contacto</SelectItem>
                <SelectItem value="Cerrado">Cerrado</SelectItem>
                <SelectItem value="Segundo contacto">Segundo contacto</SelectItem>
                <SelectItem value="Negociación">Negociación</SelectItem>
              </SelectContent>
            </Select>
            <Select value={originFilter} onValueChange={setOriginFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los orígenes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los orígenes</SelectItem>
                <SelectItem value="Web">Web</SelectItem>
                <SelectItem value="Referencia">Referencia</SelectItem>
                <SelectItem value="Importación">Importación</SelectItem>
                <SelectItem value="Evento">Evento</SelectItem>
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
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border text-center">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <Link key={contact.id} href={`/contacts/${contact.id}`}>
                <ContactCard 
                  contact={{
                    ...contact,
                    statusColor: contact.status === 'Cerrado' ? 'green' : 
                               contact.status === 'Primer contacto' ? 'blue' :
                               contact.status === 'Segundo contacto' ? 'orange' : 'blue'
                  }} 
                />
              </Link>
            ))}
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron contactos que coincidan con los filtros.</p>
            </div>
          )}
        </div>
      </div>

      <AddContactDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
      
      <ImportCSVDialog 
        open={showImportDialog} 
        onOpenChange={setShowImportDialog}
        type="contacts"
      />
    </div>
  );
}