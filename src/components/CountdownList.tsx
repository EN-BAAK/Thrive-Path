// src/components/CountdownList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import framework from '../styles/framework';
import Variables from '../styles/variables';
import { TimerLog } from '../types/schemas';
import { getAllTimerLogsByType } from '../api/crud/timerLogs';

const CountdownList: React.FC = () => {
  const [logs, setLogs] = useState<TimerLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getAllTimerLogsByType('countdown');
        setLogs(data);
      } catch (error) {
        console.error('Error fetching countdown logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <ActivityIndicator size="small" color={Variables.mainColor} style={[framework.mt4]} />;
  }

  if (logs.length === 0) {
    return <Text style={[framework.textCenter, framework.textGray, framework.mt4]}>No countdown logs yet.</Text>;
  }

  return (
    <FlatList
      data={logs}
      keyExtractor={(item) => item.id.toString()}
      style={[framework.w100, framework.mt4]}
      renderItem={({ item }) => (
        <View style={[framework.bgLight, framework.px4, framework.py3, framework.mb2, framework.roundedMd, framework.flexRow, framework.justifyBetween, framework.itemsCenter,]}>
          <View>
            <Text style={[framework.fontBold, framework.textDark]}>{item.duration}</Text>
            <Text style={[framework.textGray, framework.textSm]}>Points: {item.points}</Text>
          </View>
          {item.description && <Text style={[framework.textGray, framework.textSm]}>{item.description}</Text>}
        </View>
      )}
    />
  );
};

export default CountdownList;
