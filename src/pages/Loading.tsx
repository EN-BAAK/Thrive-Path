import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import framework from '../styles/framework';
import colors from '../styles/colors';

const Loading = (): React.ReactNode => {
  return (
    <View style={[framework.flexOne, framework.flexCenter]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default Loading;