'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  Users,
  Building2,
  Award,
  Mail,
  DollarSign,
  Download,
  FileText,
  Crown,
  Medal,
  Star,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Send,
  Target
} from 'lucide-react';

export function Dashboard() {
  // Mock data calculations based on existing dummy data
  const leadsByStage = {
    primerContacto: 5, // From contacts with "Primer contacto"
    segundoContacto: 0, // From contacts with "Segundo contacto" 
    propuesta: 0, // From contacts with "Negociación"
    cerrado: 1 // From contacts with "Cerrado"
  };

  const totalLeads = Object.values(leadsByStage).reduce((sum, count) => sum + count, 0);
  const conversionRate = totalLeads > 0 ? ((4 / totalLeads) * 100).toFixed(1) : '0'; // 4 affiliates from 6 leads

  const affiliateStats = {
    active: 2, // From mock affiliates data
    inactive: 1,
    suspended: 1
  };

  const sponsorStats = {
    oro: 1,
    plata: 1, 
    bronce: 2
  };

  const campaignMetrics = {
    totalRecipients: 205, // Sum from mock campaigns
    totalSent: 85,
    totalOpened: 58,
    totalConfirmed: 35,
    openRate: ((58/85) * 100).toFixed(1)
  };

  const geographicData = [
    { location: 'Estados Unidos', count: 5, percentage: 83.3 },
    { location: 'Costa Rica', count: 1, percentage: 16.7 }
  ];

  const cityData = [
    { city: 'Newark, NJ', count: 2 },
    { city: 'Milwaukee, WI', count: 1 },
    { city: 'Denver, CO', count: 1 },
    { city: 'Nueva York, NY', count: 1 },
    { city: 'Chicago, IL', count: 1 }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PageHeader 
          title="Dashboard"
          description="Panel de control con métricas clave."
        >
          <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
            <Download className="h-4 w-4 mr-2" />
            Exportar Métricas
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
        </PageHeader>
        
        <div className="p-8 space-y-8">
          {/* KPIs del Funnel de Leads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Funnel de Leads
                </CardTitle>
                <CardDescription>
                  Progresión de leads a través del proceso de ventas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Primer Contacto</span>
                    <Badge className="bg-blue-100 text-blue-800">{leadsByStage.primerContacto}</Badge>
                  </div>
                  <Progress value={(leadsByStage.primerContacto / totalLeads) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Segundo Contacto</span>
                    <Badge className="bg-orange-100 text-orange-800">{leadsByStage.segundoContacto}</Badge>
                  </div>
                  <Progress value={(leadsByStage.segundoContacto / totalLeads) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Propuesta</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{leadsByStage.propuesta}</Badge>
                  </div>
                  <Progress value={(leadsByStage.propuesta / totalLeads) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cerrado</span>
                    <Badge className="bg-green-100 text-green-800">{leadsByStage.cerrado}</Badge>
                  </div>
                  <Progress value={(leadsByStage.cerrado / totalLeads) * 100} className="h-2" />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Conversión a Afiliados</span>
                    <Badge className="bg-teal-100 text-teal-800">{conversionRate}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-purple-600" />
                  Rendimiento de Campañas
                </CardTitle>
                <CardDescription>
                  Métricas de engagement y alcance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-4 w-4 text-blue-600 mr-1" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{campaignMetrics.totalRecipients}</div>
                    <div className="text-xs text-gray-600">Destinatarios</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Eye className="h-4 w-4 text-green-600 mr-1" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{campaignMetrics.openRate}%</div>
                    <div className="text-xs text-gray-600">Tasa Apertura</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Send className="h-3 w-3 mr-2 text-blue-500" />
                      Enviados
                    </span>
                    <span className="font-medium">{campaignMetrics.totalSent}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-2 text-green-500" />
                      Abiertos
                    </span>
                    <span className="font-medium">{campaignMetrics.totalOpened}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-purple-500" />
                      Confirmados
                    </span>
                    <span className="font-medium">{campaignMetrics.totalConfirmed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Afiliados y Patrocinadores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-teal-600" />
                  Afiliados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Activos
                  </span>
                  <Badge className="bg-green-100 text-green-800">{affiliateStats.active}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    Inactivos
                  </span>
                  <Badge className="bg-orange-100 text-orange-800">{affiliateStats.inactive}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    Suspendidos
                  </span>
                  <Badge className="bg-red-100 text-red-800">{affiliateStats.suspended}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-600" />
                  Patrocinadores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                    Oro
                  </span>
                  <Badge className="bg-yellow-100 text-yellow-800">{sponsorStats.oro}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Medal className="h-4 w-4 mr-2 text-gray-500" />
                    Plata
                  </span>
                  <Badge className="bg-gray-100 text-gray-800">{sponsorStats.plata}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-2 text-orange-500" />
                    Bronce
                  </span>
                  <Badge className="bg-orange-100 text-orange-800">{sponsorStats.bronce}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Calidad de Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Reducción Duplicados</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Consistencia</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-600">
                    <div>Registros únicos: 12</div>
                    <div>Fusiones realizadas: 3</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribución Geográfica y Sectorial */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Distribución Geográfica
                </CardTitle>
                <CardDescription>
                  Ubicación de empresas y afiliados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {geographicData.map((location, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{location.location}</span>
                        <span className="font-medium">{location.count} ({location.percentage}%)</span>
                      </div>
                      <Progress value={location.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-2">Principales Ciudades:</h4>
                  <div className="space-y-1">
                    {cityData.map((city, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{city.city}</span>
                        <span className="font-medium">{city.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                  Evolución Temporal
                </CardTitle>
                <CardDescription>
                  Afiliaciones y leads en los últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <div className="flex items-end justify-between h-full space-x-2 pb-4">
                    {['Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'].map((month, index) => (
                      <div key={month} className="flex flex-col items-center flex-1">
                        <div className="flex flex-col items-center w-full space-y-1">
                          <div 
                            className="w-full bg-teal-500 rounded-t transition-all duration-300"
                            style={{ height: index === 4 ? '60%' : index === 5 ? '80%' : '20%' }}
                            title={`Afiliados: ${index === 4 ? 2 : index === 5 ? 4 : 1}`}
                          ></div>
                          <div 
                            className="w-full bg-blue-400 transition-all duration-300"
                            style={{ height: index === 4 ? '40%' : index === 5 ? '60%' : '30%' }}
                            title={`Leads: ${index === 4 ? 3 : index === 5 ? 6 : 2}`}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-teal-500 rounded mr-2"></div>
                      <span>Afiliados</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
                      <span>Leads</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribución por Sector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-orange-600" />
                Distribución por Sector
              </CardTitle>
              <CardDescription>
                Análisis sectorial de empresas y afiliados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">100%</div>
                  <div className="text-sm text-gray-600">Restaurante</div>
                  <div className="text-xs text-gray-500 mt-1">6 empresas</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-400">0%</div>
                  <div className="text-sm text-gray-600">Tecnología</div>
                  <div className="text-xs text-gray-500 mt-1">0 empresas</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-400">0%</div>
                  <div className="text-sm text-gray-600">Retail</div>
                  <div className="text-xs text-gray-500 mt-1">0 empresas</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-400">0%</div>
                  <div className="text-sm text-gray-600">Otros</div>
                  <div className="text-xs text-gray-500 mt-1">0 empresas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}