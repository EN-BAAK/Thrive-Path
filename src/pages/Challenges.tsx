import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Challenge } from '../types/schemas';
import Loading from './Loading';
import EmptyContent from '../components/EmptyContent';
import framework from '../styles/framework';
import { defaultChallenge } from '../constants/formValues';
import FloatingButton from '../components/FloatingButton';
import Variables from '../styles/variables';
import ChallengeCard from '../components/cards/Challenge';
import AddEditChallengeModal from '../components/modals/AddEditChallenge';
import { findAllChallenges } from '../api/crud/challenges';

const Challenges: React.FC = (): React.JSX.Element => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      const data = await findAllChallenges();
      setChallenges(data);
    } catch (error) {
      console.error('[CHALLENGES] Failed to load challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await findAllChallenges();
      setChallenges(data);
    } catch (e) {
      console.error('[CHALLENGES] refresh error', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, []);

  if (isLoading) return <Loading />;

  if (!challenges.length) {
    return (
      <>
        <EmptyContent
          message="No challenges yet"
          buttonText="Add your first challenge"
          onButtonPress={() => setSelectedChallenge(defaultChallenge)}
        />
        {selectedChallenge && (
          <AddEditChallengeModal
            visible
            onClose={() => setSelectedChallenge(null)}
            onSave={fetchChallenges}
            initialChallenge={selectedChallenge}
          />
        )}
      </>
    );
  }

  return (
    <View style={[framework.bgBackground, framework.flexOne]}>
      <FlatList
        data={challenges}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={[framework.py2]}
        style={[framework.px2]}
        renderItem={({ item }) => (
          <ChallengeCard
            record={item}
            onEdit={() => setSelectedChallenge(item)}
            onSuccess={fetchChallenges}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Variables.mainColor}
          />
        }
      />

      {selectedChallenge && (
        <AddEditChallengeModal
          visible
          onClose={() => setSelectedChallenge(null)}
          onSave={fetchChallenges}
          initialChallenge={selectedChallenge}
        />
      )}

      <FloatingButton
        msg='+ Add Challenge'
        action={() => setSelectedChallenge(defaultChallenge)}
        right={8}
        bottom={8}
      />
    </View>
  );
};

export default Challenges;
