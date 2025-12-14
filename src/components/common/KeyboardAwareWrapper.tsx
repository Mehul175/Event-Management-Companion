/**
 * Purpose: Keyboard-aware wrapper that automatically adjusts scroll position when inputs are focused.
 * Author: EventCompanion Team
 * Responsibility: Handle keyboard appearance and scroll to focused input fields.
 */

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  TextInput,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms, ScaledSheet } from 'react-native-size-matters';
import { isAndroid, getScreenHeight } from '../../utils/responsive';

interface KeyboardAwareWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollViewProps?: ScrollViewProps;
  headerHeight?: number;
}

export type KeyboardAwareScrollViewRef = ScrollView & {
  scrollToFocusedInput: (
    inputRef: React.RefObject<TextInput>,
    offset?: number,
  ) => void;
};

const KeyboardAwareWrapper = forwardRef<
  KeyboardAwareScrollViewRef,
  KeyboardAwareWrapperProps
>(
  (
    {
      children,
      style = {},
      contentContainerStyle = {},
      scrollViewProps = {},
      headerHeight = ms(30),
    },
    ref,
  ) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    const [currentScrollY, setCurrentScrollY] = useState<number>(0);
    const windowHeight = getScreenHeight();
    const insets = useSafeAreaInsets();

    // Dynamic keyboardVerticalOffset based on insets and header height
    const keyboardVerticalOffset = insets.top + headerHeight;

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        !isAndroid() ? 'keyboardWillShow' : 'keyboardDidShow',
        (e) => {
          setKeyboardHeight(e.endCoordinates.height);
        },
      );

      const keyboardDidHideListener = Keyboard.addListener(
        !isAndroid() ? 'keyboardWillHide' : 'keyboardDidHide',
        () => {
          setKeyboardHeight(0);
        },
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);

    const scrollToFocusedInput = (
      inputRef: React.RefObject<TextInput>,
      extraOffset = ms(50),
    ) => {
      if (!inputRef.current || !scrollViewRef.current) return;

      InteractionManager.runAfterInteractions(() => {
        inputRef.current?.measure((x, y, width, height, pageX, pageY) => {
          if (!keyboardHeight) return;

          const visibleArea =
            windowHeight - keyboardHeight - keyboardVerticalOffset;
          const inputBottom = pageY + height;
          const hiddenAmount = inputBottom - visibleArea;

          if (hiddenAmount > 0) {
            // Adjust for current scroll position
            const scrollTo = currentScrollY + hiddenAmount + extraOffset;
            scrollViewRef.current?.scrollTo({
              y: Math.max(0, scrollTo),
              animated: true,
            });
          }
        });
      });
    };

    React.useImperativeHandle(ref, () => {
      if (!scrollViewRef.current) return null as any;
      return Object.assign(scrollViewRef.current, {
        scrollToFocusedInput,
      });
    });

    return (
      <KeyboardAvoidingView
        style={[styles.container, style]}
        behavior={!isAndroid() ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.contentContainer,
            contentContainerStyle,
            { paddingBottom: ms(50) },
          ]}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          onScroll={(event) =>
            setCurrentScrollY(event.nativeEvent.contentOffset.y)
          }
          scrollEventThrottle={16}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  },
);

KeyboardAwareWrapper.displayName = 'KeyboardAwareWrapper';

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default KeyboardAwareWrapper;
