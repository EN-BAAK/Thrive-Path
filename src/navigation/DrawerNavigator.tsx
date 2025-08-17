import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Goals from '../pages/Goals';
import Categories from '../pages/Categories';
import Variables from '../styles/variables';
import framework from '../styles/framework';
import Tasks from '../pages/Tasks';
import Habits from '../pages/Habits';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Goals"
      screenOptions={{
        headerStyle: [framework.bgMain],
        headerTintColor: Variables.reversedTextColor,
        drawerActiveTintColor: Variables.mainColor,
        drawerContentContainerStyle: [framework.bgBackground, framework.flexOne]
      }}
    >
      <Drawer.Screen name="Goals" component={Goals} />
      <Drawer.Screen name="Categories" component={Categories} />
      <Drawer.Screen name="Tasks" component={Tasks} />
      <Drawer.Screen name="Habits" component={Habits} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
