import {
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
} from 'react-native'
import React, { useState, useContext } from 'react'
import BtnPrimary from '../../components/buttons/BtnPrimary'
import { BackButton } from '../../components/buttons/BackButton'
import { ModalLoading } from '../../components/modals/ModalLoading'
import { SelectImageUser } from '../../components/picker/SelectImageUser'
import { InputText } from '../../components/input/InputText'
import { Feather, Entypo } from '@expo/vector-icons';
import { ErrorMessage } from '../../components/other/ErrorMessage'
import { ALERT } from '../../theme/globalStyles'
import { useImage } from '../../service/hooks/useImage'
import { useForm } from '../../service/hooks/useForm'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import { API_HOST_IMG } from '../../service/helpers/constants';
import { useAlerts } from '../../service/hooks/useAlerts'
import { StackScreenProps } from '@react-navigation/stack'

interface Props extends StackScreenProps<any, any> { }

export default function ProfileScreen({ navigation }: Props) {
    const { user, updateDataUser } = useContext(AuthContext)

    const { pickImage } = useImage()
    const { confirmAlert, toast } = useAlerts()

    const [userPhoto, setUserPhoto] = useState('')
    const [loading, setLoading] = useState(false)


    const {
        email,
        full_name,
        phone,
        identification,
        onChange,
        form,
        setFormValue,
    } = useForm({
        email: user?.email || '',
        full_name: user?.full_name || '',
        phone: user?.phone || '',
        identification: user?.identification || '',
    })

    const [errors, setErrors] = useState({
        email: false,
        full_name: false,
        password: false,
        phone: false,
        identification: false,
    })


    const updateUserFunc = async () => {
        let verification_info = verification()
        if (verification_info) {
            const formData = new FormData()
            formData.append('full_name', form.full_name)
            formData.append('phone', form.phone)
            if (userPhoto !== '') {
                console.log('userPhoto ',)
                formData.append('photo', userPhoto)
            }
            formData.append('identification', form.identification)
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
    }

    const verification = () => {
        const newErrors = {
            email: false,
            full_name: false,
            password: false,
            phone: false,
            role_id: false,
            typeAccount: false,
            photo_profile: false,
            identification: false,
        }
        if (
            form.email === '' ||
            form.full_name === '' ||
            form.phone === '' ||
            form.identification === ''
        ) {


            if (form.email === '') {
                newErrors.email = true
            }
            if (form.full_name === '') {
                newErrors.full_name = true
            }

            if (form.phone === '') {
                newErrors.phone = true
            }
            if (form.identification === '') {
                newErrors.identification = true
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

                            <View
                                style={{
                                    width: '100%',
                                    height: 200,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <SelectImageUser
                                    imageUrl={`${API_HOST_IMG}/profile/${user?.photo}`}
                                    styleImg={{
                                        borderColor: 'black',
                                    }}
                                    pickImage={pickImage}
                                    uri={setUserPhoto}
                                />
                            </View>

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
                                editable={false}
                            />
                            <ErrorMessage
                                style={{ fontSize: 14, color: ALERT, top: 5, marginBottom: 10 }}
                                message="Verifica esté campo."
                                status={errors.email}
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
                        func={updateUserFunc}
                        title="Actualizar"
                        loading={loading}
                        disabled={loading}
                    />


                </View>
            </KeyboardAvoidingView>
        </View>
    )
}