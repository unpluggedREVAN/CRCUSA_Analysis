'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditContactDialog } from './EditContactDialog';
import { useData } from '@/contexts/DataContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  AlertTriangle,
  Edit,
  Trash2,
  Phone,
  Mail,
  Building2,
  MapPin,
  Star,
  User,
  UserPlus,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContactDetailPageProps {
  contactId: string;
}

export function ContactDetailPage({ contactId }: ContactDetailPageProps) {
  const { contacts, updateContact, deleteContact, convertContactToAffiliate, convertContactToSponsor } = useData();
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isConvertingAffiliate, setIsConvertingAffiliate] = useState(false);
  const [isConvertingSponsor, setIsConvertingSponsor] = useState(false);

  const contact = contacts.find(c => c.id === contactId);

  if (!contact) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Contacto no encontrado</h2>
            <p className="text-gray-600 mb-4">El contacto que buscas no existe o ha sido eliminado.</p>
            <Link href="/contacts">
              <Button>Volver a Contactos</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleTogglePotential = () => {
    updateContact(contact.id, { isPotential: !contact.isPotential });
  };

  const handleDelete = async () => {
    try {
      await deleteContact(contact.id);
      router.push('/contacts');
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error al eliminar contacto');
    }
  };

  const handleConvertToAffiliate = async () => {
    setIsConvertingAffiliate(true);
    try {
      await convertContactToAffiliate(contact.id);
      alert('Contacto convertido a afiliado exitosamente');
      router.push('/affiliates');
    } catch (error) {
      console.error('Error converting to affiliate:', error);
      alert('Error al convertir a afiliado');
    } finally {
      setIsConvertingAffiliate(false);
    }
  };

  const handleConvertToSponsor = async () => {
    setIsConvertingSponsor(true);
    try {
      await convertContactToSponsor(contact.id);
      alert('Contacto convertido a patrocinador exitosamente');
      router.push('/sponsors');
    } catch (error) {
      console.error('Error converting to sponsor:', error);
      alert('Error al convertir a patrocinador');
    } finally {
      setIsConvertingSponsor(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b bg-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/contacts">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Contactos
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleConvertToAffiliate}
                disabled={isConvertingAffiliate}
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                {isConvertingAffiliate ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Convirtiendo...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    A Afiliado
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConvertToSponsor}
                disabled={isConvertingSponsor}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
              >
                {isConvertingSponsor ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Convirtiendo...
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    A Patrocinador
                  </>
                )}
              </Button>
              <Button
                variant={contact.isPotential ? "destructive" : "default"}
                size="sm"
                onClick={handleTogglePotential}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {contact.isPotential ? 'No Potencial' : 'Marcar Potencial'}
              </Button>
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
                      Esta acción no se puede deshacer. El contacto será eliminado permanentemente.
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
                  <div className="w-16 h-16 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-lg font-medium">
                    {contact.initials}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{contact.name}</h3>
                    <p className="text-gray-600">{contact.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 md:col-span-2">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <span>{contact.company}</span>
                  </div>
                </div>
              </div>

              {/* Sales Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Información de Ventas</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <Badge className={`mt-1 ${
                      contact.status === 'Cerrado' ? 'bg-green-100 text-green-800' :
                      contact.status === 'Primer contacto' ? 'bg-blue-100 text-blue-800' :
                      contact.status === 'Segundo contacto' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Score</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{contact.score}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Interés</p>
                    <Badge className={`mt-1 ${
                      contact.interest === 'Alto' ? 'bg-green-100 text-green-800' :
                      contact.interest === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {contact.interest}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Probabilidad</p>
                    <span className="font-medium text-green-600">{contact.probability}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Origen</p>
                    <span className="font-medium">{contact.origin}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor Estimado</p>
                    <span className="font-medium text-green-600">{contact.estimatedValue}</span>
                  </div>
                </div>
              </div>

              {/* Location and Web */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Ubicación y Web</h2>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{contact.location}</span>
                </div>
              </div>

              {/* Notes Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notas</h2>
               
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Statistics */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Potencial</span>
                    <Badge className={contact.isPotential ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {contact.isPotential ? 'Sí' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Creado</span>
                    <span className="text-sm font-medium">{contact.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Actualizado</span>
                    <span className="text-sm font-medium">{contact.updatedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Propietario</span>
                    <span className="text-sm font-medium">{contact.owner}</span>
                  </div>
                </div>
              </div>

              {/* Linked Company */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Empresa Vinculada</h3>
                {contact.company ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{contact.company}</p>
                      <p className="text-xs text-gray-500">Empresa vinculada</p>
                    </div>
                    {contact.companyId && (
                      <Link href={`/companies/${contact.companyId}`}>
                        <Button variant="ghost" size="sm">
                          Ver Empresa
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin empresa vinculada</p>
                )}
              </div>

              {/* Notes Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas</h3>
              
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditContactDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        contact={contact}
      />
    </div>
  );
}