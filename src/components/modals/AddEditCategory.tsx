import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { SafeCategory } from '../../types/schemas';
import framework from '../../styles/framework';
import InputField from '../forms/InputField';
import { addEditCategoryValidation } from '../../constants/formValidation';
import { AddEditCategoryModalProps } from '../../types/modals';
import ColorPickerField from '../forms/ColorPickerField';
import IconPickerField from '../forms/IconPickerField';
import Button from '../forms/Button';
import { useCreateCategory, useUpdateCategory } from '../../features/categories';
import CUModalHolder from '../../layouts/CUModalHolder';

const AddEditCategoryModal: React.FC<AddEditCategoryModalProps> = ({ visible, onClose, initialCategory, queryKey: key }) => {
  const { mutateAsync: createMutateAsync } = useCreateCategory({ key })
  const { mutateAsync: updateMutateAsync } = useUpdateCategory({ key })

  const handleSubmitCategory = async (values: SafeCategory) => {
    try {
      const payload = {
        ...initialCategory,
        ...values,
        id: initialCategory?.id ?? -1
      }

      if (payload.id === -1) {
        await createMutateAsync(payload);
      } else {
        await updateMutateAsync({ id: payload.id, updates: payload });
      }
      onClose();
    } catch (error) {
      console.error('[AddEditCategoryModal] Failed to save category:', error);
    }
  };

  return (
    <CUModalHolder onClose={onClose} title={initialCategory.id === -1 ? "Create Category" : "Edit Category"} visible={visible}>
      <Formik<SafeCategory>
        initialValues={initialCategory}
        validationSchema={addEditCategoryValidation}
        onSubmit={handleSubmitCategory}
        enableReinitialize
      >
        {(formik) => (
          <React.Fragment>
            <InputField
              name="name"
              label="Name"
              required
              placeholder="Enter category name"
              containerStyle={framework.mb2}
            />

            <ColorPickerField
              name='color'
              label='Color'
              required
              containerStyle={framework.mb4}
            />

            <IconPickerField
              name='icon'
              label='Icon'
              required
              containerStyle={framework.mb4}
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

export default AddEditCategoryModal;
