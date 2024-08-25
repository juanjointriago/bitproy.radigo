import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Linking,
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { PRIMARY_COLOR, globalStyles } from '../../../theme/globalStyles'
import CardSos from '../../other/CardSos'
import BtnPrimary from '../../buttons/BtnPrimary'
import { Info } from '../../../interfaces/SupportInterfaces'
import { useSupport } from '../../../service/hooks/useSupport'
import { FlatList, Image } from 'react-native'
import { DataAdmin } from '../../../interfaces/userInterfaces'
import useUser from '../../../service/hooks/useUser'

interface Props {
  openModalState: boolean
  openModalChat: () => void
  btnCancel: () => void
  dataAdmin: (data: DataAdmin) => void
  onSocketChatAdmin: number
}

const ModalListAdmins = ({ onSocketChatAdmin, openModalChat, dataAdmin, openModalState, btnCancel }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const { getSupportInfo } = useSupport()
  const [dataAdmins, setDataAdmins] = useState<DataAdmin[]>([])
  const { getAdminsChat } = useUser()
  const [info, setInfo] = useState<Info>()

  useEffect(() => {
    if (openModalState) {
      handleOpenSheet()
    } else {
      handleCloseSheet()
    }
  }, [openModalState])

  useEffect(() => {
    getDataAdmins()
  }, [])

  const getDataAdmins = () => {
    getAdminsChat()
      .then((res) => {
        setDataAdmins(res.data)
      })
      .catch((err) => {
        console.log('🎶🎶', err)
      })
  }

  const handleCloseSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close()
    }
  }

  const handleOpenSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0) // Índice de la hoja inferior que deseas mostrar
    }
  }

  const CustomHandleComponent = () => (
    <TouchableOpacity
      style={{ alignItems: 'center', justifyContent: 'center', height: 40 }}
      onPress={() => {
        handleCloseSheet()
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
    </TouchableOpacity>
  )


  const selectAdmin = (data: DataAdmin) => {
    dataAdmin(data)
    openModalChat()
    handleCloseSheet()
  }


  const renderItem = (el: any) => {
    return (
      <TouchableOpacity
        key={el.id}
        onPress={() => selectAdmin(el)}
        style={{
          left: 10,
          marginTop: 10,
          width: '95%',
          height: 70,
          borderColor: PRIMARY_COLOR,
          backgroundColor: onSocketChatAdmin === el.id ? 'red' : 'white',
          borderWidth: 1,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 15,
        }}
      >
        <Image
          source={{
            uri:
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            backgroundColor: 'black',
          }}
        />
        <Text style={{ ...globalStyles.Text, color: 'black', left: 10 }}>
          {el?.full_name}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <BottomSheet
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
        index={-1}
        snapPoints={['60%']}
        enablePanDownToClose
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>


          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                width: '100%',
                height: '100%',

                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  ...globalStyles.Text,
                  color: 'black',
                  textAlign: 'center',
                  fontSize: 19,
                  marginVertical: 15,
                }}
              >
                Administradores disponibles
              </Text>
              {dataAdmins.map((res: any, i: any) => (
                renderItem(res)
              ))}
              <View style= {{height:30}} />
              {/*  <FlatList
                showsVerticalScrollIndicator={false}
                data={dataAdmins}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item: any, index: number) => index.toString()}
                ItemSeparatorComponent={() => <View style={{}}></View>}
                style={{ width: '100%' }}
              /> */}
            </View>
          </View>
        </BottomSheetScrollView>

      </BottomSheet>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

export default ModalListAdmins
