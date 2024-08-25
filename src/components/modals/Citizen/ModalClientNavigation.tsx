import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useCallback, useEffect, useRef, useState, useContext } from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
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
                index={0}
                // index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
            >
                {children}
            </BottomSheet>
        </>
    )
}


export default ModalClientNavigation
