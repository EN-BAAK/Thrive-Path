import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import framework from '../../styles/framework';
import colors from '../../styles/colors';
import Variables from '../../styles/variables';
import InputField from '../forms/InputField';
import SwitchField from '../forms/SwitchField';
import { SafeSubtask } from '../../types/schemas';
import { addEditSubtaskValidation } from '../../constants/formValidation';
import { defaultSubtask } from '../../constants/formValues';
import { AddSubtaskModalProps } from '../../types/modals';
import Button from '../forms/Button';
import CUModalHolder from '../../layouts/CUModalHolder';
import { useCreateSubTask } from '../../features/subtasks';

const AddSubtaskModal: React.FC<AddSubtaskModalProps> = ({ visible, onClose, parentTaskId, queryKey: key }) => {
  const { mutateAsync } = useCreateSubTask({ key })

  const handleSubmitSubtask = async (values: SafeSubtask) => {
    mutateAsync({ subtask: values, parentTaskId })
    onClose();
  };

  return (
    <CUModalHolder
      onClose={onClose}
      visible={visible}
      title="Add Subtask"
    >
      <Formik<SafeSubtask>
        initialValues={defaultSubtask}
        validationSchema={addEditSubtaskValidation}
        onSubmit={handleSubmitSubtask}
        enableReinitialize
      >
        {(formik) => (
          <React.Fragment>
            <InputField
              name="title"
              label="Title"
              required
              placeholder="Enter subtask title"
              containerStyle={framework.mb2}
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
              containerStyle={framework.mb3}
              trackColor={{ true: colors.success, false: Variables.secondaryColor }}
              thumbColor={{ true: colors.success, false: colors.gray }}
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

export default AddSubtaskModal;
