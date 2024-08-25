import React, { useContext, useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Image,
  Platform,
} from 'react-native'
import { PermissionsLocationContext } from '../../contexts/LocationPermissions/PermissionsLocationContext'
import { StackScreenProps } from '@react-navigation/stack'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import {
  BACKGROUND,
  INPUT2,
  PRIMARY_COLOR,
  globalStyles,
} from '../../theme/globalStyles'
import BtnPrimary from '../../components/buttons/BtnPrimary'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useImage } from '../../service/hooks/useImage'
import { useNotification } from '../../service/hooks/useNotification'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')
const data = [
  {
    title: 'Bienvenido ',
    body:
      'Estamos encantados de que hayas decidido unirte a nuestra comunidad de pasajeros. Nuestra aplicación está diseñada para ofrecerte una experiencia de viaje segura, conveniente y confiable.',
    imgUrl: require('../../assets/images/slide1.png'),
  },
  {
    title: 'Asistencia al cliente',
    body:
      'Solución personalizada a tus inconvenientes las 24 hrs puedes contactarte a nuestro call center 062 631 000.',
    imgUrl: require('../../assets/images/slide2.png'),
  },
  {
    title: 'Seguridad',
    body:
      'Esta aplicación esta diseñada para cuidarte y cuidarnos, esperamos que difrutes de todos tus viajes en nuestra app.',
    imgUrl: require('../../assets/images/slide3.png'),
  },
]
interface Props extends StackScreenProps<any, any> {}
export const SlideScreen = ({ navigation }: Props) => {
  const { askLocationPermissions } = useContext(PermissionsLocationContext)
  const { pickImage } = useImage()
  const { registerForPushNotificationsAsyn } = useNotification()

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

  const isCarousel = React.useRef(null)
  const [index, setIndex] = useState(0)
  const [userPhoto, setUserPhoto] = useState('')

  useEffect(() => {
    askLocationPermissions()
    registerForPushNotificationsAsyn()
  }, [])

  const CarouselCardItem = ({ item, index }: any) => {
    return (
      <>
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image source={item.imgUrl} style={styles.image} />
          </View>

          <View
            style={{
              flex: 1,
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  ...globalStyles.Title,
                  paddingHorizontal: 5,
                  marginTop: 0,
                }}
              >
                {item.title}
              </Text>

              <Pagination
                dotsLength={data.length}
                activeDotIndex={index}
                carouselRef={isCarousel}
                dotStyle={{
                  width: 45,
                  height: 11,
                  borderRadius: 100,
                  backgroundColor: PRIMARY_COLOR,
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                tappableDots={true}
                inactiveDotStyle={{
                  width: 16,
                  height: 16,
                  borderRadius: 100,
                  backgroundColor: INPUT2,
                }}
                containerStyle={{
                  bottom: 20,
                }}
              />
            </View>

            <Text
              style={{
                ...globalStyles.Text,
                width: '100%',
                paddingHorizontal: 5,
                bottom: 20,
              }}
            >
              {item.body}
            </Text>
          </View>
        </SafeAreaView>
      </>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        slideStyle={{ backgroundColor: BACKGROUND }}
        layout="stack"
        layoutCardOffset={9}
        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        vertical={false}
        onSnapToItem={(index) => setIndex(index)}
        useScrollView={true}
      />

      <View
        style={{
          // width: screenWidth > 390 ? 390 : 379,
          width: '100%',
          paddingHorizontal: 25,
          position: 'absolute',
          bottom: 10,
        }}
      >
        <BtnPrimary
          func={() => {
            navigation.navigate('LoginScreen')
          }}
          title="Saltar introducción"
        ></BtnPrimary>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  image: {
    width: 332.15,
    height: 188.68,
    borderRadius: 10,
  },
})
