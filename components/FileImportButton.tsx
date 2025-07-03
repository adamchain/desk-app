import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Upload, FileText } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/lib/supabase';
import type { FileData } from './DeskScene';

interface FileImportButtonProps {
  onFileImported: (file: FileData) => void;
  style?: any;
}

export default function FileImportButton({ onFileImported, style }: FileImportButtonProps) {
  const [isImporting, setIsImporting] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileType = (mimeType: string, name: string): string => {
    const extension = name.split('.').pop()?.toLowerCase();

    if (mimeType.includes('pdf') || extension === 'pdf') return 'PDF Document';
    if (mimeType.includes('word') || extension === 'docx' || extension === 'doc') return 'Word Document';
    if (mimeType.includes('text') || extension === 'txt') return 'Text Document';
    if (mimeType.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'Image';
    if (mimeType.includes('excel') || extension === 'xlsx' || extension === 'xls') return 'Excel File';
    if (mimeType.includes('powerpoint') || extension === 'pptx' || extension === 'ppt') return 'PowerPoint';

    return 'Document';
  };

  const handleImportFile = async () => {
    try {
      setIsImporting(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        // Get file info
        const fileInfo = await FileSystem.getInfoAsync(file.uri);
        const fileSize = fileInfo.exists ? formatFileSize(fileInfo.size || 0) : '0 KB';
        const fileType = getFileType(file.mimeType || '', file.name);

        // For web platform, we'll store the file data differently
        let fileUri = file.uri;

        if (Platform.OS === 'web') {
          // On web, we can use the blob URL directly
          fileUri = file.uri;
        } else {
          // On mobile, copy to a permanent location
          const fileName = `${Date.now()}_${file.name}`;
          const permanentUri = `${FileSystem.documentDirectory}imported_files/${fileName}`;

          // Ensure directory exists
          await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}imported_files/`, { intermediates: true });

          // Copy file to permanent location
          await FileSystem.copyAsync({
            from: file.uri,
            to: permanentUri,
          });

          fileUri = permanentUri;
        }

        const importedFile: FileData = {
          name: file.name,
          type: fileType,
          size: fileSize,
          date: new Date().toLocaleDateString(),
        };

        // Store in Supabase (when connected)
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('imported_files').insert({
              name: file.name,
              type: fileType,
              size: fileSize,
              uri: fileUri,
              date_imported: new Date().toISOString(),
              user_id: user.id,
            });
          }
        } catch (error) {
          console.log('Supabase not connected, storing locally only');
        }

        onFileImported(importedFile);

        if (Platform.OS !== 'web') {
          Alert.alert('Success', `File "${file.name}" imported successfully!`);
        }
      }
    } catch (error) {
      console.error('Error importing file:', error);
      Alert.alert('Error', 'Failed to import file. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.importButton, style]}
      onPress={handleImportFile}
      disabled={isImporting}
    >
      <View style={styles.buttonContent}>
        {isImporting ? (
          <FileText size={20} color="#FFF" />
        ) : (
          <Upload size={20} color="#FFF" />
        )}
        <Text style={styles.buttonText}>
          {isImporting ? 'Importing...' : 'Import File'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  importButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});