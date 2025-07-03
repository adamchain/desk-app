import { Tabs } from 'expo-router';
import { Chrome as Home, Plus, Settings } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AddItemModal from '../../components/AddItemModal';
import { useDeskActions } from '../../components/DeskActionsContext';

export default function TabsLayout() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { addFile, addFolder, addSticky } = useDeskActions();

  const handleAddFile = (name: string, type: string) => {
    addFile(name, type);
    setShowAddModal(false);
  };

  const handleAddFolder = (name: string) => {
    addFolder(name);
    setShowAddModal(false);
  };

  const handleAddSticky = () => {
    addSticky();
    setShowAddModal(false);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#8B4513',
            borderTopColor: '#A0522D',
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#D2B48C',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Desk',
            tabBarIcon: ({ size, color }: { size: number; color: string }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ size, color }: { size: number; color: string }) => (
              <Settings size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 32,
          bottom: 16,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#FFD700',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.7}
      >
        <Plus size={28} color="#8B4513" />
      </TouchableOpacity>
      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddFile={handleAddFile}
        onAddFolder={handleAddFolder}
        onAddStickyNote={handleAddSticky}
      />
    </>
  );
}