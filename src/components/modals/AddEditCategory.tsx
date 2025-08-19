import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { SafeCategory } from '../../types/schemas';
import { createCategory, updateCategory } from '../../api/crud/categories';
import framework from '../../styles/framework';
import InputField from '../forms/InputField';
import { addEditCategoryValidation } from '../../constants/formValidation';
import { AddEditCategoryModalProps } from '../../types/modals';
import ColorPickerField from '../forms/ColorPickerField';
import IconPickerField from '../forms/IconPickerField';
import Button from '../forms/Button';

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
        <KeyboardAvoidingView behavior='height' style={[framework.w100, framework.justifyCenter]}>
          <TouchableWithoutFeedback>
            <View style={[framework.bgBackground, framework.p4, framework.roundedMd, framework.shadowMedium]}>
              <Text style={[framework.bgMain, framework.mb4, framework.py2, framework.px4, framework.roundedBottomMd, framework.textCenter, framework.fontBold, framework.textXl, framework.reversedText]}>
                {initialCategory?.id === -1 ? 'Add New Category' : 'Edit Category'}
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Formik<SafeCategory>
                  initialValues={initialCategory}
                  validationSchema={addEditCategoryValidation}
                  onSubmit={handleSubmitCategory}
                  enableReinitialize
                >
                  {(formik) => (
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
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

export default AddEditCategoryModal;
