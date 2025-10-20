'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompanyCard } from './CompanyCard';
import { AddCompanyDialog } from './AddCompanyDialog';
import { ImportCSVDialog } from '../contacts/ImportCSVDialog';
import { useData } from '@/contexts/DataContext';
import { 
  Upload, 
  Download, 
  Plus, 
  Search,
  Filter
} from 'lucide-react';


export function CompaniesPage() {
  const { companies, contacts, exportCompaniesToCSV } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = sectorFilter === 'all' || company.sector === sectorFilter;
    const matchesSize = sizeFilter === 'all' || company.size === sizeFilter;
    
    return matchesSearch && matchesSector && matchesSize;
  });

  // Calculate stats
  const totalCompanies = companies.length;
  const filteredCount = filteredCompanies.length;
  const restaurantCount = companies.filter(c => c.sector === 'Restaurante').length;
  const withContactsCount = companies.filter(c => 
    contacts.some(contact => contact.companyId === c.id)
  ).length;

  const stats = [
    { label: 'Total Empresas', value: totalCompanies.toString(), color: 'text-gray-900' },
    { label: 'Filtradas', value: filteredCount.toString(), color: 'text-teal-600' },
    { label: 'Restaurantes', value: restaurantCount.toString(), color: 'text-orange-600' },
    { label: 'Con Contactos', value: withContactsCount.toString(), color: 'text-green-600' }
  ];

  const handleExportCSV = () => {
    const csvContent = exportCompaniesToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `empresas_${new Date().toISOString().split('T')[0]}.csv`);
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
          title="Empresas"
          description="Gestiona tu base de datos de empresas."
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
            Añadir Nueva Empresa
          </Button>
        </PageHeader>
        
        <div className="p-8 space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos los sectores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los sectores</SelectItem>
                <SelectItem value="Restaurante">Restaurante</SelectItem>
                <SelectItem value="Tecnología">Tecnología</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Servicios">Servicios</SelectItem>
                <SelectItem value="Manufactura">Manufactura</SelectItem>
                <SelectItem value="Turismo">Turismo</SelectItem>
                <SelectItem value="Salud">Salud</SelectItem>
                <SelectItem value="Educación">Educación</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos los tamaños" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tamaños</SelectItem>
                <SelectItem value="Pequeña (1-10)">Pequeña (1-10)</SelectItem>
                <SelectItem value="Mediana (11-50)">Mediana (11-50)</SelectItem>
                <SelectItem value="Grande (51-200)">Grande (51-200)</SelectItem>
                <SelectItem value="Empresa (200+)">Empresa (200+)</SelectItem>
              </SelectContent>
            </Select>
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

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => {
              const companyContacts = contacts.filter(c => c.companyId === company.id);
              const firstContact = companyContacts[0];
              
              return (
              <Link key={company.id} href={`/companies/${company.id}`}>
                <CompanyCard 
                  company={{
                    ...company,
                    contacts: companyContacts.length,
                    contactInitials: firstContact?.initials || 'N/A'
                  }} 
                />
              </Link>
              );
            })}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron empresas que coincidan con los filtros.</p>
            </div>
          )}
        </div>
      </div>

      <AddCompanyDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
      
      <ImportCSVDialog 
        open={showImportDialog} 
        onOpenChange={setShowImportDialog}
        type="companies"
      />
    </div>
  );
}