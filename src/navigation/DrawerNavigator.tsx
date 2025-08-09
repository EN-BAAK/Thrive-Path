import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import colors from '../styles/colors';
import Goals from '../pages/Goals';
import Categories from '../pages/Categories';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Goals"
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.background,
        drawerActiveTintColor: colors.primary,
      }}
    >
      <Drawer.Screen name="Goals" component={Goals} />
      <Drawer.Screen name="Categories" component={Categories} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
