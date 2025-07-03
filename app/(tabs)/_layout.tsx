import { Tabs } from 'expo-router';
import { Chrome as Home, Plus, Settings } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useState, useMemo } from 'react';
import AddItemModal from '../../components/AddItemModal';
import { DeskActionsContext } from '../../components/DeskActionsContext';

export default function TabsLayout() {
  const [showAddModal, setShowAddModal] = useState(false);

  // These will be replaced by context values from DeskScene
  const [addFile, setAddFile] = useState<(name: string, type: string) => void>(() => () => { });
  const [addFolder, setAddFolder] = useState<(name: string) => void>(() => () => { });
  const [addSticky, setAddSticky] = useState<() => void>(() => () => { });

  // These setters will be called by DeskScene to register the real add functions
  const contextValue = useMemo(() => ({
    addFile: (name: string, type: string) => {
      addFile(name, type);
      setShowAddModal(false);
    },
    addFolder: (name: string) => {
      addFolder(name);
      setShowAddModal(false);
    },
    addSticky: () => {
      addSticky();
      setShowAddModal(false);
    },
    setAddFile,
    setAddFolder,
    setAddSticky,
  }), [addFile, addFolder, addSticky]);

  return (
    <DeskActionsContext.Provider value={contextValue}>
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
        onAddFile={contextValue.addFile}
        onAddFolder={contextValue.addFolder}
        onAddStickyNote={contextValue.addSticky}
      />
    </DeskActionsContext.Provider>
  );
}