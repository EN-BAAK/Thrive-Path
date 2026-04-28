import React from 'react'
import { CUModalHolderProps } from '../types/layout'
import { KeyboardAvoidingView, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import framework from '../styles/framework'

const CUModalHolder: React.FC<CUModalHolderProps> = ({ children, visible, onClose, title }) => {
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <TouchableOpacity
        activeOpacity={1}
        style={[framework.bgLayout, framework.flexOne, framework.justifyCenter, framework.px3]}
        onPress={onClose}
      >
        <KeyboardAvoidingView behavior='height' style={[framework.w100, framework.justifyCenter]} keyboardVerticalOffset={0}>
          <TouchableWithoutFeedback>
            <View style={[framework.bgBackground, framework.p4, framework.roundedMd, framework.shadowMedium]}>
              <Text style={[framework.bgMain, framework.mb4, framework.py2, framework.px4, framework.roundedBottomMd, framework.textCenter, framework.fontBold, framework.textXl, framework.reversedText,]}>
                {title}
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {children}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  )
}

export default CUModalHolder