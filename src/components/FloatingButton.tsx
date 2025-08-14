import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import framework from '../styles/framework'
import { FloatingButtonProps } from '../types/components'


const FloatingButton: React.FC<FloatingButtonProps> = ({ msg, action, top = "auto", right = "auto", bottom = "auto", left = "auto" }): React.ReactNode => {
  return (
    <TouchableOpacity
      onPress={action}
      style={[framework.bgMain, framework.px4, framework.py2, framework.rounded, framework.absolute,
      { top, right, bottom, left }]}
    >
      <Text style={[framework.fontBold, framework.reversedText]}>{msg}</Text>
    </TouchableOpacity>
  )
}

export default FloatingButton