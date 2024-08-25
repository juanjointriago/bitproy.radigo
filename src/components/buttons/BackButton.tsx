import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  BCBUTTON,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TEXT2,
} from '../../theme/globalStyles'
import { useNavigation } from '@react-navigation/native'

interface Props {
  style?: StyleProp<ViewStyle>
}

export const BackButton = ({ style }: Props) => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack()
      }}
      style={{
        zIndex: 9999,
        height: 50,
        width: 50,
        borderColor: BCBUTTON,
        borderWidth: 2,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'white',
        position: 'absolute',
        top: 0,
        left: 20,
        ...(style as any),
      }}
    >
      <Ionicons name="arrow-back" size={35} color={BCBUTTON} />
    </TouchableOpacity>
  )
}
