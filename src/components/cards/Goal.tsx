import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from "react-native-vector-icons/AntDesign"
import { CardProps } from '../../types/cards';
import { GoalWCategory } from '../../types/schemas';
import { formatDate } from '../../misc/helpers';
import colors from '../../styles/colors';
import framework from '../../styles/framework';
import { deleteGoal, updateGoalStatusById, updateIsImportantById } from '../../api/crud/goals';
import Variables from '../../styles/variables';
import { Status } from '../../types/variables';

const statusColors: Record<NonNullable<GoalWCategory['status']>, string> = {
  PENDING: colors.warning,
  COMPLETED: colors.success,
  CANCELED: colors.danger,
};
const statusList = [Status.PENDING, Status.COMPLETED, Status.CANCELED];

const GoalCard: React.FC<CardProps<GoalWCategory>> = ({ record: goal, onEdit, onSuccess }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);

  const statusColor = goal.status ? statusColors[goal.status] : colors.secondary;

  const handleDelete = async () => {
    try {
      await deleteGoal(goal.id);
      onSuccess?.();
    } catch {
      console.log('[Goal] Failed to delete the goal');
    } finally {
      setMenuVisible(false);
    }
  };

  const handleIsImportantToggle = async () => {
    try {
      await updateIsImportantById(goal.id, !goal.isImportant)
      onSuccess?.()
    } catch {
      console.log('[Goal] Failed to update the goal important status');
    }
  }

  const handleChangeStatus = async (status: Status) => {
    try {
      await updateGoalStatusById(goal.id, status)
      onSuccess?.()
    } catch {
      console.log('[Goal] Failed to update the goal status');
    }
  }

  return (
    <View style={[framework.card, framework.bgBackground, framework.p0, framework.overflowHidden]}>
      <View style={[styles.categoryBar, framework.h100, framework.absolute, framework.top0, framework.left0, { backgroundColor: goal.categoryColor }]} />

      <LinearGradient
        colors={[goal.categoryColor, `${goal.categoryColor}99`]}
        style={[framework.p4, framework.pb2]}
      >
        <View style={[framework.flexRow, framework.justifyBetween]}>
          <Text style={[framework.fontBold, framework.textLg, framework.reversedText]}>
            {goal.name}
          </Text>

          <View style={[framework.flexRow, framework.alignCenter, framework.justifyBetween, framework.gap3]}>
            <TouchableOpacity onPress={handleIsImportantToggle}>
              <AntDesign
                name={goal.isImportant ? "star" : "staro"}
                size={16}
                color={colors.warning}
                style={[framework.ml2, framework.mt1]}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMenuVisible(prev => !prev)} hitSlop={10}>
              <FontAwesome5 name="ellipsis-v" size={16} color={Variables.reversedTextColor} />
            </TouchableOpacity>

            {menuVisible && (
              <View style={[framework.bgLight, framework.rounded, framework.shadowLight, framework.absolute, framework.top0, framework.right4, framework.overflowHidden]}>
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
        <Text style={[framework.mt1, framework.textSm, framework.reversedText]}>
          {goal.categoryName}
        </Text>

        {goal.status && (
          <TouchableOpacity
            onPress={() => setStatusMenuVisible(true)}
            style={[styles.statusBadge, framework.mt2, framework.px3, framework.roundedPill, { backgroundColor: statusColor }]}
          >
            <Text style={[framework.textXs, framework.reversedText]}>{goal.status}</Text>
          </TouchableOpacity>
        )}

        <Modal
          visible={statusMenuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setStatusMenuVisible(false)}
        >
          <TouchableOpacity
            style={[framework.bgLayout, framework.flexOne, framework.flexCenter]}
            activeOpacity={1}
            onPressOut={() => setStatusMenuVisible(false)}
          >
            <View style={[styles.statusMenu, framework.bgBackground, framework.py2, framework.rounded, framework.shadowStrong]}>
              {statusList.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[framework.py3, framework.px5, status === goal.status && framework.bgLightMain]}
                  onPress={() => handleChangeStatus(status)}
                >
                  <Text style={status === goal.status && framework.textMain}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </LinearGradient>

      <View style={[framework.p3, framework.pt2]}>
        {goal.description && (
          <Text style={[framework.mb3, framework.textMuted]}>{goal.description}</Text>
        )}

        <View style={[framework.flexRow, framework.justifyBetween]}>
          <View style={[framework.bgWarning, framework.py1, framework.px3, framework.flexRow, framework.alignCenter, framework.gap2, framework.roundedPill]}>
            <FontAwesome5 name="star" size={14} color={Variables.reversedTextColor} />

            <Text style={[framework.fontBold, framework.textSm, framework.reversedText]}>
              {goal.points} pts
            </Text>
          </View>

          <View style={[framework.bgInfo, framework.py1, framework.px3, framework.flexRow, framework.alignCenter, framework.gap2, framework.roundedPill]}>
            <FontAwesome5 name="clock" size={14} color={Variables.reversedTextColor} />
            <Text style={[framework.textSm, framework.fontBold, framework.reversedText]}>
              {formatDate(goal.deadline)}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.footer, framework.py2, framework.px4]}>
        <Text style={[framework.textXs, framework.textMuted]}>
          {formatDate(goal.updatedAt)}
        </Text>
      </View>
    </View>
  );
};

export default GoalCard;

const styles = StyleSheet.create({
  categoryBar: {
    width: 5,
    zIndex: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightGray,
  },
  menuItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGray,
  },
  statusMenu: {
    width: 200,
  }
});