import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { X, Trash2, FileText, File, Image as ImageIcon, FileVideo } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import DraggableItem from './DraggableItem';
import type { DeskFileData } from './DeskScene';

interface DeskFileProps {
  file: DeskFileData;
  onUpdate: (id: string, updates: Partial<DeskFileData>) => void;
  onDelete: (id: string) => void;
  onDrop?: (file: DeskFileData, target: string) => void;
  bounds?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  };
}

export default function DeskFile({ file, onUpdate, onDelete, onDrop, bounds }: DeskFileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(file.name);
  const [isDragging, setIsDragging] = useState(false);

  const handlePositionChange = (x: number, y: number) => {
    onUpdate(file.id, { x, y });
  };

  const getFileIcon = () => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText size={24} color="#D2691E" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon size={24} color="#32CD32" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FileVideo size={24} color="#FF6347" />;
      default:
        return <File size={24} color="#696969" />;
    }
  };

  const handleSave = () => {
    onUpdate(file.id, { name: editName });
    setIsEditing(false);
  };

  const handlePress = () => {
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

  return (
    <>
      <DraggableItem
        x={file.x}
        y={file.y}
        zIndex={file.zIndex}
        onPositionChange={handlePositionChange}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        bounds={bounds}
        onDrop={(target) => onDrop?.(file, target)}
      >
        <GestureDetector gesture={tapGesture}>
          <View style={styles.file}>
            <View style={styles.fileIcon}>
              {getFileIcon()}
            </View>
            <Text style={styles.fileName} numberOfLines={2}>
              {file.name}
            </Text>
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
              <Text style={styles.modalTitle}>Edit File</Text>
              <TouchableOpacity onPress={() => onDelete(file.id)}>
                <Trash2 size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>

            <View style={styles.filePreview}>
              {getFileIcon()}
              <View style={styles.fileDetails}>
                <Text style={styles.fileType}>{file.type}</Text>
                <Text style={styles.fileSize}>{file.size}</Text>
                <Text style={styles.fileDate}>{file.date}</Text>
              </View>
            </View>

            <TextInput
              style={styles.textInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="File name..."
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
  file: {
    width: 70,
    height: 85,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fileIcon: {
    marginBottom: 4,
  },
  fileName: {
    fontSize: 8,
    color: '#333',
    textAlign: 'center',
    lineHeight: 10,
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
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  fileDetails: {
    marginLeft: 15,
    flex: 1,
  },
  fileType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  fileDate: {
    fontSize: 12,
    color: '#999',
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