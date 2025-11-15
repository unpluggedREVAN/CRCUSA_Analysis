import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFExportOptions {
  title: string;
  subtitle?: string;
  headers: string[];
  data: (string | number)[][];
  filename: string;
}

export function exportToPDF(options: PDFExportOptions) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(options.title, pageWidth / 2, 20, { align: 'center' });

  if (options.subtitle) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(options.subtitle, pageWidth / 2, 28, { align: 'center' });
  }

  const date = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${date}`, pageWidth / 2, options.subtitle ? 34 : 28, { align: 'center' });

  autoTable(doc, {
    head: [options.headers],
    body: options.data,
    startY: options.subtitle ? 40 : 34,
    theme: 'striped',
    headStyles: {
      fillColor: [13, 148, 136],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [240, 253, 250]
    },
    margin: { top: 40 },
    styles: {
      cellPadding: 3,
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    didDrawPage: function (data) {
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Página ${doc.getCurrentPageInfo().pageNumber}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
  });

  doc.save(options.filename);
}

interface ContactData {
  name: string;
  email: string;
  company?: string;
  phone: string;
  status: string;
  origin: string;
  interest: string;
  location: string;
}

export function exportContactsToPDF(contacts: ContactData[], filtered: boolean = false) {
  const data = contacts.map(c => [
    c.name,
    c.email,
    c.company || 'N/A',
    c.phone,
    c.status,
    c.origin,
    c.interest,
    c.location
  ]);

  exportToPDF({
    title: 'Reporte de Contactos',
    subtitle: filtered ? `${contacts.length} contactos (filtrados)` : `Total: ${contacts.length} contactos`,
    headers: ['Nombre', 'Email', 'Empresa', 'Teléfono', 'Estado', 'Origen', 'Interés', 'Ubicación'],
    data,
    filename: `contactos_${new Date().toISOString().split('T')[0]}.pdf`
  });
}

interface CompanyData {
  name: string;
  tradeName: string;
  email: string;
  phone: string;
  sector: string;
  size: string;
  location: string;
}

export function exportCompaniesToPDF(companies: CompanyData[], filtered: boolean = false) {
  const data = companies.map(c => [
    c.name,
    c.tradeName,
    c.email,
    c.phone,
    c.sector,
    c.size,
    c.location
  ]);

  exportToPDF({
    title: 'Reporte de Empresas',
    subtitle: filtered ? `${companies.length} empresas (filtradas)` : `Total: ${companies.length} empresas`,
    headers: ['Nombre', 'Nombre Comercial', 'Email', 'Teléfono', 'Sector', 'Tamaño', 'Ubicación'],
    data,
    filename: `empresas_${new Date().toISOString().split('T')[0]}.pdf`
  });
}

interface AffiliateData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: string;
  tier: string;
  commissionRate: string;
  totalSales: string;
  location: string;
}

export function exportAffiliatesToPDF(affiliates: AffiliateData[], filtered: boolean = false) {
  const data = affiliates.map(a => [
    a.name,
    a.email,
    a.phone,
    a.company || 'N/A',
    a.status,
    a.tier,
    a.commissionRate,
    a.totalSales,
    a.location
  ]);

  exportToPDF({
    title: 'Reporte de Afiliados',
    subtitle: filtered ? `${affiliates.length} afiliados (filtrados)` : `Total: ${affiliates.length} afiliados`,
    headers: ['Nombre', 'Email', 'Teléfono', 'Empresa', 'Estado', 'Nivel', 'Comisión', 'Ventas', 'Ubicación'],
    data,
    filename: `afiliados_${new Date().toISOString().split('T')[0]}.pdf`
  });
}

interface SponsorData {
  name: string;
  company: string;
  email: string;
  phone: string;
  sponsorshipType: string;
  amount: string;
  status: string;
  startDate: string;
  endDate: string;
  location: string;
}

export function exportSponsorsToPDF(sponsors: SponsorData[], filtered: boolean = false) {
  const data = sponsors.map(s => [
    s.name,
    s.company,
    s.email,
    s.phone,
    s.sponsorshipType,
    s.amount,
    s.status,
    s.startDate,
    s.endDate,
    s.location
  ]);

  exportToPDF({
    title: 'Reporte de Patrocinadores',
    subtitle: filtered ? `${sponsors.length} patrocinadores (filtrados)` : `Total: ${sponsors.length} patrocinadores`,
    headers: ['Nombre', 'Empresa', 'Email', 'Teléfono', 'Tipo', 'Monto', 'Estado', 'Inicio', 'Fin', 'Ubicación'],
    data,
    filename: `patrocinadores_${new Date().toISOString().split('T')[0]}.pdf`
  });
}

interface DashboardStats {
  totalContacts: number;
  totalCompanies: number;
  totalAffiliates: number;
  totalSponsors: number;
  conversionRate: string;
  responseRate: string;
  acceptanceRate: string;
}

export function exportDashboardToPDF(stats: DashboardStats, details: any) {
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

  const summaryData = [
    ['Contactos Totales', stats.totalContacts.toString()],
    ['Empresas Registradas', stats.totalCompanies.toString()],
    ['Afiliados Activos', stats.totalAffiliates.toString()],
    ['Patrocinadores', stats.totalSponsors.toString()],
    ['Tasa de Conversión', `${stats.conversionRate}%`],
    ['Tasa de Respuesta', `${stats.responseRate}%`],
    ['Tasa de Aceptación', `${stats.acceptanceRate}%`]
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
      0: { fontStyle: 'bold', textColor: [13, 148, 136] },
      1: { halign: 'right' }
    }
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  if (details.topLocations && details.topLocations.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Top 5 Ubicaciones', 14, yPos);
    yPos += 5;

    autoTable(doc, {
      head: [['Ubicación', 'Contactos']],
      body: details.topLocations,
      startY: yPos,
      theme: 'striped',
      headStyles: {
        fillColor: [13, 148, 136]
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  if (details.topSectors && details.topSectors.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Distribución por Sector', 14, yPos);
    yPos += 5;

    autoTable(doc, {
      head: [['Sector', 'Empresas', 'Porcentaje']],
      body: details.topSectors,
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
