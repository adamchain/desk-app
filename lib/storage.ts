import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { 
  StickyNoteData, 
  DeskFileData, 
  DeskFolderData, 
  TornPageData, 
  NotepadData, 
  FileTrayData 
} from '@/components/DeskScene';

// For web, we'll use localStorage as a fallback
const storage = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

export interface DeskLayout {
  userId: string;
  stickyNotes: StickyNoteData[];
  deskFiles: DeskFileData[];
  deskFolders: DeskFolderData[];
  tornPages: TornPageData[];
  notepad: NotepadData;
  fileTray: FileTrayData;
  longTermFiles: any[];
  deletedItems: any[];
  lastSaved: string;
}

class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async saveDeskLayout(userId: string, layout: Omit<DeskLayout, 'userId' | 'lastSaved'>): Promise<boolean> {
    try {
      const deskLayout: DeskLayout = {
        ...layout,
        userId,
        lastSaved: new Date().toISOString(),
      };

      await storage.setItem(`desk_layout_${userId}`, JSON.stringify(deskLayout));
      return true;
    } catch (error) {
      console.error('Error saving desk layout:', error);
      return false;
    }
  }

  async loadDeskLayout(userId: string): Promise<DeskLayout | null> {
    try {
      const layoutData = await storage.getItem(`desk_layout_${userId}`);
      if (!layoutData) return null;

      return JSON.parse(layoutData);
    } catch (error) {
      console.error('Error loading desk layout:', error);
      return null;
    }
  }

  async deleteDeskLayout(userId: string): Promise<boolean> {
    try {
      await storage.removeItem(`desk_layout_${userId}`);
      return true;
    } catch (error) {
      console.error('Error deleting desk layout:', error);
      return false;
    }
  }

  async getAllUserLayouts(): Promise<DeskLayout[]> {
    try {
      // This is a simplified implementation for demo
      // In production, you'd want a more efficient way to query user layouts
      const layouts: DeskLayout[] = [];
      
      // For now, we'll just return empty array since we can't easily iterate
      // over all keys in SecureStore. In production, you'd use a proper database.
      return layouts;
    } catch (error) {
      console.error('Error getting all user layouts:', error);
      return [];
    }
  }
}

export const storageService = StorageService.getInstance();