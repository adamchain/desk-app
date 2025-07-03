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

  // Calculate dimensions based on platform
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb;
  
  // For mobile: make content wider to enable horizontal scrolling
  // For web: use full screen width
  const contentWidth = isMobile ? screenWidth * 1.8 : screenWidth - 40;
  const whiteboardWidth = isMobile ? contentWidth * 0.5 : contentWidth;
  const deskWidth = isMobile ? contentWidth * 0.5 : contentWidth;
  
  // Heights
  const whiteboardHeight = isMobile ? screenHeight * 0.4 : 180;
  const deskHeight = isMobile ? screenHeight * 0.4 : 260;
  
  // Positioning
  const whiteboardX = 20;
  const deskX = isMobile ? whiteboardWidth + 40 : 20;
  const topMargin = isMobile ? 60 : Math.floor(screenHeight * 0.1);

  // Bounds for desk items
  const deskBounds = {
    minX: 0,
    maxX: deskWidth - 80,
    minY: 0,
    maxY: deskHeight - 80,
  };

  const whiteboardBounds = {
    minX: 0,
    maxX: whiteboardWidth - 80,
    minY: 0,
    maxY: whiteboardHeight - 80,
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={isMobile}
        showsHorizontalScrollIndicator={isMobile}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            width: isMobile ? contentWidth + 40 : '100%',
            minHeight: screenHeight,
          }
        ]}
        bounces={false}
      >
        {/* Whiteboard Section */}
        <View
          style={[
            styles.whiteboardContainer,
            {
              position: 'absolute',
              left: whiteboardX,
              top: topMargin,
              width: whiteboardWidth,
              height: whiteboardHeight,
            }
          ]}
        >
          <Whiteboard />
        </View>

        {/* Desk Section */}
        <View
          style={[
            styles.deskSurface,
            {
              position: 'absolute',
              left: deskX,
              top: topMargin + (isMobile ? 0 : whiteboardHeight + 20),
              width: deskWidth,
              height: deskHeight,
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

        {/* Mobile scroll indicator */}
        {isMobile && (
          <View style={styles.scrollIndicator}>
            <Text style={styles.scrollIndicatorText}>← Swipe to explore →</Text>
          </View>
        )}
      </ScrollView>
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
    position: 'relative',
  },
  whiteboardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  deskSurface: {
    backgroundColor: '#D2B48C',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  cabinetContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    zIndex: 300,
  },
  penContainer: {
    position: 'absolute',
    top: 60,
    left: 60,
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
  scrollIndicator: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  scrollIndicatorText: {
    fontSize: 12,
    color: '#8B4513',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '600',
  },
});