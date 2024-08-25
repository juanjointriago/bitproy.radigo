import React, { useContext, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import WaitingDriverScreen from '../screens/citizen/WaitingDriverScreen'
import { HomeCitizenScreen } from '../screens/citizen/HomeCitizenScreen'
import { TravelContext } from '../contexts/Travel/TravelContext'
import { useNotification } from '../service/hooks/useNotification'

const Stack = createStackNavigator()

export const CitizenNavigator = () => {
  const { dataTravelContext } = useContext(TravelContext)
  const { registerForPushNotificationsAsyn } = useNotification()
  
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
      {dataTravelContext.dataTravel.status_id === 1 &&
      (dataTravelContext.dataTravel.driver?.id === 0 ||
        dataTravelContext.dataTravel.driver === null) ? (
        <Stack.Screen
          name="WaitingDriverScreen"
          component={WaitingDriverScreen}
        />
      ) : (
        <Stack.Screen name="HomeCitizenScreen" component={HomeCitizenScreen} />
      )}
    </Stack.Navigator>
  )
}
