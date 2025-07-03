import React from 'react';
import { View, StyleSheet } from 'react-native';
import DeskScene from '@/components/DeskScene';

export default function DeskScreen() {
  return (
    <View style={styles.container}>
      <DeskScene />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Beige background
  },
});