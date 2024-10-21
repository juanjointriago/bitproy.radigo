import { View, Text } from 'react-native'
import { globalStyles } from '../../../../theme/globalStyles'
import StarsCalifications from '../../../other/StarsCalifications'

interface Props {
  calification: (rating: number) => void;
  children:any
}

const Observations = ({calification,children }: Props) => {

  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Text
        style={[globalStyles.Text3, { color: 'white', marginLeft: 8 }]}
      >
        ¿Como estuvo tu viaje?
      </Text>

      <StarsCalifications
        calification={(res) => {
          calification(res)
        }}
      />

      <Text
        style={[
          globalStyles.Text3,
          {
            color: '#F1F1F1',
            marginLeft: 8,
            textDecorationLine: 'underline',
            marginTop: 10
          },
        ]}
      >
        Observaciones
      </Text>
      <View style={{ width: '100%', alignItems: 'center' }}>
        {children}
      </View>


    </View>
  )
}

export default Observations