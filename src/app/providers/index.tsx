import React, { ReactNode } from 'react';
import { AccessibilityProvider } from './accessibility-provider';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: ProvidersProps) => {
  return (
    <AccessibilityProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AccessibilityProvider>
  );
};
