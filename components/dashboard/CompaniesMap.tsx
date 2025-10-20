'use client';

import React, { useEffect, useRef } from 'react';
import { Company } from '@/contexts/DataContext';
import { MapPin } from 'lucide-react';

interface CompaniesMapProps {
  companies: Company[];
}

export function CompaniesMap({ companies: companiesParam }: CompaniesMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const companiesWithCoords = companiesParam.filter(c => c.latitude && c.longitude);

  useEffect(() => {
    if (!mapContainerRef.current || companiesWithCoords.length === 0) return;

    const container = mapContainerRef.current;
    container.innerHTML = '';

    const mapDiv = document.createElement('div');
    mapDiv.style.width = '100%';
    mapDiv.style.height = '400px';
    mapDiv.style.position = 'relative';
    mapDiv.style.backgroundColor = '#f0f0f0';
    container.appendChild(mapDiv);

    const minLat = Math.min(...companiesWithCoords.map(c => c.latitude!));
    const maxLat = Math.max(...companiesWithCoords.map(c => c.latitude!));
    const minLng = Math.min(...companiesWithCoords.map(c => c.longitude!));
    const maxLng = Math.max(...companiesWithCoords.map(c => c.longitude!));

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    const padding = 5;
    const bboxStr = `${minLng - padding},${minLat - padding},${maxLng + padding},${maxLat + padding}`;

    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '400';
    iframe.style.border = 'none';

    const markerParams = companiesWithCoords.map(c =>
      `mlat[]=${c.latitude}&mlon[]=${c.longitude}`
    ).join('&');

    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bboxStr}&layer=mapnik&${markerParams}`;

    mapDiv.appendChild(iframe);

  }, [companiesWithCoords]);

  if (companiesWithCoords.length === 0) {
    return (
      <div className="w-full h-[400px] border rounded-lg flex items-center justify-center bg-gray-50">
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
      <div className="border rounded-lg overflow-hidden" ref={mapContainerRef} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {companiesWithCoords.slice(0, 6).map(company => (
          <div key={company.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
            <MapPin className="h-4 w-4 text-teal-600 flex-shrink-0" />
            <span className="truncate">{company.name}</span>
          </div>
        ))}
        {companiesWithCoords.length > 6 && (
          <div className="flex items-center justify-center p-2 bg-gray-100 rounded text-sm text-gray-600">
            +{companiesWithCoords.length - 6} más
          </div>
        )}
      </div>
    </div>
  );
}
