import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Notepad from './Notepad';
import StickyNote from './StickyNote';
import FileTray from './FileTray';
import FileCabinet from './FileCabinet';
import Pen from './Pen';
import DeskFile from './DeskFile';
import DeskFolder from './DeskFolder';
import TornPage from './TornPage';
import Whiteboard from './Whiteboard';
import { useDeskActions, useDeskState } from './DeskActionsContext';

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
  folders?: DeskFolderData[];
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
  folders?: DeskFolderData[];
}

export default function DeskScene() {
  const { addSticky } = useDeskActions();
  const {
    stickyNotes,
    deskFiles,
    deskFolders,
    tornPages,
    notepad,
    fileTray,
    setShowFileTray,
    setShowFileCabinet,
    setShowAddModal,
    updateStickyNote,
    deleteStickyNote,
    updateDeskFile,
    deleteDeskFile,
    updateDeskFolder,
    deleteDeskFolder,
    updateNotepad,
    updateFileTray,
    updateTornPage,
    deleteTornPage,
    addTornPage,
    handleFolderPress,
    handleFileDrop,
  } = useDeskState();

  // Desk surface dimensions (adjust as needed)
  const deskWidth = screenWidth - 40; // 20px margin on each side
  const deskHeight = 260; // Example height for a wide/horizontal desk
  const deskX = 20; // left margin
  const deskY = Math.floor(screenHeight * 0.45); // Move desk lower on the page

  // Bounds for desk items (files, folders, etc.)
  const deskBounds = {
    minX: deskX,
    maxX: deskX + deskWidth - 80, // 80: max item width
    minY: deskY,
    maxY: deskY + deskHeight - 80, // 80: max item height
  };

  return (
    <View style={styles.container}>
      {/* Whiteboard above the desk */}
      <View
        style={{
          width: deskWidth,
          height: 100, // Optionally reduce height
          marginHorizontal: 20,
          marginTop: deskY - 120, // Position whiteboard above desk
        }}
      >
        <Whiteboard />
      </View>
      <View
        style={[
          styles.deskSurface,
          {
            width: deskWidth,
            height: deskHeight,
            marginHorizontal: 20,
            marginTop: 0,
            top: deskY, // Move desk down
            overflow: 'hidden',
          },
        ]}
      >
        {/* File Cabinet - Fixed position */}
        <View style={styles.cabinetContainer}>
          <FileCabinet onPress={() => setShowFileCabinet(true)} />
        </View>

        {/* Pen - Fixed position */}
        <View style={styles.penContainer}>
          <Pen onPress={addSticky} />
        </View>

        {/* Draggable Items */}
        {stickyNotes.map(note => (
          <StickyNote
            key={`sticky-${note.id}`}
            note={note}
            onUpdate={updateStickyNote}
            onDelete={deleteStickyNote}
            bounds={{ minX: 0, minY: 0, maxX: deskWidth - 80, maxY: deskHeight - 80 }}
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
            bounds={{ minX: 0, minY: 0, maxX: deskWidth - 100, maxY: deskHeight - 120 }}
          />
        ))}

        <Notepad
          notepad={notepad}
          onUpdate={updateNotepad}
          onTearPage={addTornPage}
          bounds={{ minX: 0, minY: 0, maxX: deskWidth - 140, maxY: deskHeight - 180 }}
        />

        <FileTray
          fileTray={fileTray}
          onUpdate={updateFileTray}
          onPress={() => setShowFileTray(true)}
          isDropTarget={false}
          onDrop={handleFileDrop}
        />

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <MaterialIcons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    overflow: 'hidden', // Ensure overflow is hidden
  },
  cabinetContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    zIndex: 300,
  },
  penContainer: {
    position: 'absolute',
    top: 180,
    left: 180,
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