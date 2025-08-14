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
import { deleteTask, updateTaskIsCompletedById, updateTaskImportantById } from '../../api/crud/tasks';
import { formatDate } from '../../misc/helpers';
import SubtaskCard from './Subtask';
import AddSubtaskModal from '../modals/AddSubtask';
import Button from '../forms/Button';

const TaskCard: React.FC<CardProps<TaskWithCategoryAndSubtasks>> = ({ record: task, onEdit, onSuccess }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAddSubtaskModalVisible, setIsAddSubtaskModalVisible] = useState<boolean>(false)
  const [open, setOpen] = useState(false);

  const toggleCompleted = async () => {
    try {
      await updateTaskIsCompletedById(task.id, !task.isCompleted);
      onSuccess?.();
    } catch (e) {
      console.log('[Task] toggleCompleted error', e);
    }
  };

  const toggleImportant = async () => {
    try {
      await updateTaskImportantById(task.id, !task.isImportant);
      onSuccess?.();
    } catch (e) {
      console.log('[Task] toggleImportant error', e);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      onSuccess?.();
    } catch (e) {
      console.log('[Task] delete error', e);
    } finally {
      setMenuOpen(false);
    }
  };

  const toggleAccordion = () => {
    setOpen((v) => !v);
  };

  const handleAddSubtask = () => {
    setIsAddSubtaskModalVisible(true)
  };

  return (
    <View style={[framework.card, framework.bgBackground, framework.mb2, framework.p0, framework.relative, framework.overflowHidden]}>
      <View style={[styles.strip, framework.h100, framework.absolute, framework.top0, framework.left0, { backgroundColor: task.categoryColor }]} />

      <LinearGradient
        colors={[task.categoryColor, `${task.categoryColor}99`]}
        style={[framework.p4, framework.pb2, framework.roundedTop]}
      >
        <View style={[framework.flexRow, framework.justifyBetween, framework.alignCenter]}>
          <View style={[framework.flexOne, framework.flexRow, framework.alignCenter, framework.gap2]}>
            <TouchableOpacity onPress={toggleCompleted} style={framework.p1} hitSlop={10}>
              <FontAwesome5
                name={task.isCompleted ? 'check-circle' : 'circle'}
                size={18}
                color={task.isCompleted ? colors.success : Variables.reversedTextColor}
              />
            </TouchableOpacity>

            <View style={[framework.flexOne]}>
              <Text style={[framework.fontBold, framework.textLg, framework.reversedText, task.isCompleted && styles.completed,]}
                numberOfLines={1}
              >
                {task.title}
              </Text>

              <View style={[framework.mt1, framework.flexRow, framework.alignCenter, framework.gap1]}>
                <MaterialCommunityIcons name="tag-outline" size={14} color={Variables.reversedTextColor} />
                <Text style={[framework.textXs, framework.reversedText]} numberOfLines={1}>
                  {task.categoryName}
                </Text>
              </View>

              <View style={[framework.mt1, framework.flexRow, framework.alignCenter, framework.gap1]}>
                <FontAwesome5 name="award" size={12} color={Variables.reversedTextColor} />
                <Text style={[framework.textXs, framework.reversedText]}>
                  {task.points ?? 0} pts
                </Text>
              </View>
            </View>
          </View>

          <View style={[framework.flexRow, framework.alignCenter, framework.relative]}>
            <TouchableOpacity onPress={toggleImportant} style={framework.p1} hitSlop={10}>
              <AntDesign
                name={task.isImportant ? 'star' : 'staro'}
                size={16}
                color={task.isImportant ? colors.warning : Variables.reversedTextColor}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMenuOpen((v) => !v)} style={framework.p1} hitSlop={10}>
              <FontAwesome5 name="ellipsis-v" size={16} color={Variables.reversedTextColor} />
            </TouchableOpacity>

            {menuOpen && (
              <View style={[framework.bgBackground, framework.rounded, framework.shadowLight, framework.absolute, framework.top0, framework.right3, framework.overflowHidden,]}
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

        {!!task.description && (
          <Text style={[framework.mt2, framework.reversedText]}>
            {task.description}
          </Text>
        )}
      </LinearGradient>

      <View style={[styles.footer, framework.py2, framework.px3, framework.flexRow, framework.justifyBetween, framework.alignCenter,]}
      >
        <Text style={[framework.textXs, framework.textMuted]}>Created {formatDate(task.createdAt)}</Text>

        <TouchableOpacity
          onPress={toggleAccordion}
          style={[styles.metaPill, framework.py1, framework.px3, framework.flexRow, framework.alignCenter, framework.roundedPill,]}
        >
          <FontAwesome5 name={open ? 'chevron-up' : 'chevron-down'} size={12} color={colors.text} />
          <Text style={[framework.textXs, framework.ml1]}>
            {open ? 'Hide subtasks' : `Show subtasks (${task.subtasks?.length || 0})`}
          </Text>
        </TouchableOpacity>
      </View>

      {open && (
        <View style={[framework.p3, framework.pt2, framework.gap2]}>
          {(task.subtasks?.length || 0) === 0 ? (
            <Text style={[framework.textSm, framework.textMuted]}>No subtasks</Text>
          ) : (
            task.subtasks!.map((st) => (
              <SubtaskCard key={st.id} record={st} onSuccess={onSuccess} />
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
        onSave={() => onSuccess?.()}
        parentTaskId={task.id}
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
    zIndex: 2,
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
