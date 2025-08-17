import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Habit, HabitWithCategory } from '../types/schemas';
import { getHabits } from '../api/crud/habits';
import HabitCard from '../components/cards/Habit';
import Loading from './Loading';
import EmptyContent from '../components/EmptyContent';
import AddEditHabitModal from '../components/modals/AddEditHabit';
import framework from '../styles/framework';
import { defaultHabit } from '../constants/formValues';
import FloatingButton from '../components/FloatingButton';
import Variables from '../styles/variables';
import { omit } from '../misc/helpers';

const Habits: React.FC = (): React.JSX.Element => {
  const [habits, setHabits] = useState<HabitWithCategory[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const data = await getHabits();
      setHabits(data);
    } catch (error) {
      console.error('[HABITS] Failed to load habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await getHabits();
      setHabits(data);
    } catch (e) {
      console.error('[HABITS] refresh error', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onEdit = (habit: HabitWithCategory) => {
    setSelectedHabit(omit(habit, ["categoryName", "categoryColor", "goalName"]))
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  if (isLoading) return <Loading />;

  if (!habits.length) {
    return (
      <React.Fragment>
        <EmptyContent
          message="No habits yet"
          buttonText="Add your first habit"
          onButtonPress={() => setSelectedHabit(defaultHabit)}
        />
        {selectedHabit && (
          <AddEditHabitModal
            visible
            onClose={() => setSelectedHabit(null)}
            onSave={fetchHabits}
            initialHabit={selectedHabit}
          />
        )}
      </React.Fragment>
    );
  }

  return (
    <View style={[framework.bgBackground, framework.flexOne]}>
      <FlatList
        data={habits}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={[framework.py2]}
        style={[framework.px2]}
        renderItem={({ item }) => (
          <HabitCard
            record={item}
            onEdit={() => onEdit(item)}
            onSuccess={fetchHabits}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Variables.mainColor}
          />
        }
      />

      {selectedHabit && (
        <AddEditHabitModal
          visible
          onClose={() => setSelectedHabit(null)}
          onSave={fetchHabits}
          initialHabit={selectedHabit}
        />
      )}

      <FloatingButton
        msg='+ Add Habit'
        action={() => setSelectedHabit(defaultHabit)}
        right={8}
        bottom={8}
      />
    </View>
  );
};

export default Habits;
