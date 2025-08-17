import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { CardProps } from '../../types/cards';
import { HabitWithCategory } from '../../types/schemas';
import colors from '../../styles/colors';
import framework from '../../styles/framework';
import Variables from '../../styles/variables';
import { deleteHabit } from '../../api/crud/habits';
import { formatDate } from '../../misc/helpers';
import { HabitType, RepeatInterval } from '../../types/variables';
import { weekdays } from '../../misc/global';

const HabitCard: React.FC<CardProps<HabitWithCategory>> = ({ record: habit, onEdit, onSuccess }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteHabit(habit.id);
      onSuccess?.();
    } catch {
      console.log('[Habit] Failed to delete habit');
    } finally {
      setMenuVisible(false);
    }
  };

  const isGoodHabit = habit.habitType === HabitType.GOOD;

  const winButtonColor = isGoodHabit ? colors.success : colors.danger;
  const loseButtonColor = isGoodHabit ? colors.danger : colors.success;

  const winLabel = isGoodHabit ? `Do it` : `Resist it`;
  const loseLabel = isGoodHabit ? `Skip it` : `Do it`;

  const getRepeatInfo = () => {
    if (!habit.repeatInterval) return 'One-time';

    switch (habit.repeatInterval) {
      case RepeatInterval.DAILY:
        return 'Daily';
      case RepeatInterval.WEEKLY:
        return `Weekly on ${weekdays.filter(d => d.value === habit.repeatWeekDay)[0].label ?? 'N/A'}`;
      case RepeatInterval.MONTHLY:
        return `Monthly on day ${habit.repeatMonthDay ?? 'N/A'}`;
      case RepeatInterval.CUSTOM:
        return `Every ${habit.customIntervalDays ?? '?'} days`;
      default:
        return habit.repeatInterval;
    }
  };

  return (
    <View style={[framework.card, framework.bgBackground, framework.p0, framework.overflowHidden]}>
      <LinearGradient colors={[habit.categoryColor || colors.primary, `${habit.categoryColor || colors.primary}99`]}
        style={[framework.p4, framework.pb2]}
      >
        <View style={[framework.flexRow, framework.justifyBetween]}>
          <Text style={[framework.fontBold, framework.textLg, framework.reversedText]}>
            {habit.title}
          </Text>

          <View style={[framework.flexRow, framework.alignCenter, framework.gap3]}>
            <TouchableOpacity onPress={() => setMenuVisible(prev => !prev)} hitSlop={10}>
              <FontAwesome5 name="ellipsis-v" size={16} color={Variables.reversedTextColor} />
            </TouchableOpacity>

            {menuVisible && (
              <View style={[framework.bgBackground, framework.rounded, framework.shadowLight, framework.absolute, framework.top0, framework.right4, framework.overflowHidden]}
              >
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

        {habit.description && (
          <Text style={[framework.mt1, framework.textSm, framework.reversedText]}>
            {habit.description}
          </Text>
        )}
      </LinearGradient>

      <View style={[framework.p3]}>
        <View style={[framework.flexRow, framework.alignCenter, framework.mb2]}>
          <FontAwesome5 name="arrow-up" size={14} color={colors.success} style={framework.mr2} />
          <Text style={[framework.fontBold, { color: colors.success }]}>+{habit.winPoints}</Text>
        </View>

        <View style={[framework.flexRow, framework.alignCenter, framework.mb2]}>
          <FontAwesome5 name="arrow-down" size={14} color={colors.danger} style={framework.mr2} />
          <Text style={[framework.fontBold, { color: colors.danger }]}>-{habit.losePoints}</Text>
        </View>

        {habit.repeatInterval && (
          <View style={[framework.flexRow, framework.alignCenter]}>
            <FontAwesome5 name="redo-alt" size={12} color={colors.muted} style={framework.mr2} />
            <Text style={[framework.textSm, { color: colors.dark }]}>
              {getRepeatInfo()}
            </Text>
          </View>
        )}
      </View>

      <View style={[framework.px3, framework.pb3, framework.flexRow]}>
        <TouchableOpacity style={[framework.mx1, framework.py2, framework.flexOne, framework.roundedMd, { backgroundColor: winButtonColor }]}
        >
          <Text style={[framework.textCenter, framework.fontBold, framework.textSm, framework.reversedText]}>
            {winLabel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[framework.mx1, framework.py2, framework.flexOne, framework.roundedMd, { backgroundColor: loseButtonColor }]}>
          <Text style={[framework.textCenter, framework.fontBold, framework.textSm, framework.reversedText]}>
            {loseLabel}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.footer, framework.py2, framework.px4, framework.flexRow, framework.justifyBetween, framework.alignCenter]}>
        <View style={[framework.flexRow, framework.alignCenter, framework.gap2]}>
          {habit.categoryName && (
            <Text style={[framework.textXs, { color: habit.categoryColor || colors.dark }]}>
              {habit.categoryName}
            </Text>
          )}
          {habit.goalName && (
            <Text style={[framework.textXs, { color: colors.muted }]}>
              🎯 {habit.goalName}
            </Text>
          )}
        </View>
        <Text style={[framework.textXs, framework.textMuted]}>
          {formatDate(habit.updatedAt)}
        </Text>
      </View>
    </View>
  );
};

export default HabitCard;

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightGray,
  },
  menuItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGray,
  },
});
