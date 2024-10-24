import { View, StyleSheet, Text } from 'react-native';
import { useCallback, useEffect, useRef, useState, useContext, Fragment, useMemo } from 'react'
// import {BottomSheetModal} from '@gorhom/bottom-sheet'
import BottomSheet,{ BottomSheetView, TouchableOpacity} from '@gorhom/bottom-sheet'
import { PRIMARY_COLOR } from '../../../theme/globalStyles';
import { TravelContext } from '../../../contexts/Travel/TravelContext';


const ModalClientNavigation = ({
    state,
    close,
    snapPoints,
    children,
}: any) => {
    const bottomSheetRef = useRef<BottomSheet>(null)
    const [statusOpenModal, setStatusOpenModal] = useState(false)
    const { dataTravelContext } = useContext(TravelContext)
    // const refIndex = useRef(1)
    const [refIndex, setRefIndex] = useState(1);

    useEffect(() => {
        handleSheetChanges(state)
    }, [state])

    const handleSheetChanges = useCallback((index: number) => {
        // bottomSheetRef.current?.snapToIndex(index)
        // if (index === 1) {
        //     close(1)
        //     setStatusOpenModal(false)
        // } else {
        //     setStatusOpenModal(true)
        // }
        // if (index === 0) {
        //     close(0)
        // }
    }, [])

    const CustomHandleComponent = () => (
        <TouchableOpacity
            style={{
                alignItems: 'center', justifyContent: 'center', height: 40, backgroundColor:
                dataTravelContext.dataTravel.status_id === 6 ? 'black': undefined
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
        </TouchableOpacity>
    )

    return (
        <Fragment>
            {/* <BottomSheetModal
                handleComponent={CustomHandleComponent}
                backgroundStyle={styles.modalContainer}
                ref={bottomSheetRef}
                index={refIndex.current}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
            >
                {children}
            </BottomSheetModal> */}
            <BottomSheet
                handleComponent={CustomHandleComponent}
                backgroundStyle={styles.modalContainer}
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                // index={refIndex}
                // index={refIndex.current}
                onChange={handleSheetChanges}
            >
                {/* <BottomSheetView> */}
                {children}

                {/* </BottomSheetView> */}
            </BottomSheet>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    
    modalContainer:{
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopColor: '#CFCFCF',
        borderEndColor: '#CFCFCF',
        borderStartColor: '#CFCFCF',
        borderTopWidth: 1,
        borderEndWidth: 0.5,
        borderStartWidth: 0.5,
        backgroundColor: 'white',
    }
})

export default ModalClientNavigation
