import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
interface Props {
    visible: boolean;
    img: any;
    onClose: () => void;
}

export const ModalPreview = ({ visible, img, onClose }: Props) => {
    const [isVisible, setIsVisible] = useState(visible)
    useEffect(() => {
        if (visible) {
            setIsVisible(true)
        }

    }, [visible])


    const closeModal = () => {
        setIsVisible(false)
        onClose()
    }
    return (
        <Modal
            animationType="slide"
            visible={isVisible}
            transparent
        // onRequestClose={() => {alert("Modal has been closed.")}}
        >
            <View style={{ backgroundColor: 'rgba(247,247,247,0.4)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.contentModal} >
                    <TouchableOpacity style={styles.buttonClose} onPress={closeModal}>
                        <Ionicons name="close-sharp" size={35} color="black" />
                    </TouchableOpacity>
                        <Image
                            source={{ uri: img }}
                            style={styles.img}
                            resizeMode='contain'
                        />
                </View>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({

    contentModal: {
        backgroundColor: 'white',
        width: '90%',
        height:"50%",
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