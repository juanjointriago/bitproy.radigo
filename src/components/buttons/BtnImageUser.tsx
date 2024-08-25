import { View, Text, TouchableOpacity, Image, ImageStyle } from 'react-native'
import React from 'react'
import { BACKGROUND, WHITE } from '../../theme/globalStyles'

interface Props {
  styleBtn?: ImageStyle
  func: any
  imgUrl?: string
}

const BtnImageUser = ({ styleBtn, func, imgUrl }: Props) => {
  return (
    <TouchableOpacity onPress={func}>
      <Image
        style={{
          width: 60,
          height: 60,
          borderRadius: 100,
          backgroundColor: WHITE,
          ...styleBtn,
        }}
        source={{
          uri:
            imgUrl === undefined || imgUrl === ''
              ? 'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png'
              : imgUrl,
        }}
      />
    </TouchableOpacity>
  )
}

export default BtnImageUser
