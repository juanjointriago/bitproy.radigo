import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager"
import { useAlerts } from "./useAlerts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InterfaceTravelById } from "../../interfaces/ITravel";
import * as BackgroundFetch from 'expo-background-fetch';

const LOCATION_TRACKING = "background-location";

const useBackground = () => {
    const { showAlert } = useAlerts();

     // Start location tracking in background
   const startBackgroundUpdate = async () => {
    const respGlobal = await AsyncStorage.getItem('travelStorage')
    if (!respGlobal){
     return stopBackgroundUpdate()
    }
    console.log("💫💫")

    // Don't track position if permission is not granted
   /*  const resp = await requestBackgroundPermission(); */
    const resp  = await Location.getBackgroundPermissionsAsync()
    if (!resp.granted) {
      await showAlert('Permisos de segundo plano denegados.', "DANGER");
      return 
    }

    // Make sure the task is defined otherwise do not start tracking
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TRACKING)
    if (!isTaskDefined) {
      console.log("Task is not defined")
      return
    }

    // Don't track if it is already running in background
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    )
    if (hasStarted) {
      console.log("Already started")
      return
    }

    // Start location tracking 
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.BestForNavigation,
      showsBackgroundLocationIndicator: true,
      distanceInterval: 15,
      foregroundService: {
        notificationTitle:  "RadiGo",
        notificationBody:  "Esta usando tu ubicación es segundo plano",
      },
    })
  }
    // Stop location tracking in background
    const stopBackgroundUpdate = async () => {
      const tasks = await TaskManager.getRegisteredTasksAsync()
      if (tasks.length === 0) return
      TaskManager.unregisterAllTasksAsync()
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TRACKING
      )
      if (hasStarted) {
        await Location.stopLocationUpdatesAsync(LOCATION_TRACKING)
        console.log("Location tacking stopped")
      } 
    }

  return {startBackgroundUpdate, stopBackgroundUpdate}
}

export default useBackground