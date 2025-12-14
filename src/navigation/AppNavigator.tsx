/**
 * Purpose: Configure app navigation flows.
 * Author: EventCompanion Team
 * Responsibility: Switch between auth and main stacks based on session.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import EventsListScreen from '../screens/events/EventsListScreen';
import EventDetailScreen from '../screens/events/EventDetailScreen';
import AttendeesScreen from '../screens/attendees/AttendeesScreen';
import { RootStackParamList } from './types';
import { useAppSelector } from '../hooks/useRedux';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Events" component={EventsListScreen} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
            <Stack.Screen name="Attendees" component={AttendeesScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
