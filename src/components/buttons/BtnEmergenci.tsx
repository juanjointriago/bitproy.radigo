import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalStyles } from '../../theme/globalStyles'
import { Ionicons } from '@expo/vector-icons'

interface Props {
  title: string
  description: string
  func: () => void
}

const BtnEmergenci = ({ title, func, description }: Props) => {
  return (
    <TouchableOpacity
      onPress={func}
      style={{
        width: '90%',
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F1F1',
        borderRadius: 20,
        height: 120,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 10,
          height: 7,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10.49,

        elevation: 12,
      }}
    >
      <View>
        <Text
          style={[
            globalStyles.Text4,
            { color: 'black', fontSize: 18, right: 10, marginBottom: 10 },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            globalStyles.Text3,
            { color: 'black', fontSize: 15, width: 260 },
          ]}
        >
          {description}
        </Text>
      </View>

      <View
        style={{
          width: 60,
          height: 60,
          backgroundColor: '#E8272C',
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name="call" size={38} color="white" />
      </View>
    </TouchableOpacity>
  )
}

export default BtnEmergenci
