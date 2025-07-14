import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import framework from '../../styles/framework';
import { formatDate } from '../../misc/helpers';
import colors from '../../styles/colors';
import { CardProps } from '../../types/cards';
import { Goal } from '../../types/schemas';
import { deleteGoal, updateGoal } from '../../api/crud/goals';

const GoalCard: React.FC<CardProps<Goal>> = ({ record: goal, onEdit, onSuccess }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const changeCheck = async () => {
    const isChecked = !goal.flag
    try {
      await updateGoal(goal.id, { flag: isChecked })
      onSuccess?.()
    } catch {
      console.log("[Goal] Failed to update flag")
    } finally {
      setMenuVisible(false);
    }
  };

  const handleEdit = () => {
    setMenuVisible(false);
    onEdit?.()
  };

  const handleDelete = async () => {
    try {
      await deleteGoal(goal.id)
      onSuccess?.()
    } catch {
      console.log("[Goal] Failed to delete the goal")
    } finally {
      setMenuVisible(false);
    }
  };

  return (
    <View style={[framework.card, framework.relative]}>
      <View style={[framework.flexRow, framework.gap2, framework.absolute, framework.top2, framework.right2]}>
        <TouchableOpacity
          style={[framework.py2, framework.px2]}
          onPress={changeCheck}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <FontAwesome5
            name={goal.flag ? 'check-circle' : 'circle'}
            size={20}
            color={goal.flag ? colors.success : colors.secondary}
            aria-hidden={true}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[framework.py2, framework.px2]}
          onPress={() => setMenuVisible(prev => !prev)} >
          <FontAwesome5 name="ellipsis-v" size={18} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[
        menuVisible ? framework.dFlex : framework.dNone,
        framework.bgLight,
        framework.mt3,
        framework.rounded,
        framework.shadowLight,
        framework.absolute,
        framework.top5,
        framework.right3,
        framework.indexTop
      ]}
        onPress={() => setMenuVisible(false)}
      >
        <TouchableOpacity onPress={handleEdit} style={[framework.py1, framework.px4, framework.borderBottom1, framework.borderGray]}>
          <Text style={framework.textCenter}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete} style={[framework.py1, framework.px4]}>
          <Text style={framework.textCenter}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <Text style={[framework.fontBold, framework.textLg, framework.textPrimary]}>
        {goal.name}
      </Text>

      {goal.description && (
        <Text style={[framework.mt1, framework.mb3, framework.textMuted]}>
          {goal.description}
        </Text>
      )}

      <View style={[framework.mt2, framework.mb5, framework.py2, framework.flexRow, framework.alignCenter, framework.justifyBetween]}>
        <View style={[framework.alignCenter, framework.flexOne, framework.borderRight]}>
          <FontAwesome5
            name="star"
            size={25}
            color={colors.warning}
            style={framework.mb2}
          />
          <Text style={[framework.fontSemiBold, framework.textXs]}>{goal.points}</Text>
        </View>

        <View style={[framework.alignCenter, framework.flexOne, framework.borderLeft]}>
          <FontAwesome5
            name="clock"
            size={25}
            color={colors.info}
            style={framework.mb2}
          />
          <Text style={[framework.fontSemiBold, framework.textXs]}>{formatDate(goal.deadline)}</Text>
        </View>
      </View>

      <View>
        <Text style={[framework.textXs, framework.textMuted, framework.absolute, framework.right0, framework.bottom0]}>{formatDate(goal.updatedAt)}</Text>
      </View>
    </View>
  );
};

export default GoalCard;
