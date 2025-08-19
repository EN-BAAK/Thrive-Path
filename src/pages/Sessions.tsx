import React from 'react';
import { View } from 'react-native';
import SessionCard from '../components/cards/Session';
import framework from '../styles/framework';

const Sessions: React.FC = (): React.JSX.Element => {
  return (
    <View style={[framework.bgBackground, framework.p2, framework.flexOne]}>
      <View style={[framework.flexRow, framework.justifyBetween, framework.flexWrap]}>
        <SessionCard
          title="Countdown"
          description="Stay focused with a timer that counts down."
          icon="hourglass-half"
          colors={['#ff6a00', '#ee0979']}
          navigateTo="Countdown"
        />

        <SessionCard
          title="Countup"
          description="Track how long you can keep going."
          icon="stopwatch"
          colors={['#43cea2', '#185a9d']}
          navigateTo="Countup"
        />
      </View>
    </View>
  );
};

export default Sessions;