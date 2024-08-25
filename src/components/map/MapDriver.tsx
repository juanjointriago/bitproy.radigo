import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  AppState,
} from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import MapView, {
  Callout,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps'
import * as Location from 'expo-location'
import MapDriverBtns from '../other/MapDriverBtns'
import MapViewDirections from 'react-native-maps-directions'
import { TravelContext } from '../../contexts/Travel/TravelContext'
import {
  API_HOST,
  API_HOST_IMG,
  GOOGLE_API_KEY,
} from '../../service/helpers/constants'
import { PRIMARY_COLOR } from '../../theme/globalStyles'
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { InterfaceTravelById, TravelByDriver } from '../../interfaces/ITravel'
import { SocketContext } from '../../contexts/sockets/SocketContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { calculateDistanceKm } from '../../service/helpers/geocoder'
import { useAlerts } from '../../service/hooks/useAlerts'
import { io } from 'socket.io-client'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import haversine from 'haversine'
import { useSocket } from '../../service/hooks/useSockets'

interface Props {
  btnLoadTravels: () => void
  btnSos: () => void
  dataSelectTravel: TravelByDriver
  statusOnBoard: boolean
  newMessage: boolean
  btnChat: () => void
  btnChatAdmin: () => void
  dontShowUp: () => void
  numberTravels?: number
  lastLocationTracked: React.MutableRefObject<LatLng>
  onChangeTripDistanceTrack: (distance: number) => void
  funcOnPress?: () => void;
}

const { width, height } = Dimensions.get('window')

export const MapDriver = ({
  newMessage,
  onChangeTripDistanceTrack,
  numberTravels,
  btnLoadTravels,
  btnSos,
  dataSelectTravel,
  statusOnBoard,
  btnChat,
  dontShowUp,
  lastLocationTracked,
  btnChatAdmin, funcOnPress
}: Props) => {
  const { dataTravelContext } = useContext(TravelContext)
  const { token } = useContext(AuthContext)
  const { toast } = useAlerts()
  const { conectarSocket } = useSocket(API_HOST)
  const [stateNavigation, setStateNavigation] = useState(false)
  const [userLocation, setUserLocation] = useState<LatLng>({
    longitude: 0,
    latitude: 0,
  })
  const navigationActiveRef = useRef(false)
  const mapRef = useRef<MapView>(null)
  const watchPositionSubscriptionRef = useRef<Location.LocationSubscription>()
  const stateCompassRef = useRef(false)
  const [magnetometer, setMagnetometer] = useState(0)
  const [arrived, setArrived] = useState(false)

  useEffect(() => {
    getCurrentLocation()
  }, [])

  useEffect(() => {
    if (dataTravelContext.dataTravel.status_id !== 0) {
      if (stateNavigation) {
       
        startNavigation()
      } else {

        handleNavigatorMap()
      }

    } else {
      stopNavigation()

    }
  }, [dataTravelContext.dataTravel.status_id, stateNavigation])


/*   const centerDirections = () => {
    const selectedTravel = dataTravelContext.dataTravel
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: selectedTravel.lat_end,
        longitude: selectedTravel.lng_end,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      })
      navigationActiveRef.current = false
      setStateNavigation(false)
      stopNavigation()
    }
  } */

  const getCurrentLocation = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({
      accuracy:Location.LocationAccuracy.Balanced
    })
    if (currentLocation) {
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.009,
            longitudeDelta: 0.009,
          })
        }
      }, 2000);
      setUserLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      })
    }
  }

  const handleCenterMap = async () => {
    const travelStorage = await AsyncStorage.getItem('travelStorage')
    if (!travelStorage) {
      if (mapRef.current) {
        getCurrentLocation()

        navigationActiveRef.current = false
        setStateNavigation(false)
        stateCompassRef.current = false

        stopNavigation()
      }
    } else {
      return toast(
        'Si hay un viaje en curso, no es posible activar esta función.',
        'WARNING',
      )
    }
  }

  const handleNavigatorMap = async () => {
    if (navigationActiveRef.current) {
      // Si la navegación ya está activa, se apaga
      const travelStorage = await AsyncStorage.getItem('travelStorage')
      if (!travelStorage) {
        navigationActiveRef.current = false
        setStateNavigation(false)
        stopNavigation()
      } else {
        navigationActiveRef.current = true
        setStateNavigation(true)
        stateCompassRef.current = true
        startNavigation()
      }
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        })
      }
    } else {
      // Si la navegación no está activa, se inicia
      navigationActiveRef.current = true
      setStateNavigation(true)
      stateCompassRef.current = true
      startNavigation()
    }
  }

  const startNavigation = async () => {
    let socket = io(API_HOST, {
      transports: ['websocket'],
      autoConnect: true,
      forceNew: true,
      query: {
        Authorization: token,
      },
    })
    /*     setStateMapTouch(false) */
    watchPositionSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        mayShowUserSettingsDialog: true,
        distanceInterval: 10,
      },
      async (location) => {
        const travelStorage = await AsyncStorage.getItem('travelStorage')
        if (!travelStorage) {
          let newLatLng: LatLng = location.coords
          if (lastLocationTracked.current.latitude === 0) return
          let prevLatLng: LatLng = { ...lastLocationTracked.current }
          const bearing = calculateBearing(
            prevLatLng.latitude,
            prevLatLng.longitude,
            newLatLng.latitude,
            newLatLng.longitude,
          )
          let distanceTraveled = calculateDistanceKm({
            location1: prevLatLng,
            location2: newLatLng,
          })

          if (distanceTraveled > 0.02) {
            if (stateCompassRef.current) {
              setMagnetometer(bearing)
              setUserLocation(location.coords)
            }
            lastLocationTracked.current = { ...newLatLng }
            await AsyncStorage.setItem(
              'lastLocationTracked',
              JSON.stringify(lastLocationTracked.current),
            )
          }
        } else {
          const hasBackgroundData = await AsyncStorage.getItem(
            'hasBackgroundData',
          )

          if (hasBackgroundData && hasBackgroundData === 'SI') return

          const dataLocal: InterfaceTravelById = JSON.parse(travelStorage)
          if (dataLocal.status_id !== 0) {
            let newLatLng: LatLng = location.coords

            if (lastLocationTracked.current.latitude === 0) return

            let prevLatLng: LatLng = { ...lastLocationTracked.current }

            const bearing = calculateBearing(
              prevLatLng.latitude,
              prevLatLng.longitude,
              newLatLng.latitude,
              newLatLng.longitude,
            )

            let distanceTraveled = calculateDistanceKm({
              location1: prevLatLng,
              location2: newLatLng,
            })

            if (distanceTraveled > 0.02) {
              socket?.emit('tracking-travel', {
                idClient: dataTravelContext.dataTravel.client.id,
                lat: location.coords.latitude,
                lng: location.coords.longitude,
              })

              if (stateCompassRef.current) {
                setMagnetometer(bearing)
                setUserLocation(location.coords)
              }
              lastLocationTracked.current = { ...newLatLng }
              await AsyncStorage.setItem(
                'lastLocationTracked',
                JSON.stringify(lastLocationTracked.current),
              )
            }

            let missingDistance = haversine(
              newLatLng,
              {
                latitude: dataLocal.lat_user,
                longitude: dataLocal.lng_user,
              },
              {
                unit: 'meter',
              },
            )
            if (missingDistance < 70) {
              setArrived(true)
            } else {
              setArrived(false)
            }

            if (dataLocal.status_id === 5) {
              const tripDistanceAuxLocal = await AsyncStorage.getItem(
                'tripDistance',
              )
              if (!tripDistanceAuxLocal) return
              if (distanceTraveled > 0.03) {
                const tripDistance = parseFloat(tripDistanceAuxLocal)
                await onChangeTripDistanceTrack(tripDistance + distanceTraveled)
              }
            }
          }
        }
      },
    )
  }

  const stopNavigation = () => {
    if (watchPositionSubscriptionRef.current) {
      watchPositionSubscriptionRef.current.remove()
      watchPositionSubscriptionRef.current = undefined
      setStateNavigation(false)    
    }
    setTimeout(() => {
    }, 2000);

    if (mapRef.current) {

      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      })
    }
  }

  function calculateBearing(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const dLon = lon2 - lon1
    const y = Math.sin(dLon) * Math.cos(lat2)
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
    let bearing = Math.atan2(y, x)
    bearing = (bearing * 180) / Math.PI
    bearing = (bearing + 360) % 360
    return bearing
  }

  const mapStyle = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#f5f5f5',
        },
      ],
    },
    {
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#616161',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#f5f5f5',
        },
      ],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#bdbdbd',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#eeeeee',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e5e5e5',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#ffffff',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#757575',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dadada',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#616161',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e',
        },
      ],
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e5e5e5',
        },
      ],
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [
        {
          color: '#eeeeee',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#c9c9c9',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9e9e9e',
        },
      ],
    },
  ]

  return (
    <View style={styles.container}>
      <MapDriverBtns
        btnChatAdmin={btnChatAdmin}
        newMessage={newMessage}
        arrived={arrived}
        stateTypeTravelBtn={false}
        numberTravels={numberTravels}
        btnChat={btnChat}
        dontShowUp={dontShowUp}
        statusOnBoard={statusOnBoard}
        statusClient={false}
        navigationState={stateNavigation}
        btnSos={btnSos}
        btnLoadTravels={btnLoadTravels}
        btnNavigation={handleNavigatorMap}
        btnCenter={handleCenterMap}
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={mapStyle}
        showsMyLocationButton={false}
        showsCompass={false}
        provider={'google'}
        onTouchStart={funcOnPress}
        pitchEnabled={false}
        zoomEnabled={true}
        camera={
            {
                heading: magnetometer,
                pitch: 0,
                zoom: 18,
                center: userLocation,
                altitude: 0,
              }
        }
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        }}
      >
        <Marker coordinate={userLocation}>
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: 'rgba(222, 237, 243, 0.70)',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
            }}
          >
            <MaterialIcons name="navigation" size={40} color="#1877F2" />
          </View>
        </Marker>

        {(dataSelectTravel.lat_end === 0 || dataSelectTravel.lat_end === 2) &&
        dataTravelContext.dataTravel.lat_end === 0 ? (
          <>
            {dataSelectTravel.id !== 0 ||
            dataTravelContext.dataTravel.id !== 0 ? (
              <>
                <Marker
                  coordinate={{
                    latitude:
                      dataSelectTravel.lat_user === 0
                        ? dataTravelContext.dataTravel.lat_user
                        : dataSelectTravel?.lat_user,
                    longitude:
                      dataSelectTravel.lng_user === 0
                        ? dataTravelContext.dataTravel.lng_user
                        : dataSelectTravel?.lng_user,
                  }}
                >
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 100,
                      borderColor: '#5CBCF8',
                      borderWidth: 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={{
                        uri:
                          dataTravelContext.dataTravel.client.photo !==
                          undefined
                            ? `${API_HOST_IMG}/profile/${dataTravelContext.dataTravel.client.photo}`
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
                      }}
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 100,
                        backgroundColor: 'white',
                      }}
                    />
                  </View>

                  <Callout
                    style={{
                      width: 220,
                      height: 60,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '25%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Entypo name="location-pin" size={24} color="black" />
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text>
                        {dataSelectTravel?.address_user ||
                          dataTravelContext.dataTravel.address_user}
                      </Text>
                      <Text>
                        Número de casa :{dataTravelContext.dataTravel.number_house}
                      </Text>
                      <Text>
                        Referencia :{dataTravelContext.dataTravel.reference}
                      </Text>
                    </View>
                  </Callout>
                </Marker>

                {(dataTravelContext.dataTravel.status_id === 0 ||
                  dataTravelContext.dataTravel.status_id === 1 ||
                  dataTravelContext.dataTravel.status_id === 2) && (
                  <MapViewDirections
                    origin={{
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                    }}
                    destination={{
                      latitude:
                        dataSelectTravel.lat_user === 0
                          ? dataTravelContext.dataTravel.lat_user
                          : dataSelectTravel.lat_user,
                      longitude:
                        dataSelectTravel.lng_user === 0
                          ? dataTravelContext.dataTravel.lng_user
                          : dataSelectTravel.lng_user,
                    }}
                    apikey={GOOGLE_API_KEY}
                    strokeWidth={4}
                    optimizeWaypoints={true}
                    strokeColor={'red'}
                    resetOnChange={true}
                  />
                )}

                   {dataTravelContext.dataTravel.status_id === 2 &&
                  <MapViewDirections
                    apikey={GOOGLE_API_KEY}
                    origin={{
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                    }}
                    destination={{
                      latitude: dataSelectTravel?.lat_user || dataTravelContext.dataTravel.lat_user,
                      longitude: dataSelectTravel?.lng_user || dataTravelContext.dataTravel.lng_user,
                    }}
                    strokeColor={"#4287f5"}
                    strokeWidth={10}
                    mode={"DRIVING"}
                    resetOnChange={false}
                  />
                }

                {dataTravelContext.dataTravel.status_id === 5 &&
                  <MapViewDirections
                    apikey={GOOGLE_API_KEY}
                    origin={{
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                    }}
                    destination={{
                      latitude: dataSelectTravel?.lat_user || dataTravelContext.dataTravel.lat_user,
                      longitude: dataSelectTravel?.lng_user || dataTravelContext.dataTravel.lng_user,
                    }}
                    strokeColor={"#4287f5"}
                    strokeWidth={10}
                    mode={"DRIVING"}
                    resetOnChange={false}
                  />
                } 
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            {dataSelectTravel.id !== 0 ||
            dataTravelContext.dataTravel.id !== 0 ? (
              <>
                <Marker
                  coordinate={{
                    latitude:
                      dataSelectTravel?.lat_user === 0
                        ? dataTravelContext.dataTravel.lat_user
                        : dataSelectTravel?.lat_user,
                    longitude:
                      dataSelectTravel?.lng_user === 0
                        ? dataTravelContext.dataTravel.lng_user
                        : dataSelectTravel?.lng_user,
                  }}
                >
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 100,
                      borderColor: '#5CBCF8',
                      borderWidth: 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={{
                        uri:
                          dataTravelContext.dataTravel.client.photo !==
                          undefined
                            ? `${API_HOST_IMG}/profile/${dataTravelContext.dataTravel.client.photo}`
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
                      }}
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 100,
                        backgroundColor: 'white',
                      }}
                    />
                  </View>
                  <Callout
                    style={{
                      width: 220,
                      height: 60,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '25%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Entypo name="location-pin" size={24} color="black" />
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text>
                        {dataSelectTravel?.address_user ||
                          dataTravelContext.dataTravel.address_user}
                      </Text>
                    </View>
                  </Callout>
                </Marker>

                <Marker
                  coordinate={{
                    latitude:
                      dataSelectTravel.lat_end === 2
                        ? dataTravelContext.dataTravel.lat_end
                        : dataSelectTravel?.lat_end,
                    longitude:
                      dataSelectTravel.lng_end === 2
                        ? dataTravelContext.dataTravel.lng_end
                        : dataSelectTravel?.lng_end,
                  }}
                  title="Destino"
                  description="Punto de destino"
                >
                  <View style={{ width: 50, height: 50 }}>
                    <Entypo name="location-pin" size={50} color="red" />
                  </View>
                  <Callout
                    style={{
                      width: 200,
                      height: 60,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: '25%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Entypo name="location-pin" size={24} color="black" />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text>
                        {dataSelectTravel?.address_end ||
                          dataTravelContext.dataTravel.address_end}
                      </Text>
                    </View>
                  </Callout>
                </Marker>

                <MapViewDirections
                  origin={{
                    latitude:
                      dataSelectTravel.lat_user === 0
                        ? dataTravelContext.dataTravel.lat_user
                        : dataSelectTravel.lat_user,
                    longitude:
                      dataSelectTravel.lng_user === 0
                        ? dataTravelContext.dataTravel.lng_user
                        : dataSelectTravel.lng_user,
                  }}
                  destination={{
                    latitude:
                      dataSelectTravel.lat_end === 2
                        ? dataTravelContext.dataTravel.lat_end
                        : dataSelectTravel.lat_end,
                    longitude:
                      dataSelectTravel.lng_end === 2
                        ? dataTravelContext.dataTravel.lng_end
                        : dataSelectTravel.lng_end,
                  }}
                  apikey={GOOGLE_API_KEY}
                  strokeWidth={4}
                  optimizeWaypoints={true}
                  strokeColor={'red'}
                  resetOnChange={true}
                  onReady={(res: any) => {
                    mapRef?.current?.fitToCoordinates(res?.coordinates, {
                      edgePadding: {
                        right: width / 20,
                        bottom: height / 20,
                        left: width / 10,
                        top: height / 20,
                      },
                      animated: true,
                    })
                  }}
                />

                {dataTravelContext.dataTravel.status_id === 2 && (
                  <MapViewDirections
                    apikey={GOOGLE_API_KEY}
                    origin={{
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                    }}
                    strokeColor={'#4287f5'}
                    strokeWidth={6}
                    destination={{
                      latitude: dataTravelContext.dataTravel.lat_user,
                      longitude: dataTravelContext.dataTravel.lng_user,
                    }}
                    mode={'DRIVING'}
                    resetOnChange={false}
                  />
                )}

                {dataTravelContext.dataTravel.status_id === 5 && (
                  <MapViewDirections
                    apikey={GOOGLE_API_KEY}
                    origin={{
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                    }}
                    strokeColor={'#4287f5'}
                    strokeWidth={6}
                    destination={{
                      latitude: dataTravelContext.dataTravel.lat_end,
                      longitude: dataTravelContext.dataTravel.lng_end,
                    }}
                    mode={'DRIVING'}
                    resetOnChange={false}
                  />
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '150%',
    overflow: 'hidden',
    borderRadius: 28,
  },
  map: {
    borderRadius: 28,
    flex: 1,
  },
  centerButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})
