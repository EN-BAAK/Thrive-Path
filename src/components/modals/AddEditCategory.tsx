import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Formik } from 'formik';
import { SafeCategory } from '../../types/schemas';
import { createCategory, updateCategory } from '../../api/crud/categories';
import framework from '../../styles/framework';
import InputField from '../forms/InputField';
import { addEditCategoryValidation } from '../../constants/formValidation';
import { AddEditCategoryModalProps } from '../../types/modals';
import ColorPickerField from '../forms/ColorPickerField';
import IconPickerField from '../forms/IconPickerField';

const AddEditCategoryModal: React.FC<AddEditCategoryModalProps> = ({
  visible,
  onClose,
  onSave,
  initialCategory,
}) => {
  const handleSubmitCategory = async (values: SafeCategory) => {
    try {
      const payload = {
        ...initialCategory,
        ...values,
        id: initialCategory?.id ?? -1
      }

      if (payload.id === -1) {
        await createCategory(payload);
      } else {
        await updateCategory(payload.id, payload);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('[AddEditCategoryModal] Failed to save category:', error);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        style={[framework.bgLayout, framework.flexOne, framework.justifyCenter, framework.px3]}
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <View style={[framework.bgBackground, framework.p4, framework.roundedMd, framework.shadowMedium]}>
            <Text style={[framework.bgMain, framework.mb4, framework.py2, framework.px4, framework.roundedBottomMd, framework.textCenter, framework.fontBold, framework.textXl, framework.reversedText]}>
              {initialCategory?.id === -1 ? 'Add New Category' : 'Edit Category'}
            </Text>

            <Formik<SafeCategory>
              initialValues={initialCategory}
              validationSchema={addEditCategoryValidation}
              onSubmit={handleSubmitCategory}
              enableReinitialize
            >
              {({ handleSubmit }) => (
                <>
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
      </TouchableOpacity>
    </Modal>
  );
};

export default AddEditCategoryModal;
