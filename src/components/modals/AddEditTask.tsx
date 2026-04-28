import React from 'react';
import { View, } from 'react-native';
import { Formik } from 'formik';
import framework from '../../styles/framework';
import colors from '../../styles/colors';
import Variables from '../../styles/variables';
import InputField from '../forms/InputField';
import SwitchField from '../forms/SwitchField';
import SelectField from '../forms/SelectField';
import { SafeTask, Task } from '../../types/schemas';
import { addEditTaskValidation } from '../../constants/formValidation';
import { AddEditTaskModalProps } from '../../types/modals';
import Button from '../forms/Button';
import { useCreateTask, useUpdateTask } from '../../features/tasks';
import CUModalHolder from '../../layouts/CUModalHolder';
import { useGetCategories } from '../../features/categories';

const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({ visible, onClose, initialTask, queryKey: key }) => {
  const { data: categories = [] } = useGetCategories({ key: ["categories"], enabled: visible });
  const { mutateAsync: createMutate } = useCreateTask({ key })
  const { mutateAsync: updateMutate } = useUpdateTask({ key })

  const handleSubmitTask = async (values: SafeTask) => {
    try {
      const payload: Task = {
        ...initialTask,
        ...values,
        id: initialTask?.id ?? -1,
        createdAt: initialTask?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (payload.id === -1) {
        await createMutate(payload);
      } else {
        await updateMutate({ id: payload.id, updates: payload });
      }

      onClose();
    } catch (error) {
      console.error('[AddEditTaskModal] Failed to save task:', error);
    }
  };

  return (
    <CUModalHolder
      onClose={onClose}
      title={initialTask.id === -1 ? "Create task" : "Edit task"}
      visible={visible}
    >
      <Formik<SafeTask>
        initialValues={initialTask}
        validationSchema={addEditTaskValidation}
        onSubmit={handleSubmitTask}
        enableReinitialize
      >
        {(formik) => (
          <React.Fragment>
            <InputField
              name="title"
              label="Title"
              required
              placeholder="Enter task title"
              containerStyle={framework.mb2}
            />

            <InputField
              name="description"
              label="Description"
              placeholder="Enter task description"
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

            <SwitchField
              name="isCompleted"
              label="Completed?"
              containerStyle={framework.mb2}
              trackColor={{ true: colors.success, false: Variables.secondaryColor }}
              thumbColor={{ true: colors.success, false: colors.gray }}
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

export default AddEditTaskModal;
