import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { X, Trash2, FolderOpen, Folder } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import DraggableItem from './DraggableItem';
import type { DeskFolderData } from './DeskScene';

interface DeskFolderProps {
  folder: DeskFolderData;
  onUpdate: (id: string, updates: Partial<DeskFolderData>) => void;
  onDelete: (id: string) => void;
  onPress: (folder: DeskFolderData) => void;
  onDrop?: (folder: DeskFolderData, target: string) => void;
  bounds?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  };
}

export default function DeskFolder({ folder, onUpdate, onDelete, onPress, onDrop, bounds }: DeskFolderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const [isDragging, setIsDragging] = useState(false);

  const handlePositionChange = (x: number, y: number) => {
    onUpdate(folder.id, { x, y });
  };

  const handleSave = () => {
    onUpdate(folder.id, { name: editName });
    setIsEditing(false);
  };

  const handlePress = () => {
    if (!isDragging) {
      onPress(folder);
    }
  };

  const handleLongPress = () => {
    if (!isDragging) {
      setIsEditing(true);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  };

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (!isDragging) {
        handlePress();
      }
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      if (!isDragging) {
        handleLongPress();
      }
    });

  const combinedGesture = Gesture.Race(longPressGesture, tapGesture);

  return (
    <>
      <DraggableItem
        x={folder.x}
        y={folder.y}
        zIndex={folder.zIndex}
        onPositionChange={handlePositionChange}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        bounds={bounds}
        onDrop={(target) => onDrop?.(folder, target)}
      >
        <GestureDetector gesture={combinedGesture}>
          <View style={styles.folder}>
            <View style={styles.folderTab}>
              <Text style={styles.tabText} numberOfLines={1}>
                {folder.name}
              </Text>
            </View>
            <View style={styles.folderBody}>
              <FolderOpen size={32} color="#8B4513" />
              <Text style={styles.fileCount}>
                {folder.files.length} files
              </Text>
            </View>
          </View>
        </GestureDetector>
      </DraggableItem>

      <Modal
        visible={isEditing}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Folder</Text>
              <TouchableOpacity onPress={() => onDelete(folder.id)}>
                <Trash2 size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>

            <View style={styles.folderPreview}>
              <Folder size={48} color="#8B4513" />
              <View style={styles.folderDetails}>
                <Text style={styles.folderInfo}>
                  {folder.files.length} files
                </Text>
                <Text style={styles.folderDate}>
                  Created today
                </Text>
              </View>
            </View>

            <TextInput
              style={styles.textInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Folder name..."
              placeholderTextColor="#666"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  folder: {
    width: 90,
    height: 70,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  folderTab: {
    width: 60,
    height: 16,
    backgroundColor: '#DEB887',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#CD853F',
    paddingHorizontal: 4,
  },
  tabText: {
    fontSize: 7,
    color: '#8B4513',
    fontWeight: '600',
  },
  folderBody: {
    flex: 1,
    backgroundColor: '#F5DEB3',
    borderRadius: 6,
    borderTopLeftRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CD853F',
    paddingVertical: 4,
  },
  fileCount: {
    fontSize: 7,
    color: '#8B4513',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  folderPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  folderDetails: {
    marginLeft: 15,
    flex: 1,
  },
  folderInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  folderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});