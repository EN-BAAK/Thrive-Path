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
import { RepeatInterval } from '../../types/variables';
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
                  <Text style={framework.text}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={[styles.menuItem, framework.py2, framework.px4]}>
                  <Text style={framework.text}>Delete</Text>
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

      {habit.repeatInterval && (
        <View style={[framework.flexRow, framework.alignCenter, framework.p3]}>
          <FontAwesome5 name="redo-alt" size={12} color={colors.muted} style={framework.mr2} />
          <Text style={[framework.textSm, { color: colors.dark }]}>
            {getRepeatInfo()}
          </Text>
        </View>
      )}

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
