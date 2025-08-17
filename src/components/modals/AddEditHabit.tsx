import React, { useEffect, useState } from 'react';
import { Modal, Dimensions, View, Text, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { AddEditHabitModalProps } from '../../types/modals';
import { Category, Habit } from '../../types/schemas';
import { createHabit, updateHabit } from '../../api/crud/habits';
import framework from '../../styles/framework';
import InputField from '../forms/InputField';
import DatePickerField from '../forms/DatePickerField';
import SelectField from '../forms/SelectField';
import Button from '../forms/Button';
import { addEditHabitValidation } from '../../constants/formValidation';
import { HabitType, IdentifyEntity, RepeatInterval } from '../../types/variables';
import { getCategories } from '../../api/crud/categories';
import { findGoalIdentities } from '../../api/crud/goals';
import { weekdays } from '../../misc/global';

const { height: windowHeight } = Dimensions.get('window');

const AddEditHabitModal: React.FC<AddEditHabitModalProps> = ({
  visible,
  onClose,
  onSave,
  initialHabit,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<IdentifyEntity[]>([]);

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const data = await findGoalIdentities();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleSubmittingHabit = async (values: Habit) => {
    try {
      const payload: Habit = {
        ...initialHabit,
        ...values,
        id: initialHabit?.id ?? -1,
        createdAt: initialHabit?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (payload.id === -1) {
        await createHabit(payload);
      } else {
        await updateHabit(payload.id, payload);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('[AddEditHabitModal] Failed to save habit:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchCategories();
      fetchGoals();
    }
  }, [visible]);

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        style={[framework.bgLayout, framework.flexOne, framework.justifyCenter, framework.px3]}
        onPress={onClose}
      >
        <KeyboardAvoidingView behavior="height" style={[framework.w100, framework.justifyCenter]}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.form,
                framework.bgBackground,
                framework.p4,
                framework.roundedMd,
                framework.shadowMedium,
              ]}
            >
              <Text
                style={[
                  framework.bgMain,
                  framework.mb4,
                  framework.py2,
                  framework.px4,
                  framework.roundedBottomMd,
                  framework.textCenter,
                  framework.fontBold,
                  framework.textXl,
                  framework.reversedText,
                ]}
              >
                {initialHabit?.id === -1 ? 'Add New Habit' : 'Edit Habit'}
              </Text>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={framework.mb5}
              >
                <Formik<Habit>
                  initialValues={initialHabit}
                  validationSchema={addEditHabitValidation}
                  onSubmit={handleSubmittingHabit}
                  enableReinitialize
                >
                  {(formik) => (
                    <>
                      <InputField
                        name="title"
                        label="Title"
                        required
                        placeholder="Enter habit title"
                        containerStyle={framework.mb2}
                      />

                      <InputField
                        name="description"
                        label="Description"
                        placeholder="Enter description"
                        containerStyle={framework.mb2}
                        multiLine
                      />

                      <SelectField
                        name="habitType"
                        label="Habit Type"
                        required
                        options={[
                          { label: 'Good', value: HabitType.GOOD },
                          { label: 'Bad', value: HabitType.BAD },
                        ]}
                        containerStyle={framework.mb2}
                      />

                      <SelectField
                        name="categoryId"
                        label="Category"
                        placeholder="Select a category"
                        options={categories.map((c) => ({
                          label: c.name,
                          value: c.id,
                        }))}
                        disabled={!!formik.values.goalId}
                        containerStyle={framework.mb3}
                      />

                      <InputField
                        name="winPoints"
                        label="Win Points"
                        required
                        type="numeric"
                        placeholder="Enter points earned"
                        containerStyle={framework.mb2}
                      />

                      <InputField
                        name="losePoints"
                        label="Lose Points"
                        required
                        type="numeric"
                        placeholder="Enter points lost"
                        containerStyle={framework.mb2}
                      />

                      <SelectField
                        name="goalId"
                        label="Goal"
                        placeholder="Select a goal"
                        options={goals.map((c) => ({
                          label: c.name,
                          value: c.id,
                        }))}
                        containerStyle={framework.mb3}
                        disabled={!!formik.values.categoryId}
                      />

                      < SelectField
                        name="repeatInterval"
                        label="Repeat Interval"
                        placeholder="Select interval"
                        options={[
                          { label: 'Daily', value: RepeatInterval.DAILY },
                          { label: 'Weekly', value: RepeatInterval.WEEKLY },
                          { label: 'Monthly', value: RepeatInterval.MONTHLY },
                          { label: 'Custom', value: RepeatInterval.CUSTOM },
                        ]}
                        containerStyle={framework.mb3}
                      />

                      {formik.values.repeatInterval === RepeatInterval.CUSTOM && (
                        <InputField
                          name="customIntervalDays"
                          label="Every X Days"
                          type="numeric"
                          placeholder="Enter number of days"
                          containerStyle={framework.mb2}
                        />
                      )}

                      {formik.values.repeatInterval === RepeatInterval.WEEKLY && (
                        <SelectField
                          name="repeatWeekDay"
                          label="Repeat on"
                          placeholder="Select day"
                          options={weekdays}
                          containerStyle={framework.mb2}
                        />
                      )}

                      {formik.values.repeatInterval === RepeatInterval.MONTHLY && (
                        <InputField
                          name="repeatMonthDay"
                          label="Day of Month"
                          type="numeric"
                          placeholder="Enter day (1-31)"
                          containerStyle={framework.mb2}
                        />
                      )}

                      <DatePickerField
                        name="deadline"
                        label="Deadline"
                        containerStyle={framework.mb2}
                      />

                      <View style={[framework.flexRow, framework.justifyEnd]}>
                        <Button
                          msg="Save"
                          onPress={() => formik.handleSubmit()}
                          style={[framework.px5, framework.rounded]}
                          disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
                        />
                      </View>
                    </>
                  )}
                </Formik>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

export default AddEditHabitModal;

const styles = StyleSheet.create({
  form: {
    height: windowHeight - 15,
  },
});
