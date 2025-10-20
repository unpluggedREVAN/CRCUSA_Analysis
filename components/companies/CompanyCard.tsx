import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Globe, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Company {
  id: string;
  name: string;
  tradeName: string;
  sector: string;
  size: string;
  phone: string;
  email: string;
  website?: string | null;
  location: string;
  contacts: number;
  contactInitials: string;
  initials: string;
}

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const getSectorColor = (sector: string) => {
    switch (sector.toLowerCase()) {
      case 'restaurante':
        return 'bg-orange-100 text-orange-800';
      case 'retail':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeColor = (size: string) => {
    if (size.includes('Pequeña')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (size.includes('Mediana')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getInitialsColor = (initials: string) => {
    const colors = [
      'bg-teal-100 text-teal-800',
      'bg-blue-100 text-blue-800', 
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800'
    ];
    return colors[initials.charCodeAt(0) % colors.length];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium',
            getInitialsColor(company.initials)
          )}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {company.name}
            </h3>
            <p className="text-xs text-gray-600 mt-1">"{company.tradeName}"</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className={cn('text-xs', getSectorColor(company.sector))}>
          {company.sector}
        </Badge>
        <Badge className={cn('text-xs', getSizeColor(company.size))}>
          {company.size}
        </Badge>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2" />
          {company.phone}
        </div>
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          {company.email}
        </div>
        {company.website && (
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            <span className="text-blue-600">Sitio Web</span>
          </div>
        )}
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {company.location}
        </div>
      </div>

      {/* Contacts */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{company.contacts} contacto</span>
        </div>
        <div className="w-6 h-6 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-xs font-medium">
          {company.contactInitials}
        </div>
      </div>
    </div>
  );
}