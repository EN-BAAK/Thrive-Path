import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import framework from '../../styles/framework';
import InputField from '../forms/InputField';
import DatePickerField from '../forms/DatePickerField';
import SelectField from '../forms/SelectField';
import Button from '../forms/Button';
import { Challenge } from '../../types/schemas';
import { AddEditChallengeModalProps } from '../../types/modals';
import { addEditChallengeValidation } from '../../constants/formValidation';
import CUModalHolder from '../../layouts/CUModalHolder';
import { useCreateChallenge, useUpdateChallenge } from '../../features/challenges';
import { useGetCategories } from '../../features/categories';

const AddEditChallengeModal: React.FC<AddEditChallengeModalProps> = ({ visible, onClose, initialChallenge, queryKey: key }) => {
  const { data: categories = [] } = useGetCategories({ key: ["categories"], enabled: visible });
  const { mutateAsync: createMutate } = useCreateChallenge({ key })
  const { mutateAsync: updateMutate } = useUpdateChallenge({ key })

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
        await createMutate(payload);
      } else {
        await updateMutate({ id: payload.id, updates: payload });
      }

      onClose();
    } catch (error) {
      console.error('[AddEditChallengeModal] Failed to save challenge:', error);
    }
  };

  return (
    <CUModalHolder
      onClose={onClose}
      title={initialChallenge.id === -1 ? "Create Challenge" : "Edit Challenge"}
      visible={visible}>
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

            <View style={[framework.mt2, framework.flexRow, framework.justifyEnd]}>
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
    </CUModalHolder>
  );
};

export default AddEditChallengeModal;
