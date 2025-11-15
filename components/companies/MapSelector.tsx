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

  const handleSearch = () => {
    const query = encodeURIComponent(searchQuery);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const newLat = parseFloat(data[0].lat);
          const newLng = parseFloat(data[0].lon);
          setCoords({ lat: newLat, lng: newLng });
          onLocationChange(newLat, newLng);
        }
      })
      .catch(error => console.error('Error searching location:', error));
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
            placeholder="Buscar dirección..."
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button type="button" onClick={handleSearch} variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
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

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>Lat: {coords.lat.toFixed(6)}, Lng: {coords.lng.toFixed(6)}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const newLat = coords.lat;
            const newLng = coords.lng;
            onLocationChange(newLat, newLng);
          }}
        >
          Confirmar Ubicación
        </Button>
      </div>
    </div>
  );
}
