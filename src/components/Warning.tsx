import React from "react";
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Text, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { WarningProps } from "../types/components";
import framework from "../styles/framework";
import Variables from "../styles/variables";
import colors from "../styles/colors";

const Warning: React.FC<WarningProps> = ({ onClose, warning }) => {
  const handleClose = () => {
    if (warning.handleBtn1) warning.handleBtn1()
    onClose()
  }

  return (
    <Modal visible transparent animationType="slide">
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
        style={[framework.bgLayout, framework.flexOne, framework.p5, framework.justifyCenter]}
      >
        <TouchableWithoutFeedback >
          <View style={[framework.card, framework.p5, framework.roundedLg, framework.gap4]}>

            <View style={[framework.pb3, framework.flexRow, framework.alignCenter, framework.gap3, framework.borderBottom1]}>
              <Icon name="alert" size={40} color="#F59E0B" />
              <Text style={[framework.fontBold, framework.textXl, framework.text]}>Warning</Text>
            </View>

            <Text style={[framework.lineHeightSm, framework.textBase, framework.textMuted]}>{warning.message}</Text>

            <View style={[framework.flexRow, framework.gap3]}>
              <Button mode="outlined" onPress={handleClose} style={[framework.flexOne]} textColor={Variables.textColor}
              >
                {warning.btn1}
              </Button>

              <Button mode="contained" onPress={() => { warning.handleBtn2(); handleClose(); }} buttonColor={colors.danger} textColor={Variables.reversedTextColor} style={[framework.flexOne]}>
                {warning.btn2}
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default Warning;