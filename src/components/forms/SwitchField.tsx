import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useField } from 'formik';
import framework from '../../styles/framework';
import { SwitchFieldProps } from '../../types/forms';

const SwitchField: React.FC<SwitchFieldProps> = ({
  name,
  label,
  containerStyle,
  labelStyle,
  trackColor,
  thumbColor
}) => {
  const [field, , helpers] = useField(name);

  return (
    <View style={[framework.flexRow, framework.alignCenter, framework.justifyBetween, containerStyle]}>
      {label && (
        <Text style={[framework.textBase, labelStyle]}>
          {label}
        </Text>
      )}
      <Switch
        value={field.value}
        onValueChange={(val) => {
          helpers.setValue(val);
        }}
        thumbColor={field.value ? thumbColor.true : thumbColor.false}
        trackColor={trackColor}
      />
    </View>
  );
};

export default SwitchField;
