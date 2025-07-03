import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import DraggableItem from './DraggableItem';
import type { FileTrayData } from './DeskScene';

interface FileTrayProps {
  fileTray: FileTrayData;
  onUpdate: (updates: Partial<FileTrayData>) => void;
  onPress: () => void;
  isDropTarget?: boolean;
  onDrop?: (file: import('./DeskScene').DeskFileData, target: string) => void;
  bounds?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  };
}

export default function FileTray({ fileTray, onUpdate, onPress, isDropTarget = false, onDrop, bounds }: FileTrayProps) {
  const [hovering, setHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handlePositionChange = (x: number, y: number) => {
    onUpdate({ x, y });
  };

  const handlePress = () => {
    if (!isDragging) {
      onPress();
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
    <DraggableItem
      x={fileTray.x}
      y={fileTray.y}
      zIndex={fileTray.zIndex}
      onPositionChange={handlePositionChange}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      bounds={bounds}
    >
      <View style={[styles.trayContainer, isDropTarget && styles.dropTarget]}>
        <GestureDetector gesture={tapGesture}>
          <View style={[styles.tray, hovering && styles.hoveredTray]}>
            {/* Stackable File Tray Structure */}
            <View style={styles.trayStack}>
              {/* Support Frame */}
              <View style={styles.supportFrame}>
                <View style={styles.leftSupport} />
                <View style={styles.rightSupport} />
              </View>

              {/* Stacked Trays */}
              <View style={styles.stackedTrays}>
                {[...Array(6)].map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.trayLevel,
                      {
                        bottom: index * 8,
                        zIndex: 10 - index,
                        opacity: index === 0 ? 1 : 0.8 - (index * 0.1)
                      }
                    ]}
                  >
                    <View style={styles.trayBase} />
                    <View style={styles.trayRim} />
                  </View>
                ))}
              </View>

              {/* Label */}
              <View style={styles.labelContainer}>
                <Text style={styles.trayLabel}>INBOX</Text>
                <Text style={styles.fileCount}>
                  {(fileTray.files?.length ?? 0) + (fileTray.folders?.length ?? 0)} items
                </Text>
              </View>
            </View>
          </View>
        </GestureDetector>

        {/* Drop zone indicator */}
        <View style={styles.dropZone}>
          <Text style={styles.dropZoneText}>Drop files here</Text>
        </View>
      </View>
    </DraggableItem>
  );
}

const styles = StyleSheet.create({
  trayContainer: {
    width: 120,
    height: 90,
  },
  dropTarget: {
    transform: [{ scale: 1.1 }],
  },
  tray: {
    flex: 1,
    elevation: 6,
  },
  hoveredTray: {
    transform: [{ scale: 1.05 }],
  },
  trayStack: {
    flex: 1,
    position: 'relative',
  },
  supportFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  leftSupport: {
    width: 8,
    height: '100%',
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
  },
  rightSupport: {
    width: 8,
    height: '100%',
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
  },
  stackedTrays: {
    position: 'absolute',
    top: 8,
    left: 12,
    right: 12,
    bottom: 20,
  },
  trayLevel: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 12,
  },
  trayBase: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  trayRim: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    height: 4,
    backgroundColor: '#E8E8E8',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    paddingVertical: 2,
  },
  trayLabel: {
    fontSize: 8,
    color: '#333',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  fileCount: {
    fontSize: 7,
    color: '#666',
    fontWeight: '600',
  },
  dropZone: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  dropZoneText: {
    color: '#007AFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});