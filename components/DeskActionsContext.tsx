import React, { createContext, useContext } from 'react';
import type { 
  StickyNoteData, 
  DeskFileData, 
  DeskFolderData, 
  TornPageData, 
  NotepadData, 
  FileTrayData,
  FileData
} from './DeskScene';

export interface DeskActionsContextType {
  addFile: (name: string, type: string) => void;
  addFolder: (name: string) => void;
  addSticky: () => void;
}

export interface DeletedItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'stickyNote';
  originalData: any;
  deletedAt: string;
}

export interface DeskStateContextType {
  // State
  stickyNotes: StickyNoteData[];
  deskFiles: DeskFileData[];
  deskFolders: DeskFolderData[];
  tornPages: TornPageData[];
  notepad: NotepadData;
  fileTray: FileTrayData;
  longTermFiles: FileData[];
  deletedItems: DeletedItem[];
  
  // Modal states
  showFileTray: boolean;
  showFileCabinet: boolean;
  showAddModal: boolean;
  showFolderSelection: boolean;
  showRecycleBin: boolean;
  selectedFolder: DeskFolderData | null;
  draggedItem: { type: string; data: any } | null;
  
  // State setters
  setShowFileTray: (show: boolean) => void;
  setShowFileCabinet: (show: boolean) => void;
  setShowAddModal: (show: boolean) => void;
  setShowFolderSelection: (show: boolean) => void;
  setShowRecycleBin: (show: boolean) => void;
  setSelectedFolder: (folder: DeskFolderData | null) => void;
  setDraggedItem: (item: { type: string; data: any } | null) => void;
  
  // Update functions
  updateStickyNote: (id: string, updates: Partial<StickyNoteData>) => void;
  deleteStickyNote: (id: string) => void;
  updateDeskFile: (id: string, updates: Partial<DeskFileData>) => void;
  deleteDeskFile: (id: string) => void;
  updateDeskFolder: (id: string, updates: Partial<DeskFolderData>) => void;
  deleteDeskFolder: (id: string) => void;
  updateNotepad: (updates: Partial<NotepadData>) => void;
  updateFileTray: (updates: Partial<FileTrayData>) => void;
  updateTornPage: (id: string, updates: Partial<TornPageData>) => void;
  deleteTornPage: (id: string) => void;
  addTornPage: (text: string) => void;
  
  // Handler functions
  handleFolderPress: (folder: DeskFolderData) => void;
  handleFileDrop: (file: DeskFileData, target: string) => void;
  handleFolderDrop: (folder: DeskFolderData, target: string) => void;
  handleStickyNoteDrop: (note: StickyNoteData, target: string) => void;
  handleTornPageDrop: (page: TornPageData, target: string) => void;
  handleFolderSelection: (folderId: string) => void;
  handleCreateFolderInTray: (name: string) => void;
  handleFileImported: (file: FileData) => void;
  handleLongTermFileImported: (file: FileData) => void;
  handleRestoreItem: (item: DeletedItem) => void;
  handlePermanentDelete: (itemId: string) => void;
  handleEmptyBin: () => void;
}

export const DeskActionsContext = createContext<DeskActionsContextType | undefined>(undefined);
export const DeskStateContext = createContext<DeskStateContextType | undefined>(undefined);

export function useDeskActions() {
  const context = useContext(DeskActionsContext);
  if (!context) {
    throw new Error('useDeskActions must be used within DeskActionsContext.Provider');
  }
  return context;
}

export function useDeskState() {
  const context = useContext(DeskStateContext);
  if (!context) {
    throw new Error('useDeskState must be used within DeskStateContext.Provider');
  }
  return context;
}