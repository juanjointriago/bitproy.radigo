import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { PRIMARY_COLOR, globalStyles } from '../../theme/globalStyles'
import TextLogOut from '../Text/TextLogOut'
interface Props {
  title: string | undefined
  styleView?: StyleProp<ViewStyle>
  onPress?: () => void
}

export const MenuItem = ({ title, styleView, onPress }: Props) => {
  return (
    <View style={{ ...(styleView as any), ...styles.content }}>
      <TouchableOpacity onPress={onPress}>
        <View style={{ flexDirection: 'row' }}>
            
          <View style={{ width: 200, height: 30, justifyContent: 'flex-end' }}>
          <TextLogOut text="Cerrar sesión " styleTitle={{
            ...globalStyles.Text4,
          
          }}/>
          
          </View>

        </View>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  content: {
    marginHorizontal: 15,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
})
