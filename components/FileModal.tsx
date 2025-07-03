import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, FileText, File, Upload, FolderOpen, Folder } from 'lucide-react-native';
import FileImportButton from './FileImportButton';
import FileViewer from './FileViewer';
import type { FileData, DeskFolderData } from './DeskScene';

interface FileModalProps {
  visible: boolean;
  title: string;
  files: FileData[];
  folders?: DeskFolderData[];
  onClose: () => void;
  onFileImported?: (file: FileData) => void;
  allowImport?: boolean;
  drawerIndex?: number;
}

export default function FileModal({ 
  visible, 
  title, 
  files, 
  folders = [],
  onClose, 
  onFileImported, 
  allowImport = false,
  drawerIndex 
}: FileModalProps) {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<DeskFolderData | null>(null);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText size={24} color="#D2691E" />;
      default:
        return <File size={24} color="#696969" />;
    }
  };

  const handleFilePress = (file: FileData) => {
    setSelectedFile(file);
  };

  const handleFolderPress = (folder: DeskFolderData) => {
    setSelectedFolder(folder);
  };

  const handleFileImported = (file: FileData) => {
    if (onFileImported) {
      onFileImported(file);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setSelectedFolder(null);
    onClose();
  };

  const handleFileViewerClose = () => {
    setSelectedFile(null);
  };

  const handleFolderModalClose = () => {
    setSelectedFolder(null);
  };

  const getDrawerColor = (index?: number) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    return index !== undefined ? colors[index] : '#8B4513';
  };

  const getDrawerLabel = (index?: number) => {
    const labels = ['A', 'B', 'C', 'D', 'E'];
    return index !== undefined ? labels[index] : '';
  };

  const hasContent = files.length > 0 || folders.length > 0;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.titleContainer}>
                {drawerIndex !== undefined && (
                  <View style={[styles.drawerIndicator, { backgroundColor: getDrawerColor(drawerIndex) }]}>
                    <Text style={styles.drawerIndicatorText}>{getDrawerLabel(drawerIndex)}</Text>
                  </View>
                )}
                <Text style={styles.modalTitle}>{title}</Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {allowImport && (
              <View style={styles.importSection}>
                <FileImportButton
                  onFileImported={handleFileImported}
                  style={styles.importButton}
                />
              </View>
            )}

            <ScrollView style={styles.contentList} showsVerticalScrollIndicator={false}>
              {!hasContent ? (
                <View style={styles.emptyState}>
                  {drawerIndex !== undefined ? (
                    <FolderOpen size={48} color="#CCC" />
                  ) : (
                    <Upload size={48} color="#CCC" />
                  )}
                  <Text style={styles.emptyText}>
                    {drawerIndex !== undefined ? `Drawer ${getDrawerLabel(drawerIndex)} is empty` : 'No items yet'}
                  </Text>
                  {allowImport && (
                    <Text style={styles.emptySubtext}>
                      {drawerIndex !== undefined 
                        ? 'Drag files here or use the import button'
                        : 'Import your first file to get started'
                      }
                    </Text>
                  )}
                </View>
              ) : (
                <>
                  {/* Folders Section */}
                  {folders.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Folders</Text>
                      {folders.map((folder, index) => (
                        <TouchableOpacity
                          key={`folder-${folder.id}-${index}`}
                          style={styles.folderItem}
                          onPress={() => handleFolderPress(folder)}
                        >
                          <Folder size={24} color="#8B4513" />
                          <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{folder.name}</Text>
                            <Text style={styles.itemDetails}>
                              {folder.files.length} files
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Files Section */}
                  {files.length > 0 && (
                    <View style={styles.section}>
                      {folders.length > 0 && <Text style={styles.sectionTitle}>Files</Text>}
                      {files.map((file, index) => (
                        <TouchableOpacity
                          key={`file-${file.name}-${index}`}
                          style={styles.fileItem}
                          onPress={() => handleFilePress(file)}
                        >
                          {getFileIcon(file.name)}
                          <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{file.name}</Text>
                            <Text style={styles.itemDetails}>{file.type} • {file.size}</Text>
                            <Text style={styles.itemDate}>{file.date}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* File Viewer Modal */}
      <FileViewer
        visible={!!selectedFile}
        file={selectedFile}
        onClose={handleFileViewerClose}
      />

      {/* Nested Folder Modal */}
      {selectedFolder && (
        <Modal
          visible={!!selectedFolder}
          animationType="slide"
          transparent
          onRequestClose={handleFolderModalClose}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleFolderModalClose} style={styles.closeButton}>
                  <X size={24} color="#666" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedFolder.name}</Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView style={styles.contentList} showsVerticalScrollIndicator={false}>
                {selectedFolder.files.length === 0 ? (
                  <View style={styles.emptyState}>
                    <FolderOpen size={48} color="#CCC" />
                    <Text style={styles.emptyText}>Folder is empty</Text>
                    <Text style={styles.emptySubtext}>
                      Drag files into this folder to organize them
                    </Text>
                  </View>
                ) : (
                  selectedFolder.files.map((file, index) => (
                    <TouchableOpacity
                      key={`nested-file-${file.name}-${index}`}
                      style={styles.fileItem}
                      onPress={() => handleFilePress(file)}
                    >
                      {getFileIcon(file.name)}
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{file.name}</Text>
                        <Text style={styles.itemDetails}>{file.type} • {file.size}</Text>
                        <Text style={styles.itemDate}>{file.date}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </>
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
    maxWidth: 500,
    maxHeight: '80%',
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  drawerIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  drawerIndicatorText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  importSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  importButton: {
    width: '100%',
  },
  contentList: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    paddingLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  fileItem: {
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
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFF8E1',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  itemInfo: {
    marginLeft: 15,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
});