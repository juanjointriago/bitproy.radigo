import { View, Text, ViewStyle, Switch, Dimensions, TouchableOpacity } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import BtnCircle from '../buttons/BtnCircle'
import BtnImageUser from '../buttons/BtnImageUser'
import {
  ALERT,
  BACKGROUND,
  BCBUTTON,
  PRIMARY_COLOR,
  WHITE,
} from '../../theme/globalStyles'
import { Entypo } from '@expo/vector-icons'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import { API_HOST_IMG } from '../../service/helpers/constants'
import { useNavigation } from '@react-navigation/native'
import { TravelContext } from '../../contexts/Travel/TravelContext'

interface Props {
  driverStates?: boolean
  funcBtnCircle?: () => void
  styleHeader?: ViewStyle
  statusCheck: (res: boolean) => void
}
const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const Header = ({
  driverStates = false,
  funcBtnCircle,
  styleHeader,
  statusCheck,
}: Props) => {
  const { user } = useContext(AuthContext)
  const { dataTravelContext } = useContext(TravelContext)

  const navigation = useNavigation()
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    setIsEnabled(user?.is_available ? true : false)
  }, [])

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState)
    statusCheck(!isEnabled)
  }
  return (
    <View
      style={{
        width: '100%',
        top: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...styleHeader,
      }}
    >
      <BtnCircle
        func={funcBtnCircle}
        icon={<Entypo name="menu" size={35} color="black" />}
        styleIcon={{ bottom: screenHeight > 700 ? 4 : 2 }}
      ></BtnCircle>

      {driverStates ? (
        <>
          {dataTravelContext.dataTravel.status_id === 0 && (
            <>

              <TouchableOpacity onPress={() => {
                toggleSwitch()
              }} style={{
                justifyContent: 'center', alignItems: 'center', backgroundColor: isEnabled ? PRIMARY_COLOR : ALERT,
                borderRadius: 100, width: 140, height:55
              }}>
                <Text style={{fontSize:25, fontWeight:'800', color:isEnabled ? 'black' :WHITE}}>
                  {isEnabled ? "Libre" : "Ocupado"}
                </Text>
              </TouchableOpacity>
              {/* <Switch
              trackColor={{ false: '#767577', true: '#767577' }}
              thumbColor={isEnabled ? PRIMARY_COLOR : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            /> */}
            </>
          )}
        </>
      ) : (
        <></>
      )}
      <BtnImageUser
        func={() => navigation.navigate('EditProfileScreen' as never)}
        imgUrl={`${API_HOST_IMG}/profile/${user?.photo}`}
      ></BtnImageUser>
    </View>
  )
}

export default Header
