import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import GetImg from '../../components/other/GetImg'
import { useImage } from '../../service/hooks/useImage'
import { useAlerts } from '../../service/hooks/useAlerts'
import { ModalPreview } from '../../components/modals/ModalPreview'
import BtnPrimary from '../../components/buttons/BtnPrimary'
import { InputText } from '../../components/input/InputText'
import { useForm } from '../../service/hooks/useForm'
import { globalStyles } from '../../theme/globalStyles'
import { BackButton } from '../../components/buttons/BackButton'
import { ErrorMessage } from '../../components/other/ErrorMessage'
import useCars from '../../service/hooks/useCars'
import { StackScreenProps } from '@react-navigation/stack'
import { ModalLoading } from '../../components/modals/ModalLoading'
import CheckOthersCar from '../../components/other/CheckOthersCar'
import { DatumMyCars } from '../../interfaces/CarInterface'
import { API_HOST, API_HOST_IMG } from '../../service/helpers/constants'

interface Props extends StackScreenProps<any, any> {}

const urlFolder = `${API_HOST_IMG}/cars/`

const RegisterVehicleScreen = ({ navigation, route }: Props) => {
  const dataVehicle: DatumMyCars = route.params?.dataVehicle

  const { postCar, putCarByID } = useCars()
  const { openCamera } = useImage()
  const [photoId, setPhotoId] = useState<any>(null)
  const [photoIdSide, setPhotoIdSide] = useState<any>(null)
  const [photoIdBack, setPhotoIdBack] = useState<any>(null)
  const [photoRegisterA, setPhotoRegisterA] = useState<any>(null)
  const [photoRegisterB, setPhotoRegisterB] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  //states false is true
  const [dogs, setDogs] = useState(false)
  const [people, setPeople] = useState(false)
  const [cycle, setCycle] = useState(false)
  const [bateryCar, setBateryCar] = useState(false)
  const [array, setArray] = useState<number[]>([])

  const { toast, confirmAlert } = useAlerts()

  const { modelo, color, plate, hcl, onChange, form, setFormValue } = useForm({
    modelo: dataVehicle?.model || '',
    color: dataVehicle?.color || '',
    plate: dataVehicle?.plate || '',
    hcl: dataVehicle?.hcl || '',
    photoIdF: dataVehicle?.photo_car || '',
    photoIdFSide: dataVehicle?.photo_car_side || '',
    photoIdFBack: dataVehicle?.photo_car_back || '',
    photoRegisterAF: dataVehicle?.photo_registration_front || '',
    photoRegisterBF: dataVehicle?.photo_registration_back || '',
  })

  const [errors, setErrors] = useState({
    modelo: false,
    color: false,
    plate: false,
    hcl: false,
    photoIdF: false,
    photoIdFSide: false,
    photoIdFBack: false,
    photoRegisterAF: false,
    photoRegisterBF: false,
  })

   useEffect(() => {
    const a = dogs ? 1 : false
    const b = people ? 2 : false
    const c = cycle ? 3 : false
    const d = bateryCar ? 4 : false
    const res: any = [a, b, c, d].filter(Boolean)
    setArray(res)
  }, [dogs, people, cycle, bateryCar]) 


  useEffect(() => {
    if (dataVehicle ===  undefined)return
    dataVehicle.extras.map((res) => {
      switch (res.extra_service_id) {
        case 1:
          setDogs(true); // Cambia a true si se cumple el caso 1
          setArray((res)=>[...res,1])
          break;
        case 2:
          setPeople(true);
          setArray((res)=>[...res,2])

          break;
        case 3:
          setCycle(true);
          setArray((res)=>[...res,3])

          break;
        case 4:
          setArray((res)=>[...res,4])

          setBateryCar(true);
          break;
        default:
          // Si el valor de extra_service_id no coincide con ningún caso, no hagas nada.
          break;
      }
    })
  }, [])

  const verification = () => {
    form.photoIdF = dataVehicle?.photo_car || photoId
    form.photoIdFSide = dataVehicle?.photo_car_side || photoIdSide
    form.photoIdFBack = dataVehicle?.photo_car_back || photoIdBack
    form.photoRegisterAF =
      dataVehicle?.photo_registration_front || photoRegisterA
    form.photoRegisterBF =
      dataVehicle?.photo_registration_back || photoRegisterB

    const newErrors = {
      modelo: false,
      color: false,
      plate: false,
      hcl: false,
      photoIdF: false,
      photoIdFSide: false,
      photoIdFBack: false,
      photoRegisterAF: false,
      photoRegisterBF: false,
    }
    if (
      form.modelo === '' ||
      form.color === '' ||
      form.plate === '' ||
      form.hcl === '' ||
      form.photoIdF === null ||
      form.photoRegisterAF === null ||
      form.photoRegisterBF === null
    ) {
      if (form.modelo === '') {
        newErrors.modelo = true
      }
      if (form.color === '') {
        newErrors.color = true
      }
      if (form.plate === '') {
        newErrors.plate = true
      }
      if (form.plate === '') {
        newErrors.hcl = true
      }

      if (form.photoIdF === null) {
        newErrors.photoIdF = true
      }
      if (form.photoRegisterAF === null) {
        newErrors.photoRegisterAF = true
      }
      if (form.photoRegisterBF === null) {
        newErrors.photoRegisterBF = true
      }

      toast('Error, verifica todos los campos ', 'DANGER')
      setErrors(newErrors)
      return false
    } else {
      setErrors(newErrors)
      return true
    }
  }

  const handleUpload = () => {
    let verification_info = verification()
    if (verification_info) {
      postCarFunc()
    }
  }

  const postCarFunc = async () => {
    const formData = new FormData()

    formData.append('plate', form.plate)

    if (dataVehicle) {
      if (photoId !== null) {
        formData.append('photo_car', photoId)
      }
      if (photoIdSide !== null) {
        formData.append('photo_car_side', photoIdSide)
      }

      if (photoIdBack !== null) {
        formData.append('photo_car_back', photoIdBack)
      }
      if (photoRegisterA !== null) {
        formData.append('photo_registration_front', photoRegisterA)
      }
      if (photoRegisterB !== null) {
        formData.append('photo_registration_back', photoRegisterB)
      }
    } else {
      formData.append('photo_car', photoId)
      formData.append('photo_car_side', photoIdSide)
      formData.append('photo_car_back', photoIdBack)
      formData.append('photo_registration_front', photoRegisterA)
      formData.append('photo_registration_back', photoRegisterB)
    }

    formData.append('color', form.color)
    formData.append('model', form.modelo)
    formData.append('hcl', form.hcl)

    //FALTAAAA
    formData.append('extras', JSON.stringify(array))
  setLoading(true)
    let response: any = dataVehicle
      ? await putCarByID(dataVehicle.id, formData)
      : await postCar(formData)

    if (response.ok) {
      setLoading(false)

      onChange('', 'modelo')
      onChange('', 'plate')
      onChange('', 'hcl')

      onChange('', 'photoIdF')
      onChange('', 'photoRegisterAF')
      onChange('', 'photoRegisterBF')

      let alert = await confirmAlert(response.msg, 'SUCCESS')
      if (alert) {
        navigation.navigate('MyCarsScreen')
      } else {
        navigation.navigate('MyCarsScreen')
      }
    } else {
      let msgError = ''
      if (response.msg) {
        msgError = response.msg
      } else {
        msgError = response.errors[0].msg
      }
      setLoading(false)
      toast(msgError, 'DANGER')
    } 
  }

  return (
    <>
      <BackButton />
      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <ModalLoading visible={loading} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={[
                globalStyles.Title,
                { marginTop: 80, marginBottom: 30, width: 250 },
              ]}
            >
              Caracteristicas de vehículo
            </Text>

            <InputText
              styleTextInput={{ right: 40 }}
              text="Modelo"
              name="modelo"
              keyboardType={'default'}
              onChange={(value: any) => onChange(value, 'modelo')}
              value={modelo}
              maxLength={15}
            />
            <ErrorMessage
              style={{ color: 'red', marginBottom: 10, marginTop: 10 }}
              message="Verifica esté campo."
              status={errors.modelo}
            />

            <InputText
              styleTextInput={{ right: 40 }}
              text="Color"
              name="color"
              keyboardType={'default'}
              onChange={(value: any) => onChange(value, 'color')}
              value={color}
              maxLength={15}
            />
            <ErrorMessage
              style={{ color: 'red', marginBottom: 10, marginTop: 10 }}
              message="Verifica esté campo."
              status={errors.color}
            />

            <InputText
              styleTextInput={{ right: 40 }}
              text="Placa"
              name="plate"
              keyboardType={'default'}
              onChange={(value: any) => onChange(value, 'plate')}
              value={plate}
              maxLength={10}
            />
            <ErrorMessage
              style={{ color: 'red', marginTop: 10 }}
              message="Verifica esté campo."
              status={errors.plate}
            />

            <InputText
              styleTextInput={{ right: 40 }}
              text="HCI"
              name="hcl"
              keyboardType={'default'}
              onChange={(value: any) => onChange(value, 'hcl')}
              value={hcl}
              maxLength={10}
            />
            <ErrorMessage
              style={{ color: 'red', marginTop: 10 }}
              message="Verifica esté campo."
              status={errors.hcl}
            />

            <Text
              style={[
                globalStyles.Title,
                { marginTop: 20, marginBottom: 30, width: 250 },
              ]}
            >
              Información de vehículo
            </Text>

            <GetImg
              uriGet={dataVehicle && `${urlFolder}${dataVehicle?.photo_car}`}
              nameImage={dataVehicle?.photo_car}
              title="Foto del Auto frontal"
              pickImage={openCamera}
              uri={setPhotoId}
            />
            <ErrorMessage
              style={{ color: 'red', marginBottom: 10, marginTop: 10 }}
              message="Verifica esté campo."
              status={errors.photoIdF}
            />

            <GetImg
              uriGet={
                dataVehicle && `${urlFolder}${dataVehicle?.photo_car_side}`
              }
              nameImage={dataVehicle?.photo_car_side}
              title="Foto del Auto lateral"
              pickImage={openCamera}
              uri={setPhotoIdSide}
            />
            <ErrorMessage
              style={{ color: 'red', marginBottom: 10, marginTop: 10 }}
              message="Verifica esté campo."
              status={errors.photoIdFSide}
            />

            <GetImg
              uriGet={
                dataVehicle && `${urlFolder}${dataVehicle?.photo_car_back}`
              }
              nameImage={dataVehicle?.photo_car_back}
              title="Foto del Auto posterior"
              pickImage={openCamera}
              uri={setPhotoIdBack}
            />
            <ErrorMessage
              style={{ color: 'red', marginBottom: 10, marginTop: 10 }}
              message="Verifica esté campo."
              status={errors.photoIdFBack}
            />

            <GetImg
              uriGet={
                dataVehicle &&
                `${urlFolder}${dataVehicle?.photo_registration_front}`
              }
              nameImage={dataVehicle?.photo_registration_front}
              title="Matrícula lado A"
              pickImage={openCamera}
              uri={setPhotoRegisterA}
            />
            <ErrorMessage
              style={{ color: 'red', marginBottom: 10, marginTop: 10 }}
              message="Verifica esté campo."
              status={errors.photoRegisterAF}
            />

            <GetImg
              uriGet={
                dataVehicle &&
                `${urlFolder}${dataVehicle?.photo_registration_back}`
              }
              nameImage={dataVehicle?.photo_registration_back}
              title="Matrícula lado B"
              pickImage={openCamera}
              uri={setPhotoRegisterB}
            />
            <ErrorMessage
              style={{ color: 'red', marginBottom: 10, marginTop: 10 }}
              message="Verifica esté campo."
              status={errors.photoRegisterBF}
            />

            <Text
              style={[
                globalStyles.Title,
                { marginTop: 20, marginBottom: 30, width: 300, fontSize: 16 },
              ]}
            >
              Escoge tus extras (que aceptas)
            </Text>

            <CheckOthersCar
              title="Mascotas"
              state={dogs}
              status={(res) => {
                setDogs(res)
              }}
            />
            <CheckOthersCar
              title="Personas con discapacidad"
              state={people}
              status={(res) => {
                setPeople(res)
              }}
            />
            <CheckOthersCar
              title="Bicicletas"
              state={cycle}
              status={(res) => {
                setCycle(res)
              }}
            />

            <CheckOthersCar
              title="Pasar corriente a los vehículos"
              state={bateryCar}
              status={(res) => {
                setBateryCar(res)
              }}
            />

            <View style={{ width: '100%', height: 100 }} />
          </ScrollView>
        </TouchableWithoutFeedback>

        <BtnPrimary
          styleBtn={{ position: 'absolute', bottom: 20 }}
          title="Subir"
          func={handleUpload}
        />
      </View>
    </>
  )
}

export default RegisterVehicleScreen
