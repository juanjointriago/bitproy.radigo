import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native'
import React, { useContext, useState } from 'react'
import BtnPrimary from '../../components/buttons/BtnPrimary'
import { BackButton } from '../../components/buttons/BackButton'
import { ModalLoading } from '../../components/modals/ModalLoading'
import { ErrorMessage } from '../../components/other/ErrorMessage'
import { ALERT, globalStyles } from '../../theme/globalStyles'
import { useImage } from '../../service/hooks/useImage'
import { useForm } from '../../service/hooks/useForm'
import GetImg from '../../components/other/GetImg'
import { Text } from 'react-native';
import { AuthContext } from '../../contexts/Auth/AuthContext'
import { API_HOST_IMG } from '../../service/helpers/constants'
import { useAlerts } from '../../service/hooks/useAlerts'
import { StackScreenProps } from '@react-navigation/stack'

const urlFolder = `${API_HOST_IMG}/profile/`;

interface Props extends StackScreenProps<any, any> { }

export default function IdentityUserScreen({ navigation }: Props) {
  const { user, updateDataUser } = useContext(AuthContext)

  const { pickImage } = useImage()
  const { confirmAlert, toast } = useAlerts()

  const [photoIdA, setPhotoIdA] = useState<any>(null)
  const [photoIdB, setPhotoIdB] = useState<any>(null)
  const [photoLicenceA, setPhotoLicenceA] = useState<any>(null)
  const [photoLicenceB, setPhotoLicenceB] = useState<any>(null)

  const [loading, setLoading] = useState(false)


  const {
    photoIdAF,
    photoIdBF,
    photoLicenceAF,
    photoLicenceBF,
    onChange,
    form,
    setFormValue,
  } = useForm({
    photoIdAF: '',
    photoIdBF: '',
    photoLicenceAF: '',
    photoLicenceBF: '',
  })

  const [errors, setErrors] = useState({
    photoIdA: false,
    photoIdB: false,
    photoLicenceA: false,
    photoLicenceB: false,
  })



  const updateIntentifyFunc = async () => {

    const formData: any = new FormData();

    if (photoIdA !== null) {
      formData.append('photo_id_front', photoIdA);
    }
    if (photoIdB !== null) {
      formData.append('photo_id_back', photoIdB);
    }
    if (photoLicenceA !== null) {
      formData.append('photo_licence_front', photoLicenceA);
    }
    if (photoLicenceB !== null) {
      formData.append('photo_licence_back', photoLicenceB);
    }


    if (formData._parts.length === 0) {
      navigation.goBack()
      return
    }

    setLoading(true)
    let response: any = await updateDataUser(formData)

    if (response.ok) {
      setLoading(false)
      let alert = await confirmAlert(response.msg, 'SUCCESS')
      if (alert) {
        navigation.goBack()
      } else {
        navigation.goBack()
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
                  { marginTop: 80, marginBottom: 10, width: 300 },
                ]}
              >
                Cédula - Licencia
              </Text>

              <GetImg
                uriGet={`${urlFolder}${user?.photo_id_front}`}
                nameImage={user?.photo_id_front}
                title="Cédula Lado A"
                pickImage={pickImage}
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
                uriGet={`${urlFolder}${user?.photo_id_back}`}
                nameImage={user?.photo_id_back}
                title="Cédula Lado B"
                pickImage={pickImage}
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
                uriGet={`${urlFolder}${user?.photo_licence_front}`}
                nameImage={user?.photo_licence_front}
                title="Licencia Lado A"
                pickImage={pickImage}
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
                uriGet={`${urlFolder}${user?.photo_licence_back}`}
                nameImage={user?.photo_licence_back}
                title="Licencia Lado B"
                pickImage={pickImage}
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
            func={updateIntentifyFunc}
            title="Editar Cédula y Licencia"
            loading={loading}
            disabled={loading}
          />


        </View>
      </KeyboardAvoidingView>
    </View>
  )
}