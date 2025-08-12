import React, { useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { Goal, GoalWCategory } from '../types/schemas';
import { findAllGoals } from '../api/crud/goals';
import GoalCard from '../components/cards/Goal';
import Loading from './Loading';
import EmptyContent from '../components/EmptyContent';
import AddEditGoalModal from '../components/modals/AddEditGoal';
import framework from '../styles/framework';
import { defaultGoal } from '../constants/formValues';
import { omit } from '../misc/helpers';

const Goals: React.FC = (): React.JSX.Element => {
  const [goals, setGoals] = useState<GoalWCategory[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
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
    <View style={[framework.flexOne]}>
      <ScrollView
        style={[framework.px2]}
        contentContainerStyle={[framework.py2]}
      >
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            record={goal}
            onEdit={() => onEdit(goal)}
            onSuccess={fetchGoals}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          framework.bgPrimary,
          framework.px4,
          framework.py2,
          framework.rounded,
          framework.absolute,
          framework.bottom1,
          framework.right1,
        ]}
        onPress={() => setSelectedGoal(defaultGoal)}
      >
        <Text style={[framework.textWhite, framework.fontBold]}>
          + Add Goal
        </Text>
      </TouchableOpacity>

      {selectedGoal && (
        <AddEditGoalModal
          visible
          onClose={() => setSelectedGoal(null)}
          onSave={fetchGoals}
          initialGoal={selectedGoal}
        />
      )}
    </View>
  );
};

export default Goals;
