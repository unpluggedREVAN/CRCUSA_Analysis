'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditCompanyDialog } from './EditCompanyDialog';
import { useData } from '@/contexts/DataContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Building2,
  Users,
  ExternalLink,
  Map
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CompanyDetailPageProps {
  companyId: string;
}

export function CompanyDetailPage({ companyId }: CompanyDetailPageProps) {
  const { companies, contacts, deleteCompany } = useData();
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const company = companies.find(c => c.id === companyId);
  const linkedContacts = contacts.filter(c => c.companyId === companyId);

  if (!company) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Empresa no encontrada</h2>
            <p className="text-gray-600 mb-4">La empresa que buscas no existe o ha sido eliminada.</p>
            <Link href="/companies">
              <Button>Volver a Empresas</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteCompany(company.id);
    router.push('/companies');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b bg-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/companies">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Empresas
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                size="sm"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. La empresa será eliminada permanentemente y se desvinculará de todos los contactos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>
                
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-teal-100 text-teal-800 rounded-lg flex items-center justify-center">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{company.name}</h3>
                    <p className="text-gray-600">"{company.tradeName}"</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{company.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{company.phone}</span>
                  </div>
                  {company.website && (
                    <div className="flex items-center space-x-3 md:col-span-2">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <Link
                        href={company.website}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        {company.website}
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className={`${
                    company.sector === 'Restaurante' ? 'bg-orange-100 text-orange-800' :
                    company.sector === 'Tecnología' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {company.sector}
                  </Badge>
                  <Badge className={`${
                    company.size.includes('Pequeña') ? 'bg-yellow-100 text-yellow-800' :
                    company.size.includes('Mediana') ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {company.size}
                  </Badge>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Ubicación</h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <span>{company.address}</span>
                  </div>

                  {company.latitude && company.longitude ? (
                    <div className="mt-4 border rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="300"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${company.longitude-0.01},${company.latitude-0.01},${company.longitude+0.01},${company.latitude+0.01}&layer=mapnik&marker=${company.latitude},${company.longitude}`}
                        title="Mapa de ubicación"
                      />
                      <div className="p-2 bg-gray-50 text-xs text-gray-600 text-center">
                        Lat: {company.latitude.toFixed(6)}, Lng: {company.longitude.toFixed(6)}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
                      <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p>No hay coordenadas registradas</p>
                      <p className="text-xs mt-1">Edita la empresa para agregar ubicación en el mapa</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Descripción</h2>
                <p className="text-gray-700">{company.description}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Contactos</span>
                    <span className="text-sm font-medium">{linkedContacts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Creada</span>
                    <span className="text-sm font-medium">{company.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Actualizada</span>
                    <span className="text-sm font-medium">{company.updatedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Propietario</span>
                    <span className="text-sm font-medium">{company.owner}</span>
                  </div>
                </div>
              </div>

              {/* Linked Contacts */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contactos Vinculados</h3>
                </div>
                {linkedContacts.length > 0 ? (
                  <div className="space-y-3">
                    {linkedContacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-xs font-medium">
                            {contact.initials}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{contact.name}</p>
                            <p className="text-xs text-gray-600">{contact.role}</p>
                            <p className="text-xs text-gray-500">{contact.email}</p>
                          </div>
                        </div>
                        <Link href={`/contacts/${contact.id}`}>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No hay contactos vinculados a esta empresa.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditCompanyDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        company={company}
      />
    </div>
  );
}