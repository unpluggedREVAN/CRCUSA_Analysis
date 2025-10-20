export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiResponse {
  message: string;
  error?: string;
}

export async function sendMessageToGemini(
  message: string,
  context: string
): Promise<GeminiResponse> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return {
      message: '',
      error: 'API key de Gemini no configurada'
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Eres un asistente inteligente para un sistema CRM. Tu objetivo es ayudar a los usuarios a analizar y entender los datos de su negocio.

Contexto del sistema:
${context}

Instrucciones:
- Responde de manera clara y concisa en español
- Si te preguntan sobre datos específicos, analiza el contexto proporcionado
- Si no tienes suficiente información, dilo claramente
- Mantén un tono profesional y amigable
- Proporciona insights útiles cuando sea posible

Pregunta del usuario: ${message}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        message: '',
        error: `Error de API: ${errorData.error?.message || response.statusText}`
      };
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      const content = data.candidates[0].content;
      if (content && content.parts && content.parts.length > 0) {
        return {
          message: content.parts[0].text
        };
      }
    }

    return {
      message: '',
      error: 'No se recibió respuesta válida de la API'
    };

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return {
      message: '',
      error: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
}

export function buildContextFromData(data: {
  contacts: any[];
  companies: any[];
  affiliates: any[];
  sponsors: any[];
  campaigns: any[];
}): string {
  const { contacts, companies, affiliates, sponsors, campaigns } = data;

  const contactsByStatus = contacts.reduce((acc: any, contact) => {
    acc[contact.status] = (acc[contact.status] || 0) + 1;
    return acc;
  }, {});

  const companiesBySector = companies.reduce((acc: any, company) => {
    acc[company.sector] = (acc[company.sector] || 0) + 1;
    return acc;
  }, {});

  const companiesBySize = companies.reduce((acc: any, company) => {
    acc[company.size] = (acc[company.size] || 0) + 1;
    return acc;
  }, {});

  const affiliatesByStatus = affiliates.reduce((acc: any, affiliate) => {
    acc[affiliate.status] = (acc[affiliate.status] || 0) + 1;
    return acc;
  }, {});

  const sponsorsByStatus = sponsors.reduce((acc: any, sponsor) => {
    acc[sponsor.status] = (acc[sponsor.status] || 0) + 1;
    return acc;
  }, {});

  const uniqueOrigins = Array.from(new Set(contacts.map(c => c.origin)));
  const uniqueLocations = Array.from(new Set(contacts.map(c => c.location))).slice(0, 10);
  const uniqueTiers = Array.from(new Set(affiliates.map(a => a.tier)));
  const uniqueSponsorTypes = Array.from(new Set(sponsors.map(s => s.sponsorshipType)));
  const uniqueCampaignStatuses = Array.from(new Set(campaigns.map(c => c.status)));
  const uniqueCampaignTypes = Array.from(new Set(campaigns.map(c => c.type)));

  return `
DATOS DEL SISTEMA CRM:

CONTACTOS (${contacts.length} total):
- Por estado: ${JSON.stringify(contactsByStatus, null, 2)}
- Orígenes principales: ${uniqueOrigins.join(', ')}
- Ubicaciones: ${uniqueLocations.join(', ')}

EMPRESAS (${companies.length} total):
- Por sector: ${JSON.stringify(companiesBySector, null, 2)}
- Por tamaño: ${JSON.stringify(companiesBySize, null, 2)}
- Nombres: ${companies.slice(0, 10).map(c => c.name).join(', ')}${companies.length > 10 ? '...' : ''}

AFILIADOS (${affiliates.length} total):
- Por estado: ${JSON.stringify(affiliatesByStatus, null, 2)}
- Tiers: ${uniqueTiers.join(', ')}

PATROCINADORES (${sponsors.length} total):
- Por estado: ${JSON.stringify(sponsorsByStatus, null, 2)}
- Tipos: ${uniqueSponsorTypes.join(', ')}

CAMPAÑAS (${campaigns.length} total):
- Estados: ${uniqueCampaignStatuses.join(', ')}
- Tipos: ${uniqueCampaignTypes.join(', ')}
`;
}
