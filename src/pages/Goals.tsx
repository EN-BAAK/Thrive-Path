import React, { useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { Goal } from '../types/schemas';
import { getGoals, createGoal } from '../api/crud/goals';
import GoalCard from '../components/cards/Goal';
import Loading from './Loading';
import EmptyContent from '../components/EmptyContent';
import AddEditGoalModal from '../components/modals/AddEditGoal';
import framework from '../styles/framework';

const Goals: React.FC = (): React.JSX.Element => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
      await createGoal(goal);
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
          onButtonPress={() => setShowModal(true)}
        />
        <AddEditGoalModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveGoal}
        />
      </>
    );

  return (
    <View style={[framework.flexOne]}>
      <ScrollView style={[framework.px2]} contentContainerStyle={[framework.py2]}>
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
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
        onPress={() => setShowModal(true)}
      >
        <Text style={[framework.textWhite, framework.fontBold]}>+ Add Goal</Text>
      </TouchableOpacity>

      <AddEditGoalModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveGoal}
      />
    </View>
  );
};

export default Goals;
