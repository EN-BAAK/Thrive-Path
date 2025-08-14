import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../../styles/colors';
import framework from '../../styles/framework';
import AntDesign from "react-native-vector-icons/AntDesign"
import Variables from '../../styles/variables';
import { Subtask } from '../../types/schemas';
import { deleteSubtask, updateSubtaskCompletedById, updateSubtaskImportantById } from '../../api/crud/tasks';
import { CardProps } from '../../types/cards';

const SubtaskCard: React.FC<CardProps<Subtask>> = ({ record: subtask, onSuccess }) => {
  const toggleCompleted = async () => {
    try {
      await updateSubtaskCompletedById(subtask.id, !subtask.isCompleted);
      onSuccess?.();
    } catch (e) {
      console.log('[Subtask] toggleCompleted error', e);
    }
  };

  const toggleImportance = async () => {
    try {
      await updateSubtaskImportantById(subtask.id, !subtask.isImportant);
      onSuccess?.();
    } catch (e) {
      console.log('[Subtask] toggleCompleted error', e);
    }
  };

  const remove = async () => {
    try {
      await deleteSubtask(subtask.id);
      onSuccess?.();
    } catch (e) {
      console.log('[Subtask] delete error', e);
    }
  };

  return (
    <View style={[styles.container, framework.bgBackground, framework.mb2, framework.py2, framework.px3, framework.flexRow, framework.alignCenter, framework.justifyBetween]}>
      <View style={[framework.flexOne, framework.flexRow, framework.alignCenter]}>
        <TouchableOpacity onPress={toggleCompleted} style={framework.p1} hitSlop={10}>
          <FontAwesome5
            name={subtask.isCompleted ? 'check-circle' : 'circle'}
            size={18}
            color={subtask.isCompleted ? colors.success : Variables.textColor}
          />
        </TouchableOpacity>

        <View style={framework.flexOne}>
          <Text
            style={[
              framework.textSm,
              subtask.isCompleted && styles.completed,
            ]}
            numberOfLines={1}
          >
            {subtask.title}
          </Text>
        </View>
      </View>

      <View style={[framework.flexRow, framework.alignCenter, framework.mx2]}>
        <FontAwesome5 name="star" size={12} color={colors.warning} style={framework.mr1} />
        <Text style={framework.textXs}>{subtask.points} pts</Text>
      </View>

      <View style={[framework.flexRow, framework.alignCenter]}>
        <TouchableOpacity
          onPress={toggleImportance} style={framework.p1} hitSlop={10}
        >
          <AntDesign
            name={subtask.isImportant ? "star" : "staro"}
            size={16}
            color={colors.warning}
            style={framework.mr2}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={remove} style={framework.p1} hitSlop={10}>
          <FontAwesome5 name="trash" size={14} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SubtaskCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  completed: {
    textDecorationLine: 'line-through',
    opacity: .8
  }
});
