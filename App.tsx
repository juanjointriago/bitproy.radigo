import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { PermissionsProvider } from './src/contexts/LocationPermissions/PermissionsLocationContext'
import useFont from './src/service/hooks/useFont'
import DrawerNavigator from './src/navigator/DrawerNavigator'
import { AuthProvider } from './src/contexts/Auth/AuthContext'
import { AlertNotificationRoot } from 'react-native-alert-notification'
import { TravelProvider } from './src/contexts/Travel/TravelContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SocketProvider } from './src/contexts/sockets/SocketContext'
// import * as TaskManager from 'expo-task-manager'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { InterfaceTravelById } from './src/interfaces/ITravel'
// import { LatLng } from 'react-native-maps'
// import { calculateDistanceKm } from './src/service/helpers/geocoder'
// import { io } from 'socket.io-client'
// import { API_HOST } from './src/service/helpers/constants'
import * as Notifications from 'expo-notifications';
import { BackgroundProvider } from './src/contexts/Background/BackgroundProvider'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

const LOCATION_TRACKING = 'background-location'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const AppStateApp = ({ children }: any) => {
  return (
    <PermissionsProvider>
      <AuthProvider>
        <BackgroundProvider>
          <TravelProvider>
            <SocketProvider>{children}</SocketProvider>
          </TravelProvider>
        </BackgroundProvider>
      </AuthProvider>
    </PermissionsProvider>
  )
}

export default function App() {
  const { loaded } = useFont();
  if (!loaded) {
    return null
  }
  return (
    <BottomSheetModalProvider>
      <AlertNotificationRoot>
        <NavigationContainer>
          <AppStateApp>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
              <DrawerNavigator />
            </SafeAreaView>
          </AppStateApp>
        </NavigationContainer>
      </AlertNotificationRoot>
    </BottomSheetModalProvider>
  )
}
