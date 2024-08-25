import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface Props {
  direc: any
  desc: any
  onPress: any
  styleBtn?: any
  styleCircle?: any
  styleNumber?: any
  styleAddress?: any
}

const CardSos = ({
  direc,
  desc,
  onPress,
  styleBtn,
  styleCircle,
  styleNumber,
  styleAddress,
}: Props) => {
  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            height: 100,
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
            elevation: 20,
            ...(styleBtn as any),
          }}
        >


          <View
            style={{ flex: 1, paddingHorizontal: 15, justifyContent: 'center' }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                ...(styleAddress as any),
              }}
            >
              {direc}
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
                {desc}
              </Text>
            </View>


          </View>

          <View
            style={{
              width: '20%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#E8272C',
              }}
            >
              <Ionicons name="call" size={40} color="white" />
            </View>
          </View>

        </View>
      </TouchableOpacity>
    </>
  )
}

export default CardSos
