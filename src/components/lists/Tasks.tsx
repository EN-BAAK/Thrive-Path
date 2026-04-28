import React, { useCallback } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import framework from '../../styles/framework'
import { RefreshControl } from 'react-native'
import Variables from '../../styles/variables'
import LoadingElement from '../LoadingElement'
import { Task, TaskWithCategoryAndSubtasks } from '../../types/schemas'
import { omit } from '../../misc/helpers'
import { ItemFlatListProps } from '../../types/components'
import TaskCard from '../cards/Task'

const TasksList: React.FC<ItemFlatListProps<TaskWithCategoryAndSubtasks, Task>> = ({ fetchNextPage, items: tasks, isFetching, onRefetch, hasNextPage, queryKey: key, setSelectedItem: setSelectedTask }): React.JSX.Element => {
  const onEdit = (task: TaskWithCategoryAndSubtasks) => {
    setSelectedTask(omit(task, ['categoryName', 'categoryColor']));
  };

  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetching, hasNextPage, fetchNextPage]);

  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={[framework.py2]}
      style={[framework.px2]}
      renderItem={({ item }) => (
        <TaskCard
          record={item}
          queryKey={key}
          onEdit={() => onEdit(item)}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={onRefetch}
          tintColor={Variables.mainColor}
        />
      }
      onEndReached={handleLoadMore}
      ListFooterComponent={
        (isFetching && hasNextPage) ? <LoadingElement styles={[framework.py5]} /> : null
      }
    />
  )
}

export default TasksList