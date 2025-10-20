'use client';

import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';

interface ImportCSVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'contacts' | 'companies';
}

export function ImportCSVDialog({ open, onOpenChange, type }: ImportCSVDialogProps) {
  const { importContactsFromCSV, importCompaniesFromCSV } = useData();
  const [csvData, setCsvData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);

  const handleImport = async () => {
    if (!csvData.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const importResult = type === 'contacts'
        ? await importContactsFromCSV(csvData)
        : await importCompaniesFromCSV(csvData);

      setResult(importResult);

      if (importResult.errors.length === 0) {
        setTimeout(() => {
          setCsvData('');
          setResult(null);
          onOpenChange(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const contactsTemplate = `name,email,phone,company,role,status,interest,origin,estimatedValue,location,isPotential
Juan Pérez,juan@ejemplo.com,(555) 123-4567,Empresa ABC,Gerente,Primer contacto,Alto,Web,$5000,San José Costa Rica,true
María González,maria@ejemplo.com,(555) 987-6543,Empresa XYZ,CEO,Negociación,Medio,Referencia,$10000,Miami Estados Unidos,true`;

    const companiesTemplate = `name,tradeName,email,phone,website,sector,size,location,address,description
Restaurante El Buen Sabor,El Buen Sabor,info@buensabor.com,(506) 2222-3333,https://buensabor.com,Restaurante,Pequeña (1-10),San José Costa Rica,Av Central 123,Restaurante de comida típica costarricense
Tech Solutions CR,TechSol,contacto@techsol.cr,(506) 4444-5555,https://techsol.cr,Tecnología,Mediana (11-50),Cartago Costa Rica,Parque Tec 456,Empresa de desarrollo de software`;

    const template = type === 'contacts' ? contactsTemplate : companiesTemplate;
    const filename = type === 'contacts' ? 'plantilla_contactos.csv' : 'plantilla_empresas.csv';

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setCsvData('');
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Importar {type === 'contacts' ? 'Contactos' : 'Empresas'} desde CSV
          </DialogTitle>
          <DialogDescription>
            Pega el contenido de tu archivo CSV o descarga la plantilla para ver el formato correcto.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-blue-900">¿Necesitas una plantilla?</p>
              <p className="text-sm text-blue-700">
                Descarga un archivo de ejemplo con el formato correcto
              </p>
            </div>
            <Button variant="outline" onClick={handleDownloadTemplate} className="text-blue-600 border-blue-600">
              <Download className="h-4 w-4 mr-2" />
              Descargar Plantilla
            </Button>
          </div>

          {/* CSV Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Contenido del CSV</label>
            <Textarea
              placeholder={`Pega aquí el contenido de tu archivo CSV...

Ejemplo:
${type === 'contacts' 
  ? 'name,email,phone,company,role\nJuan Pérez,juan@ejemplo.com,(555) 123-4567,Empresa ABC,Gerente'
  : 'name,tradeName,email,phone,sector,size\nRestaurante El Sabor,El Sabor,info@sabor.com,(506) 2222-3333,Restaurante,Pequeña (1-10)'
}`}
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-2">
              {result.success > 0 && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    ✅ {result.success} {type === 'contacts' ? 'contactos' : 'empresas'} importados correctamente
                  </AlertDescription>
                </Alert>
              )}
              
              {result.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Errores encontrados:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {result.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Format Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Formato requerido:</strong></p>
            <p>• Primera línea: encabezados separados por comas</p>
            <p>• Siguientes líneas: datos separados por comas</p>
            <p>• Campos requeridos: {type === 'contacts' ? 'name, email' : 'name, email'}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!csvData.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Importar {type === 'contacts' ? 'Contactos' : 'Empresas'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}