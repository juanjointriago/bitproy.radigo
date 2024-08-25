import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
interface Props {
  message: string
}
export const Send = ({ message }: Props) => {
  return (
    <>
      <View style={stylesSend.send}>
        <Text>{message}</Text>
      </View>
    </>
  )
}
const stylesSend = StyleSheet.create({
  send: {
    backgroundColor: '#fdb8b8',
    width: '60%',
    alignSelf: 'flex-start',
    paddingVertical: '4%',
    paddingHorizontal: '6%',
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    borderTopRightRadius: 30,
    marginVertical: 8,
  },
})
