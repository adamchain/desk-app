import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Settings, User, Bell, Moon, Palette, CircleHelp as HelpCircle, LogOut, Smartphone } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Your desk layout will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: signOut
        }
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { 
          icon: Smartphone, 
          label: 'Phone Number', 
          value: user?.phoneNumber || '',
          action: () => { } 
        },
        { icon: Bell, label: 'Notifications', action: () => { } },
      ]
    },
    {
      title: 'Appearance',
      items: [
        { icon: Palette, label: 'Theme', action: () => { } },
        { icon: Moon, label: 'Dark Mode', action: () => { } },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & FAQ', action: () => { } },
      ]
    },
    {
      title: 'Account Actions',
      items: [
        { 
          icon: LogOut, 
          label: 'Sign Out', 
          action: handleSignOut,
          destructive: true
        },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Settings size={32} color="#8B4513" />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userIcon}>
            <User size={32} color="#8B4513" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Welcome back!</Text>
            <Text style={styles.userPhone}>{user?.phoneNumber}</Text>
            <Text style={styles.userDate}>
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'today'}
            </Text>
          </View>
        </View>

        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.settingItem,
                  item.destructive && styles.destructiveItem
                ]}
                onPress={item.action}
              >
                <item.icon 
                  size={24} 
                  color={item.destructive ? "#FF4444" : "#8B4513"} 
                />
                <View style={styles.settingContent}>
                  <Text style={[
                    styles.settingLabel,
                    item.destructive && styles.destructiveText
                  ]}>
                    {item.label}
                  </Text>
                  {item.value && (
                    <Text style={styles.settingValue}>{item.value}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your desk layout is automatically saved and synced across all your devices.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5DC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
    marginBottom: 2,
  },
  userDate: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destructiveItem: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFE6E6',
  },
  settingContent: {
    flex: 1,
    marginLeft: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  destructiveText: {
    color: '#FF4444',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  footer: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});