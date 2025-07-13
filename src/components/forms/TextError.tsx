import React from 'react';
import { Text } from 'react-native';
import { TextErrorProps } from '../../types/forms';
import framework from '../../styles/framework';

const TextError: React.FC<TextErrorProps> = ({ msg }): React.JSX.Element => {
  return <Text style={[framework.mt4, framework.fontSemiBold, framework.textSm, framework.textDanger]}>{msg}</Text>;
};

export default TextError;
