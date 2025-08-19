import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { SessionCardProps } from '../../types/cards';
import framework from '../../styles/framework';
import Variables from '../../styles/variables';

const { width } = Dimensions.get('window');

const SessionCard: React.FC<SessionCardProps> = ({ title, description, icon, colors, navigateTo }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.cardWrapper} onPress={() => navigation.navigate(navigateTo)}>
      <LinearGradient colors={colors} style={[styles.card, framework.card, framework.m0, framework.p5, framework.flexCenter]}>
        <FontAwesome5 name={icon} size={40} color={Variables.reversedTextColor} />
        <Text style={[framework.mt3, framework.fontSemiBold, framework.textXl, framework.reversedText]}>{title}</Text>
        <Text style={[framework.mt1, framework.textCenter, framework.textSm, framework.reversedText]}>{description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default SessionCard;

const styles = StyleSheet.create({
  cardWrapper: {
    width: width / 2 - 16,
  },
  card: {
    height: 180,
  },
});
