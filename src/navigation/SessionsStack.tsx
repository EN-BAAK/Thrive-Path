import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SessionsMain from '../pages/Sessions';
import Countdown from '../pages/Countdown';

const Stack = createNativeStackNavigator();

const SessionsStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="SessionsMain" component={SessionsMain} />
      <Stack.Screen name="Countdown" component={Countdown} />
    </Stack.Navigator>
  );
};

export default SessionsStack;
