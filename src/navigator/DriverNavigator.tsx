import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { HomeDriverScreen } from '../screens/driver/HomeDriverScreen'
import MyCarsScreen from '../screens/driver/MyCarsScreen'
import RegisterVehicleScreen from '../screens/driver/RegisterVehicleScreen'
import EditProfileScreen from '../screens/shared/EditProfileScreen'
import { useNotification } from '../service/hooks/useNotification'
const Stack = createStackNavigator()

export const DriverNavigator = () => {
  const {registerForPushNotificationsAsyn} = useNotification()
  useEffect(() => {
    registerForPushNotificationsAsyn()
  }, [])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}
    >
      <Stack.Screen name="HomeDriverScreen" component={HomeDriverScreen} />
      <Stack.Screen name="MyCarsScreen" component={MyCarsScreen} />
      <Stack.Screen name="RegisterVehicleScreen" component={RegisterVehicleScreen} />
      
    </Stack.Navigator>
  )
}
