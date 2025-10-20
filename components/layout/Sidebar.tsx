'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserCheck,
  Award,
  Mail,
  StickyNote,
  Bot,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Contactos', href: '/contacts', icon: Users },
  { name: 'Empresas', href: '/companies', icon: Building2 },
  { name: 'Afiliados', href: '/affiliates', icon: UserCheck },
  { name: 'Patrocinadores', href: '/sponsors', icon: Award },
  { name: 'Campañas', href: '/campaigns', icon: Mail },
  { name: 'Notas', href: '/notes', icon: StickyNote },
  { name: 'Asistente IA', href: '/ai-assistant', icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col bg-white shadow-lg">
      {/* Logo and Header */}
      <div className="flex flex-col items-center px-6 py-8 border-b">
        <img
          src="https://i.postimg.cc/5y2ybnrY/imagen-2025-09-21-090313816.png"
          alt="CRCUSA Logo"
          className="h-12 w-12 mb-2"
        />
        <h1 className="text-lg font-bold text-gray-900">Chamber of Commerce</h1>
        <p className="text-sm text-gray-600 text-center">CRCUSA 360</p>
        <div className="mt-4 text-xs text-gray-500">
          <p>Business Management System</p>
          <p>Usuario: {user?.email}</p>
          <p>Rol: {user?.role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-4 py-4 border-t">
        <button 
          onClick={logout}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}