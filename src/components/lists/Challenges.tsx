import React, { useCallback } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import framework from '../../styles/framework'
import { RefreshControl } from 'react-native'
import Variables from '../../styles/variables'
import LoadingElement from '../LoadingElement'
import {  Challenge } from '../../types/schemas'
import { EntityListProps } from '../../types/components'
import ChallengeCard from '../cards/Challenge'

const ChallengesList: React.FC<EntityListProps<Challenge, Challenge>> = ({ fetchNextPage, items: challenges, isFetching, onRefetch, hasNextPage, queryKey: key, setSelectedItem: setSelectedChallenge }): React.JSX.Element => {
  const onEdit = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetching, hasNextPage, fetchNextPage]);

  return (
    <FlatList
      data={challenges}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={[framework.py2]}
      style={[framework.px2]}
      renderItem={({ item }) => (
        <ChallengeCard
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

export default ChallengesList