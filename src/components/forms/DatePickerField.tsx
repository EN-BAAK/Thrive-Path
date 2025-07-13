import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useField } from 'formik';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import framework from '../../styles/framework';
import TextError from './TextError';
import { DatePickerFieldProps } from '../../types/forms';

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  name,
  label,
  containerStyle,
  labelStyle,
  required = false,
}) => {
  const [field, meta, helpers] = useField(name);

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: field.value ? new Date(field.value) : new Date(),
      mode: 'date',
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          helpers.setValue(selectedDate.toISOString());
        }
      },
    });
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[framework.mb1, framework.fontSemiBold, framework.textSm, framework.dark, labelStyle]}>
          {label}
          {required && ' *'}
        </Text>
      )}

      <TouchableOpacity
        onPress={openDatePicker}
        style={[framework.input, styles.dateInput]}
      >
        <Text style={field.value ? framework.textDark : framework.textMuted}>
          {field.value ? new Date(field.value).toDateString() : 'Select a date'}
        </Text>
      </TouchableOpacity>

      {meta.touched && meta.error && <TextError msg={meta.error} />}
    </View>
  );
};

const styles = StyleSheet.create({
  dateInput: {
    justifyContent: 'center',
    height: 44,
  },
});

export default DatePickerField;
