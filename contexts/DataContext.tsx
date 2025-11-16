'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { contactsService, companiesService, affiliatesService, sponsorsService, campaignsService, Campaign, CampaignRecipient, RecipientStatus } from '@/lib/firestore-service';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  companyId?: string;
  role?: string;
  status: string;
  score: string;
  interest: string;
  probability: string;
  origin: string;
  estimatedValue: string;
  location: string;
  isPotential: boolean;
  createdAt: string;
  updatedAt: string;
  owner: string;
  initials: string;
}

export interface Company {
  id: string;
  name: string;
  tradeName: string;
  email: string;
  phone: string;
  website?: string;
  sector: string;
  size: string;
  location: string;
  address: string;
  description: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
  initials: string;
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  companyId?: string;
  status: string;
  commissionRate: string;
  totalSales: string;
  tier: string;
  joinDate: string;
  location: string;
  performanceScore: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  initials: string;
}

export interface Sponsor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  sponsorshipType: string;
  amount: string;
  status: string;
  startDate: string;
  endDate: string;
  benefits: string;
  location: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  initials: string;
}

interface DataContextType {
  contacts: Contact[];
  companies: Company[];
  affiliates: Affiliate[];
  sponsors: Sponsor[];
  campaigns: Campaign[];
  loading: boolean;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'initials'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'initials'>) => Promise<void>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  linkContactToCompany: (contactId: string, companyId: string) => Promise<void>;
  unlinkContactFromCompany: (contactId: string) => Promise<void>;
  getContactsByCompany: (companyId: string) => Contact[];
  importContactsFromCSV: (csvData: string) => Promise<{ success: number; errors: string[] }>;
  importCompaniesFromCSV: (csvData: string) => Promise<{ success: number; errors: string[] }>;
  exportContactsToCSV: (data?: Contact[]) => string;
  exportCompaniesToCSV: (data?: Company[]) => string;
  addAffiliate: (affiliate: Omit<Affiliate, 'id' | 'createdAt' | 'updatedAt' | 'initials'>) => Promise<void>;
  updateAffiliate: (id: string, affiliate: Partial<Affiliate>) => Promise<void>;
  deleteAffiliate: (id: string) => Promise<void>;
  convertContactToAffiliate: (contactId: string, options?: { status?: string; commissionRate?: string; tier?: string }) => Promise<void>;
  convertContactToSponsor: (contactId: string, options?: { sponsorshipType?: string; amount?: string; status?: string; endDate?: string; benefits?: string }) => Promise<void>;
  addSponsor: (sponsor: Omit<Sponsor, 'id' | 'createdAt' | 'updatedAt' | 'initials'>) => Promise<void>;
  updateSponsor: (id: string, sponsor: Partial<Sponsor>) => Promise<void>;
  deleteSponsor: (id: string) => Promise<void>;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCampaign: (id: string, campaign: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  updateRecipientStatus: (campaignId: string, recipientId: string, status: RecipientStatus) => Promise<void>;
  getCampaignById: (id: string) => Campaign | undefined;
  cleanupDuplicates: () => Promise<{ contacts: number; companies: number; affiliates: number; sponsors: number }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Luis Bolaños',
    email: 'luis@landocean.com',
    phone: '(920) 626-3063',
    company: 'Land & Ocean Costa Rican Restaurant',
    companyId: '1',
    role: 'Propietario',
    status: 'Cerrado',
    score: '3/5',
    interest: 'Alto',
    probability: '50%',
    origin: 'Web',
    estimatedValue: '$0',
    location: 'Milwaukee, Estados Unidos',
    isPotential: true,
    createdAt: '15/1/2024',
    updatedAt: '21/9/2025',
    owner: 'admin@crcusa.com',
    initials: 'LB'
  },
  {
    id: '2',
    name: 'Jorge Arturo Barahona',
    email: 'jorge@tacanes.com',
    phone: '(973) 787-4200',
    company: 'Tacanes Restaurant',
    companyId: '2',
    role: 'Gerente',
    status: 'Primer contacto',
    score: '3/5',
    interest: 'Medio',
    probability: '50%',
    origin: 'Referencia',
    estimatedValue: '$0',
    location: 'Newark, Estados Unidos',
    isPotential: true,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'JA'
  },
  {
    id: '3',
    name: 'Byron Gómez',
    email: 'byron@pollotico.com',
    phone: '(720) 343-7757',
    company: 'Pollo Tico',
    companyId: '3',
    role: 'Propietario',
    status: 'Primer contacto',
    score: '3/5',
    interest: 'Medio',
    probability: '50%',
    origin: 'Web',
    estimatedValue: '$0',
    location: 'Denver, Estados Unidos',
    isPotential: true,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'BG'
  },
  {
    id: '4',
    name: 'Dinier Villanueva',
    email: 'dinier@querica.com',
    phone: '(973) 821-5958',
    company: 'Qué Rica Restaurant',
    companyId: '4',
    role: 'Chef',
    status: 'Primer contacto',
    score: '3/5',
    interest: 'Medio',
    probability: '50%',
    origin: 'Referencia',
    estimatedValue: '$0',
    location: 'Newark, Estados Unidos',
    isPotential: true,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'DV'
  },
  {
    id: '5',
    name: 'Wally Corrales',
    email: 'wally@izcorners.com',
    phone: '(646) 490-5460',
    company: 'Iz Corners',
    companyId: '5',
    role: 'Propietario',
    status: 'Primer contacto',
    score: '3/5',
    interest: 'Medio',
    probability: '50%',
    origin: 'Web',
    estimatedValue: '$0',
    location: 'Nueva York, Estados Unidos',
    isPotential: true,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'WC'
  },
  {
    id: '6',
    name: 'Miriam Cerdas',
    email: 'miriam@irazu.com',
    phone: '(773) 252-5067',
    company: 'Irazu Costa Rican Restaurant',
    companyId: '6',
    role: 'Gerente',
    status: 'Primer contacto',
    score: '3/5',
    interest: 'Medio',
    probability: '50%',
    origin: 'Referencia',
    estimatedValue: '$0',
    location: 'Chicago, Estados Unidos',
    isPotential: true,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'MC'
  }
];

const initialCompanies: Company[] = [
  {
    id: '1',
    name: 'Land & Ocean Costa Rican Restaurant',
    tradeName: 'Land & Ocean',
    email: 'info@landocean.com',
    phone: '(920) 626-3063',
    website: 'https://landocean.com',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Milwaukee, Wisconsin, Estados Unidos',
    address: '1532 N Farwell Ave, Milwaukee, WI 53202',
    description: 'Restaurante especializado en comida costarricense auténtica',
    latitude: 43.0458,
    longitude: -87.8959,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'LO'
  },
  {
    id: '2',
    name: 'Tacanes Restaurant LLC',
    tradeName: 'Tacanes Restaurant',
    email: 'info@tacanes.com',
    phone: '(973) 787-4200',
    website: '',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Newark, New Jersey, Estados Unidos',
    address: '123 Main St, Newark, NJ 07102',
    description: 'Restaurante familiar con especialidades costarricenses',
    latitude: 40.7357,
    longitude: -74.1724,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'TR'
  },
  {
    id: '3',
    name: 'Pollo Tico Inc',
    tradeName: 'Pollo Tico',
    email: 'info@pollotico.com',
    phone: '(720) 343-7757',
    website: 'https://pollotico.com',
    sector: 'Restaurante',
    size: 'Mediana (11-50)',
    location: 'Denver, Colorado, Estados Unidos',
    address: '456 Denver Ave, Denver, CO 80202',
    description: 'Cadena de restaurantes especializados en pollo al estilo costarricense',
    latitude: 39.7392,
    longitude: -104.9903,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'PT'
  },
  {
    id: '4',
    name: 'Qué Rica Restaurant Corp',
    tradeName: 'Qué Rica Restaurant',
    email: 'info@querica.com',
    phone: '(973) 821-5958',
    website: '',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Newark, New Jersey, Estados Unidos',
    address: '789 Newark St, Newark, NJ 07103',
    description: 'Restaurante tradicional con ambiente familiar',
    latitude: 40.7282,
    longitude: -74.1776,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'QR'
  },
  {
    id: '5',
    name: 'Iz Corners LLC',
    tradeName: 'Iz Corners',
    email: 'info@izcorners.com',
    phone: '(646) 490-5460',
    website: '',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Nueva York, Estados Unidos',
    address: '321 NY Ave, New York, NY 10001',
    description: 'Restaurante boutique con fusión costarricense',
    latitude: 40.7484,
    longitude: -73.9857,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'IC'
  },
  {
    id: '6',
    name: 'Irazu Costa Rican Restaurant Inc',
    tradeName: 'Irazu Costa Rican Restaurant',
    email: 'info@irazu.com',
    phone: '(773) 252-5067',
    website: '',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Chicago, Illinois, Estados Unidos',
    address: '654 Chicago Blvd, Chicago, IL 60601',
    description: 'Restaurante tradicional costarricense en el corazón de Chicago',
    latitude: 41.8781,
    longitude: -87.6298,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'IR'
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuthenticated(true);
        loadData();
      } else {
        setUserAuthenticated(false);
        setContacts([]);
        setCompanies([]);
        setAffiliates([]);
        setSponsors([]);
        setCampaigns([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    if (!userAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [contactsData, companiesData, affiliatesData, sponsorsData, campaignsData] = await Promise.all([
        contactsService.getAll(),
        companiesService.getAll(),
        affiliatesService.getAll(),
        sponsorsService.getAll(),
        campaignsService.getAll()
      ]);

      if (contactsData.length === 0 && companiesData.length === 0 && !initialized) {
        await initializeData();
        setInitialized(true);
      } else {
        setContacts(contactsData.map(formatContact));
        setCompanies(companiesData.map(formatCompany));
        setAffiliates(affiliatesData.map(formatAffiliate));
        setSponsors(sponsorsData.map(formatSponsor));
        setCampaigns(campaignsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeData = async () => {
    try {
      const contactPromises = initialContacts.map(contact =>
        contactsService.create(contact)
      );
      const companyPromises = initialCompanies.map(company =>
        companiesService.create(company)
      );

      await Promise.all([...contactPromises, ...companyPromises]);
      await loadData();
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  const formatContact = (contact: any): Contact => ({
    ...contact,
    createdAt: contact.createdAt instanceof Date ? contact.createdAt.toLocaleDateString('es-ES') : contact.createdAt,
    updatedAt: contact.updatedAt instanceof Date ? contact.updatedAt.toLocaleDateString('es-ES') : contact.updatedAt
  });

  const formatCompany = (company: any): Company => ({
    ...company,
    createdAt: company.createdAt instanceof Date ? company.createdAt.toLocaleDateString('es-ES') : company.createdAt,
    updatedAt: company.updatedAt instanceof Date ? company.updatedAt.toLocaleDateString('es-ES') : company.updatedAt
  });

  const formatAffiliate = (affiliate: any): Affiliate => ({
    ...affiliate,
    createdAt: affiliate.createdAt instanceof Date ? affiliate.createdAt.toLocaleDateString('es-ES') : affiliate.createdAt,
    updatedAt: affiliate.updatedAt instanceof Date ? affiliate.updatedAt.toLocaleDateString('es-ES') : affiliate.updatedAt
  });

  const formatSponsor = (sponsor: any): Sponsor => ({
    ...sponsor,
    createdAt: sponsor.createdAt instanceof Date ? sponsor.createdAt.toLocaleDateString('es-ES') : sponsor.createdAt,
    updatedAt: sponsor.updatedAt instanceof Date ? sponsor.updatedAt.toLocaleDateString('es-ES') : sponsor.updatedAt
  });

  const generateInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const addContact = async (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'initials'>) => {
    try {
      const duplicateByEmail = contacts.find(c => c.email.toLowerCase() === contactData.email.toLowerCase());
      if (duplicateByEmail) {
        throw new Error(`Ya existe un contacto con el email: ${contactData.email}`);
      }

      const duplicateByPhone = contacts.find(c => c.phone === contactData.phone && contactData.phone.trim() !== '');
      if (duplicateByPhone) {
        throw new Error(`Ya existe un contacto con el teléfono: ${contactData.phone}`);
      }

      const now = new Date().toLocaleDateString('es-ES');
      const newContact = {
        ...contactData,
        createdAt: now,
        updatedAt: now,
        initials: generateInitials(contactData.name)
      };
      await contactsService.create(newContact as any);
      await loadData();
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  };

  const updateContact = async (id: string, contactData: Partial<Contact>) => {
    try {
      if (contactData.email) {
        const duplicateByEmail = contacts.find(c => c.id !== id && c.email.toLowerCase() === contactData.email!.toLowerCase());
        if (duplicateByEmail) {
          throw new Error(`Ya existe un contacto con el email: ${contactData.email}`);
        }
      }

      if (contactData.phone && contactData.phone.trim() !== '') {
        const duplicateByPhone = contacts.find(c => c.id !== id && c.phone === contactData.phone);
        if (duplicateByPhone) {
          throw new Error(`Ya existe un contacto con el teléfono: ${contactData.phone}`);
        }
      }

      const updates: any = {
        ...contactData,
        updatedAt: new Date().toLocaleDateString('es-ES')
      };
      if (contactData.name) {
        updates.initials = generateInitials(contactData.name);
      }
      await contactsService.update(id, updates);
      await loadData();
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await contactsService.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  };

  const addCompany = async (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'initials'>) => {
    try {
      const duplicateByEmail = companies.find(c => c.email.toLowerCase() === companyData.email.toLowerCase());
      if (duplicateByEmail) {
        throw new Error(`Ya existe una compañía con el email: ${companyData.email}`);
      }

      const duplicateByName = companies.find(c => c.name.toLowerCase() === companyData.name.toLowerCase());
      if (duplicateByName) {
        throw new Error(`Ya existe una compañía con el nombre: ${companyData.name}`);
      }

      const now = new Date().toLocaleDateString('es-ES');
      const newCompany = {
        ...companyData,
        createdAt: now,
        updatedAt: now,
        initials: generateInitials(companyData.name)
      };
      await companiesService.create(newCompany as any);
      await loadData();
    } catch (error) {
      console.error('Error adding company:', error);
      throw error;
    }
  };

  const updateCompany = async (id: string, companyData: Partial<Company>) => {
    try {
      if (companyData.email) {
        const duplicateByEmail = companies.find(c => c.id !== id && c.email.toLowerCase() === companyData.email!.toLowerCase());
        if (duplicateByEmail) {
          throw new Error(`Ya existe una compañía con el email: ${companyData.email}`);
        }
      }

      if (companyData.name) {
        const duplicateByName = companies.find(c => c.id !== id && c.name.toLowerCase() === companyData.name!.toLowerCase());
        if (duplicateByName) {
          throw new Error(`Ya existe una compañía con el nombre: ${companyData.name}`);
        }
      }

      const updates: any = {
        ...companyData,
        updatedAt: new Date().toLocaleDateString('es-ES')
      };
      if (companyData.name) {
        updates.initials = generateInitials(companyData.name);
      }
      await companiesService.update(id, updates);
      await loadData();
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const linkedContacts = contacts.filter(c => c.companyId === id);
      await Promise.all(
        linkedContacts.map(contact =>
          contactsService.update(contact.id, { companyId: undefined, company: undefined })
        )
      );
      await companiesService.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  };

  const linkContactToCompany = async (contactId: string, companyId: string) => {
    try {
      const company = companies.find(c => c.id === companyId);
      if (company) {
        await contactsService.update(contactId, {
          companyId,
          company: company.name
        });
        await loadData();
      }
    } catch (error) {
      console.error('Error linking contact to company:', error);
      throw error;
    }
  };

  const unlinkContactFromCompany = async (contactId: string) => {
    try {
      await contactsService.update(contactId, {
        companyId: undefined,
        company: undefined
      });
      await loadData();
    } catch (error) {
      console.error('Error unlinking contact from company:', error);
      throw error;
    }
  };

  const getContactsByCompany = (companyId: string): Contact[] => {
    return contacts.filter(contact => contact.companyId === companyId);
  };

  const importContactsFromCSV = async (csvData: string): Promise<{ success: number; errors: string[] }> => {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const errors: string[] = [];
    let success = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const contactData: any = {};

        headers.forEach((header, index) => {
          contactData[header] = values[index] || '';
        });

        if (!contactData.name || !contactData.email) {
          errors.push(`Línea ${i + 1}: Nombre y email son requeridos`);
          continue;
        }

        await addContact({
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || '',
          company: contactData.company || '',
          role: contactData.role || '',
          status: contactData.status || 'Primer contacto',
          score: contactData.score || '3/5',
          interest: contactData.interest || 'Medio',
          probability: contactData.probability || '50%',
          origin: contactData.origin || 'Importación',
          estimatedValue: contactData.estimatedValue || '$0',
          location: contactData.location || '',
          isPotential: contactData.isPotential === 'true' || contactData.isPotential === '1',
          owner: 'admin@crcusa.com'
        });

        success++;
      } catch (error) {
        errors.push(`Línea ${i + 1}: Error al procesar datos`);
      }
    }

    return { success, errors };
  };

  const importCompaniesFromCSV = async (csvData: string): Promise<{ success: number; errors: string[] }> => {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const errors: string[] = [];
    let success = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const companyData: any = {};

        headers.forEach((header, index) => {
          companyData[header] = values[index] || '';
        });

        if (!companyData.name || !companyData.email) {
          errors.push(`Línea ${i + 1}: Nombre y email son requeridos`);
          continue;
        }

        await addCompany({
          name: companyData.name,
          tradeName: companyData.tradeName || companyData.name,
          email: companyData.email,
          phone: companyData.phone || '',
          website: companyData.website || '',
          sector: companyData.sector || 'Otro',
          size: companyData.size || 'Pequeña (1-10)',
          location: companyData.location || '',
          address: companyData.address || '',
          description: companyData.description || '',
          owner: 'admin@crcusa.com'
        });

        success++;
      } catch (error) {
        errors.push(`Línea ${i + 1}: Error al procesar datos`);
      }
    }

    return { success, errors };
  };

  const exportContactsToCSV = (data?: Contact[]): string => {
    const contactsToExport = data || contacts;
    const headers = ['name', 'email', 'phone', 'company', 'role', 'status', 'score', 'interest', 'probability', 'origin', 'estimatedValue', 'location', 'isPotential', 'createdAt', 'updatedAt', 'owner'];
    const csvContent = [
      headers.join(','),
      ...contactsToExport.map(contact =>
        headers.map(header => {
          const value = contact[header as keyof Contact];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const exportCompaniesToCSV = (data?: Company[]): string => {
    const companiesToExport = data || companies;
    const headers = ['name', 'tradeName', 'email', 'phone', 'website', 'sector', 'size', 'location', 'address', 'description', 'latitude', 'longitude', 'createdAt', 'updatedAt', 'owner'];
    const csvContent = [
      headers.join(','),
      ...companiesToExport.map(company =>
        headers.map(header => {
          const value = company[header as keyof Company];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const addAffiliate = async (affiliateData: Omit<Affiliate, 'id' | 'createdAt' | 'updatedAt' | 'initials'>) => {
    try {
      const duplicateByEmail = affiliates.find(a => a.email.toLowerCase() === affiliateData.email.toLowerCase());
      if (duplicateByEmail) {
        throw new Error(`Ya existe un afiliado con el email: ${affiliateData.email}`);
      }

      const duplicateByPhone = affiliates.find(a => a.phone === affiliateData.phone && affiliateData.phone.trim() !== '');
      if (duplicateByPhone) {
        throw new Error(`Ya existe un afiliado con el teléfono: ${affiliateData.phone}`);
      }

      const now = new Date().toLocaleDateString('es-ES');
      const newAffiliate = {
        ...affiliateData,
        createdAt: now,
        updatedAt: now,
        initials: generateInitials(affiliateData.name)
      };
      await affiliatesService.create(newAffiliate as any);
      await loadData();
    } catch (error) {
      console.error('Error adding affiliate:', error);
      throw error;
    }
  };

  const updateAffiliate = async (id: string, affiliateData: Partial<Affiliate>) => {
    try {
      if (affiliateData.email) {
        const duplicateByEmail = affiliates.find(a => a.id !== id && a.email.toLowerCase() === affiliateData.email!.toLowerCase());
        if (duplicateByEmail) {
          throw new Error(`Ya existe un afiliado con el email: ${affiliateData.email}`);
        }
      }

      if (affiliateData.phone && affiliateData.phone.trim() !== '') {
        const duplicateByPhone = affiliates.find(a => a.id !== id && a.phone === affiliateData.phone);
        if (duplicateByPhone) {
          throw new Error(`Ya existe un afiliado con el teléfono: ${affiliateData.phone}`);
        }
      }

      const updates: any = {
        ...affiliateData,
        updatedAt: new Date().toLocaleDateString('es-ES')
      };
      if (affiliateData.name) {
        updates.initials = generateInitials(affiliateData.name);
      }
      await affiliatesService.update(id, updates);
      await loadData();
    } catch (error) {
      console.error('Error updating affiliate:', error);
      throw error;
    }
  };

  const deleteAffiliate = async (id: string) => {
    try {
      await affiliatesService.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting affiliate:', error);
      throw error;
    }
  };

  const convertContactToAffiliate = async (contactId: string, options?: { status?: string; commissionRate?: string; tier?: string }) => {
    try {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;

      const now = new Date().toLocaleDateString('es-ES');
      const newAffiliate = {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        companyId: contact.companyId,
        status: options?.status || 'Activo',
        commissionRate: options?.commissionRate || '10%',
        totalSales: '$0',
        tier: options?.tier || 'Bronce',
        joinDate: now,
        location: contact.location,
        performanceScore: '0',
        createdAt: now,
        updatedAt: now,
        owner: contact.owner,
        initials: contact.initials
      };

      await affiliatesService.create(newAffiliate as any);
      await loadData();
    } catch (error) {
      console.error('Error converting contact to affiliate:', error);
      throw error;
    }
  };

  const convertContactToSponsor = async (contactId: string, options?: { sponsorshipType?: string; amount?: string; status?: string; endDate?: string; benefits?: string }) => {
    try {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;

      const now = new Date().toLocaleDateString('es-ES');
      const newSponsor = {
        name: contact.name,
        company: contact.company || 'Sin empresa',
        email: contact.email,
        phone: contact.phone,
        sponsorshipType: options?.sponsorshipType || 'Oro',
        amount: options?.amount || '$0',
        status: options?.status || 'Activo',
        startDate: now,
        endDate: options?.endDate || '',
        benefits: options?.benefits || '',
        location: contact.location,
        website: '',
        createdAt: now,
        updatedAt: now,
        owner: contact.owner,
        initials: contact.initials
      };

      await sponsorsService.create(newSponsor as any);
      await loadData();
    } catch (error) {
      console.error('Error converting contact to sponsor:', error);
      throw error;
    }
  };

  const addSponsor = async (sponsorData: Omit<Sponsor, 'id' | 'createdAt' | 'updatedAt' | 'initials'>) => {
    try {
      const duplicateByEmail = sponsors.find(s => s.email.toLowerCase() === sponsorData.email.toLowerCase());
      if (duplicateByEmail) {
        throw new Error(`Ya existe un patrocinador con el email: ${sponsorData.email}`);
      }

      const duplicateByPhone = sponsors.find(s => s.phone === sponsorData.phone && sponsorData.phone.trim() !== '');
      if (duplicateByPhone) {
        throw new Error(`Ya existe un patrocinador con el teléfono: ${sponsorData.phone}`);
      }

      const now = new Date().toLocaleDateString('es-ES');
      const newSponsor = {
        ...sponsorData,
        createdAt: now,
        updatedAt: now,
        initials: generateInitials(sponsorData.name)
      };
      await sponsorsService.create(newSponsor as any);
      await loadData();
    } catch (error) {
      console.error('Error adding sponsor:', error);
      throw error;
    }
  };

  const updateSponsor = async (id: string, sponsorData: Partial<Sponsor>) => {
    try {
      if (sponsorData.email) {
        const duplicateByEmail = sponsors.find(s => s.id !== id && s.email.toLowerCase() === sponsorData.email!.toLowerCase());
        if (duplicateByEmail) {
          throw new Error(`Ya existe un patrocinador con el email: ${sponsorData.email}`);
        }
      }

      if (sponsorData.phone && sponsorData.phone.trim() !== '') {
        const duplicateByPhone = sponsors.find(s => s.id !== id && s.phone === sponsorData.phone);
        if (duplicateByPhone) {
          throw new Error(`Ya existe un patrocinador con el teléfono: ${sponsorData.phone}`);
        }
      }

      const updates: any = {
        ...sponsorData,
        updatedAt: new Date().toLocaleDateString('es-ES')
      };
      if (sponsorData.name) {
        updates.initials = generateInitials(sponsorData.name);
      }
      await sponsorsService.update(id, updates);
      await loadData();
    } catch (error) {
      console.error('Error updating sponsor:', error);
      throw error;
    }
  };

  const deleteSponsor = async (id: string) => {
    try {
      await sponsorsService.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      throw error;
    }
  };

  const addCampaign = async (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await campaignsService.create(campaignData);
      await loadData();
    } catch (error) {
      console.error('Error adding campaign:', error);
      throw error;
    }
  };

  const updateCampaign = async (id: string, campaignData: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => {
    try {
      await campaignsService.update(id, campaignData);
      await loadData();
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      await campaignsService.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  };

  const updateRecipientStatus = async (campaignId: string, recipientId: string, status: RecipientStatus) => {
    try {
      await campaignsService.updateRecipientStatus(campaignId, recipientId, status);
      await loadData();
    } catch (error) {
      console.error('Error updating recipient status:', error);
      throw error;
    }
  };

  const getCampaignById = (id: string): Campaign | undefined => {
    return campaigns.find(campaign => campaign.id === id);
  };

  const cleanupDuplicates = async (): Promise<{ contacts: number; companies: number; affiliates: number; sponsors: number }> => {
    try {
      let contactsRemoved = 0;
      let companiesRemoved = 0;
      let affiliatesRemoved = 0;
      let sponsorsRemoved = 0;

      const parseDate = (dateValue: any): number => {
        if (!dateValue) return 0;

        if (dateValue instanceof Date) {
          return dateValue.getTime();
        }

        if (typeof dateValue === 'string') {
          const parts = dateValue.split('/');
          if (parts.length === 3) {
            const parsed = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
            if (!isNaN(parsed.getTime())) {
              return parsed.getTime();
            }
          }

          const isoDate = new Date(dateValue);
          if (!isNaN(isoDate.getTime())) {
            return isoDate.getTime();
          }
        }

        return 0;
      };

      const removeDuplicatesByEmail = async (
        items: any[],
        deleteService: { delete: (id: string) => Promise<void> }
      ): Promise<number> => {
        const emailMap = new Map<string, any[]>();

        items.forEach(item => {
          if (item.email && typeof item.email === 'string') {
            const normalizedEmail = item.email.trim().toLowerCase();
            if (normalizedEmail) {
              if (!emailMap.has(normalizedEmail)) {
                emailMap.set(normalizedEmail, []);
              }
              emailMap.get(normalizedEmail)!.push(item);
            }
          }
        });

        let removed = 0;

        for (const [email, duplicates] of Array.from(emailMap.entries())) {
          if (duplicates.length > 1) {
            duplicates.sort((a, b) => {
              const dateA = parseDate(a.createdAt);
              const dateB = parseDate(b.createdAt);

              if (dateA === 0 && dateB === 0) {
                return a.id.localeCompare(b.id);
              }
              if (dateA === 0) return 1;
              if (dateB === 0) return -1;

              return dateA - dateB;
            });

            for (let i = 1; i < duplicates.length; i++) {
              try {
                await deleteService.delete(duplicates[i].id);
                removed++;
              } catch (error) {
                console.error(`Error deleting duplicate ${duplicates[i].id}:`, error);
              }
            }
          }
        }

        return removed;
      };

      const freshContacts = await contactsService.getAll();
      contactsRemoved = await removeDuplicatesByEmail(freshContacts, contactsService);

      const freshCompanies = await companiesService.getAll();
      companiesRemoved = await removeDuplicatesByEmail(freshCompanies, companiesService);

      const freshAffiliates = await affiliatesService.getAll();
      affiliatesRemoved = await removeDuplicatesByEmail(freshAffiliates, affiliatesService);

      const freshSponsors = await sponsorsService.getAll();
      sponsorsRemoved = await removeDuplicatesByEmail(freshSponsors, sponsorsService);

      await loadData();

      return {
        contacts: contactsRemoved,
        companies: companiesRemoved,
        affiliates: affiliatesRemoved,
        sponsors: sponsorsRemoved
      };
    } catch (error) {
      console.error('Error cleaning duplicates:', error);
      throw error;
    }
  };

  const value = {
    contacts,
    companies,
    affiliates,
    sponsors,
    campaigns,
    loading,
    addContact,
    updateContact,
    deleteContact,
    addCompany,
    updateCompany,
    deleteCompany,
    linkContactToCompany,
    unlinkContactFromCompany,
    getContactsByCompany,
    importContactsFromCSV,
    importCompaniesFromCSV,
    exportContactsToCSV,
    exportCompaniesToCSV,
    addAffiliate,
    updateAffiliate,
    deleteAffiliate,
    convertContactToAffiliate,
    convertContactToSponsor,
    addSponsor,
    updateSponsor,
    deleteSponsor,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    updateRecipientStatus,
    getCampaignById,
    cleanupDuplicates
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
