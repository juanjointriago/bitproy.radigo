import { View, Button, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { TravelContext } from '../../contexts/Travel/TravelContext'


const LoadingScreen = () => {


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        Cargando...
      </Text>
    </View>
  )
}

export default LoadingScreen
