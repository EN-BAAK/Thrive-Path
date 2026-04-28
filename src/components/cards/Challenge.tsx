import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CardProps } from '../../types/cards';
import { Challenge } from '../../types/schemas';
import colors from '../../styles/colors';
import framework from '../../styles/framework';
import Variables from '../../styles/variables';
import { formatDate } from '../../misc/helpers';
import { useAddStart, useDeleteChallenge, useLoseHeart } from '../../features/challenges';
import { useAppContext } from '../../contexts/AppProvider';
import { Menu } from 'react-native-paper';

const ChallengeCard: React.FC<CardProps<Challenge>> = ({ record: challenge, onEdit, queryKey: key }) => {
  const [actionMenuVisible, setActionMenuVisible] = useState(false);

  const { showWarning } = useAppContext()

  const { mutateAsync: deleteMutateAsync } = useDeleteChallenge({ key })
  const { mutateAsync: loseHeartMutateAsync } = useLoseHeart({ key })
  const { mutateAsync: addStarMutateAsync } = useAddStart({ key })

  const onActionMenuClose = () => {
    setActionMenuVisible(false)
  }

  const onActionMenuOpen = () => {
    setActionMenuVisible(true)
  }

  const handleDelete = async () => {
    showWarning({
      btn2: "delete",
      btn1: "cancel",
      handleBtn2: async () => await deleteMutateAsync(challenge.id),
      message: `Are you sure you want to delete the challenge "${challenge.title}"?`
    })
  };

  const loseHeart = async () => {
    await loseHeartMutateAsync(challenge.id);
  };

  const increaseStars = async () => {
    await addStarMutateAsync(challenge.id);
  };

  const handleEdit = () => {
    onActionMenuClose()
    onEdit && onEdit()
  }

  const isHeartsExists: boolean = Boolean(challenge.maxHearts && challenge.maxHearts > 0);
  const isStarsExists: boolean = Boolean(challenge.maxStars && challenge.maxStars > 0);

  return (
    <View style={[framework.card, framework.bgBackground, framework.p0, framework.indexBehind, framework.overflowHidden]}>
      <LinearGradient
        colors={[colors.primary, `${colors.primary}99`]}
        style={[framework.p4, framework.pb2]}
      >
        <View style={[framework.flexRow, framework.justifyBetween, framework.alignCenter]}>
          <Text style={[framework.fontBold, framework.textLg, framework.reversedText, framework.flexOne]}>
            {challenge.title}
          </Text>

          <Menu
            anchor={
              <TouchableOpacity onPress={onActionMenuOpen} hitSlop={10}>
                <FontAwesome5 name="ellipsis-v" size={16} color={Variables.reversedTextColor} />
              </TouchableOpacity>
            }
            visible={actionMenuVisible}
            onDismiss={onActionMenuClose}
            contentStyle={[framework.bgBackground]}
          >
            <View>
              <TouchableOpacity onPress={handleEdit} style={[framework.py2, framework.px4, framework.borderBottom]}>
                <Text style={[framework.text]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={[framework.py2, framework.px4]}>
                <Text style={[framework.text]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Menu>
        </View>

        {challenge.description && (
          <Text style={[framework.mt1, framework.textSm, framework.reversedText]}>
            {challenge.description}
          </Text>
        )}
      </LinearGradient>

      {isHeartsExists && isStarsExists &&
        <View style={[framework.flexRow, framework.justifyBetween, framework.alignCenter, framework.p3]}>
          {isStarsExists && (
            <View style={[framework.flexRow, framework.alignCenter, framework.flexWrap]}>
              {Array.from({ length: challenge.maxStars || 0 }).map((_, i) => (
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

          {isHeartsExists && (
            <View style={[framework.flexRow, framework.alignCenter, framework.flexWrap]}>
              {Array.from({ length: challenge.maxHearts || 0 }).map((_, i) => (
                <AntDesign
                  key={`heart-${i}`}
                  name="heart"
                  size={16}
                  color={i < (challenge.currentHearts || 0) ? colors.danger : colors.lightGray}
                  style={framework.mr1}
                />
              ))}
            </View>
          )}
        </View>
      }

      <View style={[framework.px3, framework.pb3]}>
        <View style={[framework.flexRow, framework.justifyBetween, framework.alignCenter, framework.mb2]}>
          <Text style={[framework.textSm, framework.textMuted]}>
            {formatDate(challenge.startDate)} → {formatDate(challenge.endDate)}
          </Text>
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