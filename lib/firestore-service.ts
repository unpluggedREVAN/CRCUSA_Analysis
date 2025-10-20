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
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
  initials: string;
}

export type RecipientStatus = 'sin_contestar' | 'en_espera' | 'aceptado' | 'rechazado';
export type RecipientType = 'contact' | 'affiliate' | 'sponsor';

export interface CampaignRecipient {
  id: string;
  name: string;
  email: string;
  type: RecipientType;
  status: RecipientStatus;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  recipients: CampaignRecipient[];
  createdAt: string;
  updatedAt: string;
  owner: string;
}

export interface Connection {
  id: string;
  fromNoteId: string;
  toNoteId: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  owner: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreNote {
  title: string;
  content: string;
  owner: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  createdAt: string;
  updatedAt: string;
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
      ...doc.data()
    } as Campaign));
  },

  async getById(id: string): Promise<Campaign | null> {
    const docRef = doc(db, 'campaigns', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Campaign;
    }
    return null;
  },

  async create(campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'campaigns'), {
      ...campaign,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  async update(id: string, campaign: Partial<Omit<Campaign, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, 'campaigns', id);
    await updateDoc(docRef, {
      ...campaign,
      updatedAt: new Date().toISOString()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'campaigns', id));
  },

  async updateRecipientStatus(campaignId: string, recipientId: string, status: RecipientStatus): Promise<void> {
    const campaign = await this.getById(campaignId);
    if (!campaign) return;

    const updatedRecipients = campaign.recipients.map(recipient =>
      recipient.id === recipientId ? { ...recipient, status } : recipient
    );

    await this.update(campaignId, { recipients: updatedRecipients });
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

  async create(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'notes'), {
      ...note,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  async update(id: string, note: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const docRef = doc(db, 'notes', id);
    await updateDoc(docRef, {
      ...note,
      updatedAt: new Date().toISOString()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'notes', id));
  }
};

export const connectionsService = {
  async getAll(): Promise<Connection[]> {
    const querySnapshot = await getDocs(collection(db, 'connections'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Connection));
  },

  async create(connection: Omit<Connection, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'connections'), connection);
    return docRef.id;
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'connections', id));
  },

  async deleteByNoteId(noteId: string): Promise<void> {
    const q = query(
      collection(db, 'connections'),
      where('fromNoteId', '==', noteId)
    );
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));

    const q2 = query(
      collection(db, 'connections'),
      where('toNoteId', '==', noteId)
    );
    const querySnapshot2 = await getDocs(q2);
    const deletePromises2 = querySnapshot2.docs.map(doc => deleteDoc(doc.ref));

    await Promise.all([...deletePromises, ...deletePromises2]);
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
