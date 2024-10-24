import React, { createContext, useReducer, useEffect, useContext } from 'react'
import { travelReducer } from './travelReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { InterfaceTravelById, DataTravel } from '../../interfaces/ITravel'
import useTravel from '../../service/hooks/useTravel'
import { useAlerts } from '../../service/hooks/useAlerts'
import { AuthContext } from '../Auth/AuthContext'

//definir como luce, o que informacion tendre aqui
export interface travelProgress {
  dataTravel: InterfaceTravelById
}

// estado inicial
export const travelInitialState: travelProgress = {
  dataTravel: {
    id: 0,
    status_id: 0,
    lng_user: 0,
    time: 0,
    price: 0,
    distance: 0,
    lat_user: 0,
    lng_end: 0,
    lat_end: 0,
    extras: [
      {
        id: 0,
        extra_service_id: 0,
      },
    ],
    client: {
      id: 0,
      full_name: '',
      phone: '',
      photo: '',
      stars: 0
    },
    driver: {
      id: 0,
      full_name: '',
      phone: '',
      photo: '',
      stars: 0
    },
    type_service_id: 0,
    address_end: '',
    address_user: '',
    order_description: '',
    number_house: '',
    reference: '',
    car: {
      id: 0,
      color: '',
      model: '',
      plate: 0
    }
  },
}

type TravelContextProps = {
  dataTravelContext: travelProgress
  changeTravel: (data: InterfaceTravelById) => Promise<void>
  removeTravel: () => void
  init:() => void
}

//crear el contexto
export const TravelContext = createContext({} as TravelContextProps)

export const TravelProvider = ({ children }: any) => {
  const { user } = useContext(AuthContext)
  const { getTravelbyID } = useTravel()
  const { toast } = useAlerts()

  const [dataTravelContext, dispatch] = useReducer(
    travelReducer,
    travelInitialState,
  )

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const resp = await AsyncStorage.getItem('travelStorage');
    if (!resp) return
    const objResp: InterfaceTravelById = JSON.parse(resp)

    if (user?.role_id === 3) {
      if (objResp.id === 0){
        return await removeTravel()
      }
    }
    //regresa al estado para poder calificar
    if (objResp.status_id === 0) return
    await changeTravel(objResp)
    
    if (objResp.status_id === 6) {
      await changeTravel(objResp)
      return;
    }
    try {
      
    } catch (error) {
      
    }
    getTravelbyID(objResp.id)
      .then((res) => {
        switch (res.data.status_id) {
          // Solicitado
          case 1:
            return changeTravel(res.data)
          //Aceptado
          case 2:
            return changeTravel(res.data)
          //viajando
          case 5:
            return changeTravel(res.data)
          // completado
          case 3:
            return changeTravel(res.data)
          //calificar
          case 6:
            return changeTravel(res.data)
          // cancelado
          case 4:
            return removeTravel()
        }
      })
      .catch((err: any) => {
        toast(
          err?.response?.data.msg || 'Lo sentimos, ocurrio un error',
          'WARNING',
        )
      })
  }

  const changeTravel = async (data: InterfaceTravelById) => {
    console.debug('👀 changeTravel =>', {data})
    console.log('CHNAGING...');
    
    dispatch({
      type: 'changeTravel',
      payload: { dataTravel: data },
    });
    
    await AsyncStorage.setItem('travelStorage', JSON.stringify(data))
  }

  const removeTravel = async () => {
    dispatch({
      type: 'removeData',
      payload: {
        dataTravel: travelInitialState.dataTravel,
      },
    })
    await AsyncStorage.removeItem('travelStorage')
    await AsyncStorage.removeItem('tripDistance')
    await AsyncStorage.removeItem('startTrackDateStorage')
  }

  return (
    <TravelContext.Provider
      value={{
        dataTravelContext,
        changeTravel,
        removeTravel,
        init
      }}
    >
      {children}
    </TravelContext.Provider>
  )
}
