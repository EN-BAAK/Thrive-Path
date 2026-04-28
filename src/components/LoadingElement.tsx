import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import framework from '../styles/framework';
import Variables from '../styles/variables';
import { LoadingElementProps } from '../types/components';

const LoadingElement: React.FC<LoadingElementProps> = ({ styles, color = Variables.mainColor, size = "large" }): React.ReactNode => {
  return (
    <View style={[framework.bgBackground, framework.flexCenter, styles]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default LoadingElement;