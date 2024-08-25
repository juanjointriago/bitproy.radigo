import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useState } from 'react'
import { Checkbox } from 'react-native-paper'

interface Props {
  icon: any
  styleCheck?: ViewStyle
  styleContainer?: ViewStyle
  styleIcon?: ViewStyle
  size?: number
  value: any
  description?: string
  name?: string
  onChange: (value: any, name: any) => void
  selectedExtras: any[]
  title?:string
}

const CheckboxBtn = ({
  icon,
  styleContainer,
  styleIcon,
  value,
  // description,
  onChange,
  name,
  selectedExtras,
  title
}: Props) => {
  const [checked, setChecked] = useState(selectedExtras.includes(value))

  const handleToggle = () => {
    const newValue = !checked
    setChecked(newValue)
    const updatedExtras = newValue
      ? [...selectedExtras, value]
      : selectedExtras.filter((item) => item !== value)
    onChange(updatedExtras, name)
  }

  return (
    <View style={{ ...styles.btncheck, ...styleContainer }}>
      <View style={{ ...styleIcon, ...styles.styleIcon1 }}>{icon}</View>
      <Text> {title} </Text>

      <View
        style={{
          elevation: 6,
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.32,
          shadowRadius: 6.46,
          borderRadius: 8,
          backgroundColor: '#F2F2F2',
          marginHorizontal: 10,
        }}
      >
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={handleToggle}
          color="black"
          uncheckedColor="transparent"
        />
      </View>
    </View>
  )
}

export default CheckboxBtn

const styles = StyleSheet.create({
  btncheck: {
    flexDirection: 'row',
    height: 50,
    marginVertical: 5,
    alignItems: 'center',
  },
  styleIcon1: {
    left: 10,
    marginHorizontal: 20,
  },
})
