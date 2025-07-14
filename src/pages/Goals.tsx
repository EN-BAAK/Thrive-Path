import React, { useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { Goal } from '../types/schemas';
import { getGoals, createGoal, updateGoal } from '../api/crud/goals';
import GoalCard from '../components/cards/Goal';
import Loading from './Loading';
import EmptyContent from '../components/EmptyContent';
import AddEditGoalModal from '../components/modals/AddEditGoal';
import framework from '../styles/framework';

const defaultGoal: Goal = {
  id: -1,
  name: "",
  description: "",
  points: 0,
  deadline: new Date(Date.now()).toISOString(),
  flag: false,
  createdAt: new Date(Date.now()).toISOString(),
  updatedAt: new Date(Date.now()).toISOString(),
}

const Goals: React.FC = (): React.JSX.Element => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      setIsLoading(true)
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      console.error('[GOALS] Failed to load goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGoal = async (goal: Goal) => {
    try {
      if (!selectedGoal) return
      if (selectedGoal.id === -1)
        await createGoal(goal);
      else
        await updateGoal(selectedGoal.id, goal)

      fetchGoals();
    } catch (error) {
      console.error('[GOALS] Failed to save goal:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  if (isLoading) return <Loading />;

  if (!goals.length)
    return (
      <>
        <EmptyContent
          message="There is no goals yet"
          buttonText="Add your first goal"
          onButtonPress={() => setSelectedGoal(defaultGoal)}
        />
        <AddEditGoalModal
          visible={selectedGoal ? true : false}
          onClose={() => setSelectedGoal(null)}
          onSave={handleSaveGoal}
          initialGoal={selectedGoal!}
        />
      </>
    );

  return (
    <View style={[framework.flexOne]}>
      <ScrollView style={[framework.px2]} contentContainerStyle={[framework.py2]}>
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            record={goal}
            onEdit={() => setSelectedGoal(goal)}
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
        <Text style={[framework.textWhite, framework.fontBold]}>+ Add Goal</Text>
      </TouchableOpacity>

      <AddEditGoalModal
        visible={selectedGoal ? true : false}
        onClose={() => setSelectedGoal(null)}
        onSave={handleSaveGoal}
        initialGoal={selectedGoal!}
      />
    </View>
  );
};

export default Goals;
