import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { X, Trash2, ChevronDown } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import DraggableItem from './DraggableItem';
import type { StickyNoteData } from './DeskScene';

interface StickyNoteProps {
  note: StickyNoteData;
  onUpdate: (id: string, updates: Partial<StickyNoteData>) => void;
  onDelete: (id: string) => void;
  onDrop?: (note: StickyNoteData, target: string) => void;
  bounds?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  };
}

const colorMap = {
  urgent: '#FF6B6B',
  normal: '#FFE66D',
  low: '#4ECDC4',
};

export default function StickyNote({ note, onUpdate, onDelete, onDrop, bounds }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const [editColor, setEditColor] = useState(note.color);
  const [isDragging, setIsDragging] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  const handlePositionChange = (x: number, y: number) => {
    onUpdate(note.id, { x, y });
  };

  const handleSave = () => {
    onUpdate(note.id, { text: editText, color: editColor });
    setIsEditing(false);
    setShowColorDropdown(false);
  };

  const handlePress = () => {
    // Only open if we're not dragging
    if (!isDragging) {
      setIsEditing(true);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    // Add a small delay before allowing tap again
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  };

  const colors: Array<{ key: 'urgent' | 'normal' | 'low'; color: string; label: string }> = [
    { key: 'urgent', color: '#FF6B6B', label: 'Urgent' },
    { key: 'normal', color: '#FFE66D', label: 'Normal' },
    { key: 'low', color: '#4ECDC4', label: 'Low Priority' },
  ];

  const handleColorSelect = (colorKey: 'urgent' | 'normal' | 'low') => {
    setEditColor(colorKey);
    setShowColorDropdown(false);
  };

  // Create a tap gesture that respects the dragging state
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (!isDragging) {
        handlePress();
      }
    });

  return (
    <>
      <DraggableItem
        x={note.x}
        y={note.y}
        zIndex={note.zIndex}
        onPositionChange={handlePositionChange}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        bounds={bounds}
        onDrop={(target) => onDrop?.(note, target)}
      >
        <GestureDetector gesture={tapGesture}>
          <View
            style={[styles.stickyNote, { backgroundColor: colorMap[note.color] }]}
          >
            <Text style={styles.noteText} numberOfLines={4}>
              {note.text}
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
          <View style={[styles.modalContainer, { backgroundColor: colorMap[editColor] }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Sticky Note</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.colorCircle}
                  onPress={() => setShowColorDropdown(!showColorDropdown)}
                >
                  <View style={[styles.colorCircleInner, { backgroundColor: colorMap[editColor] }]} />
                  <ChevronDown size={12} color="#333" style={styles.chevronIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(note.id)}>
                  <Trash2 size={24} color="#FF4444" />
                </TouchableOpacity>
              </View>
            </View>

            {showColorDropdown && (
              <View style={styles.colorDropdown}>
                {colors.map((colorOption) => (
                  <TouchableOpacity
                    key={colorOption.key}
                    style={[
                      styles.colorDropdownItem,
                      { backgroundColor: colorOption.color },
                      editColor === colorOption.key && styles.selectedDropdownItem,
                    ]}
                    onPress={() => handleColorSelect(colorOption.key)}
                  >
                    <View style={styles.colorSwatch} />
                    <Text style={styles.colorDropdownLabel}>{colorOption.label}</Text>
                    {editColor === colorOption.key && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TextInput
              style={styles.textInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              placeholder="Enter your note..."
              placeholderTextColor="#666"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  stickyNote: {
    width: 80,
    height: 80,
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    transform: [{ rotate: '2deg' }],
  },
  noteText: {
    fontSize: 9,
    color: '#333',
    textAlign: 'center',
    lineHeight: 12,
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#FFE66D',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  colorCircleInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  chevronIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFF',
    borderRadius: 6,
    padding: 1,
  },
  colorDropdown: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  selectedDropdownItem: {
    borderWidth: 2,
    borderColor: '#333',
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginRight: 12,
  },
  colorDropdownLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#333',
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