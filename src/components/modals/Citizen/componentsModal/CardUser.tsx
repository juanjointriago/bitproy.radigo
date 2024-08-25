import { View, Text, Image } from 'react-native';
import React from 'react'
import { globalStyles } from '../../../../theme/globalStyles';
import { Entypo } from '@expo/vector-icons';

interface Props{
  name:string
  stars:number
  imgUrl?: string
  modeBlack:boolean
}

const CardUser = ({name,stars,imgUrl,modeBlack}:Props) => {
  return (
    <View
    style={{
      width: '100%',
      height: 90,
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <View
      style={{
        width: '33%',
        justifyContent: 'center',
        alignItems: 'center',
        left:10
      }}
    >
      <Image
        style={{
          width: 60,
          height: 60,
          borderRadius: 100,
          backgroundColor: '#F1F1F1',
        }}
        source={{
          uri:
            imgUrl === undefined || imgUrl === ''
              ? 'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png'
              : imgUrl,
        }}
      />
    </View>

    <View>
      <Text style={[globalStyles.Title6, {color:modeBlack?'white':'black'}]} > {name} </Text>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <Entypo name="star" size={20} color={modeBlack ? "white":"#F3B304"} />
        <Text style={[globalStyles.Text3, {color:modeBlack?'white':'#717171',marginLeft:8 }]} > {stars.toFixed(2)} </Text>
      </View>
    </View>
  </View>
  )
}

export default CardUser