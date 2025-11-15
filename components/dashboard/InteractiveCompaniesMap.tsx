'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Company } from '@/contexts/DataContext';
import { MapPin, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InteractiveCompaniesMapProps {
  companies: Company[];
}

export function InteractiveCompaniesMap({ companies: companiesParam }: InteractiveCompaniesMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [zoom, setZoom] = useState(1);
  const companiesWithCoords = companiesParam.filter(c => c.latitude && c.longitude);

  useEffect(() => {
    if (!canvasRef.current || companiesWithCoords.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const lats = companiesWithCoords.map(c => c.latitude!);
    const lngs = companiesWithCoords.map(c => c.longitude!);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const padding = 50;
    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    const scaleX = (width - 2 * padding) / lngRange;
    const scaleY = (height - 2 * padding) / latRange;

    const projectX = (lng: number) => padding + (lng - minLng) * scaleX * zoom;
    const projectY = (lat: number) => height - padding - (lat - minLat) * scaleY * zoom;

    ctx.fillStyle = '#f0f4f8';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (width - 2 * padding) * (i / 10);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      const y = padding + (height - 2 * padding) * (i / 10);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    companiesWithCoords.forEach((company, idx) => {
      const x = projectX(company.longitude!);
      const y = projectY(company.latitude!);

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#0d9488';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((idx + 1).toString(), x, y);

      ctx.fillStyle = '#0f766e';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(company.name.substring(0, 15), x, y - 20);
    });

  }, [companiesWithCoords, zoom]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleRatio = canvas.width / rect.width;
    const clickX = (e.clientX - rect.left) * scaleRatio;
    const clickY = (e.clientY - rect.top) * scaleRatio;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    const lats = companiesWithCoords.map(c => c.latitude!);
    const lngs = companiesWithCoords.map(c => c.longitude!);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    const scaleX = (width - 2 * padding) / lngRange;
    const scaleY = (height - 2 * padding) / latRange;

    const projectX = (lng: number) => padding + (lng - minLng) * scaleX * zoom;
    const projectY = (lat: number) => height - padding - (lat - minLat) * scaleY * zoom;

    for (const company of companiesWithCoords) {
      const x = projectX(company.longitude!);
      const y = projectY(company.latitude!);

      const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
      if (distance < 15) {
        setSelectedCompany(company);
        return;
      }
    }

    setSelectedCompany(null);
  };

  if (companiesWithCoords.length === 0) {
    return (
      <div className="w-full h-[500px] border rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No hay empresas con ubicación registrada</p>
          <p className="text-sm text-gray-500 mt-2">
            Agrega coordenadas a las empresas para visualizarlas en el mapa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-white border rounded-lg overflow-hidden shadow-sm">
        <canvas
          ref={canvasRef}
          width={1200}
          height={500}
          onClick={handleCanvasClick}
          className="w-full cursor-pointer"
        />

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white"
            onClick={() => setZoom(Math.min(zoom + 0.2, 3))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white"
            onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white"
            onClick={() => setZoom(1)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {selectedCompany && (
          <div className="absolute bottom-4 left-4 right-4 bg-white border border-teal-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{selectedCompany.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedCompany.location}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedCompany.address}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">
                    {selectedCompany.sector}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {selectedCompany.size}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedCompany(null)}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {companiesWithCoords.map((company, idx) => (
          <button
            key={company.id}
            onClick={() => setSelectedCompany(company)}
            className={`flex items-center gap-2 p-3 rounded-lg text-sm text-left transition-all ${
              selectedCompany?.id === company.id
                ? 'bg-teal-600 text-white shadow-md scale-105'
                : 'bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 hover:shadow-md hover:scale-102'
            }`}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${
              selectedCompany?.id === company.id
                ? 'bg-white text-teal-600'
                : 'bg-teal-600 text-white'
            }`}>
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`block truncate font-medium ${
                selectedCompany?.id === company.id ? 'text-white' : 'text-gray-900'
              }`}>
                {company.name}
              </span>
              <span className={`block truncate text-xs ${
                selectedCompany?.id === company.id ? 'text-teal-100' : 'text-gray-600'
              }`}>
                {company.location}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              {companiesWithCoords.length} {companiesWithCoords.length === 1 ? 'empresa' : 'empresas'} mapeadas
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Haz clic en cualquier punto del mapa o en las tarjetas para ver detalles de cada empresa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
