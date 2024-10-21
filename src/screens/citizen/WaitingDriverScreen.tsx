import { useEffect, useRef, useContext, useState, useCallback } from 'react'
import {
  View,
  Animated,
  StyleSheet,
  Image,
  Text,
  RefreshControl,
  ScrollView,
} from 'react-native'
import { globalStyles } from '../../theme/globalStyles'
import BtnPrimary from '../../components/buttons/BtnPrimary'
import { TravelContext } from '../../contexts/Travel/TravelContext'
import useTravel from '../../service/hooks/useTravel'
import { StackScreenProps } from '@react-navigation/stack'
import { InterfaceTravelById } from '../../interfaces/ITravel'
import { useAlerts } from '../../service/hooks/useAlerts'
import { SocketContext } from '../../contexts/sockets/SocketContext'
import { ModalLoading } from '../../components/modals/ModalLoading'
interface Props extends StackScreenProps<any, any> {}

const WaitingDriverScreen = ({ navigation, route }: Props) => {
  const { getTravelbyID, putTravel } = useTravel()

  const { dataTravelContext, removeTravel, changeTravel, init } = useContext(
    TravelContext,
  )
  const { toast } = useAlerts()
  const { socket } = useContext(SocketContext)

  const [loading, setLoading] = useState(false)

  const [time1, setTime1] = useState(0);
  const [saveCount, setSaveCount] = useState(0);


  const dot1Scale = useRef(new Animated.Value(0)).current
  const dot2Scale = useRef(new Animated.Value(0)).current
  const dot3Scale = useRef(new Animated.Value(0)).current

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    init()
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  useEffect(() => {
    getTravel()
  }, [])

  useEffect(() => {
    onChangeTravel()
  }, [socket])

  useEffect(() => {
    const saveStateInterval = setInterval(() => {
      // Verificar si ya hemos guardado tres estados
      if (saveCount >= 3) {
        clearInterval(saveStateInterval); // Detener el intervalo
        return;
      }
  
      // Guardar el estado actual
      if (saveCount === 0) {
        // Guardar el primer estado después de 1 minuto
        setTime1(1);
        
        // Aquí puedes realizar alguna lógica para guardar el estado, por ejemplo, en AsyncStorage.
      } else if (saveCount === 1) {
        // Guardar el segundo estado después de 1 minuto
        setTime1(2);
        sendTimeTravel(2)
        // Aquí puedes realizar alguna lógica para guardar el estado, por ejemplo, en AsyncStorage.
      } else if (saveCount === 2) {
        // Guardar el tercer estado después de 1 minuto
        setTime1(3);
        sendTimeTravel(3)

        // Aquí puedes realizar alguna lógica para guardar el estado, por ejemplo, en AsyncStorage.
      }
  
      // Incrementar el contador de estados guardados
      setSaveCount(saveCount + 1);
    }, 60000); // 60000 milisegundos = 1 minuto
  
    // Limpia el intervalo cuando el componente se desmonta
    return () => {
      clearInterval(saveStateInterval);
    };
  }, [time1, saveCount]);


  const sendTimeTravel = (time: number) => {
    socket.emit('new-travel', {
      idTravel: dataTravelContext.dataTravel.id,
      times: time,
    })
  }

  const handleRemoveTravel = () => {
    setLoading(true)
    putTravel('cancel', dataTravelContext.dataTravel.id)
      .then(async (res) => {
        setLoading(false)
        socket.emit('cancel-travel', { idTravel: res.data.id })
        toast(res.msg, 'WARNING')
        removeTravel()
      })
      .catch(async (error: any) => {
        setLoading(false)
        removeTravel()
        toast(error?.response?.data.msg || 'Error, algo salio mal', 'DANGER')
      })
  }

  const getTravel = () => {
    getTravelbyID(dataTravelContext.dataTravel.id)
      .then((res) => {
        if (res.data.status_id === 1 && res.data.driver.id !== 0) {
          changeTravel({
            ...dataTravelContext.dataTravel,
            status_id: res.data.status_id,
            driver: res.data.driver,
          })
        }
      })
      .catch((err) => {})
  }
  //sockets
  const onChangeTravel = async () => {
    try {
      socket!.on(`client-listen-accept-travel`, (res: InterfaceTravelById) => {
        changeTravel(res)
      })
    } catch (error) {}
  }

  useEffect(() => {
    console.log('💨💨💨')
    const animationDuration = 500
    const animationDelay = 400

    const dot1Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dot1Scale, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(dot1Scale, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.delay(animationDelay),
      ]),
    )

    const dot2Animation = Animated.loop(
      Animated.sequence([
        Animated.delay(animationDelay),
        Animated.timing(dot2Scale, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Scale, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]),
    )

    const dot3Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dot3Scale, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.delay(animationDelay),
        Animated.timing(dot3Scale, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]),
    )

    dot1Animation.start()
    dot2Animation.start()
    dot3Animation.start()

    return () => {
      dot1Animation.stop()
      dot2Animation.stop()
      dot3Animation.stop()
    }
  }, [])

  

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <ModalLoading visible={loading} />

        <View
          style={{
            width: '85%',
            height: 280,
            justifyContent: 'flex-end',
            backgroundColor: '#F1F1F1',
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 10,
              height: 7,
            },
            shadowOpacity: 0.25,
            shadowRadius: 10.49,

            elevation: 12,
          }}
        >
          <Image
            style={{
              width: '100%',
              height: 200,
            }}
            source={require('../../assets/images/waitingCar.png')}
          />
        </View>

        <Text style={[globalStyles.Title, { width: 300, textAlign: 'center' }]}>
          Estamos buscando tu taxi
        </Text>

        

        <Text
          style={[
            globalStyles.Text3,
            { width: 270, textAlign: 'center', color: 'black' },
          ]}
        >
          Estamos encontrando el taxi mas cercano para ti
        </Text>
        <View style={styles.container}>
          <Animated.View
            style={[styles.dot, { transform: [{ scale: dot1Scale }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ scale: dot2Scale }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ scale: dot3Scale }] }]}
          />
        </View>

        <BtnPrimary
          func={handleRemoveTravel}
          styleBtn={{ marginTop: 0, backgroundColor: 'black', width: '70%' }}
          styleTitle={{ color: 'white', textAlign:'center' }}
          title={ 'Cancelar'}
          loading={loading}
          disabled={loading}
        ></BtnPrimary>

      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: '#F2BC23',
    marginHorizontal: 5,
  },
})

export default WaitingDriverScreen
