/**
 * Emergency Contacts Storage Service
 * Manages emergency contact information
 */

import { storage } from './storageService';
import type { EmergencyContact } from './storageTypes';
import { STORAGE_KEYS } from './storageTypes';

class ContactsStorageService {
  private key = STORAGE_KEYS.EMERGENCY_CONTACTS;

  /**
   * Get all emergency contacts
   */
  async getAllContacts(): Promise<EmergencyContact[]> {
    const contacts = await storage.load<EmergencyContact[]>(this.key);
    return contacts || [];
  }

  /**
   * Get a specific contact by ID
   */
  async getContact(id: string): Promise<EmergencyContact | null> {
    const contacts = await this.getAllContacts();
    return contacts.find(contact => contact.id === id) || null;
  }

  /**
   * Get primary contact
   */
  async getPrimaryContact(): Promise<EmergencyContact | null> {
    const contacts = await this.getAllContacts();
    return contacts.find(contact => contact.isPrimary) || null;
  }

  /**
   * Get contacts sorted (primary first, then by name)
   */
  async getContactsSorted(): Promise<EmergencyContact[]> {
    const contacts = await this.getAllContacts();
    return contacts.sort((a, b) => {
      // Primary contacts first
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      // Then alphabetically by name
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Add a new emergency contact
   */
  async addContact(contact: Omit<EmergencyContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmergencyContact> {
    // If this is being set as primary, unset other primaries
    if (contact.isPrimary) {
      await this.clearPrimaryFlags();
    }

    const newContact: EmergencyContact = {
      ...contact,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };

    const contacts = await this.getAllContacts();
    contacts.push(newContact);
    await storage.save(this.key, contacts);
    
    return newContact;
  }

  /**
   * Update an existing contact
   */
  async updateContact(id: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact | null> {
    // If this is being set as primary, unset other primaries
    if (updates.isPrimary) {
      await this.clearPrimaryFlags(id);
    }

    const contacts = await this.getAllContacts();
    const index = contacts.findIndex(contact => contact.id === id);
    
    if (index === -1) {
      return null;
    }

    contacts[index] = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await storage.save(this.key, contacts);
    return contacts[index];
  }

  /**
   * Delete a contact
   */
  async deleteContact(id: string): Promise<boolean> {
    const contacts = await this.getAllContacts();
    const filtered = contacts.filter(contact => contact.id !== id);
    
    if (filtered.length === contacts.length) {
      return false;
    }

    await storage.save(this.key, filtered);
    return true;
  }

  /**
   * Get contacts by relationship type
   */
  async getContactsByRelationship(relationship: string): Promise<EmergencyContact[]> {
    const contacts = await this.getAllContacts();
    return contacts.filter(contact => contact.relationship === relationship);
  }

  /**
   * Search contacts by name or phone
   */
  async searchContacts(searchTerm: string): Promise<EmergencyContact[]> {
    const contacts = await this.getAllContacts();
    const term = searchTerm.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(term) ||
      contact.phone.includes(searchTerm) ||
      contact.relationship?.toLowerCase().includes(term)
    );
  }

  /**
   * Set a contact as primary
   */
  async setPrimaryContact(id: string): Promise<boolean> {
    const contacts = await this.getAllContacts();
    const index = contacts.findIndex(contact => contact.id === id);
    
    if (index === -1) {
      return false;
    }

    // Unset all other primary contacts
    contacts.forEach((contact, idx) => {
      contact.isPrimary = idx === index;
      if (idx === index) {
        contact.updatedAt = new Date().toISOString();
      }
    });

    await storage.save(this.key, contacts);
    return true;
  }

  /**
   * Clear primary flags from all contacts except specified ID
   */
  private async clearPrimaryFlags(exceptId?: string): Promise<void> {
    const contacts = await this.getAllContacts();
    contacts.forEach(contact => {
      if (contact.id !== exceptId && contact.isPrimary) {
        contact.isPrimary = false;
        contact.updatedAt = new Date().toISOString();
      }
    });
    await storage.save(this.key, contacts);
  }

  /**
   * Get contact count
   */
  async getContactCount(): Promise<number> {
    const contacts = await this.getAllContacts();
    return contacts.length;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const contactsStorage = new ContactsStorageService();

