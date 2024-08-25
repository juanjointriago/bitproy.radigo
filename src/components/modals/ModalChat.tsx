import React, { useContext, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from "../../theme/globalStyles";
import { AntDesign } from "@expo/vector-icons";

import { Receive } from "../chat/Receive";
import { Send } from "../chat/Send";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SocketContext } from "../../contexts/sockets/SocketContext";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import ChatHeader from "../chat/ChatHeader";
import { TravelContext } from "../../contexts/Travel/TravelContext";
import moment from "moment";
interface Props {
  visible: boolean;
  idTravel: any;
  idUser: any;
  name: any;
  photo: any;
}

export const ModalChat = ({
  visible,
  idTravel,
  idUser,
  name,
  photo,
}: Props) => {
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const { dataTravelContext} = useContext(TravelContext);
  const [isVisible, setIsVisible] = useState(visible);
  const [listMessage, setListMessage] = useState<any>([]);
  const [message, setMenssage] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);

  function scrollViewSizeChanged(height: any) {
    // y since we want to scroll vertically, use x and the width-value if you want to scroll horizontally
    scrollViewRef.current?.scrollTo({ y: height, animated: true });
  }

  const socketEmit = () => {
    if (message !== "") {
      socket?.emit("send-message", {
        from: user?.id,
        to: user?.role_id === 3 ? dataTravelContext?.dataTravel.client.id : dataTravelContext?.dataTravel.driver.id,
        message,
      });
      let data = {
        sender_id: user?.id,
        receiver_id: user?.role_id === 3 ? dataTravelContext?.dataTravel.client.id : dataTravelContext?.dataTravel.driver.id,
        message: message,
        created_at: moment().toString(),
      };
      setListMessage((prevMessages) => [...prevMessages, data]);

      setMenssage("");
    }
  };
 
  const socketOn = () => {
     socket?.on(`listen-message`, (res: any) => {
      let data = {
        sender_id: res.sender_id,
        receiver_id: res.receiver_id,
        message: res.message,
        created_at: res.created_at,
      };
      if (user?.id !== res.sender_id) {
      setListMessage((prevMessages) => [...prevMessages, data]);
      }
    }); 
  };


  useEffect(() => {
    socketOn();
    return () => {
      socket?.off(`listen-message`);
    };
  }, [socket]);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    }
  }, [visible]); 

  const closeModal = () => {
    setIsVisible(false);
  };

  return (
    <Modal animationType="fade" visible={isVisible}>
      <KeyboardAvoidingView
        style={{ flex: 1, marginTop:Platform.OS==='ios'?45:0}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: PRIMARY_COLOR,
            }}
          >

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                height:70
              }}
            >
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => closeModal()}
              >
                <AntDesign
                  name="left"
                  size={24}
                  style={{ color: "black" }}
                />
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, color: "black", right:25 }}>
                  Chat
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "white",
                flex: 1,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}
            >
              <ChatHeader name={name} img={photo} />
              <View style={{ height: "100%" }}>
                <ScrollView
              
              style={{marginBottom: 210}}
                  showsVerticalScrollIndicator={false}
                  ref={scrollViewRef}
                  onContentSizeChange={(width, height) => {
                    scrollViewSizeChanged(height);
                  }}
                >
                  {listMessage.map((m: any, i: any) =>
                    m.sender_id === user?.id ? (
                      <Receive message={m.message} key={i} />
                    ) : (
                      <Send message={m.message} key={i} />
                    )
                  )}
                </ScrollView>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "#e5e7e9",
                flexDirection: "row",
                paddingLeft: 10,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 15,
                position:"absolute",
                bottom: 0,
                width: "100%",
                height:100,
                paddingBottom:30
              }}
            >
              <TextInput
                style={styles.input}
                onChangeText={(value) => setMenssage(value)}
                value={message}
              />
              <TouchableOpacity
                onPress={() => {
                  socketEmit();
                }}
              >
                <Ionicons name="send-outline" size={30} color="#6c6c6c" />
              </TouchableOpacity>
            </View>
          </View>
        
      </KeyboardAvoidingView>

    </Modal>
  );
};
const styles = StyleSheet.create({
  contentModal: {
    backgroundColor: "#F2F2F2",
    width: "100%",

    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    elevation: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  button: {
    borderRadius: 15,
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  contentInput: {
    backgroundColor: "#e5e7e9",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  input: {
    paddingLeft: 10,
    height: 50,
    width: "75%",
    borderWidth: 1,
    marginRight: 15,
    borderRadius: 10,
    borderColor: "#f1f4f5",
    backgroundColor: "white",
  },
});
