import { Tabs } from 'expo-router';
import { Chrome as Home, Settings } from 'lucide-react-native';

export default function TabsLayout() {
  return (
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
  );
}