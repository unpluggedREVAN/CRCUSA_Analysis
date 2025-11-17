'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { contactsService, companiesService, campaignsService, notesService, connectionsService, affiliatesService, sponsorsService } from '@/lib/firestore-service';

interface TestResult {
  name: string;
  status: 'OK' | 'ERROR' | 'RUNNING';
  error?: string;
}

export default function TestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0 });

  const testData = {
    contact: {
      name: 'Test Contact Integration',
      email: 'test@integration.com',
      phone: '+1234567890',
      company: 'Test Company',
      status: 'activo',
      score: '85',
      interest: 'alto',
      probability: '75',
      origin: 'web',
      estimatedValue: '50000',
      location: 'San Francisco, CA',
      isPotential: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: 'test@user.com',
      initials: 'TC'
    },
    company: {
      name: 'Integration Test Inc',
      tradeName: 'IT Inc',
      email: 'info@itinc.com',
      phone: '+1987654321',
      website: 'https://itinc.com',
      sector: 'Tecnologia',
      size: '50-100',
      location: 'New York, NY',
      address: '123 Test Street',
      description: 'Test company for integration',
      latitude: 40.7128,
      longitude: -74.0060,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: 'test@user.com',
      initials: 'IT'
    },
    campaign: {
      title: 'Test Campaign',
      description: 'Integration test campaign',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      recipients: [
        {
          id: 'recipient-1',
          name: 'Test Recipient',
          email: 'recipient@test.com',
          type: 'contact' as const,
          status: 'sin_contestar' as const
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: 'test@user.com'
    },
    note: {
      title: 'Test Note',
      content: 'This is a test note for integration testing',
      owner: 'test@user.com',
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      color: '#ffeb3b',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    affiliate: {
      name: 'Test Affiliate',
      email: 'affiliate@test.com',
      phone: '+1122334455',
      company: 'Affiliate Company',
      status: 'activo',
      commissionRate: '10',
      totalSales: '25000',
      tier: 'Gold',
      joinDate: new Date().toISOString(),
      location: 'Los Angeles, CA',
      performanceScore: '92',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: 'test@user.com',
      initials: 'TA'
    },
    sponsor: {
      name: 'Test Sponsor',
      company: 'Sponsor Corp',
      email: 'sponsor@test.com',
      phone: '+1555666777',
      sponsorshipType: 'Gold',
      amount: '100000',
      status: 'activo',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      benefits: 'Logo placement, booth space',
      location: 'Miami, FL',
      website: 'https://sponsorcorp.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: 'test@user.com',
      initials: 'TS'
    }
  };

  const createdIds = {
    contacts: [] as string[],
    companies: [] as string[],
    campaigns: [] as string[],
    notes: [] as string[],
    affiliates: [] as string[],
    sponsors: [] as string[],
    connections: [] as string[]
  };

  const addResult = (name: string, status: 'OK' | 'ERROR' | 'RUNNING', error?: string) => {
    setResults(prev => {
      const existing = prev.findIndex(r => r.name === name);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { name, status, error };
        return updated;
      }
      return [...prev, { name, status, error }];
    });
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setSummary({ total: 0, passed: 0, failed: 0 });

    let passed = 0;
    let failed = 0;

    try {
      addResult('Caso 1: Crear contacto', 'RUNNING');
      const contactId = await contactsService.create(testData.contact);
      if (!contactId) throw new Error('No se creo el contacto');
      createdIds.contacts.push(contactId);
      addResult('Caso 1: Crear contacto', 'OK');
      passed++;
    } catch (error: any) {
      addResult('Caso 1: Crear contacto', 'ERROR', error.message);
      failed++;
    }

    try {
      addResult('Caso 2: Listar contactos', 'RUNNING');
      const contactsList = await contactsService.getAll();
      if (!contactsList || contactsList.length === 0) throw new Error('No se encontraron contactos');
      addResult('Caso 2: Listar contactos', 'OK');
      passed++;
    } catch (error: any) {
      addResult('Caso 2: Listar contactos', 'ERROR', error.message);
      failed++;
    }

    if (createdIds.contacts.length > 0) {
      try {
        addResult('Caso 3: Obtener contacto por ID', 'RUNNING');
        const contactById = await contactsService.getById(createdIds.contacts[0]);
        if (!contactById) throw new Error('Contacto no encontrado');
        addResult('Caso 3: Obtener contacto por ID', 'OK');
        passed++;
      } catch (error: any) {
        addResult('Caso 3: Obtener contacto por ID', 'ERROR', error.message);
        failed++;
      }

      try {
        addResult('Caso 4: Actualizar contacto', 'RUNNING');
        await contactsService.update(createdIds.contacts[0], { name: 'Updated Contact Name' });
        addResult('Caso 4: Actualizar contacto', 'OK');
        passed++;
      } catch (error: any) {
        addResult('Caso 4: Actualizar contacto', 'ERROR', error.message);
        failed++;
      }
    }

    try {
      addResult('Caso 5: Crear empresa', 'RUNNING');
      const companyId = await companiesService.create(testData.company);
      if (!companyId) throw new Error('No se creo la empresa');
      createdIds.companies.push(companyId);
      addResult('Caso 5: Crear empresa', 'OK');
      passed++;
    } catch (error: any) {
      addResult('Caso 5: Crear empresa', 'ERROR', error.message);
      failed++;
    }

    try {
      addResult('Caso 6: Listar empresas', 'RUNNING');
      const companiesList = await companiesService.getAll();
      if (!companiesList || companiesList.length === 0) throw new Error('No se encontraron empresas');
      addResult('Caso 6: Listar empresas', 'OK');
      passed++;
    } catch (error: any) {
      addResult('Caso 6: Listar empresas', 'ERROR', error.message);
      failed++;
    }

    if (createdIds.companies.length > 0) {
      try {
        addResult('Caso 7: Obtener empresa por ID', 'RUNNING');
        const companyById = await companiesService.getById(createdIds.companies[0]);
        if (!companyById) throw new Error('Empresa no encontrada');
        addResult('Caso 7: Obtener empresa por ID', 'OK');
        passed++;
      } catch (error: any) {
        addResult('Caso 7: Obtener empresa por ID', 'ERROR', error.message);
        failed++;
      }

      try {
        addResult('Caso 8: Actualizar empresa', 'RUNNING');
        await companiesService.update(createdIds.companies[0], { sector: 'Tecnologia Avanzada' });
        addResult('Caso 8: Actualizar empresa', 'OK');
        passed++;
      } catch (error: any) {
        addResult('Caso 8: Actualizar empresa', 'ERROR', error.message);
        failed++;
      }
    }

    try {
      addResult('Caso 9: Crear campana', 'RUNNING');
      const campaignId = await campaignsService.create(testData.campaign);
      if (!campaignId) throw new Error('No se creo la campana');
      createdIds.campaigns.push(campaignId);
      addResult('Caso 9: Crear campana', 'OK');
      passed++;
    } catch (error: any) {
      addResult('Caso 9: Crear campana', 'ERROR', error.message);
      failed++;
    }

    try {
      addResult('Caso 10: Listar campanas', 'RUNNING');
      const campaignsList = await campaignsService.getAll();
      if (!campaignsList || campaignsList.length === 0) throw new Error('No se encontraron campanas');
      addResult('Caso 10: Listar campanas', 'OK');
      passed++;
    } catch (error: any) {
      addResult('Caso 10: Listar campanas', 'ERROR', error.message);
      failed++;
    }

    if (createdIds.campaigns.length > 0) {
      try {
        addResult('Caso 11: Obtener campana por ID', 'RUNNING');
        const campaignById = await campaignsService.getById(createdIds.campaigns[0]);
        if (!campaignById) throw new Error('Campana no encontrada');
        addResult('Caso 11: Obtener campana por ID', 'OK');
        passed++;
      } catch (error: any) {
        addResult('Caso 11: Obtener campana por ID', 'ERROR', error.message);
        failed++;
      }

      try {
        addResult('Caso 12: Actualizar estado de destinatario', 'RUNNING');
        const updatedRecipients = testData.campaign.recipients.map(r => ({
          ...r,
          status: 'aceptado' as const
        }));
        await campaignsService.update(createdIds.campaigns[0], { recipients: updatedRecipients });
        addResult('Caso 12: Actualizar estado de destinatario', 'OK');
        passed++;
      } catch (error: any) {
        addResult('Caso 12: Actualizar estado de destinatario', 'ERROR', error.message);
        failed++;
      }
    }

    try {
      addResult('Caso 13: Crear nota', 'RUNNING');
      const noteId = await notesService.create(testData.note);
      if (!noteId) throw new Error('No se creo la nota');
      createdIds.notes.push(noteId);
      addResult('Caso 13: Crear nota', 'OK');
      passed++;
    } catch (error: any) {
      addResult('Caso 13: Crear nota', 'ERROR', error.message);
      failed++;
    }

    try {
      addResult('Caso 14: Crear segunda nota', 'RUNNING');
      const note2Id = await notesService.create({
        ...testData.note,
        title: 'Second Note',
        x: 450,
        y: 100
      });
      if (!note2Id) throw new Error('No se creo la segunda nota');
      createdIds.notes.push(note2Id);
      addResult('Caso 14: Crear segunda nota', 'OK');
      passed++;
    } catch (error: any) {
      addResult('Caso 14: Crear segunda nota', 'ERROR', error.message);
      failed++;
    }

    try {
      addResult('Caso 15: Listar notas', 'RUNNING');
      const notesList = await notesService.getAll();
      if (!notesList || notesList.length === 0) throw new Error('No se encontraron notas');
      addResult('Caso 15: Listar notas', 'OK');
      passed++;
    } catch (error: any) {
      addResult('Caso 15: Listar notas', 'ERROR', error.message);
      failed++;
    }

    if (createdIds.notes.length > 0) {
      try {
        addResult('Caso 16: Actualizar posicion de nota', 'RUNNING');
        await notesService.update(createdIds.notes[0], {
          x: 150,
          y: 150
        });
        addResult('Caso 16: Actualizar posicion de nota', 'OK');
        passed++;
      } catch (error: any) {
        addResult('Caso 16: Actualizar posicion de nota', 'ERROR', error.message);
        failed++;
      }
    }

    if (createdIds.notes.length >= 2) {
      try {
        addResult('Caso 17: Crear conexion entre notas', 'RUNNING');
        const connId = await connectionsService.create({
          fromNoteId: createdIds.notes[0],
          toNoteId: createdIds.notes[1]
        });
        if (!connId) throw new Error('No se creo la conexion');
        createdIds.connections.push(connId);
        addResult('Caso 17: Crear conexion entre notas', 'OK');
        passed++;
      } catch (error: any) {
        addResult('Caso 17: Crear conexion entre notas', 'ERROR', error.message);
        failed++;
      }

      try {
        addResult('Caso 18: Listar conexiones', 'RUNNING');
        const connsList = await connectionsService.getAll();
        if (!connsList || connsList.length === 0) throw new Error('No se encontraron conexiones');
        addResult('Caso 18: Listar conexiones', 'OK');
        passed++;
      } catch (error: any) {
        addResult('Caso 18: Listar conexiones', 'ERROR', error.message);
        failed++;
      }

      try {
        addResult('Caso 19: Buscar conexiones por nota origen', 'RUNNING');
        const allConns = await connectionsService.getAll();
        const connsBy = allConns.filter(c => c.fromNoteId === createdIds.notes[0]);
        if (!connsBy || connsBy.length === 0) throw new Error('No se encontraron conexiones por origen');
        addResult('Caso 19: Buscar conexiones por nota origen', 'OK');
        passed++;
      } catch (error: any) {
        addResult('Caso 19: Buscar conexiones por nota origen', 'ERROR', error.message);
        failed++;
      }
    }

    try {
      addResult('Caso 20: Crear afiliado', 'RUNNING');
      const affiliateId = await affiliatesService.create(testData.affiliate);
      if (!affiliateId) throw new Error('No se creo el afiliado');
      createdIds.affiliates.push(affiliateId);
      addResult('Caso 20: Crear afiliado', 'OK');
      passed++;
    } catch (error: any) {
      addResult('Caso 20: Crear afiliado', 'ERROR', error.message);
      failed++;
    }

    try {
      addResult('Caso 21: Listar afiliados', 'RUNNING');
      const affiliatesList = await affiliatesService.getAll();
      if (!affiliatesList || affiliatesList.length === 0) throw new Error('No se encontraron afiliados');
      addResult('Caso 21: Listar afiliados', 'OK');
      passed++;
    } catch (error: any) {
      addResult('Caso 21: Listar afiliados', 'ERROR', error.message);
      failed++;
    }

    if (createdIds.affiliates.length > 0) {
      try {
        addResult('Caso 22: Actualizar metricas de afiliado', 'RUNNING');
        await affiliatesService.update(createdIds.affiliates[0], {
          totalSales: '30000',
          performanceScore: '95'
        });
        addResult('Caso 22: Actualizar metricas de afiliado', 'OK');
        passed++;
      } catch (error: any) {
        addResult('Caso 22: Actualizar metricas de afiliado', 'ERROR', error.message);
        failed++;
      }
    }

    try {
      addResult('Caso 23: Crear patrocinador', 'RUNNING');
      const sponsorId = await sponsorsService.create(testData.sponsor);
      if (!sponsorId) throw new Error('No se creo el patrocinador');
      createdIds.sponsors.push(sponsorId);
      addResult('Caso 23: Crear patrocinador', 'OK');
      passed++;
    } catch (error: any) {
      addResult('Caso 23: Crear patrocinador', 'ERROR', error.message);
      failed++;
    }

    await cleanup();

    setSummary({ total: 23, passed, failed });
    setIsRunning(false);
  };

  const cleanup = async () => {
    for (const id of createdIds.contacts) {
      try {
        await contactsService.delete(id);
      } catch (error) {
        console.error('Error cleaning contact:', error);
      }
    }

    for (const id of createdIds.companies) {
      try {
        await companiesService.delete(id);
      } catch (error) {
        console.error('Error cleaning company:', error);
      }
    }

    for (const id of createdIds.campaigns) {
      try {
        await campaignsService.delete(id);
      } catch (error) {
        console.error('Error cleaning campaign:', error);
      }
    }

    for (const id of createdIds.connections) {
      try {
        await connectionsService.delete(id);
      } catch (error) {
        console.error('Error cleaning connection:', error);
      }
    }

    for (const id of createdIds.notes) {
      try {
        await notesService.delete(id);
      } catch (error) {
        console.error('Error cleaning note:', error);
      }
    }

    for (const id of createdIds.affiliates) {
      try {
        await affiliatesService.delete(id);
      } catch (error) {
        console.error('Error cleaning affiliate:', error);
      }
    }

    for (const id of createdIds.sponsors) {
      try {
        await sponsorsService.delete(id);
      } catch (error) {
        console.error('Error cleaning sponsor:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Pruebas de Integracion - CRCUSA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Ejecuta las 23 pruebas de integracion completas contra Firebase.
            </p>
            <Button
              onClick={runTests}
              disabled={isRunning}
              size="lg"
              className="w-full"
            >
              {isRunning ? 'Ejecutando pruebas...' : 'Ejecutar Pruebas'}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      result.status === 'OK'
                        ? 'bg-green-50 border border-green-200'
                        : result.status === 'ERROR'
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <span className="font-medium text-sm">{result.name}</span>
                    <span className={`font-bold ${
                      result.status === 'OK'
                        ? 'text-green-600'
                        : result.status === 'ERROR'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`}>
                      {result.status === 'RUNNING' ? '...' : result.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {summary.total > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <div className="text-3xl font-bold text-gray-800">{summary.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center p-4 bg-green-100 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{summary.passed}</div>
                  <div className="text-sm text-green-600">Exitosas</div>
                </div>
                <div className="text-center p-4 bg-red-100 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{summary.failed}</div>
                  <div className="text-sm text-red-600">Fallidas</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {summary.total > 0 ? ((summary.passed / summary.total) * 100).toFixed(2) : 0}%
                </div>
                <div className="text-sm text-gray-600">Tasa de exito</div>
              </div>
              {summary.failed === 0 && summary.total > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-700 font-bold">TODAS LAS PRUEBAS PASARON EXITOSAMENTE</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
