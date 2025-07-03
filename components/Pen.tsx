import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { PenTool } from 'lucide-react-native';

interface PenProps {
  onPress: () => void;
}

export default function Pen({ onPress }: PenProps) {
  return (
    <TouchableOpacity style={styles.pen} onPress={onPress}>
      <View style={styles.penBody}>
        <View style={styles.penTip} />
        <View style={styles.penBarrel}>
          <PenTool size={16} color="#1C1C1E" />
        </View>
        <View style={styles.penEnd} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pen: {
    width: 80,
    height: 12,
    transform: [{ rotate: '25deg' }],
  },
  penBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  penTip: {
    width: 8,
    height: 8,
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  penBarrel: {
    flex: 1,
    height: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  penEnd: {
    width: 6,
    height: 8,
    backgroundColor: '#FF3B30',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});