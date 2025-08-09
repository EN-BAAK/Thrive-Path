import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import { AddEditGoalModalProps } from '../../types/modals';
import { Category, SafetyGoal } from '../../types/schemas';
import { getCategories } from '../../api/crud/categories';
import { createGoal, updateGoal } from '../../api/crud/goals';
import framework from '../../styles/framework';
import InputField from '../forms/InputField';
import SwitchField from '../forms/SwitchField';
import colors from '../../styles/colors';
import DatePickerField from '../forms/DatePickerField';
import SelectField from '../forms/SelectField';
import { addEditGoalValidation } from '../../constants/formValidation';

const AddEditGoalModal: React.FC<AddEditGoalModalProps> = ({
  visible,
  onClose,
  onSave,
  initialGoal,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchCategories();
    }
  }, [visible]);

  const handleSubmittingGoal = async (values: SafetyGoal) => {
    try {
      const payload = {
        ...initialGoal,
        ...values,
        id: initialGoal?.id ?? -1,
        createdAt: initialGoal?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (payload.id === -1) {
        await createGoal(payload);
      } else {
        await updateGoal(payload.id, payload);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('[AddEditGoalModal] Failed to save goal:', error);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={[framework.bgLayout, framework.flexOne, framework.justifyCenter, framework.px3]}>
        <View style={[framework.bgLight, framework.p4, framework.roundedMd, framework.shadowMedium]}>
          <Text style={[
            framework.bgPrimary,
            framework.mb4,
            framework.py2,
            framework.px4,
            framework.roundedBottomMd,
            framework.textCenter,
            framework.fontBold,
            framework.textXl,
            framework.textWhite
          ]}>
            {initialGoal?.id === -1 ? 'Add New Goal' : 'Edit Goal'}
          </Text>

          <Formik<SafetyGoal>
            initialValues={initialGoal}
            validationSchema={addEditGoalValidation}
            onSubmit={handleSubmittingGoal}
            enableReinitialize
          >
            {({ handleSubmit }) => (
              <>
                <InputField
                  name="name"
                  label="Name"
                  required
                  placeholder="Enter name"
                  containerStyle={framework.mb2}
                />

                <InputField
                  name="description"
                  label="Description"
                  placeholder="Enter description"
                  containerStyle={framework.mb2}
                  multiLine
                />

                <SwitchField
                  name="isImportant"
                  label="Important?"
                  containerStyle={framework.mb2}
                  trackColor={{ true: colors.lightPrimary, false: colors.lightGray }}
                  thumbColor={{ true: colors.primary, false: colors.gray }}
                />

                <InputField
                  name="points"
                  label="Points"
                  required
                  placeholder="Enter points"
                  type="numeric"
                  containerStyle={framework.mb2}
                />

                <DatePickerField
                  name="deadline"
                  label="Deadline"
                  required
                  containerStyle={framework.mb2}
                />

                <SelectField
                  name="status"
                  label="Status"
                  required
                  options={[
                    { label: 'Pending', value: 'PENDING' },
                    { label: 'Completed', value: 'COMPLETED' },
                    { label: 'Canceled', value: 'CANCELED' },
                  ]}
                  containerStyle={framework.mb2}
                />

                <InputField
                  name="priority"
                  label="Priority"
                  required
                  placeholder="Enter priority"
                  type="numeric"
                  containerStyle={framework.mb2}
                />

                <SelectField
                  name="categoryId"
                  label="Category"
                  placeholder="Select a category"
                  options={categories.map(c => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  containerStyle={framework.mb3}
                />

                <View style={[framework.flexRow, framework.justifyBetween]}>
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    style={[framework.bgPrimary, framework.px4, framework.py2, framework.rounded]}
                  >
                    <Text style={[framework.textWhite, framework.textBase]}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={onClose}>
                    <Text style={[framework.textSecondary, framework.textBase]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

export default AddEditGoalModal;
