import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Notepad from './Notepad';
import StickyNote from './StickyNote';
import FileTray from './FileTray';
import FileCabinet from './FileCabinet';
import FileModal from './FileModal';
import Pen from './Pen';
import DeskFile from './DeskFile';
import DeskFolder from './DeskFolder';
import AddItemModal from './AddItemModal';
import TornPage from './TornPage';
import { DeskActionsContext } from './DeskActionsContext';
import Whiteboard from './Whiteboard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface StickyNoteData {
  id: string;
  text: string;
  color: 'urgent' | 'normal' | 'low';
  x: number;
  y: number;
  zIndex: number;
}

export interface FileData {
  name: string;
  type: string;
  size: string;
  date: string;
}

export interface DeskFileData extends FileData {
  id: string;
  x: number;
  y: number;
  zIndex: number;
}

export interface DeskFolderData {
  id: string;
  name: string;
  x: number;
  y: number;
  zIndex: number;
  files: FileData[];
}

export interface TornPageData {
  id: string;
  text: string;
  x: number;
  y: number;
  zIndex: number;
}

export interface NotepadData {
  id: string;
  x: number;
  y: number;
  zIndex: number;
  notes: string;
}

export interface FileTrayData {
  id: string;
  x: number;
  y: number;
  zIndex: number;
  files: FileData[];
}

export default function DeskScene() {
  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>([
    { id: '1', text: 'Call client at 3pm', color: 'urgent', x: 50, y: 50, zIndex: 1 },
    { id: '2', text: 'Review proposal', color: 'normal', x: 200, y: 80, zIndex: 2 },
    { id: '3', text: 'Order supplies', color: 'low', x: 350, y: 60, zIndex: 3 },
  ]);

  const [deskFiles, setDeskFiles] = useState<DeskFileData[]>([
    { id: '1', name: 'Contract.pdf', type: 'PDF Document', size: '245 KB', date: 'Today', x: 150, y: 120, zIndex: 4 },
    { id: '2', name: 'Report.docx', type: 'Word Document', size: '89 KB', date: 'Yesterday', x: 300, y: 140, zIndex: 5 },
  ]);

  const [deskFolders, setDeskFolders] = useState<DeskFolderData[]>([
    {
      id: '1',
      name: 'Project Alpha',
      x: 450,
      y: 100,
      zIndex: 6,
      files: [
        { name: 'Proposal.pdf', type: 'PDF Document', size: '1.2 MB', date: 'Today' },
        { name: 'Budget.xlsx', type: 'Excel File', size: '234 KB', date: 'Yesterday' },
      ]
    }
  ]);

  const [tornPages, setTornPages] = useState<TornPageData[]>([]);

  const [notepad, setNotepad] = useState<NotepadData>({
    id: 'notepad-1',
    x: 600,
    y: 40,
    zIndex: 100,
    notes: 'Welcome to your desk!\n\nTap items to interact:\n• Yellow notepad for daily notes\n• Sticky notes for quick reminders\n• Manila folder for quick access files\n• File cabinet for long-term storage\n• Pen to add new sticky notes'
  });

  const [fileTray, setFileTray] = useState<FileTrayData>({
    id: 'filetray-1',
    x: 800,
    y: 80,
    zIndex: 100,
    files: [
      { name: 'Invoice.pdf', type: 'PDF Document', size: '245 KB', date: 'Today' },
      { name: 'PitchDeck.pptx', type: 'PowerPoint', size: '1.2 MB', date: 'Yesterday' },
    ]
  });

  const [longTermFiles, setLongTermFiles] = useState<FileData[]>([
    { name: 'Annual_Report_2023.pdf', type: 'PDF Document', size: '5.4 MB', date: 'Last week' },
    { name: 'Budget_Spreadsheet.xlsx', type: 'Excel File', size: '234 KB', date: 'Last month' },
    { name: 'Team_Photos.zip', type: 'Archive', size: '15.2 MB', date: '2 months ago' },
    { name: 'Project_Archive.zip', type: 'Archive', size: '125 MB', date: '3 months ago' },
    { name: 'Backup_Database.sql', type: 'Database', size: '45 MB', date: '6 months ago' },
  ]);

  const [showFileTray, setShowFileTray] = useState(false);
  const [showFileCabinet, setShowFileCabinet] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<DeskFolderData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(200);

  // Desk dimensions - horizontal layout taking bottom half of screen
  const whiteboardHeight = screenHeight * 0.45; // 45% for whiteboard
  const deskHeight = screenHeight * 0.45; // 45% for desk (10% for tabs)
  const deskWidth = Platform.OS === 'web' ? screenWidth * 1.5 : screenWidth * 2; // Wider desk for scrolling

  // Bounds for desk items
  const deskBounds = {
    minX: 20,
    maxX: deskWidth - 100,
    minY: 20,
    maxY: deskHeight - 100,
  };

  const getNextZIndex = useCallback(() => {
    setMaxZIndex(prev => prev + 1);
    return maxZIndex + 1;
  }, [maxZIndex]);

  const updateStickyNote = useCallback((id: string, updates: Partial<StickyNoteData>) => {
    setStickyNotes(prev => prev.map(note =>
      note.id === id ? { ...note, ...updates, zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : note.zIndex } : note
    ));
  }, [getNextZIndex]);

  const deleteStickyNote = useCallback((id: string) => {
    setStickyNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const addStickyNote = useCallback(() => {
    const newNote: StickyNoteData = {
      id: Date.now().toString(),
      text: 'New note',
      color: 'normal',
      x: Math.random() * (deskWidth - 100) + 20,
      y: Math.random() * (deskHeight - 100) + 20,
      zIndex: getNextZIndex(),
    };
    setStickyNotes(prev => [...prev, newNote]);
  }, [deskWidth, deskHeight, getNextZIndex]);

  const updateDeskFile = useCallback((id: string, updates: Partial<DeskFileData>) => {
    setDeskFiles(prev => prev.map(file =>
      file.id === id ? { ...file, ...updates, zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : file.zIndex } : file
    ));
  }, [getNextZIndex]);

  const deleteDeskFile = useCallback((id: string) => {
    setDeskFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const updateDeskFolder = useCallback((id: string, updates: Partial<DeskFolderData>) => {
    setDeskFolders(prev => prev.map(folder =>
      folder.id === id ? { ...folder, ...updates, zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : folder.zIndex } : folder
    ));
  }, [getNextZIndex]);

  const deleteDeskFolder = useCallback((id: string) => {
    setDeskFolders(prev => prev.filter(folder => folder.id !== id));
  }, []);

  const updateNotepad = useCallback((updates: Partial<NotepadData>) => {
    setNotepad(prev => ({
      ...prev,
      ...updates,
      zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : prev.zIndex
    }));
  }, [getNextZIndex]);

  const updateFileTray = useCallback((updates: Partial<FileTrayData>) => {
    setFileTray(prev => ({
      ...prev,
      ...updates,
      zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : prev.zIndex
    }));
  }, [getNextZIndex]);

  const addTornPage = useCallback((text: string) => {
    const newPage: TornPageData = {
      id: Date.now().toString(),
      text,
      x: notepad.x + 150,
      y: notepad.y + 50,
      zIndex: getNextZIndex(),
    };
    setTornPages(prev => [...prev, newPage]);
  }, [notepad.x, notepad.y, getNextZIndex]);

  const updateTornPage = useCallback((id: string, updates: Partial<TornPageData>) => {
    setTornPages(prev => prev.map(page =>
      page.id === id ? { ...page, ...updates, zIndex: updates.x !== undefined || updates.y !== undefined ? getNextZIndex() : page.zIndex } : page
    ));
  }, [getNextZIndex]);

  const deleteTornPage = useCallback((id: string) => {
    setTornPages(prev => prev.filter(page => page.id !== id));
  }, []);

  const addNewFile = useCallback((name: string, type: string) => {
    const safeName = typeof name === 'string' ? name : '';
    const newFile: DeskFileData = {
      id: Date.now().toString(),
      name: safeName,
      type: typeof type === 'string' ? type : 'Document',
      size: '0 KB',
      date: 'Just now',
      x: Math.random() * (deskWidth - 120) + 60,
      y: Math.random() * (deskHeight - 100) + 20,
      zIndex: getNextZIndex(),
    };
    setDeskFiles(prev => [...prev, newFile]);
  }, [deskWidth, deskHeight, getNextZIndex]);

  const addNewFolder = useCallback((name: string) => {
    const newFolder: DeskFolderData = {
      id: Date.now().toString(),
      name,
      x: Math.random() * (deskWidth - 120) + 60,
      y: Math.random() * (deskHeight - 100) + 20,
      zIndex: getNextZIndex(),
      files: [],
    };
    setDeskFolders(prev => [...prev, newFolder]);
  }, [deskWidth, deskHeight, getNextZIndex]);

  // Register add functions with context - only run once
  const deskActions = useContext(DeskActionsContext);
  useEffect(() => {
    if (deskActions?.setAddFile && deskActions?.setAddFolder && deskActions?.setAddSticky) {
      deskActions.setAddFile(addNewFile);
      deskActions.setAddFolder(addNewFolder);
      deskActions.setAddSticky(addStickyNote);
    }
  }, []); // Empty dependency array - only run once

  const handleFolderPress = useCallback((folder: DeskFolderData) => {
    setSelectedFolder(folder);
  }, []);

  const handleFileDrop = useCallback((file: DeskFileData, target: string) => {
    if (target === 'filetray') {
      const fileData: FileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        date: file.date,
      };

      setFileTray(prev => ({
        ...prev,
        files: [...prev.files, fileData],
      }));

      deleteDeskFile(file.id);
    }
  }, [deleteDeskFile]);

  const handleFileImported = useCallback((file: FileData) => {
    setFileTray(prev => ({
      ...prev,
      files: [file, ...prev.files],
    }));
  }, []);

  const handleLongTermFileImported = useCallback((file: FileData) => {
    setLongTermFiles(prev => [file, ...prev]);
  }, []);

  return (
    <View style={styles.container}>
      {/* Whiteboard - Top half */}
      <View style={[styles.whiteboardContainer, { height: whiteboardHeight }]}>
        <Whiteboard />
      </View>

      {/* Desk - Bottom half */}
      <View style={[styles.deskContainer, { height: deskHeight }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={Platform.OS !== 'web'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ width: deskWidth }}
          style={styles.deskScrollView}
        >
          <View style={[styles.deskSurface, { width: deskWidth, height: deskHeight - 20 }]}>
            {/* File Cabinet - Fixed position on left */}
            <View style={styles.cabinetContainer}>
              <FileCabinet onPress={() => setShowFileCabinet(true)} />
            </View>

            {/* Pen - Fixed position */}
            <View style={styles.penContainer}>
              <Pen onPress={addStickyNote} />
            </View>

            {/* Draggable Items */}
            {stickyNotes.map(note => (
              <StickyNote
                key={`sticky-${note.id}`}
                note={note}
                onUpdate={updateStickyNote}
                onDelete={deleteStickyNote}
                bounds={deskBounds}
              />
            ))}

            {deskFiles.map(file => (
              <DeskFile
                key={`file-${file.id}`}
                file={file}
                onUpdate={updateDeskFile}
                onDelete={deleteDeskFile}
                bounds={deskBounds}
              />
            ))}

            {deskFolders.map(folder => (
              <DeskFolder
                key={`folder-${folder.id}`}
                folder={folder}
                onUpdate={updateDeskFolder}
                onDelete={deleteDeskFolder}
                onPress={handleFolderPress}
                bounds={deskBounds}
              />
            ))}

            {tornPages.map(page => (
              <TornPage
                key={`page-${page.id}`}
                page={page}
                onUpdate={updateTornPage}
                onDelete={deleteTornPage}
                bounds={deskBounds}
              />
            ))}

            <Notepad
              notepad={notepad}
              onUpdate={updateNotepad}
              onTearPage={addTornPage}
              bounds={deskBounds}
            />

            <FileTray
              fileTray={fileTray}
              onUpdate={updateFileTray}
              onPress={() => setShowFileTray(true)}
              isDropTarget={isDragging}
              onDrop={handleFileDrop}
              bounds={deskBounds}
            />

            {/* Add Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <MaterialIcons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Modals */}
      <FileModal
        visible={showFileTray}
        title="File Tray - Quick Access"
        files={fileTray.files}
        onClose={() => setShowFileTray(false)}
        onFileImported={handleFileImported}
        allowImport={true}
      />

      <FileModal
        visible={showFileCabinet}
        title="File Cabinet - Long-Term Storage"
        files={longTermFiles}
        onClose={() => setShowFileCabinet(false)}
        onFileImported={handleLongTermFileImported}
        allowImport={true}
      />

      {selectedFolder && (
        <FileModal
          visible={!!selectedFolder}
          title={selectedFolder.name}
          files={selectedFolder.files}
          onClose={() => setSelectedFolder(null)}
        />
      )}

      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddFile={addNewFile}
        onAddFolder={addNewFolder}
        onAddStickyNote={addStickyNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  whiteboardContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  deskContainer: {
    flex: 1,
  },
  deskScrollView: {
    flex: 1,
  },
  deskSurface: {
    backgroundColor: '#D2B48C',
    borderRadius: 20,
    margin: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    minHeight: 200,
  },
  cabinetContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 300,
  },
  penContainer: {
    position: 'absolute',
    top: 60,
    left: 200,
    zIndex: 300,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
});