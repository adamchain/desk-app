import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { X, FileText, Folder, Plus } from 'lucide-react-native';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAddFile: (name: string, type: string) => void;
  onAddFolder: (name: string) => void;
  onAddStickyNote?: () => void;
}

export default function AddItemModal({ visible, onClose, onAddFile, onAddFolder, onAddStickyNote }: AddItemModalProps) {
  const [mode, setMode] = useState<'select' | 'file' | 'folder'>('select');
  const [name, setName] = useState('');
  const [fileType, setFileType] = useState('Document');

  const fileTypes = [
    { label: 'Document', extension: '.docx', type: 'Word Document' },
    { label: 'PDF', extension: '.pdf', type: 'PDF Document' },
    { label: 'Spreadsheet', extension: '.xlsx', type: 'Excel File' },
    { label: 'Presentation', extension: '.pptx', type: 'PowerPoint' },
    { label: 'Text File', extension: '.txt', type: 'Text Document' },
  ];

  const handleAddFile = () => {
    if (name.trim()) {
      const selectedType = fileTypes.find(type => type.label === fileType);
      const fileName = name.trim() + (selectedType?.extension || '.txt');
      onAddFile(fileName, selectedType?.type || 'Document');
      resetModal();
    }
  };

  const handleAddFolder = () => {
    if (name.trim()) {
      onAddFolder(name.trim());
      resetModal();
    }
  };

  const handleAddStickyNote = () => {
    if (onAddStickyNote) {
      onAddStickyNote();
    }
    resetModal();
  };

  const resetModal = () => {
    setMode('select');
    setName('');
    setFileType('Document');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={resetModal}
    >
      <View style={styles.modalOverlay}>
        {/* Main content area - only shows when not in select mode */}
        {mode !== 'select' && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setMode('select')}>
                <X size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {mode === 'file' ? 'New File' : 'New Folder'}
              </Text>
              <View style={{ width: 24 }} />
            </View>

            {mode === 'file' && (
              <View style={styles.formContainer}>
                <Text style={styles.label}>File Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter file name..."
                  placeholderTextColor="#666"
                />

                <Text style={styles.label}>File Type</Text>
                <View style={styles.typeContainer}>
                  {fileTypes.map((type) => (
                    <TouchableOpacity
                      key={type.label}
                      style={[
                        styles.typeButton,
                        fileType === type.label && styles.selectedType,
                      ]}
                      onPress={() => setFileType(type.label)}
                    >
                      <Text style={[
                        styles.typeText,
                        fileType === type.label && styles.selectedTypeText,
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.createButton, !name.trim() && styles.disabledButton]}
                  onPress={handleAddFile}
                  disabled={!name.trim()}
                >
                  <Plus size={20} color="#FFF" />
                  <Text style={styles.createButtonText}>Create File</Text>
                </TouchableOpacity>
              </View>
            )}

            {mode === 'folder' && (
              <View style={styles.formContainer}>
                <Text style={styles.label}>Folder Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter folder name..."
                  placeholderTextColor="#666"
                />

                <TouchableOpacity
                  style={[styles.createButton, !name.trim() && styles.disabledButton]}
                  onPress={handleAddFolder}
                  disabled={!name.trim()}
                >
                  <Plus size={20} color="#FFF" />
                  <Text style={styles.createButtonText}>Create Folder</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Bottom item selector - always visible when modal is open */}
        <View style={styles.bottomSelector}>
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorTitle}>Add New Item</Text>
            <View style={styles.itemsRow}>
              {/* File Item */}
              <TouchableOpacity
                style={styles.itemButton}
                onPress={() => setMode('file')}
              >
                <View style={styles.fileVisual}>
                  <View style={styles.fileIcon}>
                    <FileText size={24} color="#D2691E" />
                  </View>
                  <View style={styles.fileCorner} />
                </View>
                <Text style={styles.itemLabel}>File</Text>
              </TouchableOpacity>

              {/* Folder Item */}
              <TouchableOpacity
                style={styles.itemButton}
                onPress={() => setMode('folder')}
              >
                <View style={styles.folderVisual}>
                  <View style={styles.folderTab}>
                    <Text style={styles.folderTabText}>New</Text>
                  </View>
                  <View style={styles.folderBody}>
                    <Folder size={20} color="#8B4513" />
                  </View>
                </View>
                <Text style={styles.itemLabel}>Folder</Text>
              </TouchableOpacity>

              {/* Sticky Note Item */}
              <TouchableOpacity
                style={styles.itemButton}
                onPress={handleAddStickyNote}
              >
                <View style={styles.stickyNoteVisual}>
                  <Text style={styles.stickyNoteText}>Note</Text>
                </View>
                <Text style={styles.itemLabel}>Sticky Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginBottom: 120, // Leave space for bottom selector
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
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
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedType: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTypeText: {
    color: '#FFF',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSelector: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Account for tab bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  selectorContainer: {
    padding: 20,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  itemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  itemButton: {
    alignItems: 'center',
    padding: 10,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  // File Visual
  fileVisual: {
    width: 50,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  fileIcon: {
    marginBottom: 4,
  },
  fileCorner: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderBottomLeftRadius: 6,
  },
  // Folder Visual
  folderVisual: {
    width: 60,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  folderTab: {
    width: 40,
    height: 12,
    backgroundColor: '#DEB887',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#CD853F',
  },
  folderTabText: {
    fontSize: 6,
    color: '#8B4513',
    fontWeight: '600',
  },
  folderBody: {
    flex: 1,
    backgroundColor: '#F5DEB3',
    borderRadius: 4,
    borderTopLeftRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CD853F',
    paddingVertical: 4,
  },
  // Sticky Note Visual
  stickyNoteVisual: {
    width: 50,
    height: 50,
    backgroundColor: '#FFE66D',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '3deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stickyNoteText: {
    fontSize: 8,
    color: '#333',
    fontWeight: '600',
  },
});