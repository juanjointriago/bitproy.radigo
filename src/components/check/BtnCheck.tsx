import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SECONDARY_COLOR } from '../../theme/globalStyles'
import { PRIMARY_COLOR } from '../../theme/globalStyles'

interface Props{
    checkStatus:(res:boolean)=> void
}

const BtnCheck = ({checkStatus}:Props) => {
    const [isEnabled, setIsEnabled] = useState(false)

    const toggleSwitch = () => {
        setIsEnabled((previousState) => !previousState)
        checkStatus(isEnabled)
      }

  return (
    <TouchableOpacity
      onPress={() => {
        toggleSwitch()
      }}
      style={{
        width: 25,
        height: 25,
        borderRadius: 100,
        borderColor: isEnabled?PRIMARY_COLOR: SECONDARY_COLOR,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 15,
          height: 15,
          borderRadius: 100,
          backgroundColor:isEnabled? PRIMARY_COLOR: SECONDARY_COLOR,
        }}
      />
    </TouchableOpacity>
  )
}

export default BtnCheck
