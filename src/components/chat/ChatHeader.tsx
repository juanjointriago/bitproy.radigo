import { View, Text, Image } from 'react-native';
import React from 'react'
import { SECONDARY_COLOR } from '../../theme/globalStyles';

const ChatHeader = ({img, name}:any) => {
  return (
    <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
            }}
          >
            <Image
              source={{
                uri:
                  img !== undefined
                    ? img
                    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
              }}
              style={{ width: 70, height: 70, borderRadius: 100 }}
            />
            <View style={{ left: 10, width: '75%' }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: SECONDARY_COLOR,
                }}
              >
                {name}
              </Text>
       
            </View>
          </View>
  )
}

export default ChatHeader