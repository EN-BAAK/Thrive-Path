import React, { useState } from 'react';
import { View } from 'react-native';
import { Task } from '../types/schemas';
import framework from '../styles/framework';
import Loading from './Loading';
import EmptyContent from '../components/EmptyContent';
import AddEditTaskModal from '../components/modals/AddEditTask';
import { defaultTask } from '../constants/formValues';
import FloatingButton from '../components/FloatingButton';
import PageHolder from '../layouts/PageHolder';
import { QueryKey } from '../types/variables';
import { useGetPaginatedTasks } from '../features/tasks';
import { useOffsetContext } from '../contexts/OffsetProvider';
import TasksList from '../components/lists/Tasks';

const Tasks: React.FC = (): React.JSX.Element => {
  const key: QueryKey[] = ["tasks"]
  const { data, isLoading, isFetching, refetch, fetchNextPage, hasNextPage } = useGetPaginatedTasks({ limit: 20, key });
  const tasks = data?.pages?.flatMap(page => page.data) || [];

  const { resetOffsetUnit } = useOffsetContext()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const onRefetch = () => {
    resetOffsetUnit(key)
    refetch()
  }

  const handleAddTask = () => {
    setSelectedTask(defaultTask);
  };

    const handleCloseModel = () => {
    setSelectedTask(null);
  }

  if (isLoading) return <Loading />;

  if (!tasks.length) {
    return (
      <View style={[framework.bgBackground, framework.flexOne]}>
        <EmptyContent
          message="There are no tasks yet"
          buttonText="Create your first task"
          onButtonPress={handleAddTask}
        />

        {selectedTask && (
          <AddEditTaskModal
            visible
            onClose={handleCloseModel}
            initialTask={selectedTask}
            queryKey={key}
          />
        )}
      </View>
    );
  }

  return (
    <PageHolder>
      <TasksList
        items={tasks}
        setSelectedItem={setSelectedTask}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
        onRefetch={onRefetch}
        hasNextPage={hasNextPage}
        queryKey={key} />

      {selectedTask && (
        <AddEditTaskModal
          visible
          onClose={handleCloseModel}
          initialTask={selectedTask}
          queryKey={key}
        />
      )}

      <FloatingButton
        msg='+ Add task'
        action={() => setSelectedTask(defaultTask)}
        right={8}
        bottom={8}
      />
    </PageHolder>
  );
};

export default Tasks;
