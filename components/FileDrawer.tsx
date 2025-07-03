import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { Archive, FolderOpen } from 'lucide-react-native';

interface FileDrawerProps {
  onPress: () => void;
}

export default function FileDrawer({ onPress }: FileDrawerProps) {
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
    <Animated.View style={[styles.drawerContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        style={styles.drawer} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {/* Drawer Body */}
        <View style={styles.drawerBody}>
          <Archive size={24} color="#696969" />
          <Text style={styles.drawerLabel}>FILE STORAGE</Text>
        </View>
        
        {/* Drawer Handle */}
        <View style={styles.drawerHandle}>
          <View style={styles.handleGroove} />
          <View style={styles.handleGroove} />
          <View style={styles.handleGroove} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    width: 200,
    height: 60,
  },
  drawer: {
    flex: 1,
    backgroundColor: '#A9A9A9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#808080',
    overflow: 'hidden',
  },
  drawerBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B8B8B8',
    paddingHorizontal: 15,
    gap: 8,
  },
  drawerLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  drawerHandle: {
    height: 12,
    backgroundColor: '#696969',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  handleGroove: {
    width: 20,
    height: 2,
    backgroundColor: '#555',
    borderRadius: 1,
  },
});