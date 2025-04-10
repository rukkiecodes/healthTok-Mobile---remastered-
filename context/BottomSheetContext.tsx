import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, View, StyleSheet, TouchableWithoutFeedback, Easing, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { dark, light } from '@/utils/colors';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/constants/Screen';
import { AntDesign } from '@expo/vector-icons';

type BottomSheetContextType = {
  openSheet: (renderContent: () => React.ReactNode, height?: string | number, showHead?: boolean) => void;
  closeSheet: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const useBottomSheet = (): BottomSheetContextType => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [renderContent, setRenderContent] = useState<() => React.ReactNode>(() => null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetHeight, setSheetHeight] = useState<'80%' | string | number>('80%');
  const [head, setHead] = useState<boolean>(true);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current; // Start below the screen

  const openSheet = useCallback((renderContentFn: () => React.ReactNode, height: string | number = '80%', showHead: boolean = true) => {
    setRenderContent(() => renderContentFn);
    setSheetHeight(height);
    setIsSheetOpen(true);
    setHead(showHead);

    // Slide up the view
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const closeSheet = useCallback(() => {
    // Slide down the view
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setIsSheetOpen(false)); // Set isSheetOpen to false after the animation
  }, [translateY]);

  return (
    <BottomSheetContext.Provider value={{ openSheet, closeSheet }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {children}

        {/* Render the blurry backdrop when the sheet is open */}
        {isSheetOpen && (
          <TouchableWithoutFeedback onPress={closeSheet}>
            <BlurView
              intensity={5}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          </TouchableWithoutFeedback>
        )}

        {/* Animated view sliding from the bottom */}
        <Animated.View
          style={[
            styles.animatedSheet,
            {
              height: sheetHeight,
              transform: [{ translateY }],
            },
          ]}
        >
          {
            head &&
            <View
              style={{
                height: 50,
                alignItems: 'flex-end',
                padding: 10
              }}
            >
              <TouchableOpacity
                onPress={closeSheet}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <AntDesign name='close' size={20} color={dark} />
              </TouchableOpacity>
            </View>
          }

          {renderContent && renderContent()}
        </Animated.View>
      </GestureHandlerRootView>
    </BottomSheetContext.Provider>
  );
};

const styles = StyleSheet.create({
  animatedSheet: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: 'hidden',
    backgroundColor: light,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
});
