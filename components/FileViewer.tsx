import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { X, Download, FileText, CircleAlert as AlertCircle } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
import type { FileData } from './DeskScene';

interface FileViewerProps {
  visible: boolean;
  file: FileData | null;
  fileUri?: string;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FileViewer({ visible, file, fileUri, onClose }: FileViewerProps) {
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Reset state when modal closes or file changes
  useEffect(() => {
    if (!visible) {
      setFileContent('');
      setError('');
      setIsLoading(false);
      return;
    }

    if (visible && file) {
      loadFileContent();
    }
  }, [visible, file?.name]); // Use file.name to detect file changes

  const loadFileContent = async () => {
    if (!file) return;

    setIsLoading(true);
    setError('');
    setFileContent('');

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (['txt', 'md', 'json', 'js', 'ts', 'css', 'html'].includes(extension || '')) {
        // For text files, we'll simulate content since we don't have actual file URIs
        setFileContent(`This is a preview of ${file.name}\n\nFile Type: ${file.type}\nSize: ${file.size}\nDate: ${file.date}\n\nIn a real implementation, this would show the actual file content.`);
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
        // For images, use a placeholder from Pexels
        setFileContent('image');
      } else if (extension === 'pdf') {
        setFileContent('pdf');
      } else {
        setError('File type not supported for preview');
      }
    } catch (err) {
      console.error('Error loading file:', err);
      setError('Failed to load file content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!file) return;

    try {
      if (Platform.OS === 'web') {
        // Simulate download by showing an alert
        alert(`Download functionality would be implemented here for ${file.name}`);
      } else {
        console.log('Download functionality for mobile would go here');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleClose = () => {
    // Reset all state before closing
    setFileContent('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  const renderFileContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContent}>
          <FileText size={48} color="#666" />
          <Text style={styles.loadingText}>Loading file...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <AlertCircle size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <Download size={20} color="#FFF" />
            <Text style={styles.downloadButtonText}>Open Externally</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!file) return null;

    const extension = file.name.split('.').pop()?.toLowerCase();

    // Handle images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '') || fileContent === 'image') {
      // Use a relevant Pexels image based on file name
      const imageUrl = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800';
      
      return (
        <ScrollView style={styles.imageContainer} maximumZoomScale={3} minimumZoomScale={1}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </ScrollView>
      );
    }

    // Handle PDFs
    if (extension === 'pdf' || fileContent === 'pdf') {
      return (
        <View style={styles.centerContent}>
          <FileText size={48} color="#D2691E" />
          <Text style={styles.pdfText}>PDF Document</Text>
          <Text style={styles.pdfSubtext}>
            PDF viewing is not available in the web preview.
            {'\n'}Click below to open in your browser.
          </Text>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <Download size={20} color="#FFF" />
            <Text style={styles.downloadButtonText}>Open PDF</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Handle text files
    if (fileContent && fileContent !== 'image' && fileContent !== 'pdf') {
      return (
        <ScrollView style={styles.textContainer}>
          <Text style={styles.textContent}>{fileContent}</Text>
        </ScrollView>
      );
    }

    // Fallback for unsupported files
    return (
      <View style={styles.centerContent}>
        <FileText size={48} color="#666" />
        <Text style={styles.unsupportedText}>Preview not available</Text>
        <Text style={styles.unsupportedSubtext}>
          This file type cannot be previewed in the app.
        </Text>
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Download size={20} color="#FFF" />
          <Text style={styles.downloadButtonText}>Open Externally</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!visible || !file) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file.name}
            </Text>
            <Text style={styles.fileDetails}>
              {file.type} • {file.size}
            </Text>
          </View>
          <TouchableOpacity onPress={handleDownload} style={styles.headerButton}>
            <Download size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {renderFileContent()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  fileInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  fileDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginTop: 16,
    textAlign: 'center',
  },
  pdfText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  pdfSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  unsupportedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  unsupportedSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: screenWidth,
    height: screenHeight - 120,
  },
  textContainer: {
    flex: 1,
    padding: 20,
  },
  textContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});