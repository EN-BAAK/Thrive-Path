import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
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
      <View style={[framework.bgLayout, framework.flexOne, framework.justifyCenter, framework.px3]}>
        <View style={[framework.bgLight, framework.p4, framework.roundedMd, framework.shadowMedium]}>
          <Text style={[
            framework.bgPrimary,
            framework.mb4,
            framework.py2,
            framework.px4,
            framework.roundedBottomMd,
            framework.textCenter,
            framework.fontBold,
            framework.textXl,
            framework.textWhite
          ]}>
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
                  label='icon'
                  required
                  containerStyle={framework.mb4}
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

export default AddEditCategoryModal;
