import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import {
  FontAwesome5,
  AntDesign,
  Feather,
  MaterialIcons,
} from '@expo/vector-icons'
import { WHITE, globalStyles } from '../../theme/globalStyles'

interface Props {
  onCheckPress: (status: boolean) => void
  onDeletePress: () => void
  onEditPress: () => void
  name: string
  plate: string
  stateSelect: boolean
  stateActive: boolean
  styleContent?: ViewStyle
}

const CardCar = ({
  stateActive,
  onCheckPress,
  onDeletePress,
  onEditPress,
  name,
  plate,
  stateSelect, styleContent
}: Props) => {
  const [isChecked, setIsChecked] = useState(stateSelect)

  const handleCheckPress = () => {
    setIsChecked(!isChecked)
    if (onCheckPress) {
      onCheckPress(!isChecked) // Pasa el estado actualizado como argumento
    }
  }


  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        height: 120,
        borderBottomColor: 'black',
        borderBottomWidth: 1, ...styleContent
      }}
    >
      {!stateActive &&
        <Text style={{ position: 'absolute', textAlign: 'auto', right: 20, top: 10, color: WHITE, fontSize: 18, fontWeight: '700' }}>Desactivado</Text>
      }

      <View
        style={{
          width: 100,
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingRight: 15,
        }}
      >
        <FontAwesome5 name="car" size={50} style={{ color: 'black' }} />
      </View>

      <View style={{ width: '35%', justifyContent: 'center' }}>
        <Text style={[globalStyles.Text]}> {plate} </Text>
        <Text style={[globalStyles.Title]}> {name} </Text>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        {stateActive && (
          <TouchableOpacity onPress={handleCheckPress}>
            <AntDesign
              name={isChecked ? 'checkcircle' : 'checkcircleo'}
              size={25}
              color={isChecked ? 'green' : 'black'}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onEditPress}>
          <Feather name="edit" size={24} color="#F2BC23" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDeletePress}>
          <MaterialIcons name="delete-outline" size={30} color="#F54545" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CardCar
