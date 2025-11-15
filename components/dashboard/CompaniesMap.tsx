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

    const minLat = Math.min(...companiesWithCoords.map(c => c.latitude!));
    const maxLat = Math.max(...companiesWithCoords.map(c => c.latitude!));
    const minLng = Math.min(...companiesWithCoords.map(c => c.longitude!));
    const maxLng = Math.max(...companiesWithCoords.map(c => c.longitude!));

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;
    const maxRange = Math.max(latRange, lngRange);

    let zoom = 10;
    if (maxRange > 20) zoom = 4;
    else if (maxRange > 10) zoom = 5;
    else if (maxRange > 5) zoom = 6;
    else if (maxRange > 2) zoom = 7;
    else if (maxRange > 1) zoom = 8;
    else if (maxRange > 0.5) zoom = 9;

    const markers = companiesWithCoords.map((c, idx) =>
      `&markers=${c.latitude},${c.longitude},red-${idx + 1}`
    ).join('');

    const mapDiv = document.createElement('div');
    mapDiv.style.width = '100%';
    mapDiv.style.height = '400px';
    mapDiv.style.position = 'relative';
    mapDiv.style.backgroundColor = '#e5e7eb';
    mapDiv.style.borderRadius = '0.5rem';
    mapDiv.style.overflow = 'hidden';
    container.appendChild(mapDiv);

    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '400';
    iframe.style.border = 'none';
    iframe.loading = 'lazy';

    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng - 1},${minLat - 1},${maxLng + 1},${maxLat + 1}&layer=mapnik&marker=${centerLat},${centerLng}`;

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
      <div className="rounded-lg overflow-hidden" ref={mapContainerRef} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {companiesWithCoords.map((company, idx) => (
          <div key={company.id} className="flex items-center gap-2 p-3 bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-lg text-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-6 h-6 bg-teal-600 text-white rounded-full text-xs font-bold flex-shrink-0">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block truncate font-medium text-gray-900">{company.name}</span>
              <span className="block truncate text-xs text-gray-600">{company.location}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              {companiesWithCoords.length} {companiesWithCoords.length === 1 ? 'empresa' : 'empresas'} con ubicación registrada
            </p>
            <p className="text-xs text-blue-700 mt-1">
              El mapa muestra el área general. Los números corresponden a cada empresa listada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
