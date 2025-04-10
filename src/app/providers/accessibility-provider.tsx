import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AccessibilityInfo, Appearance, useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { typography } from '../../core/constants/typography';

type AccessibilityContextType = {
  isScreenReaderEnabled: boolean;
  fontScale: number;
  reducedMotionEnabled: boolean;
  highContrastEnabled: boolean;
  updateFontScale: (scale: number) => void;
};

const DEFAULT_CONTEXT: AccessibilityContextType = {
  isScreenReaderEnabled: false,
  fontScale: 1,
  reducedMotionEnabled: false,
  highContrastEnabled: false,
  updateFontScale: () => {},
};

const AccessibilityContext = createContext<AccessibilityContextType>(DEFAULT_CONTEXT);

export const useAccessibilitySettings = () => useContext(AccessibilityContext);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [reducedMotionEnabled, setReducedMotionEnabled] = useState(false);
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);

  // Set up event listeners for accessibility features
  useEffect(() => {
    // Screen reader detection
    const screenReaderChangedSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (isEnabled) => {
        setIsScreenReaderEnabled(isEnabled);
      }
    );

    // Font scale detection
    const getFontScale = async () => {
      const scale = await AccessibilityInfo.getTextScaleAsync();
      setFontScale(scale);
    };

    // Reduced motion detection
    const reduceMotionChangedSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => {
        setReducedMotionEnabled(isEnabled);
      }
    );

    // Check initial states
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);
    getFontScale();
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotionEnabled);
    
    // Some platforms support high contrast
    if (AccessibilityInfo.isHighContrastEnabled) {
      AccessibilityInfo.isHighContrastEnabled().then(setHighContrastEnabled);
    }

    return () => {
      screenReaderChangedSubscription.remove();
      reduceMotionChangedSubscription.remove();
    };
  }, []);

  // Update font scale manually if needed
  const updateFontScale = (scale: number) => {
    setFontScale(scale);
  };

  // Update font scale when app comes back to foreground
  useFocusEffect(
    React.useCallback(() => {
      AccessibilityInfo.getTextScaleAsync().then(setFontScale);
      return () => {};
    }, [])
  );

  // Apply global font scaling to our typography constants
  useEffect(() => {
    Object.keys(typography.fontSize).forEach((key) => {
      const size = typography.fontSize[key as keyof typeof typography.fontSize];
      typography.fontSize[key as keyof typeof typography.fontSize] = size * fontScale;
    });
  }, [fontScale]);

  return (
    <AccessibilityContext.Provider
      value={{
        isScreenReaderEnabled,
        fontScale,
        reducedMotionEnabled,
        highContrastEnabled,
        updateFontScale,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
