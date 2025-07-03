import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { Trash2 } from 'lucide-react-native';

interface RecycleBinProps {
  onPress: () => void;
  itemCount?: number;
}

export default function RecycleBin({ onPress, itemCount = 0 }: RecycleBinProps) {
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

  return (
    <Animated.View style={[styles.binContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        style={styles.bin} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {/* Bin Lid */}
        <View style={styles.binLid}>
          <View style={styles.lidHandle} />
        </View>
        
        {/* Bin Body */}
        <View style={styles.binBody}>
          <Trash2 size={32} color="#666" />
          {itemCount > 0 && (
            <View style={styles.itemBadge}>
              <Text style={styles.itemCount}>{itemCount}</Text>
            </View>
          )}
        </View>
        
        {/* Bin Label */}
        <Text style={styles.binLabel}>RECYCLE</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  binContainer: {
    width: 80,
    height: 100,
  },
  bin: {
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  binLid: {
    width: 60,
    height: 8,
    backgroundColor: '#696969',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#555',
  },
  lidHandle: {
    width: 20,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
  },
  binBody: {
    width: 55,
    height: 65,
    backgroundColor: '#808080',
    borderRadius: 6,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#666',
    position: 'relative',
  },
  itemBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  itemCount: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: 'bold',
  },
  binLabel: {
    fontSize: 8,
    color: '#333',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});