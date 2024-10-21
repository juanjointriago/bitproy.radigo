import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
} from 'react'
import BottomSheetModal from '@gorhom/bottom-sheet';
import { PRIMARY_COLOR } from '../../../theme/globalStyles';
import { TravelContext } from '../../../contexts/Travel/TravelContext';
import { AntDesign } from '@expo/vector-icons';

interface Props {
  openModalDescriptionTravel: () => void
  state?: any
  close?: any
  snapPoints?: any
  children?: any
  statusOnBoard?: any
}

const ModalDriverNavigation = ({
  state,
  close,
  snapPoints,
  children,
  statusOnBoard,
  openModalDescriptionTravel,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const [statusOpenModal, setStatusOpenModal] = useState(false)
  const { dataTravelContext } = useContext(TravelContext);
  const refIndex = useRef(1);

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

  const CustomHandleComponent = () => (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor:
          statusOnBoard && dataTravelContext.dataTravel.status_id === 2
            ? PRIMARY_COLOR
            : dataTravelContext.dataTravel.status_id === 2
            ? undefined
            : dataTravelContext.dataTravel.status_id === 5
            ? PRIMARY_COLOR
            : dataTravelContext.dataTravel.status_id === 3 ||
              dataTravelContext.dataTravel.status_id === 6
            ? 'black'
            : dataTravelContext.dataTravel.driver !== undefined &&
              dataTravelContext.dataTravel.status_id === 1
            ? undefined
            : 'red',
      }}
      onPress={() => {
        statusOpenModal ? handleSheetChanges(1) : handleSheetChanges(0)
      }}
    >
      <View
        style={{
          backgroundColor: '#717171',
          width: 90,
          height: 3,
          borderRadius: 5,
        }}
      ></View>
      <View
        style={{
          borderBottomColor: '#717171',
          borderBottomWidth: 0.7,
          width: '90%',
          position: 'absolute',
          bottom: 0,
        }}
      ></View>

      {(dataTravelContext.dataTravel.status_id === 1 || dataTravelContext.dataTravel.status_id === 2) && (
        <TouchableOpacity
          onPress={openModalDescriptionTravel}
          style={{ position: 'absolute', right: 40 }}
        >
          <AntDesign name="infocirlce" size={25} color="black" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )

  return (
      <BottomSheetModal
        handleComponent={CustomHandleComponent}
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
        // index={refIndex.current}
        snapPoints={useMemo(() => [...snapPoints], [snapPoints])}
        onChange={handleSheetChanges}
      >
        {children}
      </BottomSheetModal>
  )
}

export default ModalDriverNavigation
