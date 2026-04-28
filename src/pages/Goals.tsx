import React, { useState } from 'react';
import { Goal } from '../types/schemas';
import Loading from './Loading';
import EmptyContent from '../components/EmptyContent';
import AddEditGoalModal from '../components/modals/AddEditGoal';
import { defaultGoal } from '../constants/formValues';
import FloatingButton from '../components/FloatingButton';
import { useGetPaginatedGoals } from '../features/goals';
import { useOffsetContext } from '../contexts/OffsetProvider';
import { QueryKey } from '../types/variables';
import PageHolder from '../layouts/PageHolder';
import GoalsList from '../components/lists/Goals';

const Goals: React.FC = (): React.JSX.Element => {
  const key: QueryKey[] = ["goals"]
  const { data, isLoading, isFetching, refetch, fetchNextPage, hasNextPage } = useGetPaginatedGoals({ limit: 5, key });
  const goals = data?.pages?.flatMap(page => page.data) || [];

  const { resetOffsetUnit } = useOffsetContext()
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const onRefetch = () => {
    resetOffsetUnit(key)
    refetch()
  }

  const handleAddGoal = () => {
    setSelectedGoal(defaultGoal);
  };

  const handleCloseModel = () => {
    setSelectedGoal(null);
  }

  if (isLoading) return <Loading />;

  if (!goals.length) {
    return (
      <React.Fragment>
        <EmptyContent
          message="There are no goals yet"
          buttonText="Add your first goal"
          onButtonPress={handleAddGoal}
        />

        {selectedGoal && (
          <AddEditGoalModal
            queryKey={key}
            visible
            onClose={handleCloseModel}
            initialGoal={selectedGoal}
          />
        )}
      </React.Fragment>
    );
  }

  return (
    <PageHolder>
      <GoalsList
        items={goals}
        setSelectedItem={setSelectedGoal}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
        onRefetch={onRefetch}
        hasNextPage={hasNextPage}
        queryKey={key} />

      {selectedGoal && (
        <AddEditGoalModal
          queryKey={key}
          visible
          onClose={handleCloseModel}
          initialGoal={selectedGoal}
        />
      )}

      <FloatingButton
        msg='+ Add Goal'
        action={handleAddGoal}
        right={8}
        bottom={8}
      />
    </PageHolder>
  );
};

export default Goals;
