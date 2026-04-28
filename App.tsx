import React from 'react';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { NavigationContainer } from '@react-navigation/native';
import OffsetProvider from './src/contexts/OffsetProvider';
import ReactQueryProvider from './src/contexts/ReactQueryProvider';
import { PaperProvider } from "react-native-paper"
import AppProvider from './src/contexts/AppProvider';

export default function App() {
  return (
    <ReactQueryProvider>
      <PaperProvider>
        <AppProvider>
          <OffsetProvider>
            <NavigationContainer>
              <DrawerNavigator />
            </NavigationContainer>
          </OffsetProvider>
        </AppProvider>
      </PaperProvider>
    </ReactQueryProvider>
  );
}
