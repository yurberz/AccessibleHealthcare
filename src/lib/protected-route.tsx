import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../core/constants/colors';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to auth page if not authenticated
      navigation.navigate('Auth' as never);
    }
  }, [user, isLoading, navigation]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Only render children if authenticated
  return user ? <>{children}</> : null;
};

// For web routes that need to be protected (using switch/router)
export function ProtectedRouteComponent({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    // This would need custom Route component based on the router used
    // For React Navigation, the redirect logic is in the effect above
    return null;
  }

  return <Component />;
}