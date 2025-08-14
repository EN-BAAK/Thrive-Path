import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { Formik } from 'formik';
import framework from '../../styles/framework';
import colors from '../../styles/colors';
import Variables from '../../styles/variables';
import InputField from '../forms/InputField';
import SwitchField from '../forms/SwitchField';
import { SafeSubtask } from '../../types/schemas';
import { addEditSubtaskValidation } from '../../constants/formValidation';
import { defaultSubtask } from '../../constants/formValues';
import { createSubtask } from '../../api/crud/tasks';
import { AddSubtaskModalProps } from '../../types/modals';
import Button from '../forms/Button';

const AddSubtaskModal: React.FC<AddSubtaskModalProps> = ({ visible, onClose, onSave, parentTaskId, }) => {
  const handleSubmitSubtask = async (values: SafeSubtask) => {
    try {
      await createSubtask(values, parentTaskId);
      onSave();
      onClose();
    } catch (error) {
      console.error('[AddSubtaskModal] Failed to create subtask:', error);
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
            <View
              style={[framework.bgBackground, framework.p4, framework.roundedMd, framework.shadowMedium,]}
            >
              <Text
                style={[framework.bgMain, framework.mb4, framework.py2, framework.px4, framework.roundedBottomMd, framework.textCenter, framework.fontBold, framework.textXl, framework.reversedText,]}
              >
                Add Subtask
              </Text>

              <Formik<SafeSubtask>
                initialValues={defaultSubtask}
                validationSchema={addEditSubtaskValidation}
                onSubmit={handleSubmitSubtask}
                enableReinitialize
              >
                {(formik) => (
                  <>
                    <InputField
                      name="title"
                      label="Title"
                      required
                      placeholder="Enter subtask title"
                      containerStyle={framework.mb2}
                    />

                    <InputField
                      name="points"
                      label="Points"
                      placeholder="Enter points"
                      type="numeric"
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

export default AddSubtaskModal;
