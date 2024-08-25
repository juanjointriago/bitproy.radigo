import { View, Text, TouchableOpacity, Image, ViewStyle, TextStyle } from 'react-native';
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { WHITE } from '../../theme/globalStyles';

interface Props {
  direcA: string
  direcB: string
  onPress: any
  styleBtn?: ViewStyle
  styleCircle?: any
  styleNumber?: any
  styleAddress?: TextStyle
  type_service_id?: number
}

const CardRequestDriver = ({
  direcA,
  direcB,
  onPress,
  styleBtn,
  styleCircle,
  styleNumber,
  styleAddress, type_service_id
}: Props) => {
  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            marginVertical: 10,
            width: '90%',
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: 'white',
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.32,
            shadowRadius: 6.46,
            elevation: 5,
            ...(styleBtn as any),
          }}
        >
          <View
            style={{
              width: '20%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                ...(styleCircle as any),
              }}
            >
              {
                type_service_id === 1 ?
                  <Image
                    source={require("../../assets/icons/address.png")}
                    style={{ width: "80%", height: "80%" }}
                    resizeMode="contain"
                  />
                  :
                  <FontAwesome5 name="box-open" size={40} color={WHITE} />
              }

            </View>
          </View>

          <View
            style={{ flex: 1, paddingHorizontal: 15, justifyContent: 'center' }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: '400',
                ...(styleAddress as any),
              }}
            >
              {direcA}
            </Text>

            <View
              style={{
                left: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '300',
                  ...(styleAddress as any),
                }}
              >
                {direcB}
              </Text>
            </View>


          </View>
        </View>
      </TouchableOpacity>
    </>
  )
}

export default CardRequestDriver
