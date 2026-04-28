import React from 'react'
import { View } from 'react-native'
import framework from '../styles/framework'
import { PageHolderProps } from '../types/layout'

const PageHolder: React.FC<PageHolderProps> = ({ children }) => {
  return (
    <View style={[framework.p0, framework.overflowHidden, framework.flexOne]}>
      {children}
    </View>
  )
}

export default PageHolder