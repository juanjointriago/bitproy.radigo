
import * as Location from "expo-location";
import { Alert, Linking, Platform } from "react-native";
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';




export const isForegroundLocationGranted = (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        const { granted } = await Location.requestForegroundPermissionsAsync()
        if (!granted) {
            resolve(false)
        } else {
            resolve(true)
        }
    })
}


export const isBackgroundLocationGranted = (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        const { granted } = await Location.requestForegroundPermissionsAsync()
        if (!granted) {
            const { status } = await Location.requestBackgroundPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert(
                    '',
                    `Permítenos acceder a tu ubicación en segundo plano todo el tiempo para que se registre el tracking de forma correcta.`,
                    [
                        {
                            style: 'cancel',
                            text: 'Cancelar',
                            onPress: () => {
                                resolve(false);
                            }
                        },
                        {
                            text: 'Actualizar',
                            onPress: async () => {
                                if (status === 'undetermined') {
                                    const { granted } = await Location.requestBackgroundPermissionsAsync();
                                    resolve(granted);
                                } else {
                                    if (Platform.OS === "android") {
                                        await startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);
                                    } else {
                                        Linking.openURL('app-settings:');
                                    }
                                    resolve(true);
                                }
                            }
                        }
                    ],
                    {
                        cancelable: false
                    }
                );
            } else resolve(true);
        } else {
            resolve(false)
        }
    })
}

