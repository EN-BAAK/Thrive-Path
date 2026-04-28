import React, { useState } from 'react';
import { Challenge } from '../types/schemas';
import Loading from './Loading';
import EmptyContent from '../components/EmptyContent';
import { defaultChallenge } from '../constants/formValues';
import FloatingButton from '../components/FloatingButton';
import AddEditChallengeModal from '../components/modals/AddEditChallenge';
import { QueryKey } from '../types/variables';
import PageHolder from '../layouts/PageHolder';
import { useGetPaginatedChallenges } from '../features/challenges';
import { useOffsetContext } from '../contexts/OffsetProvider';
import ChallengesList from '../components/lists/Challenges';

const Challenges: React.FC = (): React.JSX.Element => {
  const key: QueryKey[] = ["challenges"]
  const { data, isLoading, isFetching, refetch, fetchNextPage, hasNextPage } = useGetPaginatedChallenges({ limit: 30, key });
  const challenges = data?.pages?.flatMap(page => page.data) || [];

  const { resetOffsetUnit } = useOffsetContext()
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const onRefetch = () => {
    resetOffsetUnit(key)
    refetch()
  }

  if (isLoading) return <Loading />;

  if (!challenges.length) {
    return (
      <React.Fragment>
        <EmptyContent
          message="No challenges yet"
          buttonText="Add your first challenge"
          onButtonPress={() => setSelectedChallenge(defaultChallenge)}
        />
        {selectedChallenge && (
          <AddEditChallengeModal
            visible
            onClose={() => setSelectedChallenge(null)}
            initialChallenge={selectedChallenge}
            queryKey={key}
          />
        )}
      </React.Fragment>
    );
  }

  return (
    <PageHolder>
      <ChallengesList
        items={challenges}
        setSelectedItem={selectedChallenge}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
        onRefetch={onRefetch}
        hasNextPage={hasNextPage}
        queryKey={key} />

      {selectedChallenge && (
        <AddEditChallengeModal
          visible
          onClose={() => setSelectedChallenge(null)}
          initialChallenge={selectedChallenge}
          queryKey={key}
        />
      )}

      <FloatingButton
        msg='+ Add Challenge'
        action={() => setSelectedChallenge(defaultChallenge)}
        right={8}
        bottom={8}
      />
    </PageHolder>
  );
};

export default Challenges;
