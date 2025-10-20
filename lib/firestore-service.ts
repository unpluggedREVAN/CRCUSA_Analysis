'use client';

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

export interface FirestoreContact {
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

export interface FirestoreCompany {
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
  createdAt: string;
  updatedAt: string;
  owner: string;
  initials: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate: Date;
  targetAudience: string;
  goals: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreAffiliate {
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

export interface FirestoreSponsor {
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

const convertTimestamp = (data: DocumentData): any => {
  const converted: any = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
};

export const contactsService = {
  async getAll(): Promise<any[]> {
    const querySnapshot = await getDocs(collection(db, 'contacts'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamp(doc.data())
    }));
  },

  async getById(id: string): Promise<any | null> {
    const docRef = doc(db, 'contacts', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...convertTimestamp(docSnap.data()) };
    }
    return null;
  },

  async create(contact: FirestoreContact): Promise<string> {
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...contact
    });
    return docRef.id;
  },

  async update(id: string, contact: Partial<FirestoreContact>): Promise<void> {
    const docRef = doc(db, 'contacts', id);
    await updateDoc(docRef, {
      ...contact
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'contacts', id));
  }
};

export const companiesService = {
  async getAll(): Promise<any[]> {
    const querySnapshot = await getDocs(collection(db, 'companies'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamp(doc.data())
    }));
  },

  async getById(id: string): Promise<any | null> {
    const docRef = doc(db, 'companies', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...convertTimestamp(docSnap.data()) };
    }
    return null;
  },

  async create(company: FirestoreCompany): Promise<string> {
    const docRef = await addDoc(collection(db, 'companies'), {
      ...company
    });
    return docRef.id;
  },

  async update(id: string, company: Partial<FirestoreCompany>): Promise<void> {
    const docRef = doc(db, 'companies', id);
    await updateDoc(docRef, {
      ...company
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'companies', id));
  }
};

export const campaignsService = {
  async getAll(): Promise<Campaign[]> {
    const querySnapshot = await getDocs(collection(db, 'campaigns'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamp(doc.data())
    } as Campaign));
  },

  async getById(id: string): Promise<Campaign | null> {
    const docRef = doc(db, 'campaigns', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...convertTimestamp(docSnap.data()) } as Campaign;
    }
    return null;
  },

  async create(campaign: Omit<Campaign, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'campaigns'), {
      ...campaign,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, campaign: Partial<Campaign>): Promise<void> {
    const docRef = doc(db, 'campaigns', id);
    await updateDoc(docRef, {
      ...campaign,
      updatedAt: Timestamp.now()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'campaigns', id));
  }
};

export const notesService = {
  async getAll(): Promise<Note[]> {
    const querySnapshot = await getDocs(collection(db, 'notes'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamp(doc.data())
    } as Note));
  },

  async getById(id: string): Promise<Note | null> {
    const docRef = doc(db, 'notes', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...convertTimestamp(docSnap.data()) } as Note;
    }
    return null;
  },

  async create(note: Omit<Note, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'notes'), {
      ...note,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, note: Partial<Note>): Promise<void> {
    const docRef = doc(db, 'notes', id);
    await updateDoc(docRef, {
      ...note,
      updatedAt: Timestamp.now()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'notes', id));
  }
};

export const affiliatesService = {
  async getAll(): Promise<any[]> {
    const querySnapshot = await getDocs(collection(db, 'affiliates'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamp(doc.data())
    }));
  },

  async getById(id: string): Promise<any | null> {
    const docRef = doc(db, 'affiliates', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...convertTimestamp(docSnap.data()) };
    }
    return null;
  },

  async create(affiliate: FirestoreAffiliate): Promise<string> {
    const docRef = await addDoc(collection(db, 'affiliates'), {
      ...affiliate
    });
    return docRef.id;
  },

  async update(id: string, affiliate: Partial<FirestoreAffiliate>): Promise<void> {
    const docRef = doc(db, 'affiliates', id);
    await updateDoc(docRef, {
      ...affiliate
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'affiliates', id));
  }
};

export const sponsorsService = {
  async getAll(): Promise<any[]> {
    const querySnapshot = await getDocs(collection(db, 'sponsors'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamp(doc.data())
    }));
  },

  async getById(id: string): Promise<any | null> {
    const docRef = doc(db, 'sponsors', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...convertTimestamp(docSnap.data()) };
    }
    return null;
  },

  async create(sponsor: FirestoreSponsor): Promise<string> {
    const docRef = await addDoc(collection(db, 'sponsors'), {
      ...sponsor
    });
    return docRef.id;
  },

  async update(id: string, sponsor: Partial<FirestoreSponsor>): Promise<void> {
    const docRef = doc(db, 'sponsors', id);
    await updateDoc(docRef, {
      ...sponsor
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'sponsors', id));
  }
};
