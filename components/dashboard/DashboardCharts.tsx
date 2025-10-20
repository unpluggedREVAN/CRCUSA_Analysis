'use client';

import React from 'react';

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Leads por Origen */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads por Origen</h3>
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No hay datos</span>
            </div>
            <p className="text-gray-500">Sin leads registrados</p>
          </div>
        </div>
      </div>

      {/* Nuevos Leads en los Últimos 6 Meses */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevos Leads en los Últimos 6 Meses</h3>
        <div className="h-64">
          <div className="flex items-end justify-between h-full space-x-2 pb-4">
            {['Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'].map((month, index) => (
              <div key={month} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-full rounded-t ${index === 4 ? 'bg-teal-500' : 'bg-gray-200'} transition-all duration-300`}
                  style={{ height: index === 4 ? '80%' : '20%' }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{month}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">Leads generados por mes</p>
        </div>
      </div>
    </div>
  );
}