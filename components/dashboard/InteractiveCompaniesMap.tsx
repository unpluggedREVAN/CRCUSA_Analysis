'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Company } from '@/contexts/DataContext';
import { MapPin } from 'lucide-react';

interface InteractiveCompaniesMapProps {
  companies: Company[];
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function InteractiveCompaniesMap({ companies: companiesParam }: InteractiveCompaniesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const companiesWithCoords = companiesParam.filter(c => c.latitude && c.longitude);

  useEffect(() => {
    if (typeof window === 'undefined' || companiesWithCoords.length === 0) return;

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        return;
      }

      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [companiesWithCoords.length]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || companiesWithCoords.length === 0 || !window.google) return;

    const bounds = new window.google.maps.LatLngBounds();

    companiesWithCoords.forEach(company => {
      bounds.extend(new window.google.maps.LatLng(company.latitude!, company.longitude!));
    });

    const center = bounds.getCenter();

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: center.lat(), lng: center.lng() },
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    map.fitBounds(bounds);

    const infoWindow = new window.google.maps.InfoWindow();

    companiesWithCoords.forEach((company, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: company.latitude!, lng: company.longitude! },
        map: map,
        title: company.name,
        label: {
          text: (index + 1).toString(),
          color: 'white',
          fontWeight: 'bold',
        },
      });

      marker.addListener('click', () => {
        setSelectedCompany(company);
        const content = `
          <div style="max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #111;">${company.name}</h3>
            <p style="margin: 4px 0; font-size: 14px; color: #666;">${company.location}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #888;">${company.address}</p>
            <div style="margin-top: 8px; display: flex; gap: 4px;">
              <span style="background: #ccfbf1; color: #0f766e; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${company.sector}</span>
              <span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${company.size}</span>
            </div>
          </div>
        `;
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });
    });

  }, [mapLoaded, companiesWithCoords]);

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
      <div className="w-full h-[500px] rounded-lg overflow-hidden border shadow-sm">
        <div ref={mapRef} className="w-full h-full" />
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

      {selectedCompany && (
        <div className="bg-white border border-teal-200 rounded-lg p-4 shadow-lg">
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
            <button
              onClick={() => setSelectedCompany(null)}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              {companiesWithCoords.length} {companiesWithCoords.length === 1 ? 'empresa' : 'empresas'} mapeadas
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Haz clic en cualquier marcador del mapa o en las tarjetas para ver detalles de cada empresa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
