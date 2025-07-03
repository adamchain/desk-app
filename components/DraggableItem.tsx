import React from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DraggableItemProps {
  children: React.ReactNode;
  x: number;
  y: number;
  zIndex: number;
  onPositionChange: (x: number, y: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDrop?: (target: string) => void;
  bounds?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  };
  disabled?: boolean;
}

export default function DraggableItem({
  children,
  x,
  y,
  zIndex,
  onPositionChange,
  onDragStart,
  onDragEnd,
  onDrop,
  bounds = {},
  disabled = false,
}: DraggableItemProps) {
  const translateX = useSharedValue(x);
  const translateY = useSharedValue(y);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const shadowOpacity = useSharedValue(0.2);

  // Update position when props change
  React.useEffect(() => {
    translateX.value = withSpring(x, {
      damping: 20,
      stiffness: 300,
    });
    translateY.value = withSpring(y, {
      damping: 20,
      stiffness: 300,
    });
  }, [x, y]);

  const checkDropTarget = (x: number, y: number) => {
    // File Tray (top right area)
    const fileTrayX = screenWidth - 180;
    const fileTrayY = 200;
    const fileTrayWidth = 140;
    const fileTrayHeight = 110;

    if (
      x >= fileTrayX - 30 &&
      x <= fileTrayX + fileTrayWidth + 30 &&
      y >= fileTrayY - 30 &&
      y <= fileTrayY + fileTrayHeight + 30
    ) {
      return 'filetray';
    }

    // File Drawer (bottom left area)
    const fileDrawerX = 20;
    const fileDrawerY = screenHeight - 100;
    const fileDrawerWidth = 200;
    const fileDrawerHeight = 60;

    if (
      x >= fileDrawerX - 30 &&
      x <= fileDrawerX + fileDrawerWidth + 30 &&
      y >= fileDrawerY - 30 &&
      y <= fileDrawerY + fileDrawerHeight + 30
    ) {
      return 'filedrawer';
    }

    // Recycle Bin (bottom right area)
    const recycleBinX = screenWidth - 100;
    const recycleBinY = screenHeight - 120;
    const recycleBinWidth = 80;
    const recycleBinHeight = 100;

    if (
      x >= recycleBinX - 30 &&
      x <= recycleBinX + recycleBinWidth + 30 &&
      y >= recycleBinY - 30 &&
      y <= recycleBinY + recycleBinHeight + 30
    ) {
      return 'recyclebin';
    }

    return null;
  };

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .minDistance(5) // Require minimum movement before starting drag
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.1, { damping: 15, stiffness: 400 });
      shadowOpacity.value = withTiming(0.6, { duration: 150 });
      
      if (onDragStart) {
        runOnJS(onDragStart)();
      }
    })
    .onUpdate((event) => {
      const newX = x + event.translationX;
      const newY = y + event.translationY;

      // Apply bounds constraints
      const constrainedX = Math.max(
        bounds.minX ?? -50,
        Math.min(bounds.maxX ?? screenWidth - 50, newX)
      );
      const constrainedY = Math.max(
        bounds.minY ?? -50,
        Math.min(bounds.maxY ?? screenHeight - 100, newY)
      );

      translateX.value = constrainedX;
      translateY.value = constrainedY;
    })
    .onEnd(() => {
      isDragging.value = false;
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      shadowOpacity.value = withTiming(0.2, { duration: 150 });

      // Snap to final position
      const finalX = translateX.value;
      const finalY = translateY.value;

      // Check for drop targets
      const dropTarget = checkDropTarget(finalX, finalY);
      
      if (dropTarget && onDrop) {
        runOnJS(onDrop)(dropTarget);
      } else {
        translateX.value = withSpring(finalX, {
          damping: 20,
          stiffness: 300,
        });
        translateY.value = withSpring(finalY, {
          damping: 20,
          stiffness: 300,
        });

        if (onPositionChange) {
          runOnJS(onPositionChange)(finalX, finalY);
        }
      }

      if (onDragEnd) {
        runOnJS(onDragEnd)();
      }
    });

  // Separate tap gesture that only triggers when not dragging
  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onStart(() => {
      // Only allow tap if we're not currently dragging
      if (!isDragging.value) {
        // This will be handled by the child component's onPress
      }
    });

  // Combine gestures with proper priority
  const combinedGesture = Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => {
    const elevation = interpolate(
      isDragging.value ? 1 : 0,
      [0, 1],
      [zIndex, zIndex + 1000]
    );

    return {
      position: 'absolute',
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      zIndex: elevation,
      shadowOpacity: shadowOpacity.value,
      shadowOffset: {
        width: isDragging.value ? 6 : 2,
        height: isDragging.value ? 12 : 4,
      },
      shadowRadius: isDragging.value ? 16 : 6,
      elevation: elevation,
    };
  });

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}