import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Phone, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  phone: string;
  company?: string;
  score: string;
  estimatedValue: string;
  probability: string;
  initials: string;
}

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  const statusColors = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800'
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
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
            getInitialsColor(contact.initials)
          )}>
            {contact.initials}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
            <Badge className={cn('text-xs', statusColors[contact.statusColor as keyof typeof statusColors])}>
              {contact.status}
            </Badge>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2" />
          {contact.phone}
        </div>
        <div className="flex items-center">
          <Building2 className="h-4 w-4 mr-2" />
          {contact.company}
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 mr-2 text-yellow-500" />
          Score: {contact.score}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="flex justify-between items-center pt-4 border-t text-sm">
        <div>
          <span className="text-gray-600">Valor estimado: </span>
          <span className="font-medium">{contact.estimatedValue}</span>
        </div>
        <span className="text-green-600 font-medium">{contact.probability}</span>
      </div>
    </div>
  );
}