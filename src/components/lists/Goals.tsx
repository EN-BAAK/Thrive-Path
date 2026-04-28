import React, { useCallback } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import framework from '../../styles/framework'
import GoalCard from '../cards/Goal'
import { RefreshControl } from 'react-native'
import Variables from '../../styles/variables'
import LoadingElement from '../LoadingElement'
import { Goal, GoalWCategory } from '../../types/schemas'
import { omit } from '../../misc/helpers'
import { EntityListProps } from '../../types/components'

const GoalsList: React.FC<EntityListProps<GoalWCategory, Goal>> = ({ fetchNextPage, items: goals, isFetching, onRefetch, hasNextPage, queryKey: key, setSelectedItem: setSelectedGoal }): React.JSX.Element => {
  const onEdit = (goal: GoalWCategory) => {
    setSelectedGoal(omit(goal, ['categoryName', 'categoryColor']));
  };

  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetching, hasNextPage, fetchNextPage]);

  return (
    <FlatList
      data={goals}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={[framework.py2]}
      style={[framework.px2]}
      renderItem={({ item }) => (
        <GoalCard
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

export default GoalsList