import React, { useEffect, useState, useContext } from 'react'
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native'
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons'
import { TravelContext } from '../../contexts/Travel/TravelContext'
import {
  INPUT2,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TEXT,
  globalStyles,
} from '../../theme/globalStyles'
import BtnPrimary from '../buttons/BtnPrimary'
import useUser from '../../service/hooks/useUser'
import { DataAdmin } from '../../interfaces/userInterfaces'
interface Props {
  visible: boolean
  dataAdmin:(data:DataAdmin)=> void
  onChatAdmin:any
}

export const ModalSelectUserChat = ({onChatAdmin, visible, dataAdmin }: Props) => {
  const { getAdminsChat } = useUser()
  const { dataTravelContext } = useContext(TravelContext)
  const [isVisible, setIsVisible] = useState(visible)

  const [dataAdmins, setDataAdmins] = useState<DataAdmin[]>([])

  useEffect(() => {
    getDataAdmins()
  }, [])

  useEffect(() => {
    if (visible) {
      setIsVisible(true)
    }
  }, [visible])

  const closeModal = () => {
    setIsVisible(false)
  }

  const getDataAdmins = () => {
    getAdminsChat()
      .then((res) => {
        setDataAdmins(res.data)
      })
      .catch((err) => {
        console.log('🎶🎶', err)
      })
  }

  const selectAdmin =(data:DataAdmin)=>{
    dataAdmin(data)
    closeModal()
  }

  const renderItem = (el: any) => {
    return (
      <TouchableOpacity
        onPress={()=>selectAdmin(el)}
        style={{
          left: 10,
          marginTop: 10,
          width: '95%',
          height: 70,
          borderColor: PRIMARY_COLOR,
          backgroundColor: onChatAdmin ===el.id ? 'red' :'white',
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
        <Text style={{ ...globalStyles.Text, color: onChatAdmin ===el.id ? 'white' :'black', left: 10 }}>
          {el?.full_name}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      transparent
      // onRequestClose={() => {alert("Modal has been closed.")}}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={styles.contentModal}>
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

          <FlatList
            //
            showsVerticalScrollIndicator={false}
            data={dataAdmins}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item: any, index: number) => index.toString()}
            ItemSeparatorComponent={() => <View style={{}}></View>}
            style={{ width: '100%' }}
          />
        </View>
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  contentModal: {
    backgroundColor: 'white',
    width: '100%',
    height: '60%',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    elevation: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    flex: 1,
  },
  buttonClose: {
    right: '4%',
    top: '3%',
    position: 'absolute',
    zIndex: 99999,
    backgroundColor: 'white',
    borderRadius: 100,
    width: 50,
    height: 50,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
