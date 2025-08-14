import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import framework from '../styles/framework';
import Variables from '../styles/variables';

const Loading = (): React.ReactNode => {
  return (
    <View style={[framework.bgBackground, framework.flexOne, framework.flexCenter]}>
      <ActivityIndicator size="large" color={Variables.mainColor} />
    </View>
  );
};

export default Loading;