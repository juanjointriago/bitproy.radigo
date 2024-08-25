import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../../theme/globalStyles'

interface Props {
  status: (res: boolean) => void
  state:boolean;
}

const CheckPay = ({ status,state }: Props) => {
  const [statusCheck, setStatusCheck] = useState(state|| false)
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height:70 }}>
      <Text style={[globalStyles.Text, { flex: 1, left: 5 }]}>
        Aceptas transferencias
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
                ? (setStatusCheck(false), status(false))
                : (setStatusCheck(true), status(true))
            }}
            style={{
              borderRadius: 100,
              borderColor: statusCheck ? '#F2BC23' : 'black',
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
          <Text style={globalStyles.Text}>Si</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              statusCheck
                ? (setStatusCheck(false), status(false))
                : (setStatusCheck(true), status(true))
            }}
            style={{
              borderRadius: 100,
              borderColor: statusCheck ? 'black' : '#F2BC23',
              borderWidth: 2.5,
              height: 20,
              width: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {!statusCheck && (
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
          <Text style={globalStyles.Text}>No</Text>
        </View>
      </View>
    </View>
  )
}

export default CheckPay
