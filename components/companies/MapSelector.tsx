'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search } from 'lucide-react';

interface MapSelectorProps {
  address: string;
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function MapSelector({ address, latitude, longitude, onLocationChange }: MapSelectorProps) {
  const [searchQuery, setSearchQuery] = useState(address);
  const [coords, setCoords] = useState({
    lat: latitude || 39.8283,
    lng: longitude || -98.5795
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string>('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchStatus('Por favor ingresa una dirección');
      return;
    }

    setIsSearching(true);
    setSearchStatus('Buscando ubicación...');

    try {
      const query = encodeURIComponent(searchQuery);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const data = await res.json();

      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        setCoords({ lat: newLat, lng: newLng });
        onLocationChange(newLat, newLng);
        setSearchStatus('✓ Ubicación encontrada');
        setTimeout(() => setSearchStatus(''), 2000);
      } else {
        setSearchStatus('No se encontró la ubicación. Intenta con otra dirección.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchStatus('Error al buscar ubicación. Intenta de nuevo.');
    } finally {
      setIsSearching(false);
    }
  };

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng-0.1},${coords.lat-0.1},${coords.lng+0.1},${coords.lat+0.1}&layer=mapnik&marker=${coords.lat},${coords.lng}`;

  return (
    <div className="space-y-3">
      <div>
        <Label>Ubicación en Mapa</Label>
        <div className="flex gap-2 mt-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ej: Nueva York, USA o Calle Principal 123, Madrid"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            disabled={isSearching}
          />
          <Button
            type="button"
            onClick={handleSearch}
            variant="outline"
            disabled={isSearching}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {searchStatus && (
          <p className={`text-xs mt-1 ${
            searchStatus.includes('✓') ? 'text-green-600' :
            searchStatus.includes('Error') || searchStatus.includes('No se encontró') ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {searchStatus}
          </p>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="300"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          title="Mapa de ubicación"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="text-xs">Lat: {coords.lat.toFixed(6)}, Lng: {coords.lng.toFixed(6)}</span>
        </div>
        <div className="text-xs text-teal-600">
          {coords.lat !== (latitude || 39.8283) || coords.lng !== (longitude || -98.5795)
            ? '✓ Ubicación actualizada'
            : 'Busca una dirección para actualizar'}
        </div>
      </div>
    </div>
  );
}
