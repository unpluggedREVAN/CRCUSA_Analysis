'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BarChart3, 
  Users, 
  Building2, 
  Award, 
  Mail,
  StickyNote,
  TrendingUp,
  MessageSquare,
  Loader2
} from 'lucide-react';

// Mock conversation data
const mockConversation = [
  {
    id: '1',
    type: 'user',
    message: '¿Cuántos leads nuevos entraron este mes?',
    timestamp: '10:30 AM'
  },
  {
    id: '2',
    type: 'ai',
    message: 'Este mes han ingresado 6 leads nuevos al sistema. La mayoría provienen de origen Web (4) y Referencia (2). El sector predominante es Restaurante con 5 leads.',
    timestamp: '10:30 AM',
    data: {
      total: 6,
      breakdown: [
        { label: 'Web', value: 4 },
        { label: 'Referencia', value: 2 }
      ]
    }
  },
  {
    id: '3',
    type: 'user',
    message: '¿Qué campañas tuvieron mayor tasa de apertura?',
    timestamp: '10:32 AM'
  },
  {
    id: '4',
    type: 'ai',
    message: 'La campaña "Agradecimiento Patrocinadores 2024" tuvo la mayor tasa de apertura con 91.7% (11 de 12 enviados). Le sigue "Bienvenida Nuevos Afiliados Q4 2024" con 71.1% (32 de 45 enviados).',
    timestamp: '10:32 AM',
    data: {
      campaigns: [
        { name: 'Agradecimiento Patrocinadores 2024', rate: '91.7%' },
        { name: 'Bienvenida Nuevos Afiliados Q4 2024', rate: '71.1%' }
      ]
    }
  }
];

const suggestedQueries = [
  "¿Cuál es el sector con más afiliados activos?",
  "¿Cuántas empresas tenemos registradas por tamaño?",
  "¿Qué patrocinadores están por vencer su período?",
  "¿Cuáles son las notas más recientes del canvas?",
  "¿Qué leads tienen mayor probabilidad de conversión?"
];

export function AIAssistantPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState(mockConversation);

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      message: query,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
    
    setConversation(prev => [...prev, userMessage]);
    setQuery('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        message: 'Esta funcionalidad está en desarrollo. Pronto podrás hacer consultas en tiempo real sobre todos los datos del sistema.',
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      
      setConversation(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <PageHeader 
          title="Asistente IA"
          description="Consulta inteligente de datos empresariales en lenguaje natural."
        />
        
        <div className="flex h-full">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {conversation.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-teal-100 text-teal-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {message.type === 'user' ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className={`rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-teal-600 text-white'
                          : 'bg-white border shadow-sm'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        {message.data && (
                          <div className="mt-3 space-y-2">
                            {message.data.breakdown && (
                              <div className="flex space-x-4">
                                {message.data.breakdown.map((item, index) => (
                                  <Badge key={index} className="bg-blue-100 text-blue-800">
                                    {item.label}: {item.value}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {message.data.campaigns && (
                              <div className="space-y-1">
                                {message.data.campaigns.map((campaign, index) => (
                                  <div key={index} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                                    <span>{campaign.name}</span>
                                    <Badge className="bg-green-100 text-green-800">{campaign.rate}</Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white border shadow-sm rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                        <span className="text-sm text-gray-600">Analizando datos...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Pregunta sobre leads, empresas, afiliados, patrocinadores o campañas..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendQuery()}
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  onClick={handleSendQuery}
                  disabled={!query.trim() || isLoading}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pregunta sobre leads, empresas, afiliados, patrocinadores o campañas..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendQuery()}
                  disabled={isLoading}
                />
              </div>
              <Button 
                onClick={handleSendQuery}
                disabled={!query.trim() || isLoading}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Sidebar */}
          <div className="w-80 border-l bg-white p-6 space-y-6">
            

            {/* Suggested Queries */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-teal-600" />
                  Consultas Sugeridas
                </CardTitle>
                <CardDescription className="text-xs">
                  Haz clic para usar estas consultas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQueries.map((suggestedQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuery(suggestedQuery)}
                    className="w-full text-left p-3 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    {suggestedQuery}
                  </button>
                ))}
              </CardContent>
            </Card>



            {/* Development Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}