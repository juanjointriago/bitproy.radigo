import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import BtnCircle from '../buttons/BtnCircle'
import {
  MaterialIcons,
  Feather,
  Ionicons,
  AntDesign,
  Entypo,
} from '@expo/vector-icons'
import BtnRequests from '../buttons/BtnRequests'
import { ALERT, INPUT1, PRIMARY_COLOR } from '../../theme/globalStyles'
import { TravelContext } from '../../contexts/Travel/TravelContext'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import * as Location from 'expo-location'
import { API_HOST_IMG } from '../../service/helpers/constants'

interface Props {
  btnCenter?: () => void
  btnLoadTravels?: () => void
  btnSos: () => void
  btnNavigation?: () => void
  btnChat: () => void
  btnChatAdmin: () => void
  dontShowUp?: () => void
  navigationState: any
  statusClient: boolean
  statusOnBoard?: boolean
  btnStateTypeTravel?: (res: boolean) => void
  stateTypeTravelBtn: boolean
  numberTravels?: number
  arrived: boolean
  newMessage: boolean
}

const MapDriverBtns = ({
  btnChatAdmin,
  newMessage,
  arrived,
  numberTravels = 0,
  stateTypeTravelBtn,
  btnStateTypeTravel,
  btnCenter,
  btnLoadTravels,
  btnSos,
  btnNavigation,
  navigationState,
  statusClient,
  btnChat,
  dontShowUp,
  statusOnBoard,
}: Props) => {
  const { dataTravelContext, changeTravel } = useContext(TravelContext)
  const { user } = useContext(AuthContext)
  const [stateTypeTravel, setStateTypeTravel] = useState(false)

  useEffect(() => {
    if (!btnStateTypeTravel) return
    btnStateTypeTravel(stateTypeTravel)
  }, [stateTypeTravel])

  useEffect(() => {
    setStateTypeTravel(stateTypeTravelBtn)
  }, [stateTypeTravelBtn])

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        zIndex: 999,
        paddingTop: 10,
      }}
    >
      {!statusClient && dataTravelContext.dataTravel.id === 0 && (
        <View
          style={{
            width: '100%',
            marginTop: 20,
            paddingVertical: 10,
            paddingHorizontal: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <BtnCircle
            func={btnCenter}
            icon={<MaterialIcons name="gps-fixed" size={24} color="black" />}
            styleBtn={{ justifyContent: 'flex-end', height: 40, width: 40 }}
            styleIcon={{ bottom: 5 }}
          ></BtnCircle>

          <BtnRequests func={btnLoadTravels} text={numberTravels} />
        </View>
      )}

      <View
        style={{
          width: '100%',
          paddingVertical: 10,
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        {dataTravelContext.dataTravel.id !== 0 ? (
          <>
            {statusClient ? (
              <>
                <View
                  style={{ justifyContent: 'flex-end', height: 40, width: 40 }}
                />
              </>
            ) : (
              <>
                <BtnCircle
                  func={btnNavigation}
                  icon={
                    <Feather
                      name="navigation"
                      size={25}
                      color={navigationState ? 'white' : 'black'}
                    />
                  }
                  styleIcon={{ right: 3 }}
                  styleBtn={{
                    justifyContent: 'flex-end',
                    height: 40,
                    width: 40,
                    backgroundColor: navigationState ? 'red' : 'white',
                  }}
                ></BtnCircle>
              </>
            )}
          </>
        ) : (
          <>
            <BtnCircle
              func={btnNavigation}
              icon={
                <Feather
                  name="navigation"
                  size={25}
                  color={navigationState ? 'white' : 'black'}
                />
              }
              styleIcon={{ right: 3 }}
              styleBtn={{
                justifyContent: 'flex-end',
                height: 40,
                width: 40,
                backgroundColor: navigationState ? 'red' : 'white',
              }}
            ></BtnCircle>
          </>
        )}

        <BtnCircle
          func={btnSos}
          styleBtn={{ backgroundColor: ALERT, height: 45, width: 45 }}
          text="S.O.S"
        ></BtnCircle>
      </View>

      {dataTravelContext.dataTravel.status_id === 0 && user?.role_id !== 3 && (
        <View
          style={{
            width: '100%',
            alignItems: 'flex-end',
          }}
        >
          <BtnCircle
            func={() => {
              stateTypeTravelBtn
                ? (setStateTypeTravel(false),
                  changeTravel({
                    ...dataTravelContext.dataTravel,
                    type_service_id: 1,
                  }))
                : (setStateTypeTravel(true),
                  changeTravel({
                    ...dataTravelContext.dataTravel,
                    type_service_id: 2,
                  }))
            }}
            styleText={{ fontSize: 8 }}
            styleBtn={{
              backgroundColor: stateTypeTravelBtn ? PRIMARY_COLOR : INPUT1,
              height: 45,
              width: 45,
              marginRight: 8,
            }}
            text={stateTypeTravelBtn ? 'Viaje' : 'Encargos'}
          ></BtnCircle>
        </View>
      )}

      <View
        style={{
          width: '100%',
          paddingVertical: 10,
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        {dataTravelContext.dataTravel.status_id === 2 &&
        statusOnBoard &&
        arrived ? (
          <>
            <TouchableOpacity
              onPress={dontShowUp}
              style={{
                width: 200,
                height: 50,
                backgroundColor: 'red',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '900' }}>
                No se presento
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={{ width: 200, height: 50 }} />
        )}

        {dataTravelContext.dataTravel.status_id === 2 ? (
          <>
            {newMessage && (
              <View
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 100,
                  backgroundColor: 'red',
                  position: 'absolute',
                  right: 10,
                  zIndex: 999,
                  top: 10,
                }}
              />
            )}
            <BtnCircle
              func={btnChat}
              icon={
                <Ionicons name="chatbubbles-outline" size={25} color="black" />
              }
              styleBtn={{ height: 45, width: 45 }}
            ></BtnCircle>
          </>
        ) : (
          <>
            {newMessage && (
              <View
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 100,
                  backgroundColor: 'red',
                  position: 'absolute',
                  right: 10,
                  zIndex: 999,
                  top: 10,
                }}
              />
            )}
            {user?.role_id === 3 && (
              <BtnCircle
                func={btnChatAdmin}
                icon={
                  <Ionicons
                    name="chatbubbles-outline"
                    size={25}
                    color="black"
                  />
                }
                styleBtn={{
                  height: 45,
                  width: 45,
                  backgroundColor: PRIMARY_COLOR,
                }}
              ></BtnCircle>
            )}
          </>
        )}
      </View>

      {dataTravelContext.dataTravel.status_id === 2 ? (
        <>
          <View
            style={{
              width: '100%',
              alignItems: 'flex-end',
              right: 10,
              marginTop: 10,
            }}
          >
            <BtnCircle
              func={async () => {
                let currentLocation = await Location.getCurrentPositionAsync({
                  accuracy: Location.LocationAccuracy.Balanced,
                })
                if (currentLocation) {
                  const imgUrl = `${API_HOST_IMG}/profile/${
                    user?.role_id === 3
                      ? dataTravelContext.dataTravel.client.photo
                      : dataTravelContext.dataTravel.driver.photo
                  }`

                  const url = `https://www.google.com/maps/place/${currentLocation.coords.latitude},${currentLocation.coords.longitude}`
                  const message = `¡Mira mi ubicación en el mapa!\nUbicación: ${url}\nNombre del ${
                    user?.role_id === 3 ? 'Cliente' : 'Conductor'
                  }: ${
                    user?.role_id === 3
                      ? dataTravelContext.dataTravel.client.full_name
                      : dataTravelContext.dataTravel.driver.full_name
                  }\nImagen: ${imgUrl}${
                    user?.role_id === 4
                      ? `\nPlaca: ${dataTravelContext.dataTravel.car.plate}\nModelo: ${dataTravelContext.dataTravel.car.model}\nColor: ${dataTravelContext.dataTravel.car.color}`
                      : ''
                  }`

                  const encodedMessage = encodeURIComponent(message)

                  try {
                    const intentUrl = `whatsapp://send?text=${encodedMessage}`
                    await Linking.openURL(intentUrl)
                  } catch (error) {
                    console.error('Error sharing location to WhatsApp:', error)
                  }
                }
              }}
              icon={<AntDesign name="sharealt" size={25} color="black" />}
              styleBtn={{ height: 45, width: 45 }}
            ></BtnCircle>

            <BtnCircle
              icon={<Entypo name="map" size={24} color="black" />}
              func={async () => {
                let currentLocation = await Location.getCurrentPositionAsync({
                  accuracy: Location.LocationAccuracy.Balanced,
                })
                if (currentLocation) {
                  const scheme = Platform.select({
                    ios: 'maps://0,0?q=',
                    android: 'geo:0,0?q=',
                  })
                  const latLng = `${currentLocation.coords.latitude},${currentLocation.coords.longitude}`
                  const label = 'Custom Label'
                  const url = Platform.select({
                    ios: `${scheme}${label}@${latLng}`,
                    android: `${scheme}${latLng}(${label})`,
                  })

                  Linking.openURL(url)
                }
              }}
              styleBtn={{ height: 45, width: 45, marginTop: 20 }}
            ></BtnCircle>
          </View>
        </>
      ) : (
        <></>
      )}
    </View>
  )
}

export default MapDriverBtns
