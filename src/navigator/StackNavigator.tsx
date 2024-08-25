import { createStackNavigator } from '@react-navigation/stack'
import { useContext, useEffect, useState } from 'react'
import { PermissionsLocationContext } from '../contexts/LocationPermissions/PermissionsLocationContext'
import { SlideScreen } from '../screens/shared/SlideScreen'
import LoadingScreen from '../screens/shared/LoadingScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import SignUpScreen from '../screens/auth/SignUpScreen'
import { AuthContext } from '../contexts/Auth/AuthContext'
import { CitizenNavigator } from './CitizenNavigator'
import { DriverNavigator } from './DriverNavigator'
import { PermissionStatus } from 'expo-location'
import PermissionsLocationScreen from '../screens/shared/PermissionsLocationScreen'
import HistoryScreen from '../screens/shared/HistoryScreen'
import EditProfileScreen from '../screens/shared/EditProfileScreen'
import ProfileScreen from '../screens/shared/ProfileScreen'
import AccountBankScreen from '../screens/shared/AccountBankScreen'
import IdentityUserScreen from '../screens/shared/IdentityUserScreen'
const Stack = createStackNavigator()
import Constants from "expo-constants";
import { TermsScreen } from '../screens/shared/TermsScreen'
import { SupportScreen } from '../screens/shared/SupportScreen'
import ChatAdminScreen from '../screens/shared/ChatAdminScreen';
import { isBackgroundLocationGranted } from '../service/helpers/PermissionHelper'

const StackNavigator = () => {
  const { permissions } = useContext(PermissionsLocationContext)
  const { status, user } = useContext(AuthContext)
  const isExpoReactNative = Constants.appOwnership === "expo";
  const [locationPermission, setLocationPermission] = useState(false)

  const validateLocationPermission = async () => {
    const isGranted = await isBackgroundLocationGranted()
    setLocationPermission(isGranted)
  }

  useEffect(() => {
    validateLocationPermission();
  }, [])


  if (status === 'checking') return <LoadingScreen />

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}
    >
      {status !== 'authenticated' ? (
        <>
          <Stack.Screen name="SlideScreen" component={SlideScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        </>
      ) : (
        <>
          {
            // !isExpoReactNative && permissions.locationStatus === false ? 
            !isExpoReactNative && locationPermission ?
              (
                <>
                  <Stack.Screen name="PermissionsLocationScreen" component={PermissionsLocationScreen} />
                </>
              ) : (
                <>
                  {user?.role_id === 4 ? (
                    <Stack.Screen
                      name="CitizenNavigator"
                      component={CitizenNavigator}
                    />
                  ) : (
                    <Stack.Screen
                      name="DriverNavigator"
                      component={DriverNavigator}
                    />
                  )}
                </>
              )}

          <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="AccountBankScreen" component={AccountBankScreen} />
          <Stack.Screen name="IdentityUserScreen" component={IdentityUserScreen} />
          <Stack.Screen name="TermsScreen" component={TermsScreen} />
          <Stack.Screen name="SupportScreen" component={SupportScreen} />
          <Stack.Screen name="ChatAdminScreen" component={ChatAdminScreen} />


        </>
      )}
    </Stack.Navigator>
  )
}
export default StackNavigator
