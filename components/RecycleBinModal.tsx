import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { X, RotateCcw, Trash2, FileText, Folder, StickyNote } from 'lucide-react-native';

export interface DeletedItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'stickyNote';
  originalData: any;
  deletedAt: string;
}

interface RecycleBinModalProps {
  visible: boolean;
  deletedItems: DeletedItem[];
  onClose: () => void;
  onRestore: (item: DeletedItem) => void;
  onPermanentDelete: (itemId: string) => void;
  onEmptyBin: () => void;
}

export default function RecycleBinModal({ 
  visible, 
  deletedItems, 
  onClose, 
  onRestore, 
  onPermanentDelete,
  onEmptyBin 
}: RecycleBinModalProps) {
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <FileText size={24} color="#D2691E" />;
      case 'folder':
        return <Folder size={24} color="#8B4513" />;
      case 'stickyNote':
        return <StickyNote size={24} color="#FFE66D" />;
      default:
        return <FileText size={24} color="#666" />;
    }
  };

  const handleEmptyBin = () => {
    Alert.alert(
      'Empty Recycle Bin',
      'Are you sure you want to permanently delete all items? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Empty Bin', 
          style: 'destructive',
          onPress: onEmptyBin
        }
      ]
    );
  };

  const handlePermanentDelete = (item: DeletedItem) => {
    Alert.alert(
      'Permanent Delete',
      `Are you sure you want to permanently delete "${item.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onPermanentDelete(item.id)
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Recycle Bin</Text>
            {deletedItems.length > 0 && (
              <TouchableOpacity onPress={handleEmptyBin} style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>Empty</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
            {deletedItems.length === 0 ? (
              <View style={styles.emptyState}>
                <Trash2 size={48} color="#CCC" />
                <Text style={styles.emptyText}>Recycle bin is empty</Text>
                <Text style={styles.emptySubtext}>
                  Deleted items will appear here and can be restored
                </Text>
              </View>
            ) : (
              deletedItems.map((item) => (
                <View key={item.id} style={styles.deletedItem}>
                  <View style={styles.itemInfo}>
                    {getItemIcon(item.type)}
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemMeta}>
                        Deleted {item.deletedAt}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.restoreButton}
                      onPress={() => onRestore(item)}
                    >
                      <RotateCcw size={18} color="#4CAF50" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handlePermanentDelete(item)}
                    >
                      <Trash2 size={18} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
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
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  emptyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF4444',
    borderRadius: 6,
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  itemsList: {
    flex: 1,
    padding: 20,
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
  deletedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemDetails: {
    marginLeft: 15,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemMeta: {
    fontSize: 12,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  restoreButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
});