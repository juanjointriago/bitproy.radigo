import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Button,
} from 'react-native'
import React, { useState } from 'react'
import { ALERT, BCBUTTON, INPUT1, globalStyles } from '../../theme/globalStyles'
import { InputText } from '../../components/input/InputText'
import { Feather, Entypo } from '@expo/vector-icons'
import BtnPrimary from '../../components/buttons/BtnPrimary'
import { BackButton } from '../../components/buttons/BackButton'
import { SelectImageUser } from '../../components/picker/SelectImageUser'
import { useImage } from '../../service/hooks/useImage'
import DropdownSelect from '../../components/select/DropdownSelect '
import { useForm } from '../../service/hooks/useForm'
import { ModalLoading } from '../../components/modals/ModalLoading'
import { useAlerts } from '../../service/hooks/useAlerts'
import { ErrorMessage } from '../../components/other/ErrorMessage'
import { StackScreenProps } from '@react-navigation/stack'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import { useContext, useEffect } from 'react'
import GetImg from '../../components/other/GetImg'
import CheckPay from '../../components/other/CheckPay'
import { SocketContext } from '../../contexts/sockets/SocketContext'
import { useSocketsNoAuth } from '../../service/hooks/useSocketsNoAuth'
import { API_HOST } from '../../service/helpers/constants';
import DeviceInfo from 'react-native-device-info';
interface Props extends StackScreenProps<any, any> { }

const SignUpScreen = ({ navigation }: Props) => {
  const { conectarSocket, socket, desconectarSocket }= useSocketsNoAuth(API_HOST)
  const { openCamera } = useImage()
  const { confirmAlert, showAlert, toast } = useAlerts()
  const { signUp } = useContext(AuthContext)

  const [userPhoto, setUserPhoto] = useState('')
  const [userRol, setUserRol] = useState<any>('Cliente')
  const [accountType, setAccountType] = useState<any>('Cuenta de Ahorros')
  const [loading, setLoading] = useState(false)

  const [photoIdA, setPhotoIdA] = useState<any>(null)
  const [photoIdB, setPhotoIdB] = useState<any>(null)
  const [photoLicenceA, setPhotoLicenceA] = useState<any>(null)
  const [photoLicenceB, setPhotoLicenceB] = useState<any>(null)
  const [statusCheck, setStatusCheck] = useState(false)

  const {
    email,
    full_name,
    password,
    phone,
    role_id,
    photo_profile,
    identification,
    nameBank,
    numberAccount,
    nameUserAccount,
    idUserAccount,
    emailAccountBank,
    photoIdAF,
    photoIdBF,
    photoLicenceAF,
    photoLicenceBF,
    typeAccount,
    onChange,
    form,
    setFormValue,
  } = useForm({
    email: '',
    full_name: '',
    password: '',
    phone: '',
    role_id: userRol === 'Cliente' ? 4 : 3,
    photo_profile: '',
    identification: '',
    nameBank: '',
    numberAccount: '',
    nameUserAccount: '',
    idUserAccount: '',
    emailAccountBank: '',
    photoIdAF: '',
    photoIdBF: '',
    photoLicenceAF: '',
    photoLicenceBF: '',
    typeAccount: accountType === 'Cuenta de Ahorros' ? 2 : 1,
  })

  const [errors, setErrors] = useState({
    email: false,
    full_name: false,
    password: false,
    phone: false,
    role_id: false,
    photo_profile: false,
    identification: false,
    nameBank: false,
    numberAccount: false,
    nameUserAccount: false,
    idUserAccount: false,
    emailAccountBank: false,
    photoIdA: false,
    photoIdB: false,
    photoLicenceA: false,
    photoLicenceB: false,
    typeAccount: false,
  })

  useEffect(() => {
    conectarSocket()
    return () => {
      desconectarSocket()
    }
  }, [])

  const registerUser = async () => {
    let verification_info = verification()
    if (verification_info) {
      postUser()
    }
  }

  const postUser = async () => {
    const uniqueDeviceId = await DeviceInfo.getUniqueId();
    const formData = new FormData()

    formData.append('email', form.email)
    formData.append('full_name', form.full_name)
    formData.append('password', form.password)
    formData.append('phone', form.phone)
    formData.append('role_id', form.role_id.toString())
    formData.append('photo', userPhoto)
    formData.append('identification', form.identification)

    formData.append('photo_id_front', photoIdA)
    formData.append('photo_id_back', photoIdB)
    formData.append('photo_licence_front', photoLicenceA)
    formData.append('photo_licence_back', photoLicenceB)

    formData.append('name_bank', form.nameBank)
    formData.append('type_account_id', form.typeAccount.toString())
    formData.append('name_onwner', form.nameUserAccount)
    formData.append('number_account', form.numberAccount)
    formData.append('email_owner', form.emailAccountBank)
    formData.append('identification_owner', form.idUserAccount)
    // formData.append('uid', uniqueDeviceId)
    setLoading(true)

    let response:any = await signUp(formData)
    if (response.ok) {
      setLoading(false)
      console.log("❤❤❤",response.data.id)
       socket?.emit('new-user', {
        id:response.data.id,
        // uid:uniqueDeviceId,
      }) 

      let alert = await confirmAlert(response.msg, 'SUCCESS')
      if (alert) {
        navigation.navigate('LoginScreen')
      } else {
        navigation.navigate('LoginScreen')
      }
    } else {
      let msgError = ''
      if (response.msg) {
        msgError = response.msg
        setLoading(false)
      } else {
        msgError = response.errors[0].msg
        setLoading(false)

      }
      toast(msgError, 'DANGER')
      setLoading(false)

    }
  }

  const verification = () => {
    form.role_id = userRol === 'Cliente' ? 4 : 3
    form.typeAccount = accountType === 'Cuenta de Ahorros' ? 2 : 1
    form.photo_profile = userPhoto

    form.photoIdAF = photoIdA
    form.photoIdBF = photoIdB
    form.photoLicenceAF = photoLicenceA
    form.photoLicenceBF = photoLicenceB

    const newErrors = {
      email: false,
      full_name: false,
      password: false,
      phone: false,
      role_id: false,
      typeAccount: false,
      photo_profile: false,
      identification: false,
      nameBank: false,
      numberAccount: false,
      nameUserAccount: false,
      idUserAccount: false,
      emailAccountBank: false,
      photoIdA: false,
      photoIdB: false,
      photoLicenceA: false,
      photoLicenceB: false,
    }
    if (
      form.email === '' ||
      form.full_name === '' ||
      form.password === '' ||
      form.phone === '' ||
      form.identification === '' ||
      userPhoto === '' ||
      (form.role_id === 3 &&
        (
          photoIdA === null ||
          photoIdB === null ||
          photoLicenceA === null ||
          photoLicenceB === null ||

          (statusCheck && (
            form.nameBank === '' ||
            form.numberAccount === '' ||
            form.nameUserAccount === '' ||
            form.idUserAccount === '' ||
            form.emailAccountBank === ''
          ))

        ))
    ) {
      if (userPhoto === '') {
        newErrors.photo_profile = true
      }
      if (photoIdA === null) {
        newErrors.photoIdA = userRol === 'Cliente' ? false : true
      }
      if (photoIdB === null) {
        newErrors.photoIdB = userRol === 'Cliente' ? false : true
      }
      if (photoLicenceA === null) {
        newErrors.photoLicenceA = userRol === 'Cliente' ? false : true
      }
      if (photoLicenceB === null) {
        newErrors.photoLicenceB = userRol === 'Cliente' ? false : true
      }

      if (form.email === '') {
        newErrors.email = true
      }
      if (form.full_name === '') {
        newErrors.full_name = true
      }

      if (form.password === '') {
        newErrors.password = true
      }
      if (form.phone === '') {
        newErrors.phone = true
      }
      if (form.identification === '') {
        newErrors.identification = true
      }
      //checkStatud
      if (statusCheck) {
        if (form.nameBank === '') {
          newErrors.nameBank = userRol === 'Cliente' ? false : true
        }
        if (form.numberAccount === '') {
          newErrors.numberAccount = userRol === 'Cliente' ? false : true
        }
        if (form.nameUserAccount === '') {
          newErrors.nameUserAccount = userRol === 'Cliente' ? false : true
        }
        if (form.idUserAccount === '') {
          newErrors.idUserAccount = userRol === 'Cliente' ? false : true
        }
        if (form.emailAccountBank === '') {
          newErrors.emailAccountBank = userRol === 'Cliente' ? false : true
        }
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

              <View
                style={{
                  width: '100%',
                  height: 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <SelectImageUser
                  styleImg={{
                    borderColor: errors.photo_profile ? 'red' : 'black',
                  }}
                  pickImage={openCamera}
                  uri={setUserPhoto}
                />
              </View>

              <DropdownSelect
                options={['Cliente', 'Conductor']}
                key={1.5}
                setDataZone={setUserRol}
              />

              <InputText
                icon={<Feather name="user" size={30} color={'black'} />}
                text="Nombre completo"
                name="full_name"
                keyboardType={'default'}
                onChange={(value: any) => onChange(value, 'full_name')}
                value={full_name}
              />
              <ErrorMessage
                style={{ fontSize: 14, color: ALERT, top: 5, marginBottom: 10 }}
                message="Verifica esté campo."
                status={errors.full_name}
              />

              <InputText
                icon={<Feather name="mail" size={30} color="black" />}
                text="Correo electrónico"
                name="email"
                keyboardType={'email-address'}
                onChange={(value: any) => onChange(value, 'email')}
                value={email}
              />
              <ErrorMessage
                style={{ fontSize: 14, color: ALERT, top: 5, marginBottom: 10 }}
                message="Verifica esté campo."
                status={errors.email}
              />

              <InputText
                icon={<Feather name="key" size={30} color={'black'} />}
                text="Contraseña"
                name="password"
                secureTextEntry
                value={password}
                onChange={onChange}
              />

              <ErrorMessage
                style={{ fontSize: 14, color: ALERT, top: 5, marginBottom: 10 }}
                message="Verifica esté campo."
                status={errors.password}
              />
              <InputText
                icon={<Entypo name="fingerprint" size={24} color="black" />}
                text="Cédula"
                name="identification"
                keyboardType={'numeric'}
                onChange={(value: any) => onChange(value, 'identification')}
                value={identification}
                maxLength={10}
              />

              <ErrorMessage
                style={{ fontSize: 14, color: ALERT, top: 5, marginBottom: 10 }}
                message="Verifica esté campo."
                status={errors.identification}
              />

              <InputText
                icon={<Entypo name="mobile" size={24} color="black" />}
                text="Número de celular"
                name="phone"
                keyboardType={'numeric'}
                onChange={(value: any) => onChange(value, 'phone')}
                value={phone}
                maxLength={10}
              />
              <ErrorMessage
                style={{ fontSize: 14, color: ALERT, top: 5, marginBottom: 10 }}
                message="Verifica esté campo."
                status={errors.phone}
              />

              {userRol !== 'Cliente' && (
                <>
                  <GetImg
                    title="Cédula Lado A"
                    pickImage={openCamera}
                    uri={setPhotoIdA}
                  />

                  <ErrorMessage
                    style={{
                      fontSize: 14,
                      color: ALERT,
                      top: 5,
                      marginBottom: 10,
                    }}
                    message="Verifica esté campo."
                    status={errors.photoIdA}
                  />

                  <GetImg
                    title="Cédula Lado B"
                    pickImage={openCamera}
                    uri={setPhotoIdB}
                  />

                  <ErrorMessage
                    style={{
                      fontSize: 14,
                      color: ALERT,
                      top: 5,
                      marginBottom: 10,
                    }}
                    message="Verifica esté campo."
                    status={errors.photoIdB}
                  />

                  <GetImg
                    title="Licencia Lado A"
                    pickImage={openCamera}
                    uri={setPhotoLicenceA}
                  />

                  <ErrorMessage
                    style={{
                      fontSize: 14,
                      color: ALERT,
                      top: 5,
                      marginBottom: 10,
                    }}
                    message="Verifica esté campo."
                    status={errors.photoLicenceA}
                  />

                  <GetImg
                    title="Licencia Lado B"
                    pickImage={openCamera}
                    uri={setPhotoLicenceB}
                  />

                  <ErrorMessage
                    style={{
                      fontSize: 14,
                      color: ALERT,
                      top: 5,
                      marginBottom: 10,
                    }}
                    message="Verifica esté campo."
                    status={errors.photoLicenceB}
                  />
                  <CheckPay
                    state={statusCheck}
                    status={(res) => {
                      setStatusCheck(res)

                      if (res) {
                        form.nameUserAccount = full_name
                        form.emailAccountBank = email
                        form.idUserAccount = identification
                      } else {
                        form.nameUserAccount = ''
                        form.emailAccountBank = ''
                        form.idUserAccount = ''
                      }

                    }}
                  />

                  {statusCheck && (
                    <>
                      <Text
                        style={[
                          globalStyles.Title,
                          { marginBottom: 30, width: 300 },
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
                    </>
                  )}
                </>
              )}

              <View style={{ height: 50 }} />
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
            func={registerUser}
            title="Registrarme"
            loading={loading}
            disabled={loading}
          />

          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text
              style={[
                globalStyles.Text3,
                {
                  fontSize: 12,
                  textDecorationLine: 'underline',
                  textAlign: 'center',
                  marginTop: 20,
                  marginBottom: 5,
                },
              ]}
            >
              Inicio Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SignUpScreen
