import * as BackgroundFetch from "expo-background-fetch";
import Geolocation from "@react-native-community/geolocation";
import { LOCATION_TASK } from "./task";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from 'react-native-device-info';
import { InterfaceTravelById } from "../../interfaces/ITravel";
import { LatLng } from "react-native-maps";
import { calculateDistanceKm } from "../../service/helpers/geocoder";
import { io } from 'socket.io-client'
import { API_HOST } from "../../service/helpers/constants";



export const registerBGTask = async () => {
    console.debug('Registering task', { LOCATION_TASK })
    return BackgroundFetch.registerTaskAsync(LOCATION_TASK, {
        minimumInterval: 60 * 1,// near 1 minute interval 
        stopOnTerminate: false,
        startOnBoot: true,
    });
}


export const startTracking = async () => {
    const uniqueDeviceId = await DeviceInfo.getUniqueId();
    if (AppState.currentState === 'active') return
    await AsyncStorage.setItem('hasBackgroundData', 'SI')

    Geolocation.requestAuthorization(
        () => console.debug(' 🐕 ✅ geolocation-background-success'),
        () => console.warn(' 🐕 ❌ geolocation-background-fail'));
    // Emitir las coordenadas del coductor
    Geolocation.getCurrentPosition(
        async (position: any) => {
            const { coords } = position;
            const { latitude, longitude } = coords;
            console.debug('coords', { latitude, longitude }), Date.now().toLocaleString();
            const locations = (coords as any).locations
            // let travelStorageCollaborator = await AsyncStorage.getItem("progress_trip");

            const travelStorage = await AsyncStorage.getItem('travelStorage')
            if (!travelStorage) return

            const dataLocal: InterfaceTravelById = JSON.parse(travelStorage)

            // Calcular la distancia recorrida
            const lastLocationTrackedStorage = await AsyncStorage.getItem(
                'lastLocationTracked',
            )

            if (!lastLocationTrackedStorage) return
            let lastLocationTracked = JSON.parse(lastLocationTrackedStorage) as LatLng
            let prevLatLng: LatLng = { ...lastLocationTracked }
            let newLatLng: LatLng = {
                latitude: locations[0].coords.latitude,
                longitude: locations[0].coords.longitude,
            }
            let distanceTraveled = calculateDistanceKm({
                location1: prevLatLng,
                location2: newLatLng,
            })

            if (distanceTraveled > 0.03) {
                const token = await AsyncStorage.getItem('token')

                let socket = io(API_HOST, {
                    transports: ['websocket'],
                    autoConnect: true,
                    forceNew: true,
                    query: {
                        Authorization: token,
                    },
                })

                socket?.emit('tracking-travel', {
                    
                    // idClient: dataLocal.client.id,
                    idClient: uniqueDeviceId,
                    lat: locations[0].coords.latitude,
                    lng: locations[0].coords.longitude,
                });

                if (dataLocal.status_id === 5) {

                    let tripDistanceStorage = await AsyncStorage.getItem('tripDistance')
                    if (!tripDistanceStorage) return
                    const tripDistance = parseFloat(tripDistanceStorage)
                    const newTripDistance = tripDistance + distanceTraveled
                    lastLocationTracked = { ...newLatLng }

                    await AsyncStorage.setItem(
                        'lastLocationTracked',
                        JSON.stringify(lastLocationTracked),
                    )

                    await AsyncStorage.setItem('tripDistance', newTripDistance.toString());
                }

            }
        },
        (error: any) => console.warn({ error }),
        {
            enableHighAccuracy: false, timeout: 5000,
        }
    );

}
