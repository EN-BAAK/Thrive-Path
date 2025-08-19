import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CardProps } from '../../types/cards';
import { Challenge } from '../../types/schemas';
import colors from '../../styles/colors';
import framework from '../../styles/framework';
import Variables from '../../styles/variables';
import { addStar, deleteChallenge, deleteHeart, updateChallengeCompletedById } from '../../api/crud/challenges';
import { formatDate } from '../../misc/helpers';

const ChallengeCard: React.FC<CardProps<Challenge>> = ({ record: challenge, onEdit, onSuccess }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteChallenge(challenge.id);
      onSuccess?.();
    } catch {
      console.log('[Challenge] Failed to delete challenge');
    } finally {
      setMenuVisible(false);
    }
  };

  const toggleCompleted = async () => {
    try {
      updateChallengeCompletedById(challenge.id, !challenge.isCompleted)
      onSuccess?.();
    } catch {
      console.log('[Challenge] Failed to toggle completion');
    }
  };

  const loseHeart = async () => {
    await deleteHeart(challenge.id);
    onSuccess?.();
  };

  const increaseStars = async () => {
    await addStar(challenge.id);
    onSuccess?.();
  };

  return (
    <View style={[framework.card, framework.bgBackground, framework.p0, framework.overflowHidden]}>
      <LinearGradient
        colors={[colors.primary, `${colors.primary}99`]}
        style={[framework.p4, framework.pb2]}
      >
        <View style={[framework.flexRow, framework.justifyBetween, framework.alignCenter]}>
          <TouchableOpacity onPress={toggleCompleted} style={[framework.mr2]}>
            <FontAwesome5
              name={challenge.isCompleted ? 'check-circle' : 'circle'}
              size={20}
              color={Variables.reversedTextColor}
            />
          </TouchableOpacity>

          <Text style={[framework.fontBold, framework.textLg, framework.reversedText, framework.flexOne]}>
            {challenge.title}
          </Text>

          <View style={[framework.flexRow, framework.alignCenter, framework.gap3]}>
            <TouchableOpacity onPress={() => setMenuVisible(prev => !prev)} hitSlop={10}>
              <FontAwesome5 name="ellipsis-v" size={16} color={Variables.reversedTextColor} />
            </TouchableOpacity>

            {menuVisible && (
              <View style={[framework.bgBackground, framework.rounded, framework.shadowLight, framework.absolute, framework.top0, framework.right4, framework.overflowHidden]}>
                <TouchableOpacity onPress={onEdit} style={[styles.menuItem, framework.py2, framework.px4]}>
                  <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={[styles.menuItem, framework.py2, framework.px4]}>
                  <Text>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {challenge.description && (
          <Text style={[framework.mt1, framework.textSm, framework.reversedText]}>
            {challenge.description}
          </Text>
        )}
      </LinearGradient>

      <View style={[framework.p3]}>

        {challenge.maxStars && challenge.maxStars > 0 && (
          <View style={[framework.flexRow, framework.alignCenter, framework.mb2, framework.flexWrap]}>
            {Array.from({ length: challenge.maxStars }).map((_, i) => (
              <AntDesign
                key={`star-${i}`}
                name="star"
                size={16}
                color={i < (challenge.currentStars || 0) ? colors.warning : colors.lightGray}
                style={framework.mr1}
              />
            ))}
          </View>
        )}

        {challenge.maxHearts && challenge.maxHearts > 0 && (
          <View style={[framework.flexRow, framework.alignCenter, framework.mb2, framework.flexWrap]}>
            {Array.from({ length: challenge.maxHearts }).map((_, i) => {
              const indexFromRight = (challenge.maxHearts || 0) - 1 - i;
              const isFilled = indexFromRight < (challenge.currentHearts || 0);

              return (
                <AntDesign
                  key={`heart-${i}`}
                  name="heart"
                  size={16}
                  color={isFilled ? colors.lightGray : colors.danger}
                  style={framework.mr1}
                />
              );
            })}
          </View>
        )}

        <View style={[framework.flexRow, framework.alignCenter, framework.mb2]}>
          <FontAwesome5 name="arrow-up" size={12} color={colors.success} style={framework.mr2} />
          <Text style={[framework.textSm, { color: colors.success }]}>+{challenge.points} pts</Text>
        </View>

        <View style={[framework.flexRow, framework.alignCenter]}>
          <FontAwesome5 name="arrow-down" size={12} color={colors.danger} style={framework.mr2} />
          <Text style={[framework.textSm, { color: colors.danger }]}>-{challenge.penaltyPoints} pts</Text>
        </View>
      </View>

      <View style={[framework.px3, framework.pb3]}>
        <View style={[framework.flexRow, framework.justifyBetween, framework.alignCenter, framework.mb2]}>
          <Text style={[framework.textSm, framework.textMuted]}>
            {formatDate(challenge.startDate)} → {formatDate(challenge.endDate)}
          </Text>
          {Boolean(challenge.isCompleted) && (
            <Text style={[framework.fontBold, framework.textSm, framework.textSuccess]}>✔ Completed</Text>
          )}
        </View>

        <View style={[framework.flexRow, framework.gap3]}>
          {challenge.maxHearts && challenge.maxHearts > 0 && (
            <TouchableOpacity onPress={loseHeart} style={[framework.bgDanger, framework.px3, framework.py1, framework.flexOne, framework.rounded]}>
              <Text style={[framework.textCenter, framework.textSm, framework.reversedText]}>Lose Heart</Text>
            </TouchableOpacity>
          )}
          {challenge.maxStars && challenge.maxStars > 0 && (
            <TouchableOpacity onPress={increaseStars} style={[framework.bgSuccess, framework.px3, framework.py1, framework.flexOne, framework.rounded]}>
              <Text style={[framework.textCenter, framework.textSm, framework.reversedText]}>Add Star</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChallengeCard;

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGray,
  },
});
