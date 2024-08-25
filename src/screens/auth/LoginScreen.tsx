import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView,
} from 'react-native'
import { InputText } from '../../components/input/InputText'
import { Feather } from '@expo/vector-icons'
import BtnPrimary from '../../components/buttons/BtnPrimary'
import { BCBUTTON, INPUT1, globalStyles } from '../../theme/globalStyles'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import { useForm } from '../../service/hooks/useForm'
import { StackScreenProps } from '@react-navigation/stack'
import { useAlerts } from '../../service/hooks/useAlerts'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'

WebBrowser.maybeCompleteAuthSession()

interface Props extends StackScreenProps<any, any> {}

const LoginScreen = ({ navigation }: Props) => {
  const { toast } = useAlerts()
  const {
    signIn,
    errorMessage,
    removeError,
    resetPassword,
    signInGoogle,
  } = useContext(AuthContext)
  const { email, password, onChange } = useForm({
    email: '',
    password: '',
  })
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

  const [userInfo, setUserInfo] = useState<any>(null)
  const [accessToken, setAccessToken] = useState<any>(null)

  const [loadingBtn, setLoadingBtn] = useState(false)
  const [resetStatePassword, setResetStatePassword] = useState(false)
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      '322483511102-cl98u7f3pkv0cu0g7grrufc305i5prh4.apps.googleusercontent.com',
    iosClientId:
      '322483511102-g9qt5bp8b49g3aj03mmkhp9u9kdu5eir.apps.googleusercontent.com',
    androidClientId:
      '322483511102-5f6ae2jdmpg4dte69uif8jprg2aaj5v1.apps.googleusercontent.com',
  })

  useEffect(() => {
    if (errorMessage.length === 0) return
    setLoadingBtn(false)
    toast(errorMessage, 'DANGER')
    removeError()
  }, [errorMessage])

  useEffect(() => {
    if (response?.type === 'success') {
      signInGoogle(response.params.id_token)
      setAccessToken(response.authentication?.accessToken)
      accessToken && getUserInfo()
    }
  }, [response, accessToken])

  const onLogin = async () => {
    if (!email) {
      toast('Por favor ingrese sus datos', 'DANGER')
    } else {
      Keyboard.dismiss()
      setLoadingBtn(true)
      const res: any = await signIn({ email: email, password })
      if (res) {
        setLoadingBtn(false)
      }
      setLoadingBtn(false)
    }
  }

  const resetPasswordFunc = async () => {
    setLoadingBtn(true)
    const resp: any = await resetPassword(email)
    if (resp) {
      setLoadingBtn(false)
      setResetStatePassword(false)
    }
    setLoadingBtn(false)
  }

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )

      const user = await response.json()
      setUserInfo(user)
    } catch (error) {
      // Add your own error handler here
    }
  }

  const loginGmail = async () => {
    promptAsync()
  }

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 30,
                justifyContent: 'center',
                marginBottom: 50,
              }}
            >
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  height: 200,
                  justifyContent: 'center',
                }}
              >
                <Image
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 20,
                  }}
                  source={require('../../assets/icons/radiGoLogo.png')}
                />
              </View>

              <Text style={[globalStyles.Title6, { marginBottom: 5 }]}>
                {resetStatePassword ? 'Cambiar Contraseña' : 'Bienvenido!'}
              </Text>
              <Text style={[globalStyles.Text2, { marginBottom: 20 }]}>
                Estamos aquí para hacer tu día mas seguro
              </Text>

              {resetStatePassword ? (
                <>
                  <InputText
                    icon={<Feather name="user" size={30} color={'black'} />}
                    text="Correo electrónico"
                    name="email"
                    value={email}
                    onChange={onChange}
                    keyboardType={'email-address'}
                  ></InputText>
                </>
              ) : (
                <>
                  <InputText
                    icon={<Feather name="user" size={30} color={'black'} />}
                    text="Correo electrónico"
                    name="email"
                    value={email}
                    onChange={onChange}
                    keyboardType={'email-address'}
                  ></InputText>

                  <InputText
                    icon={<Feather name="key" size={30} color={'black'} />}
                    text="Contraseña"
                    name="password"
                    value={password}
                    onChange={onChange}
                    secureTextEntry
                  ></InputText>
                </>
              )}

              {resetStatePassword ? (
                <></>
              ) : (
                <>
                  <TouchableOpacity onPress={() => setResetStatePassword(true)}>
                    <Text
                      style={[
                        globalStyles.Text3,
                        {
                          fontSize: 12,
                          textDecorationLine: 'underline',
                          textAlign: 'center',
                          marginBottom: 30,
                        },
                      ]}
                    >
                      Olvidé mi contraseña
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <BtnPrimary
                styleBtn={{ marginTop: resetStatePassword ? 30 : 0 }}
                func={resetStatePassword ? resetPasswordFunc : onLogin}
                title={resetStatePassword ? 'Enviar' : 'Empezar'}
                loading={loadingBtn}
              ></BtnPrimary>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: BCBUTTON,
                  marginTop: 20,
                  marginBottom: 30,
                }}
              />

              <View
                style={{
                  borderColor: 'rgba(66, 133, 244, 0.1)',
                  borderRadius: 5,
                  borderWidth: 3,
                  marginTop: screenHeight > 700 ? 0 : -15,
                }}
              >
                <TouchableOpacity
                  onPress={loginGmail}
                  style={{
                    width: '100%',
                    height: 50,
                    borderColor: INPUT1,
                    borderWidth: 1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}
                >
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      position: 'absolute',
                      left: 0,
                      marginLeft: 20,
                    }}
                    source={require('../../assets/icons/logogoogle.png')}
                  ></Image>

                  <Text style={[globalStyles.Text3]}>Sign in with Google</Text>
                </TouchableOpacity>
              </View>

              {resetStatePassword ? (
                <>
                  <TouchableOpacity
                    onPress={() => setResetStatePassword(false)}
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      top: 90,
                    }}
                  >
                    <Text style={[globalStyles.Text4, { marginRight: 5 }]}>
                      Iniciar Sesión
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('SignUpScreen')}
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      top: screenHeight > 700 ? 40 : 3,
                    }}
                  >
                    <Text style={[globalStyles.Text4, { marginRight: 5 }]}>
                      ¿No tienes cuenta?
                    </Text>
                    <Text style={[globalStyles.Text2]}>Registrate</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  )
}

export default LoginScreen
