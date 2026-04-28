import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { AddEditGoalModalProps } from '../../types/modals';
import { SafetyGoal } from '../../types/schemas';
import framework from '../../styles/framework';
import InputField from '../forms/InputField';
import SwitchField from '../forms/SwitchField';
import colors from '../../styles/colors';
import DatePickerField from '../forms/DatePickerField';
import SelectField from '../forms/SelectField';
import { addEditGoalValidation } from '../../constants/formValidation';
import Variables from '../../styles/variables';
import { Status } from '../../types/variables';
import Button from '../forms/Button';
import { useCreateGoal, useUpdateGoal } from '../../features/goals';
import CUModalHolder from '../../layouts/CUModalHolder';
import { useGetCategories } from '../../features/categories';

const AddEditGoalModal: React.FC<AddEditGoalModalProps> = ({ visible, onClose, initialGoal, queryKey: key }) => {
  const { data: categories = [] } = useGetCategories({ key: ["categories"], enabled: visible });
  const { mutateAsync: createMutate } = useCreateGoal({ key })
  const { mutateAsync: updateMutate } = useUpdateGoal({ key })

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
        await createMutate(payload);
      } else {
        await updateMutate({ id: payload.id, updates: payload });
      }

      onClose();
    } catch (error) {
      console.error('[AddEditGoalModal] Failed to save goal:', error);
    }
  };

  return (
    <CUModalHolder
      onClose={onClose}
      title={initialGoal.id === -1 ? "Create Goal" : "Edit Goal"}
      visible={visible}>
      <Formik<SafetyGoal>
        initialValues={initialGoal}
        validationSchema={addEditGoalValidation}
        onSubmit={handleSubmittingGoal}
        enableReinitialize
      >
        {(formik) => (
          <React.Fragment>
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
              trackColor={{ true: Variables.lightMain, false: Variables.secondaryColor }}
              thumbColor={{ true: Variables.mainColor, false: colors.gray }}
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
                { label: Status.PENDING, value: Status.PENDING },
                { label: Status.COMPLETED, value: Status.COMPLETED },
                { label: Status.CANCELED, value: Status.CANCELED },
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
              required
              containerStyle={framework.mb3}
            />

            <View style={[framework.flexRow, framework.justifyEnd]}>
              <Button
                msg='Save'
                onPress={() => formik.handleSubmit()}
                style={[framework.px5, framework.rounded]}
                disabled={!formik.dirty || formik.isSubmitting || !formik.isValid}
              />
            </View>
          </React.Fragment>
        )}
      </Formik>
    </CUModalHolder>
  );
};

export default AddEditGoalModal;
