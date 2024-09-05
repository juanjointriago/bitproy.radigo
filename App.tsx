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

const LOCATION_TRACKING = 'background-location'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// const trackingTask = async (data: any) => {
//   if (AppState.currentState === 'active') return
//   await AsyncStorage.setItem('hasBackgroundData', 'SI')

//   // Emitir las coordenadas del coductor
//   const locations = (data as any).locations
//   // let travelStorageCollaborator = await AsyncStorage.getItem("progress_trip");

//   const travelStorage = await AsyncStorage.getItem('travelStorage')
//   if (!travelStorage) return

//   const dataLocal: InterfaceTravelById = JSON.parse(travelStorage)

//   // Calcular la distancia recorrida
//   const lastLocationTrackedStorage = await AsyncStorage.getItem(
//     'lastLocationTracked',
//   )

//   if (!lastLocationTrackedStorage) return
//   let lastLocationTracked = JSON.parse(lastLocationTrackedStorage) as LatLng
//   let prevLatLng: LatLng = { ...lastLocationTracked }
//   let newLatLng: LatLng = {
//     latitude: locations[0].coords.latitude,
//     longitude: locations[0].coords.longitude,
//   }
//   let distanceTraveled = calculateDistanceKm({
//     location1: prevLatLng,
//     location2: newLatLng,
//   })

//   if (distanceTraveled > 0.03) {
//     const token = await AsyncStorage.getItem('token')

//     let socket = io(API_HOST, {
//       transports: ['websocket'],
//       autoConnect: true,
//       forceNew: true,
//       query: {
//         Authorization: token,
//       },
//     })

//     socket?.emit('tracking-travel', {
//       idClient: dataLocal.client.id,
//       lat: locations[0].coords.latitude,
//       lng: locations[0].coords.longitude,
//     });

//     if (dataLocal.status_id === 5) {

//       let tripDistanceStorage = await AsyncStorage.getItem('tripDistance')
//       if (!tripDistanceStorage) return
//       const tripDistance = parseFloat(tripDistanceStorage)
//       const newTripDistance = tripDistance + distanceTraveled
//       lastLocationTracked = { ...newLatLng }

//       await AsyncStorage.setItem(
//         'lastLocationTracked',
//         JSON.stringify(lastLocationTracked),
//       )

//       await AsyncStorage.setItem('tripDistance', newTripDistance.toString());
//     }
//   }
// }

// TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
//   if (error) {
//     return
//   }
//   if (data) {
//     await trackingTask(data);
//   }
// })

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
  )
}
