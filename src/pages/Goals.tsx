import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Goal, GoalWCategory } from '../types/schemas';
import { findAllGoals } from '../api/crud/goals';
import GoalCard from '../components/cards/Goal';
import Loading from './Loading';
import EmptyContent from '../components/EmptyContent';
import AddEditGoalModal from '../components/modals/AddEditGoal';
import framework from '../styles/framework';
import { defaultGoal } from '../constants/formValues';
import { omit } from '../misc/helpers';
import FloatingButton from '../components/FloatingButton';
import Variables from '../styles/variables';

const Goals: React.FC = (): React.JSX.Element => {
  const [goals, setGoals] = useState<GoalWCategory[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const data = await findAllGoals();
      setGoals(data);
    } catch (error) {
      console.error('[GOALS] Failed to load goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await findAllGoals();
      setGoals(data);
    } catch (e) {
      console.error('[GOALS] refresh error', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onEdit = (goal: GoalWCategory) => {
    setSelectedGoal(omit(goal, ['categoryName', 'categoryColor']));
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  if (isLoading) return <Loading />;

  if (!goals.length) {
    return (
      <>
        <EmptyContent
          message="There are no goals yet"
          buttonText="Add your first goal"
          onButtonPress={() => setSelectedGoal(defaultGoal)}
        />
        {selectedGoal && (
          <AddEditGoalModal
            visible
            onClose={() => setSelectedGoal(null)}
            onSave={fetchGoals}
            initialGoal={selectedGoal}
          />
        )}
      </>
    );
  }

  return (
    <View style={[framework.bgBackground, framework.flexOne]}>
      <FlatList
        data={goals}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={[framework.py2]}
        style={[framework.px2]}
        renderItem={({ item }) => (
          <GoalCard
            record={item}
            onEdit={() => onEdit(item)}
            onSuccess={fetchGoals}
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

      {selectedGoal && (
        <AddEditGoalModal
          visible
          onClose={() => setSelectedGoal(null)}
          onSave={fetchGoals}
          initialGoal={selectedGoal}
        />
      )}

      <FloatingButton
        msg='+ Add Goal'
        action={() => setSelectedGoal(defaultGoal)}
        right={8}
        bottom={8}
      />
    </View>
  );
};

export default Goals;
