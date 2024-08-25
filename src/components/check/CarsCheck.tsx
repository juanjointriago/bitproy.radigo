import { View, Text } from 'react-native'
import React from 'react'
import { BCBUTTON, globalStyles } from '../../theme/globalStyles'
import BtnCheck from './BtnCheck'

interface Props {
  checkStatus: (res: boolean) => void
}

const CarsCheck = ({ checkStatus }: Props) => {
  return (
    <>
      <View
        style={{
          width: '100%',
          height: 70,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: 30,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Text style={[globalStyles.Text, { marginHorizontal: 10 }]}>1</Text>
          <Text style={globalStyles.Text}>Autos</Text>
        </View>

        <BtnCheck
          checkStatus={(res) => {
            checkStatus(res)
          }}
        ></BtnCheck>
      </View>
      <View
        style={{ left: 30, width: '70%', height: 1, backgroundColor: BCBUTTON }}
      />
    </>
  )
}

export default CarsCheck
