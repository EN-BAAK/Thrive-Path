import React from 'react'
import framework from '../styles/framework'
import { FloatingButtonProps } from '../types/components'
import Button from './forms/Button'


const FloatingButton: React.FC<FloatingButtonProps> = ({ msg, action, top = "auto", right = "auto", bottom = "auto", left = "auto" }): React.ReactNode => {
  return (
    <Button
      onPress={action}
      msg={msg}
      style={[framework.absolute, { top, right, bottom, left }]}
    />
  )
}

export default FloatingButton