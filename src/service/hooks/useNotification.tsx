import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'

import { Platform, Linking } from 'react-native'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import Constants from 'expo-constants'
import { useAlerts } from './useAlerts'

export interface Message {
  app_id: string
  headings: Contents
  data: Data
  contents: Contents
  channel_for_external_user_ids: string
  include_external_user_ids: string[]
}

export interface Contents {
  en: string
}

export interface Data {
  ruta: string
  fecha: string
}

export const useNotification = () => {
  const { user, updateDataUser } = useContext(AuthContext)
  const { toast } = useAlerts()

  const registerForPushNotificationsAsyn = async () => {
    let token

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    if (Device.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!')
        return
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas.projectId,
        })
      ).data
      toast(token, 'SUCCESS')
    } else {
      alert('Must use physical device for Push Notifications')
    }

    return token
  }

  const updateToken = () => {
    registerForPushNotificationsAsyn().then(async (token) => {
      updateDataUser({ expo_token: token })
      toast('Token de notificación actualizado', 'WARNING')
    })
  }

  const sendMesaage = async (token: any, description: string, data?: {}) => {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        title: 'RadiGo',
        body: description,
        data,
        vibrate: [1, 5, 1],
        priority: 'high',
      }),
    })
  }
  return {
    updateToken,
    sendMesaage,
    registerForPushNotificationsAsyn,
  }
}
