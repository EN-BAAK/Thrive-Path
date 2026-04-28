import React, { useEffect } from "react";
import { View } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ToastProps } from "../types/components";
import framework from "../styles/framework";
import { toastConfig } from "../constants/global";

const Toast: React.FC<ToastProps> = ({ onClose, toast }) => {
  const config = toastConfig[toast.type];
  const title = toast.title || config.title

  useEffect(() => {
    const timer = setTimeout(onClose, 1500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Surface style={[framework.card, framework.w75, framework.p4, framework.roundedMd,]}
      elevation={4}
    >
      <View style={[framework.mb3, framework.flexOne, framework.flexRow, framework.alignCenter, framework.gap2]}>
        <Icon name={config.icon} size={26} color={config.iconColor} />

        <Text style={[[framework.flexOne, framework.textCapitalize, framework.fontSemibold, framework.textBase], { color: config.titleColor }]}>
          {title}
        </Text>
      </View>

      <IconButton icon="close" size={15} iconColor={config.iconColor} style={[framework.absolute, framework.top0, framework.right0]} onPress={onClose} />

      <Text style={[[framework.textSm, framework.lineHeightSm], { color: config.messageColor }]}>
        {toast.message}
      </Text>

    </Surface>
  );
};

export default Toast;