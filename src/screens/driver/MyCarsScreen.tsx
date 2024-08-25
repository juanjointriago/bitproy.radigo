import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import CardCar from '../../components/other/CardCar'
import { ALERT, globalStyles } from '../../theme/globalStyles'
import { BackButton } from '../../components/buttons/BackButton'
import BtnPrimary from '../../components/buttons/BtnPrimary'
import { StackScreenProps } from '@react-navigation/stack'
import useCars from '../../service/hooks/useCars'
import { DatumMyCars } from '../../interfaces/CarInterface'
import { useAlerts } from '../../service/hooks/useAlerts'
import { useFocusEffect } from '@react-navigation/native'

interface Props extends StackScreenProps<any, any> { }

const MyCarsScreen = ({ item, navigation }: any) => {
  const { getCarsDriver, deleteCar, selectMyCar } = useCars()
  const [carsData, setCarsData] = useState<DatumMyCars[]>([])
  const { confirmAlert, toast } = useAlerts()


  useFocusEffect(
    React.useCallback(() => {
      // Este código se ejecuta cuando la pantalla obtiene el enfoque
      getDataCars()
      return () => {
        // Este código se ejecuta cuando la pantalla pierde el enfoque
      };
    }, [])
  );

  const getDataCars = () => {
    getCarsDriver().then((res) => {
      setCarsData(res.data)
    })
  }

  const deleteMyCar = async (id: number) => {
    let alert = await confirmAlert('¿Quieres elimnar este auto?', 'DANGER')
    if (alert) {
      deleteCar(id).then((res) => {
        getDataCars()
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  const selectMyCarFunc = async (id: number) => {
    selectMyCar(id).then((res) => {
      toast('Cambiaste de auto', "SUCCESS");
      navigation.navigate("HomeDriverScreen")
    }).catch((err) => {
      toast(err?.response?.data?.msg, "DANGER");
    }
    )
  }

  const renderItem = ({ item }: any) => (
    <CardCar
      styleContent={{ backgroundColor: item.is_active ? undefined :ALERT, borderRadius: 20 }}
      stateActive={item.is_active}
      stateSelect={item?.selected}
      name={item?.model}
      plate={item?.plate}
      onCheckPress={(res) => {
        selectMyCarFunc(item.id)
      }}
      onDeletePress={() => {
        deleteMyCar(item.id)
      }}
      onEditPress={() => {
        navigation.navigate("RegisterVehicleScreen", { dataVehicle: item })
      }}
    />
  )

  const renderFooter = () => {
    return (
      <View style={{ height: 80, marginBottom: 100 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('RegisterVehicleScreen')}
          style={{
            backgroundColor: '#F1F1F1',
            height: 45,
            width: 150,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
            marginTop: 20,
            marginLeft: 20,
          }}
        >
          <Text style={[globalStyles.Text3, { color: 'black' }]}>
            Agregar más +
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderHeader = () => {
    return (
      <Text
        style={[
          globalStyles.Title6,
          { marginTop: 80, marginBottom: 10, left: 10 },
        ]}
      >
        Mís vehículos
      </Text>
    )
  }

  return (
    <>
      <BackButton />
      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <FlatList
          data={carsData}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, alignItems: 'center', }} >
              <Image
                source={require("../../assets/images/empty.png")}
                style={{ width: 320, height: 390 }}
              />
              <Text
                style={[
                  globalStyles.Title6,
                  { marginTop: 80, marginBottom: 10, textAlign: 'center' },
                ]}
              >
                Por favor agrega un auto para usar RadiGo!
              </Text>

            </View>
          )}
        />

      </View>
    </>
  )
}

export default MyCarsScreen
