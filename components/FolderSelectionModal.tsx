import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { X, Folder, Plus, FolderOpen } from 'lucide-react-native';
import type { DeskFolderData } from './DeskScene';

interface FolderSelectionModalProps {
  visible: boolean;
  folders: DeskFolderData[];
  onClose: () => void;
  onSelectFolder: (folderId: string) => void;
  onCreateFolder: (name: string) => void;
  draggedItemName: string;
}

export default function FolderSelectionModal({ 
  visible, 
  folders, 
  onClose, 
  onSelectFolder, 
  onCreateFolder,
  draggedItemName 
}: FolderSelectionModalProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowCreateForm(false);
    }
  };

  const handleClose = () => {
    setShowCreateForm(false);
    setNewFolderName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Folder</Text>
            <TouchableOpacity onPress={() => setShowCreateForm(!showCreateForm)}>
              <Plus size={24} color="#8B4513" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Where would you like to put "{draggedItemName}"?
          </Text>

          {showCreateForm && (
            <View style={styles.createForm}>
              <TextInput
                style={styles.textInput}
                value={newFolderName}
                onChangeText={setNewFolderName}
                placeholder="Enter folder name..."
                placeholderTextColor="#666"
                autoFocus
              />
              <View style={styles.formButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowCreateForm(false);
                    setNewFolderName('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.createButton, !newFolderName.trim() && styles.disabledButton]}
                  onPress={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <ScrollView style={styles.folderList} showsVerticalScrollIndicator={false}>
            {folders.map((folder) => (
              <TouchableOpacity
                key={folder.id}
                style={styles.folderItem}
                onPress={() => onSelectFolder(folder.id)}
              >
                <View style={styles.folderIcon}>
                  <FolderOpen size={32} color="#8B4513" />
                </View>
                <View style={styles.folderInfo}>
                  <Text style={styles.folderName}>{folder.name}</Text>
                  <Text style={styles.folderDetails}>
                    {folder.files.length} files
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '70%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  createForm: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F8F9FA',
  },
  textInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#8B4513',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  folderList: {
    flex: 1,
    padding: 20,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  folderIcon: {
    marginRight: 15,
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  folderDetails: {
    fontSize: 12,
    color: '#666',
  },
});