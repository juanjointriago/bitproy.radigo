import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
interface Props {
  message: string
}
export const Receive = ({ message }: Props) => {
  return (
    <>
      <View style={stylesRecieve.recieve}>
        <Text>{message}</Text>
      </View>
    </>
  )
}
const stylesRecieve = StyleSheet.create({
  recieve: {
    backgroundColor: '#bdd6c5',
    width: '60%',
    alignSelf: 'flex-end',
    paddingVertical: '4%',
    paddingHorizontal: '5%',
    borderTopStartRadius: 30,
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    marginVertical: 8,
  },
})
