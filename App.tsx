import React from 'react';
import { View } from 'react-native';
import Goals from './src/pages/Goals';
import framework from './src/styles/framework';

function App(): React.JSX.Element {
  return (
    <View style={[framework.flexOne, framework.bgLight]}>
      <Goals />
    </View>
  );
}

export default App;
