import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../../styles/colors';
import framework from '../../styles/framework';
import AntDesign from "react-native-vector-icons/AntDesign"
import Variables from '../../styles/variables';
import { Subtask } from '../../types/schemas';
import { CardProps } from '../../types/cards';
import { useRemoveSubtask, useUpdateSubtaskCompleted, useUpdateSubtaskImportance } from '../../features/subtasks';

const SubtaskCard: React.FC<CardProps<Subtask>> = ({ record: subtask, queryKey: key }) => {
  const { mutateAsync: deleteSubtaskAsync } = useRemoveSubtask({ key })
  const { mutateAsync: updateSubtaskCompletedAsync } = useUpdateSubtaskCompleted({ key })
  const { mutateAsync: updateSubtaskImportantAsync } = useUpdateSubtaskImportance({ key })


  const toggleCompleted = async () => {
    await updateSubtaskCompletedAsync({ id: subtask.id, isCompleted: !subtask.isCompleted })
  };

  const toggleImportance = async () => {
    await updateSubtaskImportantAsync({ id: subtask.id, isImportant: !subtask.isImportant })
  };

  const remove = async () => {
    await deleteSubtaskAsync(subtask.id)
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
              framework.text, framework.textSm,
              subtask.isCompleted && styles.completed,
            ]}
            numberOfLines={1}
          >
            {subtask.title}
          </Text>
        </View>
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
