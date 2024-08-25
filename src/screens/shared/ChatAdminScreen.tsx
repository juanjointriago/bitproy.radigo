import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { PRIMARY_COLOR } from '../../theme/globalStyles'
import { SocketContext } from '../../contexts/sockets/SocketContext'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import useChat from '../../service/hooks/useChat'
import useUser from '../../service/hooks/useUser'
import { DataAdmin } from '../../interfaces/userInterfaces'
import { StackScreenProps } from '@react-navigation/stack'
import moment from 'moment'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import ChatHeader from '../../components/chat/ChatHeader'
import { Receive } from '../../components/chat/Receive'
import { Send } from '../../components/chat/Send'
interface Props extends StackScreenProps<any, any> { }

const ChatAdminScreen = ({route, navigation}:Props) => {
  const onChatAdmin = route.params?.onChatAdmin
  const { socket } = useContext(SocketContext)
  const { user } = useContext(AuthContext)
  const { getMessagesChat } = useChat()
  const { getAdminsChat } = useUser()

  const [listMessage, setListMessage] = useState<any>([])
  const [message, setMenssage] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const [openModal, setOpenModal] = useState(true)
  const [dataAdmin, setDataAdmin] = useState<DataAdmin>()

  function scrollViewSizeChanged(height: any) {
    // y since we want to scroll vertically, use x and the width-value if you want to scroll horizontally
    scrollViewRef.current?.scrollTo({ y: height, animated: true })
  }
  useEffect(() => {
    setOpenModal(false)
  }, [openModal])

  useEffect(() => {
    getMessages()
  }, [onChatAdmin])

  useEffect(() => {
    getDataAdmins()
  }, [onChatAdmin])

  const getDataAdmins = () => {
    getAdminsChat()
      .then((res) => {
        const data = res.data.find((res) => {
          return res.id === onChatAdmin
        })
        setDataAdmin(data)
        console.log(data)
      })
      .catch((err) => {
        console.log('🎶🎶', err)
      })
  }

  const getMessages = () => {
    getMessagesChat(onChatAdmin).then((res) => {
      setListMessage(res.data)
    })
  }

  const socketEmitAdmin = () => {
    if (onChatAdmin === 0) {
      return setOpenModal(true)
    }
    if (message !== '') {
      socket?.emit('send-message', {
        from: user?.id,
        to: onChatAdmin,
        message,
      })
      let data = {
        sender_id: user?.id,
        receiver_id: onChatAdmin,
        message: message,
        created_at: moment().toString(),
      }
      setListMessage((prevMessages: any) => [...prevMessages, data])

      setMenssage('')
    }
  }

  const socketOn = () => {
    socket?.on(`listen-message`, (res: any) => {
      let data = {
        sender_id: onChatAdmin,
        receiver_id: res.receiver_id,
        message: res.message,
        created_at: res.created_at,
      }
      console.log("❤❤❤❤❤❤",onChatAdmin)
      if (res.sender_id === onChatAdmin) {
        setListMessage((prevMessages: any) => {
          // Filtrar mensajes duplicados basados en el ID del mensaje
          const uniqueMessages = [...prevMessages, data].filter(
            (msg, index, self) =>
              index ===
              self.findIndex(
                (m) =>
                  m.sender_id === msg.sender_id && m.message === msg.message,
              ),
          )
          return uniqueMessages
        })
      }
    })
  }

  useEffect(() => {
    socketOn()
  }, [socket, onChatAdmin])



  return (
    
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: PRIMARY_COLOR,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: 70,
        }}
      >
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} style={{ color: 'black' }} />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Text style={{ fontSize: 20, color: 'black', right: 25 }}>
            Chat Administrador
          </Text>
        </View>
      </View>
      <>
        <View
          style={{
            backgroundColor: 'white',
            flex: 1,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          <ChatHeader
            name={dataAdmin?.full_name}
            img={
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
            }
          />
          {dataAdmin?.id !== 0 && (
            <View style={{ height: '100%' }}>
              <ScrollView
                style={{ marginBottom: 210 }}
                showsVerticalScrollIndicator={false}
                ref={scrollViewRef}
                onContentSizeChange={(width, height) => {
                  scrollViewSizeChanged(height)
                }}
              >
                {listMessage.map((m: any, i: any) =>
                  m.sender_id === user?.id ? (
                    <Receive message={m.message} key={i} />
                  ) : (
                    <Send message={m.message} key={i} />
                  ),
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </>

      <View
        style={{
          backgroundColor: '#e5e7e9',
          flexDirection: 'row',
          paddingLeft: 10,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 15,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 100,
          paddingBottom: 30,
        }}
      >
        <TextInput
          style={styles.input}
          onChangeText={(value) => setMenssage(value)}
          value={message}
        />
        <TouchableOpacity
          onPress={() => {
            socketEmitAdmin()
          }}
        >
          <Ionicons name="send-outline" size={30} color="#6c6c6c" />
        </TouchableOpacity>
      </View>
    </View>
)
}
const styles = StyleSheet.create({
contentModal: {
backgroundColor: '#F2F2F2',
width: '100%',

shadowOffset: {
  width: 0,
  height: 10,
},
shadowOpacity: 0.25,
elevation: 10,
borderRadius: 15,
alignItems: 'center',
},
button: {
borderRadius: 15,
height: '70%',
justifyContent: 'center',
alignItems: 'center',
},
contentInput: {
backgroundColor: '#e5e7e9',
borderTopEndRadius: 10,
borderTopStartRadius: 10,
width: '100%',
height: 100,
justifyContent: 'center',
alignItems: 'center',
flexDirection: 'row',
},
input: {
paddingLeft: 10,
height: 50,
width: '75%',
borderWidth: 1,
marginRight: 15,
borderRadius: 10,
borderColor: '#f1f4f5',
backgroundColor: 'white',
},
})

export default ChatAdminScreen