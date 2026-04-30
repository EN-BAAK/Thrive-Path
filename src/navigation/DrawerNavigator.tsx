import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Goals from '../pages/Goals';
import Categories from '../pages/Categories';
import Variables from '../styles/variables';
import framework from '../styles/framework';
import Tasks from '../pages/Tasks';
import Challenges from '../pages/Challenges';
import Logo from "../assets/images/logo.png"
import { Image, StyleSheet, View } from 'react-native';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[framework.bgBackground, framework.flexOne]}
    >
      <View style={[framework.py5, framework.flexCenter]}>
        <Image source={Logo} style={style.image} />
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Goals"
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerStyle: [framework.bgMain],
        headerTintColor: Variables.reversedTextColor,
        drawerActiveTintColor: Variables.mainColor,
      }}
    >
      <Drawer.Screen name="Goals" component={Goals} />
      <Drawer.Screen name="Categories" component={Categories} />
      <Drawer.Screen name="Tasks" component={Tasks} />
      <Drawer.Screen name="Challenges" component={Challenges} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const style = StyleSheet.create({
  image: {
    width: 180,
    height: 200,
    resizeMode: 'cover',
  }
})