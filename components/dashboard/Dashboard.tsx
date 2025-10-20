'use client';

import React, { useMemo, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { CompaniesMap } from './CompaniesMap';
import { toast } from 'sonner';
import {
  TrendingUp,
  Users,
  Building2,
  Award,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Target,
  DollarSign,
  TrendingDown,
  AlertCircle,
  Calendar,
  UserCheck,
  Crown,
  Medal,
  Star,
  Activity,
  Trash2
} from 'lucide-react';

export function Dashboard() {
  const { contacts, companies, affiliates, sponsors, campaigns, loading, cleanupDuplicates } = useData();
  const [isCleaningDuplicates, setIsCleaningDuplicates] = useState(false);

  const handleCleanupDuplicates = async () => {
    if (!confirm('¿Estás seguro de eliminar todos los duplicados? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsCleaningDuplicates(true);
    try {
      const result = await cleanupDuplicates();
      const total = result.contacts + result.companies + result.affiliates + result.sponsors;
      if (total > 0) {
        toast.success(`Se eliminaron ${total} duplicados: ${result.contacts} contactos, ${result.companies} empresas, ${result.affiliates} afiliados, ${result.sponsors} patrocinadores`);
      } else {
        toast.info('No se encontraron duplicados');
      }
    } catch (error) {
      console.error('Error cleaning duplicates:', error);
      toast.error('Error al limpiar duplicados');
    } finally {
      setIsCleaningDuplicates(false);
    }
  };

  const stats = useMemo(() => {
    const totalContacts = contacts.length;
    const totalCompanies = companies.length;
    const totalAffiliates = affiliates.length;
    const totalSponsors = sponsors.length;
    const totalCampaigns = campaigns.length;

    const contactsByStatus = contacts.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const potentialContacts = contacts.filter(c => c.isPotential).length;
    const conversionRate = totalContacts > 0 ? ((totalAffiliates / totalContacts) * 100).toFixed(1) : '0';

    const affiliatesByStatus = affiliates.reduce((acc, a) => {
      acc[a.status.toLowerCase()] = (acc[a.status.toLowerCase()] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sponsorsByType = sponsors.reduce((acc, s) => {
      const type = s.sponsorshipType.toLowerCase();
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const now = new Date();
    const activeCampaigns = campaigns.filter(c => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      return now >= start && now <= end;
    }).length;

    const upcomingCampaigns = campaigns.filter(c => {
      const start = new Date(c.startDate);
      return now < start;
    }).length;

    const completedCampaigns = campaigns.filter(c => {
      const end = new Date(c.endDate);
      return now > end;
    }).length;

    const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipients.length, 0);
    const totalAceptados = campaigns.reduce((sum, c) =>
      sum + c.recipients.filter(r => r.status === 'aceptado').length, 0);
    const totalRechazados = campaigns.reduce((sum, c) =>
      sum + c.recipients.filter(r => r.status === 'rechazado').length, 0);
    const totalEnEspera = campaigns.reduce((sum, c) =>
      sum + c.recipients.filter(r => r.status === 'en_espera').length, 0);
    const totalSinContestar = campaigns.reduce((sum, c) =>
      sum + c.recipients.filter(r => r.status === 'sin_contestar').length, 0);

    const responseRate = totalRecipients > 0
      ? (((totalAceptados + totalRechazados) / totalRecipients) * 100).toFixed(1)
      : '0';

    const acceptanceRate = totalRecipients > 0
      ? ((totalAceptados / totalRecipients) * 100).toFixed(1)
      : '0';

    const locationData = contacts.reduce((acc, c) => {
      if (c.location) {
        acc[c.location] = (acc[c.location] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topLocations = Object.entries(locationData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const companiesBySector = companies.reduce((acc, c) => {
      acc[c.sector] = (acc[c.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSectors = Object.entries(companiesBySector)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);

    const highInterestContacts = contacts.filter(c => c.interest === 'Alto').length;
    const mediumInterestContacts = contacts.filter(c => c.interest === 'Medio').length;
    const lowInterestContacts = contacts.filter(c => c.interest === 'Bajo').length;

    const avgEstimatedValue = contacts.length > 0
      ? contacts.reduce((sum, c) => {
          const value = parseFloat(c.estimatedValue.replace(/[$,]/g, '')) || 0;
          return sum + value;
        }, 0) / contacts.length
      : 0;

    const totalEstimatedValue = contacts.reduce((sum, c) => {
      const value = parseFloat(c.estimatedValue.replace(/[$,]/g, '')) || 0;
      return sum + value;
    }, 0);

    const companiesBySize = companies.reduce((acc, c) => {
      acc[c.size] = (acc[c.size] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentContacts = contacts.filter(c => {
      const createdDate = new Date(c.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate >= thirtyDaysAgo;
    }).length;

    return {
      totalContacts,
      totalCompanies,
      totalAffiliates,
      totalSponsors,
      totalCampaigns,
      contactsByStatus,
      potentialContacts,
      conversionRate,
      affiliatesByStatus,
      sponsorsByType,
      activeCampaigns,
      upcomingCampaigns,
      completedCampaigns,
      totalRecipients,
      totalAceptados,
      totalRechazados,
      totalEnEspera,
      totalSinContestar,
      responseRate,
      acceptanceRate,
      topLocations,
      topSectors,
      highInterestContacts,
      mediumInterestContacts,
      lowInterestContacts,
      avgEstimatedValue,
      totalEstimatedValue,
      companiesBySize,
      recentContacts
    };
  }, [contacts, companies, affiliates, sponsors, campaigns]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PageHeader
          title="Dashboard"
          description="Métricas estratégicas en tiempo real para la toma de decisiones."
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleCleanupDuplicates}
            disabled={isCleaningDuplicates}
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            {isCleaningDuplicates ? (
              <Activity className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Limpiar Duplicados
          </Button>
        </PageHeader>

        <div className="p-8 space-y-8">
          {/* KPIs Principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Contactos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalContacts}</div>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="text-green-600 font-medium">{stats.recentContacts}</span> últimos 30 días
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Empresas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalCompanies}</div>
                <p className="text-xs text-gray-500 mt-1">Base de datos activa</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Afiliados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-teal-600">{stats.totalAffiliates}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Conversión: <span className="font-medium">{stats.conversionRate}%</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Patrocinadores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats.totalSponsors}</div>
                <p className="text-xs text-gray-500 mt-1">Socios estratégicos</p>
              </CardContent>
            </Card>
          </div>

          {/* Funnel y Campañas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Pipeline de Contactos
                </CardTitle>
                <CardDescription>
                  Calidad y potencial de la base de datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                      Alto Interés
                    </span>
                    <Badge className="bg-green-100 text-green-800">{stats.highInterestContacts}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-yellow-500" />
                      Medio Interés
                    </span>
                    <Badge className="bg-yellow-100 text-yellow-800">{stats.mediumInterestContacts}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2 text-gray-500" />
                      Bajo Interés
                    </span>
                    <Badge className="bg-gray-100 text-gray-800">{stats.lowInterestContacts}</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Contactos Potenciales</span>
                    <span className="font-bold text-teal-600">{stats.potentialContacts}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Valor Estimado Total</span>
                    <span className="font-bold text-green-600">${stats.totalEstimatedValue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Valor Promedio</span>
                    <span className="font-medium">${stats.avgEstimatedValue.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-purple-600" />
                  Estado de Campañas
                </CardTitle>
                <CardDescription>
                  Rendimiento y engagement en tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</div>
                    <div className="text-xs text-gray-600">Activas</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.upcomingCampaigns}</div>
                    <div className="text-xs text-gray-600">Próximas</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{stats.completedCampaigns}</div>
                    <div className="text-xs text-gray-600">Finalizadas</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Destinatarios</span>
                    <span className="font-medium">{stats.totalRecipients}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                      Aceptados
                    </span>
                    <span className="font-medium text-green-600">{stats.totalAceptados}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-yellow-500" />
                      En Espera
                    </span>
                    <span className="font-medium text-yellow-600">{stats.totalEnEspera}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1 text-gray-500" />
                      Sin Contestar
                    </span>
                    <span className="font-medium">{stats.totalSinContestar}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-600">Tasa de Respuesta</div>
                      <div className="text-2xl font-bold text-blue-600">{stats.responseRate}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Tasa de Aceptación</div>
                      <div className="text-2xl font-bold text-green-600">{stats.acceptanceRate}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Afiliados, Patrocinadores y Empresas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-teal-600" />
                  Afiliados por Estado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(stats.affiliatesByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{status}</span>
                    <Badge className={
                      status === 'activo' ? 'bg-green-100 text-green-800' :
                      status === 'inactivo' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {count}
                    </Badge>
                  </div>
                ))}
                {Object.keys(stats.affiliatesByStatus).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">Sin afiliados aún</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-600" />
                  Patrocinadores por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                    Oro
                  </span>
                  <Badge className="bg-yellow-100 text-yellow-800">{stats.sponsorsByType.oro || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Medal className="h-4 w-4 mr-2 text-gray-500" />
                    Plata
                  </span>
                  <Badge className="bg-gray-100 text-gray-800">{stats.sponsorsByType.plata || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-2 text-orange-500" />
                    Bronce
                  </span>
                  <Badge className="bg-orange-100 text-orange-800">{stats.sponsorsByType.bronce || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Empresas por Tamaño
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(stats.companiesBySize).map(([size, count]) => (
                  <div key={size} className="flex items-center justify-between">
                    <span className="text-sm">{size}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
                {Object.keys(stats.companiesBySize).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">Sin empresas aún</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Distribución Geográfica y Sectorial */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Top 5 Ubicaciones
                </CardTitle>
                <CardDescription>
                  Distribución geográfica de contactos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.topLocations.length > 0 ? (
                  stats.topLocations.map(([location, count], index) => {
                    const percentage = ((count / stats.totalContacts) * 100).toFixed(1);
                    return (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="truncate flex-1">{location}</span>
                          <span className="font-medium ml-2">{count} ({percentage}%)</span>
                        </div>
                        <Progress value={parseFloat(percentage)} className="h-2" />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Sin datos de ubicación</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-orange-600" />
                  Top Sectores
                </CardTitle>
                <CardDescription>
                  Distribución sectorial de empresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.topSectors.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {stats.topSectors.map(([sector, count], index) => {
                      const percentage = ((count / stats.totalCompanies) * 100).toFixed(0);
                      return (
                        <div key={index} className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{percentage}%</div>
                          <div className="text-sm text-gray-700 truncate">{sector}</div>
                          <div className="text-xs text-gray-500 mt-1">{count} empresas</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Sin datos sectoriales</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mapa de Empresas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Mapa de Empresas
              </CardTitle>
              <CardDescription>
                Visualización geográfica de empresas registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompaniesMap companies={companies} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
