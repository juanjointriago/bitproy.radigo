import  { useEffect, useState,useContext, Fragment } from 'react';
import { ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { TravelContext } from '../../contexts/Travel/TravelContext';
import { PRIMARY_COLOR, globalStyles } from '../../theme/globalStyles';
import BtnPrimary from '../buttons/BtnPrimary';
interface Props {
    visible: boolean;
}

export const ModalDescription = ({ visible }: Props) => {
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
            // transparent
            // style={{ flex: 1, backgroundColor: 'red' }}
        // onRequestClose={() => {alert("Modal has been closed.")}}
        >
            <View style={{ backgroundColor: 'rgba(247,247,247,0.4)', flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.contentModal} >
                    <Entypo name="location-pin" size={50} color="black" />
                      <Text style={{textAlign: 'center',fontWeight:'bold', fontSize:18}}> {dataTravelContext.dataTravel.type_service_id  ===2 ? "Dirección de Compra:":  "Dirección:"}</Text>
                      
                      <Text style={{...globalStyles.Text,textAlign: 'center'}}> {dataTravelContext?.dataTravel.address_user} </Text>
                      <Text style={{textAlign: 'center',fontWeight:'bold', fontSize:18}}> Número de casa: </Text>
                      <Text style={{...globalStyles.Text,}}>{dataTravelContext?.dataTravel.number_house}</Text>

                      <Text style={{textAlign: 'center',fontWeight:'bold', fontSize:18}}> Referencia: </Text>
                      <Text style={{...globalStyles.Text}}>{dataTravelContext?.dataTravel.reference}</Text>

                        {dataTravelContext.dataTravel.type_service_id === 2 &&
                        <Fragment>
                        
                      <Text style={{textAlign: 'center',fontWeight:'bold', fontSize:18}}> Descripción de la orden: </Text>
                      <Text style={{...globalStyles.Text}}> {dataTravelContext?.dataTravel.order_description}</Text>

                      <Text style={{textAlign: 'center',fontWeight:'bold', fontSize:18}}>  Lugar de Entrega:</Text>
                      
                      <Text style={{...globalStyles.Text,textAlign: 'center'}}> {dataTravelContext?.dataTravel.address_end} </Text>
                        </Fragment>

                        }

                      <AntDesign name="checkcircle" size={35} color={PRIMARY_COLOR} />
                      <BtnPrimary
                        func={closeModal}
                        styleBtn={{
                          width: '60%',
                          height: 50,
                          backgroundColor: PRIMARY_COLOR,
                          marginTop:10
                        }}
                        styleTitle={{ color: 'black' }}
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
        backgroundColor: 'white',
        width: '90%',
        height:"60%",
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