import React, { useEffect, useRef, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete'
import { GOOGLE_API_KEY } from '../../../service/helpers/constants'
import {
  INPUT2,
  PRIMARY_COLOR,
  globalStyles,
} from '../../../theme/globalStyles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons'
import { Dimensions } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'
const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface Props {
  styleView?: StyleProp<ViewStyle>
  placeholder?: any
  onpress?: (data: GooglePlaceData, detail: GooglePlaceDetail | null) => void
  address: any
  textInputProps: (status: boolean) => void
  iconColor?: 'red' | 'green' | 'default'
  autofocus?: boolean
}

export const Autocompleted = ({
  styleView,
  placeholder,
  onpress,
  address,
  textInputProps,
  iconColor = 'default',
  autofocus = false,
}: Props) => {
  const saveObj = (data: GooglePlaceData, detail: GooglePlaceDetail | null) => {
    if (onpress) onpress(data, detail)
  }

  const ref: any = useRef()

  useEffect(() => {
    ref.current.setAddressText(address)
  }, [address])

  return (
    <View style={{ ...styles.contentAutoCompleted, ...(styleView as any) }}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        GooglePlacesDetailsQuery={{ fields: 'geometry' }}
        ref={ref}
        fetchDetails={true}
        textInputProps={{
          onChange: () => {
            textInputProps(true)
          },
          autoFocus: autofocus,
        }}
        onPress={(data: GooglePlaceData, detail: GooglePlaceDetail | null) => {
          saveObj(data, detail)
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: 'es',
          components: 'country:ec',
          dropDownDirection: 'd',
        }}
        styles={searchInputStyle}
        renderRightButton={() => (
          <View style={styles.buttonRight}>
            <AntDesign name="right" size={24} color={INPUT2} />
          </View>
        )}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  contentAutoCompleted: {
    borderRadius: 10,
    position: 'absolute',
    width: '100%',

    top: 40,
  },

  buttonRight: {
    position: 'absolute',
    right: -30,
  },
  autocompleteContainer: {
    position: 'absolute',
    top: -200, // Ajusta este valor para determinar la posición de las opciones de autocompletado
    maxHeight: 200, // Ajusta este valor para determinar la altura máxima de las opciones de autocompletado
    borderRadius: 10,
    borderWidth: 1,
    borderColor: INPUT2,
    backgroundColor: '#fff',
    marginRight: 10,
    zIndex: 999,
  },
  autocompleteContainer1: {
    position: 'relative',
    top: -200, // Ajusta este valor para determinar la posición de la lista de opciones
    maxHeight: 200, // Ajusta este valor para determinar la altura máxima de la lista de opciones
  },
})
const searchInputStyle = {
  textInputContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 40,
    dropDownDirection: 'up',
    // borderColor: "green",
    // borderWidth: 1,

    // borderColor: INPUT2,
  },
  textInput: {
    ...globalStyles.Text,
    // borderWidth:1,
    // borderColor: "yellow",
    marginBottom: 0,
    // borderColor:INPUT2,
  },
  poweredContainer: {
    display: 'none',
    dropDownDirection: 'up',
  },
  row: {
    flexDirection: 'row',
    borderRadius: 10,
    // borderColor: "blue",
    // borderWidth:1
  },
  separator: {
    height: 0.6,
    width: 4,
    backgroundColor: 'transparent',
    // borderWidth: 2,
    // borderColor: "blue",
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: screenHeight > 700 ? 36 : 20,
    marginHorizontal: 20,
    top: screenHeight > 700 ? -40 : -15,
    borderWidth: 1,
    borderColor: INPUT2,
    dropDownDirection: 'up',
    bottom: '-100%',
    // shadowRadius: 6.46,
    // elevation: 20,
  },
  listView: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    shadowRadius: 6.46,
    elevation: 20,
    dropDownDirection: 'up',
    maxHeight: 600,
    // Otros estilos de la lista de opciones
  },
  description: {
    ...globalStyles.Text5,
  },
}
