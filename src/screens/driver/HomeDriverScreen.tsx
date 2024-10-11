import React, { useState, useRef, useEffect, useContext, useMemo } from 'react'
import {
  View,
  FlatList,
  Animated,
  Text,
  RefreshControl,
  ScrollView,
} from 'react-native'
import Header from '../../components/header/Header'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { MapDriver } from '../../components/map/MapDriver'
import { StackScreenProps } from '@react-navigation/stack'
import CardRequestDriver from '../../components/other/CardRequestDriver'
import BtnPrimary from '../../components/buttons/BtnPrimary'
import useTravel from '../../service/hooks/useTravel'
import {
  InitialTravelByDriver,
  InterfaceQuality,
  InterfaceTravelById,
  ResponseGetTravelByID,
  TravelByDriver,
} from '../../interfaces/ITravel'
import InfTravel from '../../components/modals/Citizen/componentsModal/InfTravel'
import TimeLineTrips from '../../components/other/TimeLineTrips'
import {
  FontAwesome,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
  SimpleLineIcons,
} from '@expo/vector-icons'
import ModalSos from '../../components/modals/Citizen/ModalSos'
import { TravelContext } from '../../contexts/Travel/TravelContext'
import { useAlerts } from '../../service/hooks/useAlerts'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import ModalDriverInitTravel from '../../components/modals/Citizen/ModalDriverInitTravel'
import ModalDriverNavigation from '../../components/modals/Citizen/ModalDriverNavigation'
import CardUser from '../../components/modals/Citizen/componentsModal/CardUser'
import {
  INPUT1,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  WHITE,
} from '../../theme/globalStyles'
import { API_HOST, API_HOST_IMG } from '../../service/helpers/constants'
import Observations from '../../components/modals/Citizen/componentsModal/Observations'
import { ModalLoading } from '../../components/modals/ModalLoading'
import { InputTextArea } from '../../components/input/InputTextArea'
import { SocketContext } from '../../contexts/sockets/SocketContext'
import { AppState, Button } from 'react-native'
import useBackground from '../../service/hooks/useBackground'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import { LatLng } from 'react-native-maps'
import moment from 'moment'
import { ModalChat } from '../../components/modals/ModalChat'
import useUser from '../../service/hooks/useUser'
import { useNotification } from '../../service/hooks/useNotification'
import { ModalDescription } from '../../components/modals/ModalDescription'
import * as Notifications from 'expo-notifications'
import { useSocket } from '../../service/hooks/useSockets'
import ModalListAdmins from '../../components/modals/Citizen/ModalListAdmins'

interface Props extends StackScreenProps<any, any> {}

export const HomeDriverScreen = ({ navigation }: Props) => {
  const navigator = useNavigation()
  const { socket } = useContext(SocketContext)
  const { confirmAlert, toast } = useAlerts()
  const { changeTravel, dataTravelContext, removeTravel, init } = useContext(
    TravelContext,
  )
  const { user, updateDataUser } = useContext(AuthContext)
  const {
    getTravelRequestToDayDriver,
    putTravel,
    getTravelbyID,
    qualityTravel,
    putTravelComplete,
    getCostTravel,
  } = useTravel()
  const { sendMesaage } = useNotification()
  const { availableDriver, geInfotUserLogged } = useUser()
  const { updateToken } = useNotification()
  const { startBackgroundUpdate, stopBackgroundUpdate } = useBackground()

  const [modalInit, setModalInit] = useState<
    'loadTravels' | 'sos' | 'selectTravel'
  >('loadTravels')
  const [stateSos, setStateSos] = useState(false)
  const [stateAdmisList, setStateAdmisList] = useState(false)
  const [dataTravels, setDataTravels] = useState<TravelByDriver[]>([])
  const [selectTravel, setSelectTravel] = useState<TravelByDriver>(
    InitialTravelByDriver,
  )
  const [onBoard, setOnBoard] = useState(false)
  const [loading, setLoading] = useState(false)
  const [observations, setObservations] = useState('')
  const [starsValue, setStarsValue] = useState<number>(5)
  const [refreshing, setRefreshing] = React.useState(false)
  const lastLocationTracked = useRef<LatLng>({
    latitude: 0,
    longitude: 0,
  })
  const [modalChat, setModalChat] = useState(false)
  const [modalChatAdmin, setModalChatAdmin] = useState(false)
  const [newMessage, setNewMessage] = useState(false)
  const [openModalDescription, setOpenModalDescription] = useState(false)
  const [onChatAdmin, setOnChatAdmin] = useState<number>(0)
  const [onChatAdminSocket, setOnChatAdminSocket] = useState<number>(0)
  const { conectarSocket } = useSocket(API_HOST)
  const [
    showBottomSheetModaNewrequest,
    setShowBottomSheetModalNewRequest,
  ] = useState(0)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    init()
    getDataTravels()
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    const unsubscribe = Notifications.addNotificationReceivedListener(
      (notification) => {
        conectarSocket()
        getDataTravels()
      },
    )
    return () => {
      Notifications.removeNotificationSubscription(unsubscribe)
    }
  }, [])

  useEffect(() => {
    AppState.addEventListener('change', async (state) => {
      if (state !== 'active') {
        startBackgroundUpdate()
        await AsyncStorage.setItem('hasBackgroundData', 'SI')
      } else {
        stopBackgroundUpdate()
        await AsyncStorage.setItem('hasBackgroundData', 'NO')
      }
    })
  }, [])

  useEffect(() => {
    validationTokenNotification()
    getDataTravels()
  }, [])

  useEffect(() => {
    onDriverListenAcceptTravel()
    onNewTravels()
    onCancelTravel()
    onDriverListenRemoveTravels()
    onListenCancelTravelById()
    socketOnNewMessage()
    socketOnNewMessages()
  }, [socket])

  useEffect(() => {
    addlastLocationTracked()
  }, [])

  useEffect(() => {
    setModalChat(false)
  }, [modalChat])

  useEffect(() => {
    setModalChatAdmin(false)
  }, [modalChatAdmin])

  useEffect(() => {
    setOpenModalDescription(false)
  }, [openModalDescription])

  useEffect(() => {
    updateCoords()
  }, [])

  const updateCoords = async () => {
    const currentLocationAux = await getLiveLocation()
    if (!currentLocationAux) return
    const { latitude, longitude } = currentLocationAux
    await updateDataUser({ lat: latitude, lng: longitude })
  }

  const addlastLocationTracked = async () => {
    const data = await AsyncStorage.getItem('travelStorage')
    if (data) {
      const lastLocationTrackedStorage = await AsyncStorage.getItem(
        'lastLocationTracked',
      )
      if (!lastLocationTrackedStorage) {
        const currentLocationAux = await getLiveLocation()
        if (!currentLocationAux) return
        const { latitude, longitude } = currentLocationAux
        lastLocationTracked.current = { latitude, longitude }
        await AsyncStorage.setItem(
          'lastLocationTracked',
          JSON.stringify(lastLocationTracked.current),
        )
      } else {
        let lastLocation = JSON.parse(lastLocationTrackedStorage) as LatLng
        lastLocationTracked.current = lastLocation
      }
    } else {
      const currentLocationAux = await getLiveLocation()
      if (!currentLocationAux) return
      const { latitude, longitude } = currentLocationAux
      lastLocationTracked.current = { latitude, longitude }
      await AsyncStorage.setItem(
        'lastLocationTracked',
        JSON.stringify(lastLocationTracked.current),
      )
    }
  }

  const validationTokenNotification = async () => {
    geInfotUserLogged().then(async (res) => {
        console.log('❤❤❤❤❤', res)
        await updateToken()
    })
  }

  const getDataTravels = async () => {
    await AsyncStorage.setItem('hasBackgroundData', 'NO')
    getTravelRequestToDayDriver()
      .then((res) => {
        setDataTravels(res.data.travels.reverse())
      })
      .catch((err: any) => {
        navigation.navigate('MyCarsScreen')
        toast(
          err?.response?.data.msg || 'Lo sentimos, ocurrio un error',
          'WARNING',
        )
      })
  }

  const refreshTravelsBtn = () => {
    if (showBottomSheetModaNewrequest === 1) {
      setShowBottomSheetModalNewRequest(0)
      getDataTravels()
    } else {
      setShowBottomSheetModalNewRequest(1)
    }
  }

  const acceptTravelFunc = async () => {
    setLoading(true)
    const resp = await changeTravelFunc('accept')
    if (resp) {
      setLoading(false)
      getDataTravels()
      setOpenModalDescription(true)
      await AsyncStorage.setItem('hasBackgroundData', 'NO')
    } else {
      setLoading(false)
      removedTravelData()
    }
  }

  const onBoardClientFunc = async () => {
    setLoading(true)
    const resp = await changeTravelFunc('traveling')
    if (resp) {
      setLoading(false)
      await AsyncStorage.setItem('tripDistance', '0')
      await AsyncStorage.setItem(
        'startTrackDateStorage',
        moment(new Date()).toString(),
      )
      const currentLocationAux = await getLiveLocation()
      if (!currentLocationAux) return
      const { latitude, longitude } = currentLocationAux
      lastLocationTracked.current = { latitude, longitude }
      await AsyncStorage.setItem(
        'lastLocationTracked',
        JSON.stringify(lastLocationTracked.current),
      )
    } else {
      setLoading(false)
    }
  }

  const completeTravelFunc = async () => {
    /*     setLoading(true) */

    const startTrackDateStorage = await AsyncStorage.getItem(
      'startTrackDateStorage',
    )
    const tripDistanceAux = await AsyncStorage.getItem('tripDistance')
    if (!tripDistanceAux) return

    const tripDistance = parseFloat(tripDistanceAux)

    const endTrackDate = moment(new Date())
    let duration = moment.duration(
      endTrackDate.diff(moment(startTrackDateStorage)),
    )

    const totalMinutes = duration.asMinutes()
    const totalMinutesFixed = parseInt(totalMinutes.toFixed(0))

    const dataPriceTravel = await getCostTravel(tripDistance, totalMinutesFixed)

    console.log('😊😊', {
      km: tripDistance,
      price: dataPriceTravel.data.costTotal,
      time: totalMinutesFixed,
    })

    putTravelComplete(dataTravelContext.dataTravel.id, {
      km: tripDistance,
      price:
        dataPriceTravel.data.costTotal > dataPriceTravel.data.costTravelMin
          ? dataPriceTravel.data.costTotal
          : dataPriceTravel.data.costTravelMin,
      time: totalMinutesFixed,
    })
      .then((res) => {
        getTravelbyID(res.data.id)
          .then((res) => {
            toast(res.msg, 'SUCCESS')
            changeTravel(res.data)
            setLoading(false)
            setOnBoard(false)
            updateCoords()
          })
          .catch((err) => {
            setLoading(false)
            toast(
              err?.response?.data.msg || 'Lo sentimos, ocurrió un error',
              'WARNING',
            )
          })
      })
      .catch((err) => {
        setLoading(false)
        toast(
          err?.response?.data.msg || 'Lo sentimos, ocurrió un error',
          'WARNING',
        )
      })
  }

  const finishQualify = async () => {
    changeTravel({ ...dataTravelContext.dataTravel, status_id: 6 })
    updateCoords()
  }

  const cancelTravelFunc = async () => {
    setLoading(true)
    const resp = await changeTravelFunc('cancel')
    updateCoords()
    if (resp) {
      removedTravelData()
    } else {
      setLoading(false)
    }
  }

  const qualityFunct = async () => {
    setLoading(true)
    const data: InterfaceQuality = {
      idTravel: dataTravelContext.dataTravel.id,
      stars: starsValue,
      observation: observations,
      idUser: dataTravelContext.dataTravel.client.id,
    }
    qualityTravel(data)
      .then((res) => {
        toast(res?.msg || 'Viaje calificado ', 'SUCCESS')
        removedTravelData()
        setLoading(false)
      })
      .catch((err) => {
        removedTravelData()
        toast(
          err?.response?.data.msg || 'Lo sentimos, ocurrió un error',
          'WARNING',
        )
        setLoading(false)
      })
  }

  const changeTravelFunc = (
    status: 'accept' | 'complete' | 'cancel' | 'traveling',
  ) => {
    return new Promise<boolean>((resolve) => {
      putTravel(status, selectTravel?.id || dataTravelContext.dataTravel.id)
        .then(async (res) => {
          const resValidation: any = await validationMyTravel(res.data.id)
          if (!resValidation) {
            resolve(false)
            return toast(
              'Lo sentimos, este viaje fue aceptado por otro conductor',
              'WARNING',
            )
          }

          toast(resValidation.msg, 'SUCCESS')
          changeTravel(resValidation.data)
          resolve(true)
          switch (status) {
            case 'accept':
              return socket?.emit('accept-travel', {
                idTravel: res.data.id,
              })
            case 'cancel':
              return socket?.emit('cancel-travel', {
                idTravel: res.data.id,
              })
          }
        })
        .catch((err) => {
          console.log('💟💟', err.response.data)
          toast(
            err?.response?.data.msg || 'Lo sentimos, ocurrió un error',
            'WARNING',
          )
          resolve(false)
        })
    })
  }

  const validationMyTravel = (idTravel: number) => {
    return new Promise((resolve, reject) => {
      getTravelbyID(idTravel)
        .then((res) => {
          if (user?.id !== res.data.driver.id) {
            resolve(false)
          } else {
            resolve(res)
          }
        })
        .catch((err) => {
          resolve(false)
        })
    })
  }

  const getLiveLocation = async () => {
    let currentLocationPromise = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })
    if (currentLocationPromise) {
      const { latitude, longitude } = currentLocationPromise.coords
      return { latitude, longitude }
    }
  }

  //sockets
  const onNewTravels = async () => {
    try {
      socket!.on(`new-travel`, (res: TravelByDriver) => {
        const data: TravelByDriver = res
        setDataTravels((prev) => {
          // Filtrar los elementos duplicados por el ID
          const filteredData = prev.filter((item) => item.id !== data.id)
          // Agregar el nuevo elemento al inicio del array
          return [data, ...filteredData]
        })
      })
    } catch (error) {}
  }

  const onDriverListenAcceptTravel = async () => {
    try {
      socket!.on(`driver-listen-accept-travel`, (res: InterfaceTravelById) => {
        if (res) {
          changeTravel(res)
        }
      })
    } catch (error) {}
  }

  const onDriverListenRemoveTravels = async () => {
    try {
      socket!.on(`drivers-listen-remove-travel`, (res: any) => {
        console.log('💦💦💦', res)
      })
    } catch (error) {}
  }

  const onCancelTravel = async () => {
    try {
      socket!.on(`driver-listen-cancel-travel`, (res: any) => {
        removedTravelData()
        getDataTravels()
      })
    } catch (error) {}
  }

  const onListenCancelTravelById = () => {
    try {
      socket!.on(`listen-reject-travel`, (res: any) => {
        removedTravelData()
        getDataTravels()
      })
    } catch (error) {}
  }

  const socketOnNewMessage = () => {
    socket?.on(`listen-message`, (res: any) => {
      if (user?.id !== res.sender_id) {
        setNewMessage(true)
        setOnChatAdminSocket(res.sender_id)
      }
    })
  }

  const socketOnNewMessages = () => {
    socket?.on(`driver-listen-remove-travel`, (res: any) => {
      console.log('❤❤', res)
    })
  }

  const removedTravelData = () => {
    setLoading(false)
    setModalInit('loadTravels')
    setSelectTravel(InitialTravelByDriver)
    removeTravel()
    getDataTravels()
    setOnBoard(false)
    setNewMessage(false)
  }

  const onChangeTripDistanceTrack = async (distance: number) => {
    await AsyncStorage.setItem('tripDistance', distance.toString())
  }

  const updateAvailableDriver = (state: boolean) => {
    availableDriver(state).then(async (res) => {
      await updateDataUser({ is_available: res.data.is_available })
      toast(
        `Se ${res.data.is_available ? 'habilito' : 'deshabilitado'} RadiGo`,
        res.data.is_available ? 'SUCCESS' : 'DANGER',
      )
    })
  }

  return (
    <>
      <View
        style={{
          flex: 1,
        }}
      >
        {/*    
        <Button
          title="hasBackgroundData "
          onPress={async () => {
            const value: any = await AsyncStorage.getItem('hasBackgroundData')
            toast(value, 'WARNING')
          }}
        />
        <Button
          title="calcular "
          onPress={async () => {
            const value: any = await AsyncStorage.getItem('tripDistance')
            toast(value, 'WARNING')
          }}
        />
        <Button
          title="startTrackDateStorage "
          onPress={async () => {
            const value: any = await AsyncStorage.getItem(
              'startTrackDateStorage',
            )
            toast(value, 'WARNING')
          }}
        />

        <Text>
          {JSON.stringify(lastLocationTracked.current.latitude, null, 5)}
        </Text> */}
        <ModalDescription visible={openModalDescription} />

        <ModalLoading visible={loading} />

        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              width: '90%',
              marginHorizontal: 20,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Header
              styleHeader={{ width: '100%', zIndex: 999 }}
              statusCheck={(res) => updateAvailableDriver(res)}
              driverStates={true}
              funcBtnCircle={() =>
                navigator.dispatch(DrawerActions.openDrawer())
              }
            />
          </ScrollView>

          <View
            style={{
              width: '90%',
              position: 'absolute',
              height: '80%',
              top: 80,
              marginHorizontal: 20,
            }}
          >
            <MapDriver
              funcOnPress={() => {
                setShowBottomSheetModalNewRequest(0)
              }}
              btnChatAdmin={() => {
                if (stateAdmisList) {
                  setShowBottomSheetModalNewRequest(1)
                  setStateSos(false)
                  setStateAdmisList(false)
                } else {
                  setStateSos(false)
                  setStateAdmisList(true)
                  setShowBottomSheetModalNewRequest(0)
                }
              }}
              newMessage={newMessage}
              onChangeTripDistanceTrack={onChangeTripDistanceTrack}
              lastLocationTracked={lastLocationTracked}
              numberTravels={dataTravels.length}
              btnChat={() => {
                setNewMessage(false)
                setModalChat(true)
              }}
              dontShowUp={async () => {
                const resp = await confirmAlert(
                  '¿Quieres cancelar el viaje?',
                  'WARNING',
                )
                if (resp) {
                  cancelTravelFunc()
                }
              }}
              statusOnBoard={onBoard}
              dataSelectTravel={selectTravel}
              btnLoadTravels={refreshTravelsBtn}
              btnSos={() => {
                if (stateSos) {
                  setShowBottomSheetModalNewRequest(1)
                  setStateSos(false)
                  setStateAdmisList(false)
                } else {
                  setStateSos(true)
                  setStateAdmisList(false)
                  setShowBottomSheetModalNewRequest(0)
                }
              }}
            />
          </View>
        </View>
      </View>
      {dataTravelContext.dataTravel.status_id === 2 && (
        <ModalChat
          visible={modalChat}
          idTravel={dataTravelContext.dataTravel.id}
          idUser={dataTravelContext.dataTravel.client.id}
          name={dataTravelContext.dataTravel.client.full_name}
          photo={`${API_HOST_IMG}/profile/${dataTravelContext.dataTravel.client?.photo}`}
        />
      )}

      {dataTravelContext.dataTravel.status_id === 0 ? (
        <ModalDriverInitTravel
          dataTravels={dataTravels}
          selectTravel={selectTravel}
          snapPoints={
            useMemo(()=>user?.is_available === false
            ? [100, 110]
            : [100, modalInit === 'loadTravels' ? '90%' : '45%'],[])
          }
          state={showBottomSheetModaNewrequest}
          close={setShowBottomSheetModalNewRequest}
        >
          {(() => {
            switch (modalInit) {
              case 'loadTravels':
                return (
                  <FlatList
                    data={dataTravels}
                    renderItem={({ item }:any) => (
                      <View style={{ alignItems: 'center', paddingTop: 10 }}>
                        <CardRequestDriver
                          type_service_id={item.type_service_id}
                          styleBtn={{
                            backgroundColor:
                              item.type_service_id === 1
                                ? PRIMARY_COLOR
                                : INPUT1,
                          }}
                          onPress={async () => {
                            setModalInit('selectTravel'), setSelectTravel(item)
                          }}
                          direcA={item.address_user}
                          direcB={item.address_end}
                        />
                      </View>
                    )}
                    keyExtractor={(item: any) => item.id}
                  />
                )
              case 'selectTravel':
                return (
                  <View
                    style={{ alignItems: 'center', paddingTop: 10, flex: 1 }}
                  >
                    <View
                      style={{
                        width: '100%',
                        paddingHorizontal: 30,
                        height: 100,
                        flexDirection: 'row',
                      }}
                    >
                      <View style={{ width: '90%' }}>
                        <TimeLineTrips
                          style={{
                            left: 10,
                            width: 270,
                          }}
                          currentPosition={1}
                          num={2}
                          data={[
                            selectTravel?.address_user,
                            selectTravel?.address_end === ''
                              ? 'Sin destino'
                              : selectTravel?.address_end,
                          ]}
                        ></TimeLineTrips>
                      </View>

                      <View
                        style={{
                          justifyContent: 'space-around',
                          flex: 1,
                          alignItems: 'center',
                        }}
                      >
                        {selectTravel?.extras.map((res) => {
                          return (
                            <React.Fragment key={res.id}>
                              {res.extra_service_id === 1 && (
                                <MaterialCommunityIcons
                                  name="dog"
                                  size={20}
                                  color="#717171"
                                />
                              )}
                              {res.extra_service_id === 3 && (
                                <FontAwesome
                                  name="wheelchair"
                                  size={20}
                                  color="#717171"
                                />
                              )}
                              {res.extra_service_id === 2 && (
                                <FontAwesome
                                  name="bicycle"
                                  size={20}
                                  color="#717171"
                                />
                              )}
                              {res.extra_service_id === 4 && (
                                <Entypo
                                  name="battery"
                                  size={20}
                                  color="#717171"
                                />
                              )}

                              {res.extra_service_id === 5 && (
                                <MaterialIcons
                                  name="sports-motorsports"
                                  size={20}
                                  color="#717171"
                                />
                              )}

                              {res.extra_service_id === 6 && (
                                <SimpleLineIcons
                                  name="envelope-letter"
                                  size={20}
                                  color="#717171"
                                />
                              )}
                            </React.Fragment>
                          )
                        })}
                      </View>
                    </View>

                    <InfTravel
                      km={selectTravel!.distance}
                      minute={selectTravel!.time}
                      price={
                        selectTravel!.price === 0 ? 0.0 : selectTravel!.price
                      }
                    />

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        position: 'absolute',
                        bottom: 10,
                        width: '100%',
                      }}
                    >
                      <BtnPrimary
                        func={removedTravelData}
                        styleBtn={{
                          width: '45%',
                          height: 50,
                          backgroundColor: 'black',
                        }}
                        title="Cancelar"
                        styleTitle={{ color: 'white' }}
                      />
                      <BtnPrimary
                        func={acceptTravelFunc}
                        styleBtn={{ width: '45%', height: 50 }}
                        title="Aceptar"
                      />
                    </View>
                  </View>
                )
            }
          })()}
        </ModalDriverInitTravel>
      ) : (
        <ModalDriverNavigation
          openModalDescriptionTravel={() => {
            setOpenModalDescription(true)
          }}
          statusOnBoard={onBoard}
          snapPoints={useMemo(()=>[
            140,
            dataTravelContext.dataTravel.status_id === 6 ? '90%' : '40%',
          ], [])}
          state={showBottomSheetModaNewrequest}
          close={setShowBottomSheetModalNewRequest}
        >
          {(() => {
            switch (dataTravelContext.dataTravel.status_id) {
              //acepted con id de driver
              case 1:
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      paddingTop: 10,
                      flex: 1,
                    }}
                  >
                    <CardUser
                      modeBlack={false}
                      imgUrl={`${API_HOST_IMG}/profile/${dataTravelContext.dataTravel.client.photo}`}
                      name={dataTravelContext.dataTravel.client.full_name}
                      stars={dataTravelContext.dataTravel.client.stars}
                    />

                    <InfTravel
                      modeBlack={false}
                      km={dataTravelContext.dataTravel!.distance}
                      minute={dataTravelContext.dataTravel!.time}
                      price={
                        dataTravelContext.dataTravel!.price === 0
                          ? 0.0
                          : dataTravelContext.dataTravel!.price
                      }
                    />
                    <View
                      style={{
                        width: '100%',
                        position: 'absolute',
                        alignItems: 'center',
                        bottom: 0,
                      }}
                    >
                      <BtnPrimary
                        func={async () => {
                          {
                            const resp = await confirmAlert(
                              '¿Quieres cancelar el viaje?',
                              'WARNING',
                            )
                            if (resp) {
                              cancelTravelFunc()
                            }
                          }
                        }}
                        styleBtn={{
                          top: -10,
                          width: '90%',
                          height: 50,
                          backgroundColor: PRIMARY_COLOR,
                        }}
                        styleTitle={{ color: 'black' }}
                        title={'Esperando confirmación...'}
                      />
                    </View>
                  </View>
                )
              //acpetado
              case 2:
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      paddingTop: 10,
                      flex: 1,
                      backgroundColor: !onBoard ? undefined : PRIMARY_COLOR,
                    }}
                  >
                    <CardUser
                      modeBlack={!onBoard ? false : true}
                      imgUrl={`${API_HOST_IMG}/profile/${dataTravelContext.dataTravel.client.photo}`}
                      name={dataTravelContext.dataTravel.client.full_name}
                      stars={dataTravelContext.dataTravel.client.stars}
                    />

                    <InfTravel
                      modeBlack={false}
                      km={dataTravelContext.dataTravel!.distance}
                      minute={dataTravelContext.dataTravel!.time}
                      price={
                        dataTravelContext.dataTravel!.price === 0
                          ? 0.0
                          : dataTravelContext.dataTravel!.price
                      }
                    />
                    <View
                      style={{
                        width: '100%',
                        position: 'absolute',
                        alignItems: 'center',
                        bottom: 0,
                      }}
                    >
                      <BtnPrimary
                        func={async () => {
                          {
                            if (!onBoard) {
                              toast(
                                'Se notificó al cliente que llegaste',
                                'SUCCESS',
                              )

                              socket?.emit('arrived', {
                                idClient:
                                  dataTravelContext.dataTravel.client.id,
                              })

                              await sendMesaage(
                                dataTravelContext.dataTravel.client.expo_token,
                                `¡Tu conductor ${user?.full_name} llegó!`,
                              )

                              setOnBoard(true)
                            } else {
                              onBoardClientFunc()

                              socket?.emit('traveling', {
                                idTravel: dataTravelContext.dataTravel.id,
                              })
                            }
                          }
                        }}
                        styleBtn={{
                          top: -10,
                          width: '90%',
                          height: 50,
                          backgroundColor: onBoard ? 'black' : PRIMARY_COLOR,
                        }}
                        styleTitle={{
                          color: onBoard ? 'white' : 'black',
                          fontSize: 18,
                        }}
                        title={
                          onBoard
                            ? dataTravelContext.dataTravel.type_service_id === 2
                              ? 'Encargo realizado'
                              : 'El cliente ingreso al taxi'
                            : 'Estoy afuera de la ubicación'
                        }
                      />
                    </View>
                  </View>
                )
              //viajando
              case 5:
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      paddingTop: 10,
                      flex: 1,
                      backgroundColor: !onBoard ? undefined : PRIMARY_COLOR,
                    }}
                  >
                    <CardUser
                      modeBlack={!onBoard ? false : true}
                      imgUrl={`${API_HOST_IMG}/profile/${dataTravelContext.dataTravel.client.photo}`}
                      name={dataTravelContext.dataTravel.client.full_name}
                      stars={dataTravelContext.dataTravel.client.stars}
                    />

                    <InfTravel
                      modeBlack={false}
                      km={dataTravelContext.dataTravel!.distance}
                      minute={dataTravelContext.dataTravel!.time}
                      price={
                        dataTravelContext.dataTravel!.price === 0
                          ? 0.0
                          : dataTravelContext.dataTravel!.price
                      }
                    />
                    <View
                      style={{
                        width: '100%',
                        position: 'absolute',
                        alignItems: 'center',
                        bottom: 0,
                      }}
                    >
                      <BtnPrimary
                        func={() => {
                          socket?.emit('complete-travel', {
                            idTravel: dataTravelContext.dataTravel.id,
                          })
                          completeTravelFunc()
                        }}
                        styleBtn={{
                          top: -10,
                          width: '90%',
                          height: 50,
                          backgroundColor: 'black',
                        }}
                        styleTitle={{ color: 'white' }}
                        title={
                          dataTravelContext.dataTravel.type_service_id === 2
                            ? 'Finalizar encargo'
                            : 'Finalizar viaje'
                        }
                      />
                    </View>
                  </View>
                )
              //completado
              case 3:
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      paddingTop: 10,
                      flex: 1,
                      backgroundColor: 'black',
                    }}
                  >
                    <CardUser
                      modeBlack={true}
                      imgUrl={`${API_HOST_IMG}/profile/${dataTravelContext.dataTravel.client.photo}`}
                      name={dataTravelContext.dataTravel.client.full_name}
                      stars={dataTravelContext.dataTravel.client.stars}
                    />

                    <InfTravel
                      modeBlack={true}
                      km={dataTravelContext.dataTravel!.distance}
                      minute={dataTravelContext.dataTravel!.time}
                      price={
                        dataTravelContext.dataTravel!.price === 0
                          ? 0.0
                          : dataTravelContext.dataTravel!.price
                      }
                    />
                    <View
                      style={{
                        width: '100%',
                        position: 'absolute',
                        alignItems: 'center',
                        bottom: 0,
                      }}
                    >
                      <BtnPrimary
                        func={() => {
                          {
                            finishQualify()
                          }
                        }}
                        styleBtn={{
                          top: -10,
                          width: '90%',
                          height: 50,
                          backgroundColor: PRIMARY_COLOR,
                        }}
                        styleTitle={{ color: 'black' }}
                        title={'Calificar'}
                      />
                    </View>
                  </View>
                )
              //calificar
              case 6:
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      paddingTop: 10,
                      flex: 1,
                      backgroundColor: 'black',
                    }}
                  >
                    <CardUser
                      modeBlack={true}
                      imgUrl={`${API_HOST_IMG}/profile/${dataTravelContext.dataTravel.client.photo}`}
                      name={dataTravelContext.dataTravel.client.full_name}
                      stars={dataTravelContext.dataTravel.client.stars}
                    />

                    <Observations
                      calification={(res) => {
                        setStarsValue(res)
                      }}
                    >
                      <InputTextArea
                        style={{ width: '85%', marginVertical: 20 }}
                        text="Escribe tus observaciones"
                        multiline={false}
                        value={observations}
                        name="referenceLocation"
                        onChange={(value) => setObservations(value)}
                      />
                    </Observations>

                    <View
                      style={{
                        width: '100%',
                        position: 'absolute',
                        alignItems: 'center',
                        bottom: 0,
                      }}
                    >
                      <BtnPrimary
                        func={() => {
                          {
                            qualityFunct()
                          }
                        }}
                        styleBtn={{
                          top: -10,
                          width: '90%',
                          height: 50,
                          backgroundColor: PRIMARY_COLOR,
                        }}
                        styleTitle={{ color: 'black' }}
                        title={'Enviar'}
                      />
                    </View>
                  </View>
                )
            }
          })()}
        </ModalDriverNavigation>
      )}

      <ModalSos
        btnCancel={() => {
          if (stateSos) {
            setShowBottomSheetModalNewRequest(0)
            setStateSos(false)
          } else {
            setStateSos(true)
            setShowBottomSheetModalNewRequest(1)
          }
        }}
        openModalState={stateSos}
      />

      <ModalListAdmins
        onSocketChatAdmin={onChatAdminSocket}
        openModalChat={() => {
          setOnChatAdminSocket(0)
          setNewMessage(false)
          setModalChatAdmin(true)
        }}
        dataAdmin={(res) =>
          navigation.navigate('ChatAdminScreen', { onChatAdmin: res.id })
        }
        btnCancel={() => {
          if (stateAdmisList) {
            setShowBottomSheetModalNewRequest(0)
            setStateAdmisList(false)
          } else {
            setStateAdmisList(true)
            setShowBottomSheetModalNewRequest(1)
          }
        }}
        openModalState={stateAdmisList}
      />
    </>
  )
}
