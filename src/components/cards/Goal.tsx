import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from "react-native-vector-icons/AntDesign"
import { CardProps } from '../../types/cards';
import { GoalWCategory } from '../../types/schemas';
import { formatDate } from '../../misc/helpers';
import colors from '../../styles/colors';
import framework from '../../styles/framework';
import Variables from '../../styles/variables';
import { Status } from '../../types/variables';
import { useDeleteGoal, useUpdateIsImportantGoal, useUpdateStatusGoal } from '../../features/goals';
import { Menu } from "react-native-paper"
import ModalHolder from '../../layouts/ModalHolder';
import { useAppContext } from '../../contexts/AppProvider';

const statusColors: Record<NonNullable<GoalWCategory['status']>, string> = {
  PENDING: colors.warning,
  COMPLETED: colors.success,
  CANCELED: colors.danger,
};
const statusList = [Status.PENDING, Status.COMPLETED, Status.CANCELED];

const GoalCard: React.FC<CardProps<GoalWCategory>> = ({ record: goal, onEdit, queryKey: key }) => {
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);

  const { showWarning } = useAppContext()

  const { mutateAsync: deleteMutateAsync } = useDeleteGoal({ key })
  const { mutateAsync: isImportantUpdatingMutateAsync } = useUpdateIsImportantGoal({ key })
  const { mutateAsync: statusUpdatingMutateAsync } = useUpdateStatusGoal({ key })

  const statusColor = goal.status ? statusColors[goal.status] : colors.secondary;

  const onActionMenuClose = () => {
    setActionMenuVisible(false)
  }

  const onActionMenuOpen = () => {
    setActionMenuVisible(true)
  }

  const onStatusMenuClose = () => {
    setStatusMenuVisible(false)
  }

  const onStatusMenuOpen = () => {
    setStatusMenuVisible(true)
  }

  const handleDelete = async () => {
    showWarning({
      btn2: "delete",
      btn1: "cancel",
      handleBtn2: async () => await deleteMutateAsync(goal.id),
      message: `Are you sure you want to delete the goal "${goal.name}"?`
    })
  }

  const handleIsImportantToggle = async () => {
    isImportantUpdatingMutateAsync({ id: goal.id, isImportant: !goal.isImportant })
  }

  const handleChangeStatus = async (status: Status) => {
    statusUpdatingMutateAsync({ id: goal.id, status })
    onStatusMenuClose()
  }

  const handleEdit = () => {
    onActionMenuClose()
    onEdit && onEdit()
  }

  return (
    <View style={[framework.card, framework.bgBackground, framework.p0, framework.overflowHidden]}>
      <View style={[styles.categoryBar, framework.h100, framework.absolute, framework.top0, framework.left0, { backgroundColor: statusColor }]} />

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
        </View>

        <Text style={[framework.mt1, framework.textSm, framework.reversedText]}>
          {goal.categoryName}
        </Text>
      </LinearGradient >

      <View style={[framework.p3, framework.pt2]}>
        {goal.description && (
          <Text style={[framework.mb3, framework.textMuted]}>{goal.description}</Text>
        )}

        <View style={[framework.flexRow, framework.justifyBetween]}>
          <View style={[framework.bgInfo, framework.py1, framework.px3, framework.flexRow, framework.alignCenter, framework.gap2, framework.roundedPill]}>
            <FontAwesome5 name="clock" size={14} color={Variables.reversedTextColor} />
            <Text style={[framework.textSm, framework.fontBold, framework.reversedText]}>
              {formatDate(goal.deadline)}
            </Text>
          </View>

          {goal.status && (
            <TouchableOpacity
              onPress={onStatusMenuOpen}
              style={[styles.statusBadge, framework.py1, framework.px3, framework.roundedPill, { backgroundColor: statusColor }]}
            >
              <Text style={[framework.textSm, framework.reversedText]}>{goal.status}</Text>
            </TouchableOpacity>
          )}

          <ModalHolder visible={statusMenuVisible} onClose={onStatusMenuClose} title='Status:'>
            {statusList.map((status) => (
              <TouchableOpacity
                key={status}
                style={[framework.py3, framework.px5, framework.rounded, status === goal.status && framework.bgLightMain]}
                onPress={() => handleChangeStatus(status)}
              >
                <Text style={[framework.text, status === goal.status && framework.fontBold]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ModalHolder>
        </View>
      </View>

      <View style={[styles.footer, framework.py2, framework.px4]}>
        <Text style={[framework.textXs, framework.textMuted]}>
          {formatDate(goal.updatedAt)}
        </Text>
      </View>
    </View >
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
});