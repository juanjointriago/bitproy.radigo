import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { DrawerActions, useNavigation } from '@react-navigation/native'
import { API_HOST_IMG } from '../../service/helpers/constants'
import { MapCitizen } from '../../components/map/MapCitizen'
import { ALERT, PRIMARY_COLOR } from '../../theme/globalStyles'
import Header from '../../components/header/Header'
import ModalCreateRequest from '../../components/modals/Citizen/ModalCreateRequest'
import { TravelContext } from '../../contexts/Travel/TravelContext'
import ModalSos from '../../components/modals/Citizen/ModalSos'
import ModalClientNavigation from '../../components/modals/Citizen/ModalClientNavigation'
import CardUser from '../../components/modals/Citizen/componentsModal/CardUser'
import InfTravel from '../../components/modals/Citizen/componentsModal/InfTravel'
import BtnPrimary from '../../components/buttons/BtnPrimary'
import useTravel from '../../service/hooks/useTravel'
import { useAlerts } from '../../service/hooks/useAlerts'
import { SocketContext } from '../../contexts/sockets/SocketContext'
import { ModalLoading } from '../../components/modals/ModalLoading'
import PayInfo from '../../components/modals/Citizen/componentsModal/PayInfo'
import Observations from '../../components/modals/Citizen/componentsModal/Observations'
import { InputTextArea } from '../../components/input/InputTextArea'
import { InterfaceQuality } from '../../interfaces/ITravel'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import useBank from '../../service/hooks/useBank'
import { DataBankIdDriver } from '../../interfaces/BankInterface'
import { ModalChat } from '../../components/modals/ModalChat'
import { useNotification } from '../../service/hooks/useNotification'
import { ModalArrivedDriver } from '../../components/modals/ModalArrivedDriver'
import useUser from '../../service/hooks/useUser'

export const HomeCitizenScreen = () => {
  const { putTravel, getTravelbyID, qualityTravel } = useTravel()
  const { getInfoBankByIdDriver } = useBank()
  const { user } = useContext(AuthContext)
  const { init, changeTravel, dataTravelContext, removeTravel } = useContext(
    TravelContext,
  )
  const { socket } = useContext(SocketContext)
  const { updateToken } = useNotification()
  const {  geInfotUserLogged } = useUser()

  const { confirmAlert, toast } = useAlerts()
  const navigation = useNavigation()
  const [stateTypeTravel, setStateTypeTravel] = useState(false)
  const [
    showBottomSheetModaNewrequest,
    setShowBottomSheetModalNewRequest,
  ] = useState(0)

  const [stateSos, setStateSos] = useState(false)
  const [loading, setLoading] = useState(false)
  const [starsValue, setStarsValue] = useState<number>(5)
  const [observations, setObservations] = useState('')
  const [refreshing, setRefreshing] = React.useState(false)
  const [statePay, setStatePay] = React.useState(false)
  const [dataBankDriver, setDataBankDriver] = useState<DataBankIdDriver>()
  const [dataAproxLocationDriver, setDataAproxLocationDriver] = useState({
    time: 0,
    distance: 0,
  })
  const [modalChat, setModalChat] = useState(false)
  const [loadUserLocationState, setLoadUserLocationState] = useState(false)
  const [newMessage, setNewMessage] = useState(false)
  const [modalChatAdmin, setModalChatAdmin] = useState(false)
  const [openModalArrivedDriver, setOpenModalArrivedDriver] = useState(false)
  const [openModalArrivedDriverMsg, setOpenModalArrivedDriverMsg] = useState(
    false,
  )

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    init()
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  useEffect(() => {
    validationTokenNotification()
  }, [])

  useEffect(() => {
    onCanceltravel()
    socketOnNewMessage()
    socketOnArrivedDriver()
    socketOnTravelingDriver()
    socketOnCompletedDriver()
  }, [socket])

  useEffect(() => {
    setModalChat(false)
  }, [modalChat])

  useEffect(() => {
    setOpenModalArrivedDriver(false)
  }, [openModalArrivedDriver])

  useEffect(() => {
    setModalChatAdmin(false)
  }, [modalChatAdmin])

  const validationTokenNotification = async () => {
         updateToken()
  }

  const acceptTravelFunc = async () => {
    setLoading(true)
    const resp = await changeTravelFunc('accept')
    if (resp) {
      setLoading(false)
    } else {
      init()
      setLoading(false)
    }
  }

  const qualityFunct = async () => {
    setLoading(true)
    const data: InterfaceQuality = {
      idTravel: dataTravelContext.dataTravel.id,
      stars: starsValue,
      observation: observations,
      idUser: dataTravelContext.dataTravel.driver.id,
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

  const payOrderValidationFunct = () => {
    getTravelbyID(dataTravelContext.dataTravel.id)
      .then((resp) => {
        if (resp.data.status_id === 3) {
          toast(resp.msg, 'SUCCESS')
          getInfoBankByIdDriver(resp.data.driver.id).then((res) => {
            setDataBankDriver(res.data)
            changeTravel({
              ...dataTravelContext.dataTravel,
              price: resp.data.price,
            })
            setStatePay(true)
          })
        } else {
          toast(
            'Lo sentimos, el conductor aun no ha finalizado el viaje',
            'DANGER',
          )
        }
      })
      .catch((err) => {
        toast(
          err?.response?.data.msg || 'Lo sentimos, ocurrió un error',
          'WARNING',
        )
      })
  }

  const insideCarDriver = () => {
    getTravelbyID(dataTravelContext.dataTravel.id)
      .then((res) => {
        if (res.data.status_id === 5 || res.data.status_id === 3) {
          toast(res.msg, 'SUCCESS')
          changeTravel({ ...dataTravelContext.dataTravel, status_id: 5 })
        } else {
          toast('Lo sentimos, el conductor aun no esta en camino', 'DANGER')
        }
      })
      .catch((err) => {
        toast(
          err?.response?.data.msg || 'Lo sentimos, ocurrió un error',
          'WARNING',
        )
      })
  }

  const cancelTravel = async () => {
    setLoading(true)
    const resp = await changeTravelFunc('cancel')
    if (resp) {
      setLoading(false)
      removedTravelData()
    } else {
      init()
      setLoading(false)
    }
  }

  const removedTravelData = () => {
    setLoading(false)
    removeTravel()
    setNewMessage(false)
  }

  const changeTravelFunc = (
    status: 'accept' | 'complete' | 'cancel' | 'traveling',
  ) => {
    return new Promise<boolean>((resolve) => {
      putTravel(status, dataTravelContext.dataTravel.id)
        .then((res) => {
          setTimeout(() => {
            getTravelbyID(res.data.id)
              .then((res) => {
                toast(res.msg, 'SUCCESS')
                changeTravel(res.data)
                resolve(true)
                switch (status) {
                  case 'accept':
                    return socket?.emit('accept-travel', {
                      idTravel: res.data.id,
                    })
                  case 'cancel':
                    return socket?.emit('reject-travel', {
                      idTravel: res.data.id,
                      idDriver: res.data.driver.id,
                    })
                }
              })
              .catch((err) => {
                toast(
                  err?.response?.data.msg || 'Lo sentimos, ocurrió un error',
                  'WARNING',
                )
                resolve(false)
              })
          }, 1000)
        })
        .catch((err) => {
          toast(
            err?.response?.data.msg || 'Lo sentimos, ocurrió un error',
            'WARNING',
          )
          resolve(false)
        })
    })
  }

  const onCanceltravel = async () => {
    try {
      socket!.on(`client-listen-cancel-travel`, (res: any) => {
        removedTravelData()
      })
    } catch (error) {}
  }

  const socketOnNewMessage = () => {
    socket?.on(`listen-message`, (res: any) => {
      if (user?.id !== res.sender_id) {
        setNewMessage(true)
      }
    })
  }

  const socketOnArrivedDriver = () => {
    socket?.on(`listen-arrived`, (res: any) => {
      setOpenModalArrivedDriver(true)
      setOpenModalArrivedDriverMsg(true)
    })
  }

  const socketOnTravelingDriver = () => {
    socket?.on(`client-listen-traveling`, (res: any) => {
      init()
    })
  }

  const socketOnCompletedDriver = () => {
    socket?.on(`client-listen-completed-travel`, (res: any) => {
      init()
    })
  }

  return (
    <>
      <View
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <ModalArrivedDriver visible={openModalArrivedDriver} />

        <ModalLoading visible={loading} />
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              width: '90%',
              marginHorizontal: 20,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={
                  dataTravelContext.dataTravel.id !== 0 ? onRefresh : undefined
                }
              />
            }
          >
            <Header
              statusCheck={(res) => console.log('❤❤', res)}
              driverStates={false}
              funcBtnCircle={() =>
                navigation.dispatch(DrawerActions.openDrawer())
              }
            />
          </ScrollView>

          <View style={{ ...styles.containerMap1 }}>
            <MapCitizen
              updateLocationUserFunc={loadUserLocationState}
              btnChatAdmin={() => {
                setNewMessage(false)
                setModalChatAdmin(true)
              }}
              funcOnPress={() => {
                setShowBottomSheetModalNewRequest(0)
              }}
              newMessage={newMessage}
              dataAproxLocationDriver={(res) => {
                setDataAproxLocationDriver(res)
              }}
              btnStateTypeTravel={(res) => {
                setStateTypeTravel(res)
                if (showBottomSheetModaNewrequest === 0) {
                  setShowBottomSheetModalNewRequest(1)
                }
              }}
              stateTypeTravel={stateTypeTravel}
              img={`${API_HOST_IMG}/profile/${user?.photo}`}
              btnChat={() => {
                setNewMessage(false)
                setModalChat(true)
              }}
              btnSos={() => {
                if (stateSos) {
                  setShowBottomSheetModalNewRequest(1)
                  setStateSos(false)
                } else {
                  setStateSos(true)
                  setShowBottomSheetModalNewRequest(0)
                }
              }}
            />
          </View>
        </View>

        {dataTravelContext.dataTravel.status_id === 2 && (
          <ModalChat
            visible={modalChat}
            idTravel={dataTravelContext.dataTravel.id}
            idUser={dataTravelContext.dataTravel.driver.id}
            name={dataTravelContext.dataTravel.driver.full_name}
            photo={`${API_HOST_IMG}/profile/${dataTravelContext.dataTravel.driver?.photo}`}
          />
        )}
        {dataTravelContext.dataTravel.status_id === 0 ? (
          <ModalCreateRequest
            updateLocationUserFunc={() => {
              setLoadUserLocationState((res) => !res)
            }}
            updateStateTravelModal={(resp: boolean) => {
              if (resp) {
                setStateTypeTravel(true)
              } else {
                setStateTypeTravel(false)
              }
            }}
            stateTypeTravel={stateTypeTravel}
            snapPoints={useMemo(()=>[100, '50%', '100%'],[])}
            state={showBottomSheetModaNewrequest}
            close={(res) => setShowBottomSheetModalNewRequest(res)}
          />
        ) : (
          <ModalClientNavigation
            snapPoints={useMemo(()=>[
              140,
              dataTravelContext.dataTravel.status_id === 3
                ? '90%'
                : dataTravelContext.dataTravel.status_id === 6
                ? '90%'
                : '50%',
            ],[])}
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
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <CardUser
                        modeBlack={false}
                        imgUrl={`${API_HOST_IMG}/profile/${dataTravelContext.dataTravel.driver?.photo}`}
                        name={dataTravelContext.dataTravel.driver?.full_name}
                        stars={dataTravelContext.dataTravel.driver?.stars}
                      />

                      <InfTravel
                        plate={dataTravelContext.dataTravel.car?.plate}
                        model={dataTravelContext.dataTravel.car?.model}
                        colorCar={dataTravelContext.dataTravel.car?.color}
                        modeBlack={false}
                        km={dataAproxLocationDriver.distance}
                        minute={dataAproxLocationDriver.time}
                      />
                      <View
                        style={{
                          width: '100%',
                          position: 'absolute',
                          justifyContent: 'space-around',
                          bottom: 0,
                          flexDirection: 'row',
                        }}
                      >
                        <BtnPrimary
                          func={() => {
                            {
                              cancelTravel()
                            }
                          }}
                          styleBtn={{
                            top: -10,
                            width: '45%',
                            height: 50,
                            backgroundColor: 'black',
                          }}
                          styleTitle={{ color: 'white' }}
                          title={'Cancelar'}
                        />

                        <BtnPrimary
                          func={() => {
                            {
                              acceptTravelFunc()
                            }
                          }}
                          styleBtn={{
                            top: -10,
                            width: '45%',
                            height: 50,
                            backgroundColor: PRIMARY_COLOR,
                          }}
                          styleTitle={{ color: 'black' }}
                          title={'Aceptar'}
                        />
                      </View>
                    </View>
                  )
                //acpetado
                case 2:
                //viajando
                case 5:
                  return (
                    <>
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          alignItems: 'center',
                        }}
                      >
                        <CardUser
                          modeBlack={false}
                          imgUrl={`${API_HOST_IMG}/profile/${dataTravelContext.dataTravel.driver.photo}`}
                          name={dataTravelContext.dataTravel.driver.full_name}
                          stars={dataTravelContext.dataTravel.driver.stars}
                        />

                        <InfTravel
                          plate={dataTravelContext.dataTravel.car.plate}
                          model={dataTravelContext.dataTravel.car.model}
                          colorCar={dataTravelContext.dataTravel.car.color}
                          modeBlack={false}
                          km={dataTravelContext.dataTravel!.distance}
                          minute={dataTravelContext.dataTravel!.time}
                        />
                        <View
                          style={{
                            width: '100%',
                            position: 'absolute',
                            alignItems: 'center',
                            bottom: 0,
                          }}
                        >
                          {dataTravelContext.dataTravel.status_id === 2 ? (
                            <>
                              {openModalArrivedDriverMsg ? (
                                <>
                                  <Text
                                    style={{
                                      bottom: 20,
                                      fontSize: 18,
                                      fontWeight: 'bold',
                                      textAlign: 'center',
                                      textDecorationLine: 'underline',
                                    }}
                                  >
                                    {dataTravelContext.dataTravel
                                      .type_service_id === 2
                                      ? 'El conductor ingreso al lugar del encargo'
                                      : 'Tu conductor llegó'}
                                  </Text>
                                </>
                              ) : (
                                <>
                                  <Text
                                    style={{
                                      bottom: 20,
                                      fontSize: 18,
                                      fontWeight: 'bold',
                                      textAlign: 'center',
                                      textDecorationLine: 'underline',
                                    }}
                                  >
                                    Conductor en camino
                                  </Text>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <Text
                                style={{
                                  bottom: 20,
                                  fontSize: 18,
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                  textDecorationLine: 'underline',
                                }}
                              >
                                {dataTravelContext.dataTravel
                                  .type_service_id === 2
                                  ? 'Tengo su encargo'
                                  : 'Viajando'}
                              </Text>
                            </>
                          )}
                        </View>
                      </View>
                    </>
                  )
                //completado
                case 3:
                  return (
                    <>
                      <View style={{ width: '100%', height: '100%' }}>
                        <PayInfo dataBank={dataBankDriver} />
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
                                changeTravel({
                                  ...dataTravelContext.dataTravel,
                                  status_id: 6,
                                })
                              }
                            }}
                            styleBtn={{
                              top: -10,
                              width: '90%',
                              height: 50,
                              backgroundColor: PRIMARY_COLOR,
                            }}
                            styleTitle={{ color: 'black' }}
                            title={'Calificar Conductor'}
                          />
                        </View>
                      </View>
                    </>
                  )
                case 6:
                  return (
                    <View
                      style={{
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'black',
                      }}
                    >
                      <CardUser
                        modeBlack={true}
                        imgUrl={`${API_HOST_IMG}/profile/${dataTravelContext.dataTravel.driver.photo}`}
                        name={dataTravelContext.dataTravel.driver.full_name}
                        stars={dataTravelContext.dataTravel.driver.stars}
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
            })}
          </ModalClientNavigation>
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
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visible: {
    borderWidth: 2,
    borderColor: 'red',
  },
  containerCard: {
    // width: "100%",
    // flex: 1,
    height: '100%',
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  containerSecondaryBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerMap: {
    borderWidth: 2,
    borderColor: 'blue',
    width: '100%',
    height: 300,
    zIndex: -1000,
    borderRadius: 10,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
  },
  containerMap1: {
    width: '90%',
    position: 'absolute',
    height: '80%',
    top: 80,
    marginHorizontal: 20,
    // backgroundColor:"red"
  },
  containerBtn: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  Containersbtn: {
    borderWidth: 2,
    borderColor: 'red',
  },
  btnRed: {
    justifyContent: 'flex-end',
    height: 40,
    width: 40,
  },
  btn: {
    backgroundColor: ALERT,
    height: 40,
    width: 40,
  },
})
