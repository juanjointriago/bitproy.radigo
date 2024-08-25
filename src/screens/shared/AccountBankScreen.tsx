import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import BtnPrimary from '../../components/buttons/BtnPrimary'
import { BackButton } from '../../components/buttons/BackButton'
import { ModalLoading } from '../../components/modals/ModalLoading'
import { ErrorMessage } from '../../components/other/ErrorMessage'
import { ALERT, globalStyles } from '../../theme/globalStyles'
import { useImage } from '../../service/hooks/useImage'
import { useForm } from '../../service/hooks/useForm'
import GetImg from '../../components/other/GetImg'
import { Text } from 'react-native';
import { InputText } from '../../components/input/InputText'
import DropdownSelect from '../../components/select/DropdownSelect '
import useBank from '../../service/hooks/useBank'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import { BankInterface, DataBankInterface } from '../../interfaces/BankInterface'
import { StackScreenProps } from '@react-navigation/stack'
import { useAlerts } from '../../service/hooks/useAlerts'

interface Props extends StackScreenProps<any, any> { }

export default function AccountBankScreen({ navigation, route }: Props) {
  const data: DataBankInterface = route?.params?.data
  const { confirmAlert, toast } = useAlerts()

  const [accountType, setAccountType] = useState<any>(data.type_account_id === 1 ? 'Cuenta de Ahorros' : 'Cuenta de Corriente')
  const [loading, setLoading] = useState(false)
  const { putBank } = useBank()
  const {
    nameBank,
    numberAccount,
    nameUserAccount,
    idUserAccount,
    emailAccountBank,
    onChange,
    type_account_id,
    form,
    setFormValue,
  } = useForm({
    nameBank: data?.name_bank || '',
    numberAccount: data?.number_account || '',
    nameUserAccount: data?.name_onwner || '',
    idUserAccount: data?.identification || '',
    emailAccountBank: data?.email || '',
    type_account_id: data?.email || '',
  })

  const [errors, setErrors] = useState({
    nameBank: false,
    numberAccount: false,
    nameUserAccount: false,
    idUserAccount: false,
    emailAccountBank: false,
  })

  const updateBankFunc = () => {
    let verification_info = verification()
    if (!verification_info) return
    const data: BankInterface = {
      email: form.emailAccountBank,
      identification: form.idUserAccount,
      name_bank: form.nameBank,
      name_onwner: form.nameUserAccount,
      number_account: form.numberAccount,
      type_account_id: accountType === 'Cuenta de Ahorros' ? 1 : 2
    }
    setLoading(true)
    putBank(data).then(async (res) => {
      setLoading(false)
      let alert = await confirmAlert(res.msg, 'SUCCESS')
      if (alert) {
        navigation.goBack()
      }
    }).catch(async (err: any) => {
      setLoading(false)
      toast('Error, algo salio mal', "DANGER")
    })
  }

  const verification = () => {
    const newErrors = {
      nameBank: false,
      numberAccount: false,
      nameUserAccount: false,
      idUserAccount: false,
      emailAccountBank: false,
    }
    if (
      form.nameBank === '' ||
      form.numberAccount === '' ||
      form.nameUserAccount === '' ||
      form.idUserAccount === '' ||
      form.emailAccountBank === ''
    ) {

      if (form.nameBank === '') {
        newErrors.nameBank =  true
      }
      if (form.numberAccount === '') {
        newErrors.numberAccount = true
      }
      if (form.nameUserAccount === '') {
        newErrors.nameUserAccount = true
      }
      if (form.idUserAccount === '') {
        newErrors.idUserAccount = true
      }
      if (form.emailAccountBank === '') {
        newErrors.emailAccountBank =true
      }

      toast('Error, verifica todos los campos ', 'DANGER')
      setErrors(newErrors)
      return false
    } else {
      setErrors(newErrors)
      return true
    }
  }


  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ModalLoading visible={loading} />

        <BackButton />

        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <View
              style={{
                flex: 1,
                paddingHorizontal: 30,
                justifyContent: 'center',
                marginBottom: 50,
              }}
            >
              <ModalLoading visible={loading} />

              <Text
                style={[
                  globalStyles.Title,
                  { marginTop: 100, marginBottom: 30, width: 300 },
                ]}
              >
                Parámetros Bancarios
              </Text>

              <InputText
                styleTextInput={{ right: 40 }}
                text="Nombre del Banco"
                name="nameBank"
                keyboardType={'default'}
                onChange={(value: any) => onChange(value, 'nameBank')}
                value={nameBank}
                maxLength={25}
              />

              <ErrorMessage
                style={{ color: 'red', marginBottom: 5, marginTop: 5 }}
                message="Verifica esté campo."
                status={errors.nameBank}
              />

              <DropdownSelect
                data={accountType}
                options={['Cuenta de Ahorros', 'Cuenta Corriente']}
                key={1.6}
                setDataZone={setAccountType}
              />

              <InputText
                styleTextInput={{ right: 40 }}
                text="Número de Cuenta"
                name="numberAccount"
                keyboardType={'default'}
                onChange={(value: any) =>
                  onChange(value, 'numberAccount')
                }
                value={numberAccount}
                maxLength={30}
              />

              <ErrorMessage
                style={{ color: 'red', marginBottom: 5, marginTop: 5 }}
                message="Verifica esté campo."
                status={errors.numberAccount}
              />

              <InputText
                styleTextInput={{ right: 40 }}
                text="Nombre del titular"
                name="nameUserAccount"
                keyboardType={'default'}
                value={nameUserAccount}
                onChange={(value: any) =>
                  onChange(value, 'nameUserAccount')
                }
                maxLength={20}
              />

              <ErrorMessage
                style={{ color: 'red', marginBottom: 5, marginTop: 5 }}
                message="Verifica esté campo."
                status={errors.nameUserAccount}
              />

              <InputText
                styleTextInput={{ right: 40 }}
                text="Cédula del titular"
                name="idUserAccount"
                keyboardType={'default'}
                onChange={(value: any) =>
                  onChange(value, 'idUserAccount')
                }
                value={idUserAccount}
                maxLength={13}
              />

              <ErrorMessage
                style={{ color: 'red', marginBottom: 5, marginTop: 5 }}
                message="Verifica esté campo."
                status={errors.idUserAccount}
              />

              <InputText
                styleTextInput={{ right: 40 }}
                text="Correo Electrónico"
                name="emailAccountBank"
                keyboardType={'default'}
                onChange={(value: any) =>
                  onChange(value, 'emailAccountBank')
                }
                value={emailAccountBank}
                maxLength={25}
              />

              <ErrorMessage
                style={{ color: 'red', marginBottom: 5, marginTop: 5 }}
                message="Verifica esté campo."
                status={errors.emailAccountBank}
              />


            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        <View
          style={{
            width: '100%',
            alignItems: 'center',
            paddingHorizontal: 30,
            position: 'absolute',
            bottom: 0,
            backgroundColor: 'white',
          }}
        >
          <BtnPrimary
            func={updateBankFunc}
            title="Editar"
            loading={loading}
            disabled={loading}
          />


        </View>
      </KeyboardAvoidingView>
    </View>
  )
} 