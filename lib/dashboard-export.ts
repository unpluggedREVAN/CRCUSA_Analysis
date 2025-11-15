import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DashboardData {
  contacts: any[];
  companies: any[];
  affiliates: any[];
  sponsors: any[];
  campaigns: any[];
}

export function exportDashboardToPDF(data: DashboardData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Reporte Ejecutivo del Dashboard', pageWidth / 2, 20, { align: 'center' });

  const date = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${date}`, pageWidth / 2, 28, { align: 'center' });

  let yPos = 40;

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen General', 14, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const totalContacts = data.contacts.length;
  const totalCompanies = data.companies.length;
  const totalAffiliates = data.affiliates.length;
  const totalSponsors = data.sponsors.length;
  const totalCampaigns = data.campaigns.length;

  const conversionRate = totalContacts > 0 ? ((totalAffiliates / totalContacts) * 100).toFixed(1) : '0';
  const activeAffiliates = data.affiliates.filter(a => a.status === 'Activo').length;
  const activeSponsors = data.sponsors.filter(s => s.status === 'Activo').length;

  const summaryData = [
    ['Contactos Totales', totalContacts.toString()],
    ['Empresas Registradas', totalCompanies.toString()],
    ['Afiliados Totales', totalAffiliates.toString()],
    ['Afiliados Activos', activeAffiliates.toString()],
    ['Patrocinadores Totales', totalSponsors.toString()],
    ['Patrocinadores Activos', activeSponsors.toString()],
    ['Campañas', totalCampaigns.toString()],
    ['Tasa de Conversión', `${conversionRate}%`]
  ];

  autoTable(doc, {
    body: summaryData,
    startY: yPos,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [13, 148, 136], cellWidth: 80 },
      1: { halign: 'right', cellWidth: 40 }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  const locationCount = data.contacts.reduce((acc, c) => {
    acc[c.location] = (acc[c.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(locationCount)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5)
    .map(([location, count]) => [location, (count as number).toString()]);

  if (topLocations.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Top 5 Ubicaciones de Contactos', 14, yPos);
    yPos += 5;

    autoTable(doc, {
      head: [['Ubicación', 'Contactos']],
      body: topLocations,
      startY: yPos,
      theme: 'striped',
      headStyles: {
        fillColor: [13, 148, 136]
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  const sectorCount = data.companies.reduce((acc, c) => {
    acc[c.sector] = (acc[c.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSectors = Object.entries(sectorCount)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .map(([sector, count]) => {
      const percentage = (((count as number) / totalCompanies) * 100).toFixed(1);
      return [sector, (count as number).toString(), `${percentage}%`];
    });

  if (topSectors.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Distribución de Empresas por Sector', 14, yPos);
    yPos += 5;

    autoTable(doc, {
      head: [['Sector', 'Empresas', 'Porcentaje']],
      body: topSectors,
      startY: yPos,
      theme: 'striped',
      headStyles: {
        fillColor: [13, 148, 136]
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  const statusCount = data.contacts.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const contactsByStatus = Object.entries(statusCount)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .map(([status, count]) => {
      const percentage = (((count as number) / totalContacts) * 100).toFixed(1);
      return [status, (count as number).toString(), `${percentage}%`];
    });

  if (contactsByStatus.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Contactos por Estado', 14, yPos);
    yPos += 5;

    autoTable(doc, {
      head: [['Estado', 'Contactos', 'Porcentaje']],
      body: contactsByStatus,
      startY: yPos,
      theme: 'striped',
      headStyles: {
        fillColor: [13, 148, 136]
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  if (data.affiliates.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    const tierCount = data.affiliates.reduce((acc, a) => {
      acc[a.tier] = (acc[a.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const affiliatesByTier = Object.entries(tierCount)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .map(([tier, count]) => [tier, (count as number).toString()]);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Afiliados por Nivel', 14, yPos);
    yPos += 5;

    autoTable(doc, {
      head: [['Nivel', 'Afiliados']],
      body: affiliatesByTier,
      startY: yPos,
      theme: 'striped',
      headStyles: {
        fillColor: [13, 148, 136]
      }
    });
  }

  doc.setFontSize(8);
  doc.setTextColor(150);
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`dashboard_reporte_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportDashboardToCSV(data: DashboardData): string {
  const date = new Date().toLocaleString('es-ES');

  let csv = `REPORTE EJECUTIVO DEL DASHBOARD\nGenerado: ${date}\n\n`;

  csv += 'RESUMEN GENERAL\n';
  csv += 'Métrica,Valor\n';
  csv += `Contactos Totales,${data.contacts.length}\n`;
  csv += `Empresas Registradas,${data.companies.length}\n`;
  csv += `Afiliados Totales,${data.affiliates.length}\n`;
  csv += `Afiliados Activos,${data.affiliates.filter(a => a.status === 'Activo').length}\n`;
  csv += `Patrocinadores Totales,${data.sponsors.length}\n`;
  csv += `Patrocinadores Activos,${data.sponsors.filter(s => s.status === 'Activo').length}\n`;
  csv += `Campañas,${data.campaigns.length}\n`;
  const conversionRate = data.contacts.length > 0 ? ((data.affiliates.length / data.contacts.length) * 100).toFixed(1) : '0';
  csv += `Tasa de Conversión,${conversionRate}%\n\n`;

  const locationCount = data.contacts.reduce((acc, c) => {
    acc[c.location] = (acc[c.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(locationCount)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 10);

  if (topLocations.length > 0) {
    csv += 'TOP UBICACIONES DE CONTACTOS\n';
    csv += 'Ubicación,Cantidad\n';
    topLocations.forEach(([location, count]) => {
      csv += `"${location}",${count}\n`;
    });
    csv += '\n';
  }

  const sectorCount = data.companies.reduce((acc, c) => {
    acc[c.sector] = (acc[c.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSectors = Object.entries(sectorCount)
    .sort((a, b) => (b[1] as number) - (a[1] as number));

  if (topSectors.length > 0) {
    csv += 'DISTRIBUCIÓN DE EMPRESAS POR SECTOR\n';
    csv += 'Sector,Empresas,Porcentaje\n';
    topSectors.forEach(([sector, count]) => {
      const percentage = (((count as number) / data.companies.length) * 100).toFixed(1);
      csv += `"${sector}",${count as number},${percentage}%\n`;
    });
    csv += '\n';
  }

  const statusCount = data.contacts.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const contactsByStatus = Object.entries(statusCount)
    .sort((a, b) => (b[1] as number) - (a[1] as number));

  if (contactsByStatus.length > 0) {
    csv += 'CONTACTOS POR ESTADO\n';
    csv += 'Estado,Contactos,Porcentaje\n';
    contactsByStatus.forEach(([status, count]) => {
      const percentage = (((count as number) / data.contacts.length) * 100).toFixed(1);
      csv += `"${status}",${count as number},${percentage}%\n`;
    });
    csv += '\n';
  }

  if (data.affiliates.length > 0) {
    const tierCount = data.affiliates.reduce((acc, a) => {
      acc[a.tier] = (acc[a.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const affiliatesByTier = Object.entries(tierCount)
      .sort((a, b) => (b[1] as number) - (a[1] as number));

    csv += 'AFILIADOS POR NIVEL\n';
    csv += 'Nivel,Cantidad\n';
    affiliatesByTier.forEach(([tier, count]) => {
      csv += `"${tier}",${count}\n`;
    });
    csv += '\n';
  }

  if (data.sponsors.length > 0) {
    const typeCount = data.sponsors.reduce((acc, s) => {
      acc[s.sponsorshipType] = (acc[s.sponsorshipType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sponsorsByType = Object.entries(typeCount)
      .sort((a, b) => (b[1] as number) - (a[1] as number));

    csv += 'PATROCINADORES POR TIPO\n';
    csv += 'Tipo,Cantidad\n';
    sponsorsByType.forEach(([type, count]) => {
      csv += `"${type}",${count}\n`;
    });
  }

  return csv;
}
