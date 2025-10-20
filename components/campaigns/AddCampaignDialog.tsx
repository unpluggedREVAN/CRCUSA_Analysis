'use client';

import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { CampaignRecipient } from '@/lib/firestore-service';
import { Users, Mail, Calendar, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AddCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCampaignDialog({ open, onOpenChange }: AddCampaignDialogProps) {
  const { contacts, affiliates, sponsors, addCampaign } = useData();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [selectedAffiliates, setSelectedAffiliates] = useState<Set<string>>(new Set());
  const [selectedSponsors, setSelectedSponsors] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('La descripción es obligatoria');
      return;
    }

    if (!formData.startDate) {
      toast.error('La fecha de inicio es obligatoria');
      return;
    }

    if (!formData.endDate) {
      toast.error('La fecha de fin es obligatoria');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    const totalRecipients = selectedContacts.size + selectedAffiliates.size + selectedSponsors.size;
    if (totalRecipients === 0) {
      toast.error('Debe seleccionar al menos un destinatario');
      return;
    }

    const recipients: CampaignRecipient[] = [];

    selectedContacts.forEach(id => {
      const contact = contacts.find(c => c.id === id);
      if (contact) {
        recipients.push({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          type: 'contact',
          status: 'sin_contestar'
        });
      }
    });

    selectedAffiliates.forEach(id => {
      const affiliate = affiliates.find(a => a.id === id);
      if (affiliate) {
        recipients.push({
          id: affiliate.id,
          name: affiliate.name,
          email: affiliate.email,
          type: 'affiliate',
          status: 'sin_contestar'
        });
      }
    });

    selectedSponsors.forEach(id => {
      const sponsor = sponsors.find(s => s.id === id);
      if (sponsor) {
        recipients.push({
          id: sponsor.id,
          name: sponsor.name,
          email: sponsor.email,
          type: 'sponsor',
          status: 'sin_contestar'
        });
      }
    });

    try {
      setLoading(true);
      await addCampaign({
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        recipients,
        owner: user?.email || 'admin@crcusa.com'
      });

      toast.success('Campaña creada exitosamente');
      handleClose();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Error al crear la campaña');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', startDate: '', endDate: '' });
    setSelectedContacts(new Set());
    setSelectedAffiliates(new Set());
    setSelectedSponsors(new Set());
    onOpenChange(false);
  };

  const isPersonAlreadySelected = (email: string, currentCategory: 'contact' | 'affiliate' | 'sponsor'): boolean => {
    if (currentCategory !== 'contact') {
      const contactMatch = contacts.find(c => c.email === email && selectedContacts.has(c.id));
      if (contactMatch) return true;
    }
    if (currentCategory !== 'affiliate') {
      const affiliateMatch = affiliates.find(a => a.email === email && selectedAffiliates.has(a.id));
      if (affiliateMatch) return true;
    }
    if (currentCategory !== 'sponsor') {
      const sponsorMatch = sponsors.find(s => s.email === email && selectedSponsors.has(s.id));
      if (sponsorMatch) return true;
    }
    return false;
  };

  const toggleContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    const newSet = new Set(selectedContacts);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (isPersonAlreadySelected(contact.email, 'contact')) {
        toast.error(`${contact.name} ya está seleccionado en otra categoría`);
        return;
      }
      newSet.add(id);
    }
    setSelectedContacts(newSet);
  };

  const toggleAffiliate = (id: string) => {
    const affiliate = affiliates.find(a => a.id === id);
    if (!affiliate) return;

    const newSet = new Set(selectedAffiliates);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (isPersonAlreadySelected(affiliate.email, 'affiliate')) {
        toast.error(`${affiliate.name} ya está seleccionado en otra categoría`);
        return;
      }
      newSet.add(id);
    }
    setSelectedAffiliates(newSet);
  };

  const toggleSponsor = (id: string) => {
    const sponsor = sponsors.find(s => s.id === id);
    if (!sponsor) return;

    const newSet = new Set(selectedSponsors);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (isPersonAlreadySelected(sponsor.email, 'sponsor')) {
        toast.error(`${sponsor.name} ya está seleccionado en otra categoría`);
        return;
      }
      newSet.add(id);
    }
    setSelectedSponsors(newSet);
  };

  const getSelectedEmails = (): Set<string> => {
    const emails = new Set<string>();

    selectedContacts.forEach(id => {
      const contact = contacts.find(c => c.id === id);
      if (contact) emails.add(contact.email);
    });

    selectedAffiliates.forEach(id => {
      const affiliate = affiliates.find(a => a.id === id);
      if (affiliate) emails.add(affiliate.email);
    });

    selectedSponsors.forEach(id => {
      const sponsor = sponsors.find(s => s.id === id);
      if (sponsor) emails.add(sponsor.email);
    });

    return emails;
  };

  const selectAllContacts = () => {
    const selectedEmails = getSelectedEmails();
    const validContacts: string[] = [];
    let skippedCount = 0;

    contacts.forEach(contact => {
      if (!selectedEmails.has(contact.email) || selectedContacts.has(contact.id)) {
        validContacts.push(contact.id);
      } else {
        skippedCount++;
      }
    });

    setSelectedContacts(new Set(validContacts));

    if (skippedCount > 0) {
      toast.warning(`${skippedCount} contacto(s) omitido(s) porque ya están seleccionados en otra categoría`);
    }
  };

  const deselectAllContacts = () => {
    setSelectedContacts(new Set());
  };

  const selectAllAffiliates = () => {
    const selectedEmails = getSelectedEmails();
    const validAffiliates: string[] = [];
    let skippedCount = 0;

    affiliates.forEach(affiliate => {
      if (!selectedEmails.has(affiliate.email) || selectedAffiliates.has(affiliate.id)) {
        validAffiliates.push(affiliate.id);
      } else {
        skippedCount++;
      }
    });

    setSelectedAffiliates(new Set(validAffiliates));

    if (skippedCount > 0) {
      toast.warning(`${skippedCount} afiliado(s) omitido(s) porque ya están seleccionados en otra categoría`);
    }
  };

  const deselectAllAffiliates = () => {
    setSelectedAffiliates(new Set());
  };

  const selectAllSponsors = () => {
    const selectedEmails = getSelectedEmails();
    const validSponsors: string[] = [];
    let skippedCount = 0;

    sponsors.forEach(sponsor => {
      if (!selectedEmails.has(sponsor.email) || selectedSponsors.has(sponsor.id)) {
        validSponsors.push(sponsor.id);
      } else {
        skippedCount++;
      }
    });

    setSelectedSponsors(new Set(validSponsors));

    if (skippedCount > 0) {
      toast.warning(`${skippedCount} patrocinador(es) omitido(s) porque ya están seleccionados en otra categoría`);
    }
  };

  const deselectAllSponsors = () => {
    setSelectedSponsors(new Set());
  };

  const totalSelected = selectedContacts.size + selectedAffiliates.size + selectedSponsors.size;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Nueva Campaña</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-1">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5 pr-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título de la Campaña *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Campaña de Bienvenida Q1 2025"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="startDate">Fecha de Inicio *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Fecha de Fin *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe el objetivo y contenido de la campaña..."
                  rows={2}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Seleccionar Destinatarios *</Label>
                <div className="flex items-center space-x-2 text-sm bg-teal-50 px-3 py-1 rounded-full">
                  <Users className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-teal-600">{totalSelected} seleccionados</span>
                </div>
              </div>

              <Tabs defaultValue="contacts" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="contacts">
                    Contactos ({selectedContacts.size})
                  </TabsTrigger>
                  <TabsTrigger value="affiliates">
                    Afiliados ({selectedAffiliates.size})
                  </TabsTrigger>
                  <TabsTrigger value="sponsors">
                    Patrocinadores ({selectedSponsors.size})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="contacts" className="mt-3">
                  <div className="flex justify-end space-x-2 mb-3">
                    <Button type="button" variant="outline" size="sm" onClick={selectAllContacts}>
                      Seleccionar Todos
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={deselectAllContacts}>
                      Deseleccionar Todos
                    </Button>
                  </div>
                  <ScrollArea className="h-[380px] border rounded-lg bg-gray-50">
                    <div className="p-4">
                      {contacts.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay contactos disponibles</p>
                      ) : (
                        <div className="space-y-2 pb-2">
                          {contacts.map(contact => (
                            <div key={contact.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded bg-gray-50">
                              <Checkbox
                                checked={selectedContacts.has(contact.id)}
                                onCheckedChange={() => toggleContact(contact.id)}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{contact.name}</p>
                                <p className="text-xs text-gray-500">{contact.email}</p>
                              </div>
                              {selectedContacts.has(contact.id) && (
                                <Check className="h-4 w-4 text-teal-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
              </TabsContent>

                <TabsContent value="affiliates" className="mt-3">
                  <div className="flex justify-end space-x-2 mb-3">
                    <Button type="button" variant="outline" size="sm" onClick={selectAllAffiliates}>
                      Seleccionar Todos
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={deselectAllAffiliates}>
                      Deseleccionar Todos
                    </Button>
                  </div>
                  <ScrollArea className="h-[380px] border rounded-lg bg-gray-50">
                    <div className="p-4">
                      {affiliates.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay afiliados disponibles</p>
                      ) : (
                        <div className="space-y-2 pb-2">
                          {affiliates.map(affiliate => (
                            <div key={affiliate.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded bg-gray-50">
                              <Checkbox
                                checked={selectedAffiliates.has(affiliate.id)}
                                onCheckedChange={() => toggleAffiliate(affiliate.id)}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{affiliate.name}</p>
                                <p className="text-xs text-gray-500">{affiliate.email}</p>
                              </div>
                              {selectedAffiliates.has(affiliate.id) && (
                                <Check className="h-4 w-4 text-teal-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
              </TabsContent>

                <TabsContent value="sponsors" className="mt-3">
                  <div className="flex justify-end space-x-2 mb-3">
                    <Button type="button" variant="outline" size="sm" onClick={selectAllSponsors}>
                      Seleccionar Todos
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={deselectAllSponsors}>
                      Deseleccionar Todos
                    </Button>
                  </div>
                  <ScrollArea className="h-[380px] border rounded-lg bg-gray-50">
                    <div className="p-4">
                      {sponsors.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay patrocinadores disponibles</p>
                      ) : (
                        <div className="space-y-2 pb-2">
                          {sponsors.map(sponsor => (
                            <div key={sponsor.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded bg-gray-50">
                              <Checkbox
                                checked={selectedSponsors.has(sponsor.id)}
                                onCheckedChange={() => toggleSponsor(sponsor.id)}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{sponsor.name}</p>
                                <p className="text-xs text-gray-500">{sponsor.email}</p>
                              </div>
                              {selectedSponsors.has(sponsor.id) && (
                                <Check className="h-4 w-4 text-teal-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Campaña'}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
