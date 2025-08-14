import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { TaskWithCategoryAndSubtasks, Task } from '../types/schemas';
import framework from '../styles/framework';
import colors from '../styles/colors';
import Loading from './Loading';
import EmptyContent from '../components/EmptyContent';
import TaskCard from '../components/cards/Task';
import { findAllTasks } from '../api/crud/tasks';
import AddEditTaskModal from '../components/modals/AddEditTask';
import { defaultTask } from '../constants/formValues';
import { omit } from '../misc/helpers';
import FloatingButton from '../components/FloatingButton';

const Tasks: React.FC = (): React.JSX.Element => {
  const [tasks, setTasks] = useState<TaskWithCategoryAndSubtasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await findAllTasks();
      setTasks(data);
    } catch (e) {
      console.log('[Tasks] load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await findAllTasks();
      setTasks(data);
    } catch (e) {
      console.log('[Tasks] refresh error', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleAddTask = () => {
    setSelectedTask(defaultTask);
  };

  const onEdit = (task: TaskWithCategoryAndSubtasks) => {
    setSelectedTask(omit(task, ['categoryName', 'categoryColor', "subtasks"]));
  };

  if (loading) return <Loading />;

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
            onClose={() => setSelectedTask(null)}
            onSave={load}
            initialTask={selectedTask}
          />
        )}
      </View>
    );
  }

  return (
    <View style={[framework.bgBackground, framework.flexOne]}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[framework.py2]}
        style={[framework.px2]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <TaskCard
            record={item}
            onEdit={() => onEdit(item)}
            onSuccess={load}
          />
        )}
      />

      {selectedTask && (
        <AddEditTaskModal
          visible
          onClose={() => setSelectedTask(null)}
          onSave={load}
          initialTask={selectedTask}
        />
      )}

      <FloatingButton
        msg='Add task'
        action={() => setSelectedTask(defaultTask)}
        right={8}
        bottom={8}
      />
    </View>
  );
};

export default Tasks;
