import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { globalStyles } from '../../theme/globalStyles'

interface Props {
  status: (res: boolean) => void
  state: boolean
  title: string
}

const CheckOthersCar = ({ status, state, title }: Props) => {
  const [statusCheck, setStatusCheck] = useState(false)

  useEffect(() => {
    setStatusCheck(state)
  }, [state])

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 70 }}>
      <Text style={[globalStyles.Text, { flex: 1, left: 5, color: '#717171' }]}>
        {title}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          width: 80,
          justifyContent: 'space-evenly',
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              statusCheck
                ? (setStatusCheck(true), status(false))
                : (setStatusCheck(false), status(true))
            }}
            style={{
              borderRadius: 100,
              borderColor: !statusCheck ? '#717171' : '#F2BC23',
              borderWidth: 2.5,
              height: 20,
              width: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {statusCheck && (
              <View
                style={{
                  borderRadius: 100,
                  backgroundColor: '#F2BC23',
                  height: 10,
                  width: 10,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default CheckOthersCar
