import React, { useRef, useState } from 'react';
import { View, PanResponder, StyleSheet, TextInput, TouchableOpacity, Text, Keyboard, GestureResponderEvent } from 'react-native';

interface Line {
    points: { x: number; y: number }[];
}

interface Word {
    text: string;
    x: number;
    y: number;
}

export default function Whiteboard() {
    const [lines, setLines] = useState<Line[]>([]);
    const [currentLine, setCurrentLine] = useState<Line | null>(null);
    const [words, setWords] = useState<Word[]>([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const [inputPos, setInputPos] = useState<{ x: number; y: number } | null>(null);

    // Helper to determine if a line is being drawn
    const isDrawing = useRef(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt: GestureResponderEvent) => {
                if (inputVisible) return;
                const { locationX, locationY } = evt.nativeEvent;
                setCurrentLine({ points: [{ x: locationX, y: locationY }] });
                isDrawing.current = true;
            },
            onPanResponderMove: (evt: GestureResponderEvent) => {
                if (inputVisible) return;
                const { locationX, locationY } = evt.nativeEvent;
                setCurrentLine((prev: Line | null) =>
                    prev ? { points: [...prev.points, { x: locationX, y: locationY }] } : null
                );
            },
            onPanResponderRelease: (evt: GestureResponderEvent) => {
                if (inputVisible) return;
                if (currentLine && isDrawing.current) {
                    setLines((prev) => [...prev, currentLine]);
                    setCurrentLine(null);
                    isDrawing.current = false;
                } else if (!isDrawing.current) {
                    // If not drawing, show input for word
                    const { locationX, locationY } = evt.nativeEvent;
                    setInputPos({ x: locationX, y: locationY });
                    setInputVisible(true);
                    setInputText('');
                }
            },
        })
    ).current;

    const handleWordSubmit = () => {
        if (inputText.trim() && inputPos) {
            setWords((prev) => [...prev, { text: inputText.trim(), x: inputPos.x, y: inputPos.y }]);
        }
        setInputVisible(false);
        setInputText('');
        setInputPos(null);
        Keyboard.dismiss();
    };

    return (
        <View style={styles.whiteboard} {...panResponder.panHandlers}>
            <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                {lines.map((line, i) => (
                    <polyline
                        key={i}
                        fill="none"
                        stroke="#222"
                        strokeWidth={4}
                        points={line.points.map((p) => `${p.x},${p.y}`).join(' ')}
                    />
                ))}
                {currentLine && (
                    <polyline
                        fill="none"
                        stroke="#222"
                        strokeWidth={4}
                        points={currentLine.points.map((p) => `${p.x},${p.y}`).join(' ')}
                    />
                )}
                {words.map((word, i) => (
                    <text
                        key={i}
                        x={word.x}
                        y={word.y}
                        fontSize="28"
                        fontWeight="bold"
                        fill="#333"
                        style={{ userSelect: 'none' }}
                    >
                        {word.text}
                    </text>
                ))}
            </svg>
            {inputVisible && (
                <View style={[styles.inputOverlay, inputPos && { left: inputPos.x, top: inputPos.y }]}>
                    <TextInput
                        style={styles.textInput}
                        value={inputText}
                        onChangeText={setInputText}
                        autoFocus
                        placeholder="Type word..."
                        onSubmitEditing={handleWordSubmit}
                        blurOnSubmit={true}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleWordSubmit}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    whiteboard: {
        width: '100%',
        height: 180,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#bbb',
        marginBottom: 16,
        overflow: 'hidden',
        alignSelf: 'center',
        position: 'relative',
    },
    inputOverlay: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    textInput: {
        minWidth: 60,
        fontSize: 22,
        color: '#222',
        padding: 2,
        backgroundColor: 'transparent',
    },
    addButton: {
        marginLeft: 6,
        backgroundColor: '#8B4513',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
