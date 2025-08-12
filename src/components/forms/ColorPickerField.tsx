import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { Field } from 'formik';
import WheelColorPicker from 'react-native-wheel-color-picker';
import TextError from './TextError';
import framework from '../../styles/framework';
import { ColorPickerFieldProps } from '../../types/forms';

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  name,
  label,
  required = false,
  containerStyle,
  labelStyle
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Field name={name}>
      {({ field, form, meta }: any) => (
        <View style={containerStyle}>
          {label && (
            <Text style={[framework.mb1, framework.fontSemiBold, framework.textSm, labelStyle]}>
              {label}
              {required && ' *'}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={[framework.px3, framework.py2, framework.border1, framework.borderLight, framework.rounded, { backgroundColor: field.value || '#ffffff' }]}
          >
            <Text style={framework.textCenter}>
              {field.value || 'Select Color'}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={showPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowPicker(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
              <View style={[framework.flexOne, framework.justifyCenter]}>
                <TouchableWithoutFeedback>
                  <View style={[styles.modalContent, framework.bgBackground, framework.mx4, framework.p4, framework.roundedMd]}>
                    <WheelColorPicker
                      color={field.value || '#ffffff'}
                      onColorChange={(color) => {
                        form.setFieldValue(name, color);
                      }}
                      onColorChangeComplete={(color) => {
                        form.setFieldValue(name, color);
                      }}
                      thumbSize={30}
                      sliderSize={30}
                      noSnap={true}
                      row={false}
                    />
                    <TouchableOpacity
                      style={[framework.mt3, framework.p2, framework.bgMain, framework.rounded]}
                      onPress={() => setShowPicker(false)}
                    >
                      <Text style={[framework.textCenter, framework.reversedText]}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {meta.touched && meta.error && <TextError msg={meta.error} />}
        </View>
      )}
    </Field>
  );
};

export default ColorPickerField;

const styles = StyleSheet.create({
  modalContent: {
    height: 500,
  }
});
