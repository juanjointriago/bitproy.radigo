import React, { useEffect, useState,useContext } from 'react';
import { ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { TravelContext } from '../../contexts/Travel/TravelContext';
import { PRIMARY_COLOR, globalStyles } from '../../theme/globalStyles';
import BtnPrimary from '../buttons/BtnPrimary';
interface Props {
    visible: boolean;
}

export const ModalArrivedDriver = ({ visible }: Props) => {
    const { dataTravelContext } = useContext(TravelContext)
    const [isVisible, setIsVisible] = useState(visible)
    useEffect(() => {
        if (visible) {
            setIsVisible(true)
        }

    }, [visible])


    const closeModal = () => {
        setIsVisible(false)
    }
    return (
        <Modal
            animationType="slide"
            visible={isVisible}
            transparent
        // onRequestClose={() => {alert("Modal has been closed.")}}
        >
            <View style={{ backgroundColor: 'rgba(247,247,247,0.4)', flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.contentModal} >
                      <Text style={{textAlign: 'center',fontWeight:'bold', fontSize:18, marginVertical:20}}> {dataTravelContext.dataTravel.type_service_id === 2 ? "El conductor llegó al lugar de compra": "El conductor ha llegado al punto de partida"}   </Text>
                      
                   
                      <BtnPrimary
                        func={closeModal}
                        styleBtn={{
                          width: '60%',
                          height: 50,
                          backgroundColor: 'black',
                          marginTop:10
                        }}
                        styleTitle={{ color: 'white' }}
                        title={'Listo'}
                      />
                </View>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({

    contentModal: {
        paddingHorizontal:30,
        paddingVertical:30,
        backgroundColor: PRIMARY_COLOR,
        width: '90%',
        height:"30%",
        justifyContent:'center',
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
        flex:1

    },
    buttonClose: {
        right: '4%',
        top: '3%',
        position: "absolute",
        zIndex:99999,
        backgroundColor:"white",
        borderRadius:100,
        width:50,
        height:50,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',

    }

});