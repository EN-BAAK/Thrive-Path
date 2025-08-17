import React, { useEffect, useState } from 'react';
import { Modal, Dimensions, View, Text, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import framework from '../../styles/framework';
import InputField from '../forms/InputField';
import DatePickerField from '../forms/DatePickerField';
import SelectField from '../forms/SelectField';
import Button from '../forms/Button';
import { createChallenge, updateChallenge } from '../../api/crud/challenges';
import { getCategories } from '../../api/crud/categories';
import { Challenge, Category } from '../../types/schemas';
import { AddEditChallengeModalProps } from '../../types/modals';
import { addEditChallengeValidation } from '../../constants/formValidation';

const { height: windowHeight } = Dimensions.get('window');

const AddEditChallengeModal: React.FC<AddEditChallengeModalProps> = ({
  visible,
  onClose,
  onSave,
  initialChallenge,
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

  const handleSubmittingChallenge = async (values: Challenge) => {
    try {
      const payload: Challenge = {
        ...initialChallenge,
        ...values,
        id: initialChallenge?.id ?? -1,
        createdAt: initialChallenge?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (payload.id === -1) {
        await createChallenge(payload);
      } else {
        await updateChallenge(payload.id, payload);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('[AddEditChallengeModal] Failed to save challenge:', error);
    }
  };

  useEffect(() => {
    if (visible)
      fetchCategories();
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
                {initialChallenge?.id === -1 ? 'Add New Challenge' : 'Edit Challenge'}
              </Text>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={framework.mb5}>
                <Formik<Challenge>
                  initialValues={initialChallenge}
                  validationSchema={addEditChallengeValidation}
                  onSubmit={handleSubmittingChallenge}
                  enableReinitialize
                >
                  {(formik) => (
                    <>
                      <InputField
                        name="title"
                        label="Title"
                        required
                        placeholder="Enter challenge title"
                        containerStyle={framework.mb2}
                      />

                      <InputField
                        name="description"
                        label="Description"
                        placeholder="Enter challenge description"
                        containerStyle={framework.mb2}
                        multiLine
                      />

                      <SelectField
                        name="categoryId"
                        label="Category"
                        placeholder="Select a category"
                        options={categories.map((c) => ({
                          label: c.name,
                          value: c.id,
                        }))}
                        containerStyle={framework.mb3}
                      />

                      <InputField
                        name="points"
                        label="Reward Points"
                        required
                        type="numeric"
                        placeholder="e.g. 100"
                      />

                      <InputField
                        name="penaltyPoints"
                        label="Penalty Points"
                        required
                        type="numeric"
                        placeholder="e.g. 50"
                      />

                      <InputField
                        name="targetValue"
                        label="Target Value"
                        required
                        type="numeric"
                        placeholder="e.g. 20 workouts"
                      />

                      <InputField
                        name="maxHearts"
                        label="Max Hearts"
                        required
                        type="numeric"
                      />

                      <InputField
                        name="maxStars"
                        label="Max Stars"
                        required
                        type="numeric"
                      />

                      <DatePickerField
                        name="startDate"
                        label="Start Date"
                      />

                      <DatePickerField
                        name="endDate"
                        label="End Date"
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

export default AddEditChallengeModal;

const styles = StyleSheet.create({
  form: {
    height: windowHeight - 15,
  },
});
