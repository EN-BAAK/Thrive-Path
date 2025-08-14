import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import { Formik } from 'formik';
import framework from '../../styles/framework';
import colors from '../../styles/colors';
import Variables from '../../styles/variables';
import InputField from '../forms/InputField';
import SwitchField from '../forms/SwitchField';
import SelectField from '../forms/SelectField';
import { Category, SafeTask, Task } from '../../types/schemas';
import { getCategories } from '../../api/crud/categories';
import { createTask, updateTask } from '../../api/crud/tasks';
import { addEditTaskValidation } from '../../constants/formValidation';
import { AddEditTaskModalProps } from '../../types/modals';

const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({
  visible,
  onClose,
  onSave,
  initialTask,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('[AddEditTaskModal] Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchCategories();
    }
  }, [visible]);

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
        await createTask(payload);
      } else {
        await updateTask(payload.id, payload);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('[AddEditTaskModal] Failed to save task:', error);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        style={[framework.bgLayout, framework.flexOne, framework.justifyCenter, framework.px3]}
        onPress={onClose}
      >
        <KeyboardAvoidingView behavior="height" style={framework.w100} keyboardVerticalOffset={0}>
          <TouchableWithoutFeedback>
            <View style={[framework.bgBackground, framework.p4, framework.roundedMd, framework.shadowMedium]}>
              <Text style={[framework.bgMain, framework.mb4, framework.py2, framework.px4, framework.roundedBottomMd, framework.textCenter, framework.fontBold, framework.textXl, framework.reversedText]}
              >
                {initialTask?.id === -1 ? 'Add New Task' : 'Edit Task'}
              </Text>

              <Formik<SafeTask>
                initialValues={initialTask}
                validationSchema={addEditTaskValidation}
                onSubmit={handleSubmitTask}
                enableReinitialize
              >
                {({ handleSubmit }) => (
                  <>
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

                    <InputField
                      name="points"
                      label="Points"
                      placeholder="Enter points"
                      type="numeric"
                      containerStyle={framework.mb2}
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
                      <TouchableOpacity
                        onPress={() => handleSubmit()}
                        style={[framework.bgMain, framework.px4, framework.py2, framework.rounded]}
                      >
                        <Text style={[framework.reversedText, framework.textBase]}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

export default AddEditTaskModal;
