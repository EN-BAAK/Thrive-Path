import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import framework from '../../styles/framework';
import colors from '../../styles/colors';
import Variables from '../../styles/variables';
import { CardProps } from '../../types/cards';
import { TaskWithCategoryAndSubtasks } from '../../types/schemas';
import { formatDate } from '../../misc/helpers';
import SubtaskCard from './Subtask';
import AddSubtaskModal from '../modals/AddSubtask';
import Button from '../forms/Button';
import { Menu } from 'react-native-paper';
import { useDeleteTask, useUpdateCompletingTask, useUpdateIsImportantTask } from '../../features/tasks';
import { useAppContext } from '../../contexts/AppProvider';

const statusColors: Record<NonNullable<string>, string> = {
  "completed": colors.success,
  "uncompleted": colors.warning,
};

const TaskCard: React.FC<CardProps<TaskWithCategoryAndSubtasks>> = ({ record: task, onEdit, queryKey: key }) => {
  const [isAddSubtaskModalVisible, setIsAddSubtaskModalVisible] = useState<boolean>(false)
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [isAccordionOpened, setIsAccordionOpened] = useState(false);

  const { showWarning } = useAppContext()

  const { mutateAsync: isImportantUpdatingMutateAsync } = useUpdateIsImportantTask({ key })
  const { mutateAsync: isCompletedUpdatingMutateAsync } = useUpdateCompletingTask({ key })
  const { mutateAsync: deleteMutateAsync } = useDeleteTask({ key })

  const statusColor = statusColors[task.isCompleted ? "completed" : "uncompleted"]

  const onActionMenuClose = () => {
    setActionMenuVisible(false)
  }

  const onActionMenuOpen = () => {
    setActionMenuVisible(true)
  }

  const toggleAccordion = () => {
    setIsAccordionOpened((v) => !v);
  };

  const handleAddSubtask = () => {
    setIsAddSubtaskModalVisible(true)
  };

  const handleDelete = async () => {
    showWarning({
      btn2: "delete",
      btn1: "cancel",
      handleBtn2: async () => await deleteMutateAsync(task.id),
      message: `Are you sure you want to delete the task "${task.title}"?`
    })
  };

  const handleIsImportantToggle = async () => {
    isImportantUpdatingMutateAsync({ id: task.id, isImportant: !task.isImportant })
  }

  const handleCompleteToggle = async () => {
    isCompletedUpdatingMutateAsync({ id: task.id, isCompleted: !task.isCompleted })
  }

  const handleEdit = () => {
    onActionMenuClose()
    onEdit && onEdit()
  }

  return (
    <View style={[framework.card, framework.bgBackground, framework.mb2, framework.p0, framework.relative, framework.indexBehind, framework.overflowHidden]}>
      <View style={[styles.strip, framework.h100, framework.absolute, framework.top0, framework.left0, framework.index1, { backgroundColor: statusColor }]} />

      <LinearGradient
        colors={[task.categoryColor, `${task.categoryColor}99`]}
        style={[framework.p4, framework.pb2, framework.roundedTop]}
      >
        <View style={[framework.flexOne, framework.flexRow, framework.alignCenter, framework.gap2]}>
          <View style={[framework.flexOne]}>
            <View style={[framework.flexRow, framework.alignCenter]}>
              <TouchableOpacity onPress={handleCompleteToggle} style={framework.p1} hitSlop={10}>
                <FontAwesome5
                  name={task.isCompleted ? 'check-circle' : 'circle'}
                  size={18}
                  color={Variables.reversedTextColor}
                />
              </TouchableOpacity>

              <Text style={[framework.flexOne, framework.fontBold, framework.textLg, framework.reversedText, task.isCompleted && styles.completed,]}
                numberOfLines={1}
              >
                {task.title}
              </Text>

              <View style={[framework.flexRow, framework.alignCenter, framework.relative, framework.index1]}>
                <TouchableOpacity onPress={handleIsImportantToggle} style={framework.p1} hitSlop={10}>
                  <AntDesign
                    name={task.isImportant ? 'star' : 'staro'}
                    size={16}
                    color={task.isImportant ? colors.warning : Variables.reversedTextColor}
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

            <View style={[framework.mt1, framework.flexRow, framework.alignCenter, framework.gap1]}>
              <MaterialCommunityIcons name="tag-outline" size={14} color={Variables.reversedTextColor} />
              <Text style={[framework.textXs, framework.reversedText]} numberOfLines={1}>
                {task.categoryName}
              </Text>
            </View>
          </View>
        </View>

        {!!task.description && (
          <Text style={[framework.mt2, framework.reversedText]}>
            {task.description}
          </Text>
        )}
      </LinearGradient>

      <View style={[styles.footer, framework.py2, framework.px3, framework.flexRow, framework.justifyBetween, framework.alignCenter, framework.indexBehind]}>
        <Text style={[framework.textXs, framework.textMuted]}>Created {formatDate(task.createdAt)}</Text>

        <TouchableOpacity
          onPress={toggleAccordion}
          style={[styles.metaPill, framework.py1, framework.px3, framework.flexRow, framework.alignCenter, framework.roundedPill, framework.gap1]}
        >
          <FontAwesome5 name={isAccordionOpened ? 'chevron-up' : 'chevron-down'} size={12} color={colors.text} />
          <Text style={[framework.textXs, framework.ml1m, framework.text]}>
            {isAccordionOpened ? 'Hide subtasks' : `Show subtasks (${task.subtasks?.length || 0})`}
          </Text>
        </TouchableOpacity>
      </View>

      {isAccordionOpened && (
        <View style={[framework.p3, framework.pt2, framework.gap2]}>
          {(task.subtasks?.length || 0) === 0 ? (
            <Text style={[framework.textSm, framework.textMuted]}>No subtasks</Text>
          ) : (
            task.subtasks!.map((st) => (
              <SubtaskCard key={`sub-task-${st.id}`} record={st} queryKey={key} />
            ))
          )}

          <Button
            msg='+ Add Subtask'
            onPress={() => handleAddSubtask()}
            style={[framework.px5, framework.rounded]}
          />
        </View>
      )}

      <AddSubtaskModal
        visible={isAddSubtaskModalVisible}
        onClose={() => setIsAddSubtaskModalVisible(false)}
        parentTaskId={task.id}
        queryKey={key}
      />
    </View>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  card: {
    elevation: 0,
  },
  strip: {
    width: 5,
  },
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.8,
  },
  metaPill: {
    backgroundColor: colors.lightGray,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightGray,
  },
  menuItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGray,
  },
});
