import { View, Text } from 'react-native'
import React,{useContext} from 'react'
import { globalStyles } from '../../../../theme/globalStyles'
import { TravelContext } from '../../../../contexts/Travel/TravelContext';

interface Props {
  plate?: number
  model?: string
  colorCar?: string
  minute: number
  km: number
  price?: number
  modeBlack?:boolean
}

const InfTravel = ({
  plate,
  model,
  colorCar,
  minute,
  km,
  modeBlack,
  price,
}: Props) => {
  const {  dataTravelContext } = useContext(
    TravelContext
  )
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        marginBottom: 25,
        marginTop: 5,
      }}
    >
      <View style={{ flex: 1, alignItems: 'center', borderEndColor: '#717171', borderEndWidth: 1, }}>
        {!price &&
          <Text style={[globalStyles.Text4, { color: modeBlack ?'white':'black', right: 25, marginBottom: 10 }]} > {dataTravelContext.dataTravel.status_id === 5 ? "":"Tu taxi esta a:"  } </Text>
        }
        <Text style={[globalStyles.TitleSecondary, { color:modeBlack ?'white': 'black' }]} > {minute.toFixed(2)} min</Text>
        <Text style={[globalStyles.Text4, { color:modeBlack ?'white': 'black' }]} >{km.toFixed(2)} Km</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {price ? <>
          {dataTravelContext.dataTravel.type_service_id  ===2 &&  
              <Text style={[globalStyles.Text, { color: modeBlack ?'white':'black', fontSize: 14 }]} > Costo de la carrera: </Text>
          }
          <Text style={[globalStyles.Text, { color: modeBlack ?'white':'black', fontSize: 32 }]} > ${price.toFixed(2)} </Text>
        </> : <>
          <Text style={[globalStyles.TitleSecondary, { color: modeBlack ?'white':'black', marginTop: 10 }]} > {plate} </Text>
          <Text style={[globalStyles.Text4, { color: modeBlack ?'white': 'black' }]} > {model} </Text>
          <Text style={[globalStyles.Text4, { color: modeBlack ?'white': 'black' }]} > {colorCar} </Text>
        </>

        }


      </View>
    </View>
  )
}

export default InfTravel