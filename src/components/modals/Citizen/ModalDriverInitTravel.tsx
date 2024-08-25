import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import React, { useCallback, useEffect, useRef, useState, useContext } from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import { ALERT, INPUT1, PRIMARY_COLOR, globalStyles } from '../../../theme/globalStyles';
import { TravelByDriver } from '../../../interfaces/ITravel';
import { AuthContext } from '../../../contexts/Auth/AuthContext';
import { useAlerts } from '../../../service/hooks/useAlerts';
import { AntDesign } from '@expo/vector-icons';
import { TravelContext } from '../../../contexts/Travel/TravelContext';

interface Props {
  state: any
  close: any
  snapPoints: any
  children: any
  dataTravels: TravelByDriver[]
  selectTravel?: TravelByDriver
}

const ModalDriverInitTravel = ({
  state,
  close,
  snapPoints,
  children,
  dataTravels,
  selectTravel,
}: Props) => {
  const { dataTravelContext } = useContext(TravelContext)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [statusOpenModal, setStatusOpenModal] = useState(false)
  const { user, } = useContext(AuthContext)
  const { toast } = useAlerts()

  useEffect(() => {
    handleSheetChanges(state)
  }, [state])

  const handleSheetChanges = useCallback((index: number) => {

    bottomSheetRef.current?.snapToIndex(index)
    if (index === 1) {
      close(1)
      setStatusOpenModal(false)
    } else {
      setStatusOpenModal(true)
    }
    if (index === 0) {
      close(0)
    }
  }, [])

  const CustomHandleComponentNotTravel = () => (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        backgroundColor: selectTravel?.type_service_id === 1 ? PRIMARY_COLOR : selectTravel?.type_service_id === 2 ? INPUT1 : dataTravels.length > 0 ? ALERT : '#1f1f1f',
        borderTopEndRadius: 10,
        borderTopStartRadius: 10
      }}
      onPress={() => {
        statusOpenModal ? handleSheetChanges(1) : handleSheetChanges(0)
      }}
    >
      <View
        style={{
          bottom: 15,
          backgroundColor: 'white',
          width: 70,
          height: 3,
          borderRadius: 5,
          flexDirection: 'row'
        }}
      ></View>
      <View
        style={{

          flexDirection: 'row'
        }}
      >
        {selectTravel?.id === 0 ?
          <>
            <Text style={[globalStyles.Title, { color: 'white', marginRight: 10 }]}>
              {dataTravels.length}
            </Text>
            <Text style={[globalStyles.Text, { color: 'white', fontSize: 24 }]}>
              Solicitud(es)
            </Text>
          </>
          : <>

            <Text style={[globalStyles.Text, { color: 'white', fontSize: 24 }]}>
              {selectTravel?.type_service_id === 2 ?
                "Solicitud encargo" : "Solicitud"
              }
            </Text>

          </>}
      </View>


    </TouchableOpacity>
  )


  return (
    <>
      <BottomSheet
        handleComponent={CustomHandleComponentNotTravel}
        backgroundStyle={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderTopColor: '#CFCFCF',
          borderEndColor: '#CFCFCF',
          borderStartColor: '#CFCFCF',
          borderTopWidth: 1,
          borderEndWidth: 0.5,
          borderStartWidth: 0.5,
          backgroundColor: 'white',
        }}
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        {children}
      </BottomSheet>
    </>
  )
}


export default ModalDriverInitTravel
