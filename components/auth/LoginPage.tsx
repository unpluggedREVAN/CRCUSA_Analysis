'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
    }
  };

  const fillCredentials = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center">
          <img
            src="https://i.postimg.cc/5y2ybnrY/imagen-2025-09-21-090313816.png"
            alt="CRCUSA Logo"
            className="h-16 w-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Chamber of Commerce</h1>
          <p className="text-gray-600">CRCUSA 360 - Business Management System</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-900">Credenciales de Prueba</CardTitle>
            <CardDescription className="text-blue-700">
              Haz clic en cualquier usuario para llenar automáticamente los campos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto p-3 hover:bg-blue-100"
              onClick={() => fillCredentials('admin@crcusa.com', 'admin123')}
              disabled={isLoading}
            >
              <div>
                <div className="font-medium text-blue-900">Administrador</div>
                <div className="text-sm text-blue-700">admin@crcusa.com / admin123</div>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto p-3 hover:bg-blue-100"
              onClick={() => fillCredentials('manager@crcusa.com', 'manager123')}
              disabled={isLoading}
            >
              <div>
                <div className="font-medium text-blue-900">Manager</div>
                <div className="text-sm text-blue-700">manager@crcusa.com / manager123</div>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto p-3 hover:bg-blue-100"
              onClick={() => fillCredentials('user@crcusa.com', 'user123')}
              disabled={isLoading}
            >
              <div>
                <div className="font-medium text-blue-900">Usuario</div>
                <div className="text-sm text-blue-700">user@crcusa.com / user123</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}