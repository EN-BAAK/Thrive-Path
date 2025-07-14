import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import framework from '../../styles/framework';
import colors from '../../styles/colors';
import { Goal } from '../../types/schemas';
import { AddEditGoalModalProps } from '../../types/modals';
import InputField from '../forms/InputField';
import SwitchField from '../forms/SwitchField';
import DatePickerField from '../forms/DatePickerField';
import { addEditGoalValidation } from '../../constants/formValidatoin';

const AddEditGoalModal: React.FC<AddEditGoalModalProps> = ({
  visible,
  onClose,
  onSave,
  initialGoal,
}) => {
  const handleSubmittingGoal = (values: any) => {
    const newGoal: Goal = {
      ...initialGoal,
      id: initialGoal?.id || -1,
      name: values.name.trim(),
      description: values.description?.trim(),
      points: parseInt(values.points, 10),
      deadline: values.deadline,
      flag: values.flag,
      createdAt: initialGoal?.createdAt || new Date(Date.now()).toISOString(),
      updatedAt: initialGoal?.updatedAt || new Date(Date.now()).toISOString()
    };

    onSave(newGoal);
    onClose();
  };

  useEffect(() => {
  }, [initialGoal, visible])

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={[framework.bgLayout, framework.flexOne, framework.justifyCenter, framework.px3]}>
        <View style={[framework.bgLight, framework.p4, framework.roundedMd, framework.shadowMedium]}>
          <Text style={[framework.bgPrimary, framework.mb4, framework.py2, framework.px4, framework.roundedBottomMd, framework.textCenter, framework.fontBold, framework.textXl, framework.textWhite]}>
            {initialGoal ? 'Edit Goal' : 'Add New Goal'}
          </Text>

          <Formik
            initialValues={{
              name: initialGoal?.name || '',
              description: initialGoal?.description || '',
              points: initialGoal?.points?.toString() || '',
              deadline: initialGoal?.deadline ? new Date(initialGoal.deadline) : new Date(),
              flag: initialGoal?.flag || false,
              createdAt: initialGoal?.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }}
            validationSchema={addEditGoalValidation}
            onSubmit={handleSubmittingGoal}
            enableReinitialize
          >
            {({ handleSubmit }) => (
              <>
                <InputField name="name" label="Name" required placeholder="Enter name" containerStyle={framework.mb2} />
                <InputField name="description" label="Description" placeholder="Enter description" containerStyle={framework.mb2} multiLine />
                <InputField name="points" label="Points" required placeholder="Enter points" type="numeric" containerStyle={framework.mb2} />

                <DatePickerField name="deadline" label="Deadline" required containerStyle={framework.mb2} />

                <SwitchField
                  name="flag"
                  label="Done?"
                  containerStyle={framework.mb2}
                  trackColor={{ true: colors.lightPrimary, false: colors.lightGray }}
                  thumbColor={{ true: colors.primary, false: colors.gray }}
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
