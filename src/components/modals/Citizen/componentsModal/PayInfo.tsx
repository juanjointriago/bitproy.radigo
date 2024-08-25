import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import { globalStyles } from '../../../../theme/globalStyles'
import BtnPrimary from '../../../buttons/BtnPrimary'
import { DataBankIdDriver } from '../../../../interfaces/BankInterface'
import { TravelContext } from '../../../../contexts/Travel/TravelContext'

interface Props {
  dataBank?: DataBankIdDriver
}

const PayInfo = ({ dataBank }: Props) => {
  const { dataTravelContext } = useContext(
    TravelContext
  )
  const [selectedPayment, setSelectedPayment] = useState('Efectivo')

  const handlePaymentSelection = (paymentMethod: string) => {
    setSelectedPayment(paymentMethod)
  }


  return (
    <>
      {dataBank === null || dataBank === undefined ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
              marginVertical: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#505050',
                  width: 45,
                  height: 45,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons name="cash" size={35} color="white" />
              </View>
              <Text
                style={[
                  globalStyles.Text3,
                  { color: '#505050', marginLeft: 15 },
                ]}
              >
                Efectivo
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handlePaymentSelection('Efectivo')}
              style={{
                backgroundColor:
                  selectedPayment === 'Efectivo' ? '#F2BC23' : 'black',
                width: 40,
                height: 40,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FontAwesome name="check" size={24} color="white" />
            </TouchableOpacity>
          </View>

        </>
      ) : (
        <>
        <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
              marginVertical: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#505050',
                  width: 45,
                  height: 45,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons name="cash" size={35} color="white" />
              </View>
              <Text
                style={[
                  globalStyles.Text3,
                  { color: '#505050', marginLeft: 15 },
                ]}
              >
                Efectivo
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handlePaymentSelection('Efectivo')}
              style={{
                backgroundColor:
                  selectedPayment === 'Efectivo' ? '#F2BC23' : 'black',
                width: 40,
                height: 40,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FontAwesome name="check" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#505050',
                  width: 45,
                  height: 45,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons
                  name="bank-transfer"
                  size={35}
                  color="white"
                />
              </View>
              <Text
                style={[
                  globalStyles.Text3,
                  { color: '#505050', marginLeft: 15 },
                ]}
              >
                Transferencia
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handlePaymentSelection('Transferencia')}
              style={{
                backgroundColor:
                  selectedPayment === 'Transferencia' ? '#F2BC23' : 'black',
                width: 40,
                height: 40,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FontAwesome name="check" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {selectedPayment === 'Efectivo' ? (
        <>
          <View
            style={{ marginHorizontal: 50, marginTop: 30, height: 240 }}
          ></View>
        </>
      ) : (
        <>
          <View style={{ marginHorizontal: 50, marginTop: 30, height: 240 }}>
            <Text
              style={[
                globalStyles.Text4,
                {
                  color: 'black',
                  marginLeft: 8,
                  fontSize: 18,
                  marginVertical: 10,
                },
              ]}
            >
              {dataBank?.name_bank}
            </Text>
            <View
              style={{ width: '100%', height: 0.5, backgroundColor: 'black' }}
            />
            <Text
              style={[
                globalStyles.Text4,
                { color: 'black', marginLeft: 8, fontSize: 15, marginTop: 10 },
              ]}
            >
              Titular: {dataBank?.name_onwner}
            </Text>

            <Text
              style={[
                globalStyles.Text4,
                { color: 'black', marginLeft: 8, fontSize: 15, marginTop: 5 },
              ]}
            >
              Cuenta:  {dataBank?.number_account}
            </Text>

            <Text
              style={[
                globalStyles.Text4,
                { color: 'black', marginLeft: 8, fontSize: 15, marginTop: 5 },
              ]}
            >
              E-mail:  {dataBank?.email}
            </Text>

            <Text
              style={[
                globalStyles.Text4,
                { color: 'black', marginLeft: 8, fontSize: 15, marginTop: 5 },
              ]}
            >
              Tipo de Cuenta:  {dataBank?.type_account_id ===  1 ?"Cuenta de Ahorros" : "Cuenta Corriente"}
            </Text>

            <Text
              style={[
                globalStyles.Text,
                {
                  color: '#181818',
                  marginLeft: 8,
                  fontSize: 13,
                  marginTop: 40,
                  marginBottom: 20,
                  textAlign: 'center',
                },
              ]}
            >
              *Porfavor enseñe la transferencia al conductor
            </Text>
          </View>
        </>
      )}

      <View style={[{ height: 1, overflow: 'hidden', marginHorizontal: 20 }]}>
        <View
          style={[
            {
              height: 2,
              borderWidth: 1,
              borderColor: 'black',
              borderStyle: 'dashed',
            },
          ]}
        ></View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 20,
        }}
      >
        <Text
          style={[
            globalStyles.Title5,
            {
              color: '#505050',
              fontSize: 18,
              marginVertical: 10,
              textAlign: 'center',
            },
          ]}
        >
          Total
        </Text>
        <Text
          style={[
            globalStyles.Title5,
            {
              color: '#505050',
              fontSize: 18,
              marginVertical: 10,
              textAlign: 'center',
            },
          ]}
        >
          ${dataTravelContext?.dataTravel?.price.toFixed(2)}
        </Text>
      </View>
    </>
  )
}

export default PayInfo
