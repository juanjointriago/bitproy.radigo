import { createContext, useEffect, useState } from 'react'
import { PermissionStatus } from 'expo-location'
import * as Location from 'expo-location'
import { AppState } from 'react-native'
import { useAlerts } from '../../service/hooks/useAlerts'
import * as Notifications from 'expo-notifications'
export interface PermissionsState {
  locationStatus: boolean | null
}

export const permissionInitState: PermissionsState = {
  locationStatus: null,
}

type PermissionsContextProps = {
  permissions: PermissionsState
  askLocationPermissions: () => void
  checkLocationPermissions: () => void
}

export const PermissionsLocationContext = createContext(
  {} as PermissionsContextProps,
)

export const PermissionsProvider = ({ children }: any) => {
  const [permissions, setPermissions] = useState(permissionInitState)

  useEffect(() => {
    AppState.addEventListener('change', (state) => {
      if (state !== 'active') return
      checkLocationPermissions()
    })
  }, [])

  useEffect(() => {
    if (permissions.locationStatus === true) return
    checkLocationPermissions()
  }, [])

  const askLocationPermissions = () => {
    return new Promise(async (resolve) => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      let {
        status: foregroundStatus,
      } = await Location.requestForegroundPermissionsAsync()
      let {
        status: backgroundStatus,
      } = await Location.requestBackgroundPermissionsAsync()


      if (
        foregroundStatus !== 'granted' ||
        backgroundStatus !== 'granted' ||
        existingStatus !== 'granted'
      ) {
        setPermissions({
          ...permissions,
          locationStatus: false,
        })

        resolve(false)
      } else {
        setPermissions({
          ...permissions,
          locationStatus: true,
        })
        resolve(true)
      }
    })
  }

  const checkLocationPermissions = async () => {
    let {
      status: foregroundStatus,
    } = await Location.getForegroundPermissionsAsync()
    let {
      status: backgroundStatus,
    } = await Location.getBackgroundPermissionsAsync()
    let {
      status: notificationState,
    } = await Notifications.getPermissionsAsync()

    if (
      foregroundStatus !== 'granted' ||
      backgroundStatus !== 'granted' ||
      notificationState !== 'granted'
    ) {
      setPermissions({
        ...permissions,
        locationStatus: false,
      })
    } else {
      setPermissions({
        ...permissions,
        locationStatus: true,
      })
    }
    return
  }

  return (
    <PermissionsLocationContext.Provider
      value={{
        permissions,
        askLocationPermissions,
        checkLocationPermissions,
      }}
    >
      {children}
    </PermissionsLocationContext.Provider>
  )
}
