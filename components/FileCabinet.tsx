import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { Archive, FolderOpen } from 'lucide-react-native';

interface FileCabinetProps {
  onPress: () => void;
}

export default function FileCabinet({ onPress }: FileCabinetProps) {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const sections = [
    { label: 'A-F', color: '#FF6B6B' },
    { label: 'G-M', color: '#4ECDC4' },
    { label: 'N-S', color: '#45B7D1' },
    { label: 'T-Z', color: '#96CEB4' },
  ];

  return (
    <Animated.View style={[styles.cabinetContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        style={styles.cabinet} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {/* Cabinet Header */}
        <View style={styles.cabinetHeader}>
          <Archive size={20} color="#696969" />
          <Text style={styles.cabinetTitle}>FILE CABINET</Text>
        </View>

        {/* File Sections */}
        <View style={styles.sectionsContainer}>
          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <View style={[styles.sectionTab, { backgroundColor: section.color }]}>
                <Text style={styles.sectionLabel}>{section.label}</Text>
              </View>
              <View style={styles.sectionBody}>
                <FolderOpen size={12} color="#696969" />
              </View>
              <View style={styles.sectionHandle} />
            </View>
          ))}
        </View>

        {/* Cabinet Base */}
        <View style={styles.cabinetBase}>
          <Text style={styles.baseLabel}>LONG-TERM STORAGE</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cabinetContainer: {
    width: 120,
    height: 160,
  },
  cabinet: {
    flex: 1,
    backgroundColor: '#A9A9A9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#808080',
    overflow: 'hidden',
  },
  cabinetHeader: {
    height: 30,
    backgroundColor: '#B8B8B8',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
    flexDirection: 'row',
    gap: 4,
  },
  cabinetTitle: {
    fontSize: 7,
    color: '#333',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionsContainer: {
    flex: 1,
    padding: 4,
  },
  section: {
    flex: 1,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C0C0C0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sectionTab: {
    width: 20,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#999',
  },
  sectionLabel: {
    fontSize: 6,
    color: '#333',
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
  },
  sectionBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  sectionHandle: {
    width: 8,
    height: 12,
    backgroundColor: '#696969',
    borderRadius: 2,
    marginRight: 4,
  },
  cabinetBase: {
    height: 20,
    backgroundColor: '#B8B8B8',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#808080',
  },
  baseLabel: {
    fontSize: 6,
    color: '#333',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});