import React, { useRef, useState } from 'react';
import { View, PanResponder, StyleSheet, TextInput, TouchableOpacity, Text, Keyboard, GestureResponderEvent, Dimensions, Platform } from 'react-native';
import { Eraser, Pen, Type } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface Line {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

interface TextElement {
  text: string;
  x: number;
  y: number;
  id: string;
}

export default function Whiteboard() {
  const [lines, setLines] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputPos, setInputPos] = useState<{ x: number; y: number } | null>(null);
  const [mode, setMode] = useState<'draw' | 'text' | 'erase'>('draw');
  const [strokeColor, setStrokeColor] = useState('#2C3E50');
  const [strokeWidth, setStrokeWidth] = useState(3);

  const isDrawing = useRef(false);
  const whiteboardRef = useRef<View>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        if (inputVisible) return;
        
        const { locationX, locationY } = evt.nativeEvent;
        
        if (mode === 'draw') {
          setCurrentLine({ 
            points: [{ x: locationX, y: locationY }], 
            color: strokeColor, 
            width: strokeWidth 
          });
          isDrawing.current = true;
        } else if (mode === 'text') {
          setInputPos({ x: locationX, y: locationY });
          setInputVisible(true);
          setInputText('');
        } else if (mode === 'erase') {
          // Find and remove lines near the touch point
          setLines(prev => prev.filter(line => {
            return !line.points.some(point => 
              Math.abs(point.x - locationX) < 20 && Math.abs(point.y - locationY) < 20
            );
          }));
          
          // Remove text elements near the touch point
          setTextElements(prev => prev.filter(element =>
            !(Math.abs(element.x - locationX) < 30 && Math.abs(element.y - locationY) < 30)
          ));
        }
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        if (inputVisible || mode !== 'draw') return;
        
        const { locationX, locationY } = evt.nativeEvent;
        
        if (mode === 'draw' && isDrawing.current) {
          setCurrentLine((prev: Line | null) =>
            prev ? { 
              ...prev, 
              points: [...prev.points, { x: locationX, y: locationY }] 
            } : null
          );
        } else if (mode === 'erase') {
          // Continue erasing while moving
          setLines(prev => prev.filter(line => {
            return !line.points.some(point => 
              Math.abs(point.x - locationX) < 20 && Math.abs(point.y - locationY) < 20
            );
          }));
        }
      },
      onPanResponderRelease: () => {
        if (inputVisible) return;
        
        if (currentLine && isDrawing.current && mode === 'draw') {
          setLines((prev) => [...prev, currentLine]);
          setCurrentLine(null);
          isDrawing.current = false;
        }
      },
    })
  ).current;

  const handleTextSubmit = () => {
    if (inputText.trim() && inputPos) {
      const newTextElement: TextElement = {
        text: inputText.trim(),
        x: inputPos.x,
        y: inputPos.y,
        id: Date.now().toString(),
      };
      setTextElements((prev) => [...prev, newTextElement]);
    }
    setInputVisible(false);
    setInputText('');
    setInputPos(null);
    Keyboard.dismiss();
  };

  const clearBoard = () => {
    setLines([]);
    setTextElements([]);
    setCurrentLine(null);
  };

  const colors = ['#2C3E50', '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6'];

  // Render drawing using Canvas-like approach for better mobile compatibility
  const renderDrawing = () => {
    if (Platform.OS === 'web') {
      // Use SVG for web
      try {
        const Svg = require('react-native-svg').default;
        const { Polyline, Text: SvgText } = require('react-native-svg');

        return (
          <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Render completed lines */}
            {lines.map((line, i) => (
              <Polyline
                key={i}
                fill="none"
                stroke={line.color}
                strokeWidth={line.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={line.points.map(p => `${p.x},${p.y}`).join(' ')}
              />
            ))}
            
            {/* Render current line being drawn */}
            {currentLine && (
              <Polyline
                fill="none"
                stroke={currentLine.color}
                strokeWidth={currentLine.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={currentLine.points.map(p => `${p.x},${p.y}`).join(' ')}
              />
            )}
            
            {/* Render text elements */}
            {textElements.map((element) => (
              <SvgText
                key={element.id}
                x={element.x}
                y={element.y}
                fontSize="18"
                fontWeight="600"
                fill="#2C3E50"
              >
                {element.text}
              </SvgText>
            ))}
          </Svg>
        );
      } catch (error) {
        console.warn('SVG rendering failed, falling back to simple view');
        return renderFallback();
      }
    } else {
      // Use fallback for mobile to avoid SVG issues
      return renderFallback();
    }
  };

  const renderFallback = () => {
    return (
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {/* Simple visual feedback for mobile */}
        {lines.map((line, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: line.points[0]?.x || 0,
              top: line.points[0]?.y || 0,
              width: 4,
              height: 4,
              backgroundColor: line.color,
              borderRadius: 2,
            }}
          />
        ))}
        
        {textElements.map((element) => (
          <Text
            key={element.id}
            style={{
              position: 'absolute',
              left: element.x,
              top: element.y - 18,
              fontSize: 18,
              fontWeight: '600',
              color: '#2C3E50',
            }}
          >
            {element.text}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Whiteboard */}
      <View style={styles.whiteboard} {...panResponder.panHandlers} ref={whiteboardRef}>
        {/* Whiteboard frame */}
        <View style={styles.whiteboardFrame}>
          <View style={styles.whiteboardSurface}>
            {/* Drawing layer */}
            {renderDrawing()}
            
            {/* Text input overlay */}
            {inputVisible && inputPos && (
              <View style={[styles.inputOverlay, { left: inputPos.x, top: inputPos.y - 20 }]}>
                <TextInput
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={setInputText}
                  autoFocus
                  placeholder="Type here..."
                  placeholderTextColor="#999"
                  onSubmitEditing={handleTextSubmit}
                  blurOnSubmit={true}
                />
                <TouchableOpacity style={styles.addTextButton} onPress={handleTextSubmit}>
                  <Text style={styles.addTextButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        {/* Mode buttons */}
        <View style={styles.modeButtons}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'draw' && styles.activeModeButton]}
            onPress={() => setMode('draw')}
          >
            <Pen size={20} color={mode === 'draw' ? '#FFF' : '#666'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modeButton, mode === 'text' && styles.activeModeButton]}
            onPress={() => setMode('text')}
          >
            <Type size={20} color={mode === 'text' ? '#FFF' : '#666'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modeButton, mode === 'erase' && styles.activeModeButton]}
            onPress={() => setMode('erase')}
          >
            <Eraser size={20} color={mode === 'erase' ? '#FFF' : '#666'} />
          </TouchableOpacity>
        </View>

        {/* Color palette */}
        <View style={styles.colorPalette}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                strokeColor === color && styles.activeColorButton,
              ]}
              onPress={() => setStrokeColor(color)}
            />
          ))}
        </View>

        {/* Clear button */}
        <TouchableOpacity style={styles.clearButton} onPress={clearBoard}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  whiteboard: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  whiteboardFrame: {
    flex: 1,
    backgroundColor: '#8B4513',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  whiteboardSurface: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#A0522D',
  },
  inputOverlay: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  textInput: {
    minWidth: 80,
    fontSize: 16,
    color: '#2C3E50',
    padding: 4,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#BDC3C7',
  },
  addTextButton: {
    marginLeft: 8,
    backgroundColor: '#3498DB',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addTextButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  activeModeButton: {
    backgroundColor: '#3498DB',
    borderColor: '#2980B9',
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 6,
  },
  colorButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  activeColorButton: {
    borderColor: '#2C3E50',
    borderWidth: 3,
  },
  clearButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
});