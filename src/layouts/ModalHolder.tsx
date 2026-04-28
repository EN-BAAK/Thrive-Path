import React from 'react'
import { ModalHolderProps } from '../types/layout'
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import framework from '../styles/framework'

const ModalHolder: React.FC<ModalHolderProps> = ({ onClose, title, visible, children }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={[framework.bgLayout, framework.flexOne, framework.justifyEnd,]} onPress={onClose} >
        <TouchableWithoutFeedback>
          <View style={[framework.card, framework.p4, framework.roundedTopLg, framework.gap2, framework.m0]}>
            <Text style={[framework.fontBold, framework.textLg, framework.text]}>{title}</Text>

            {children}
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  )
}

export default ModalHolder