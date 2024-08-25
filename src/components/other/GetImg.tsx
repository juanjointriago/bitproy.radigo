import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Platform, ViewStyle } from 'react-native'
import BtnIcon from '../../components/icons/BtnIcon'
import { AntDesign } from '@expo/vector-icons'
import { globalStyles } from '../../theme/globalStyles'
// @ts-ignore
import InsetShadow from 'react-native-inset-shadow'
import { useAlerts } from '../../service/hooks/useAlerts'
import { ModalPreview } from '../modals/ModalPreview'

interface Props {
  title: string
  pickImage?: any
  uri?: any
  nameImage?: any
  uriGet?:any
}

const GetImg = ({ pickImage, uri, title,nameImage,uriGet }: Props) => {

  const { toast } = useAlerts()
  const [modalPreviewVisible, setModalPreviewVisible] = useState(false)

  const [file, setFile] = useState({
    name: '',
    uri: '',
  })

  const selectImage = async () => {
    let result = await pickImage()
    if (result !== null) {
      setFile({
        name: result.fileName,
        uri: result.path,
      })
      uri(
        JSON.parse(
          JSON.stringify({
            uri: result.path,
            type: `image/${result.path.split('.').pop()}`,
            name: result.path.split('/').pop(),
          }),
        ),
      )
    }
  }

  const handleViewPhoto = (photo: any, setModalPreviewVisible: any) => {
    if (!photo) {
      toast('Por favor selecciona una fotografía', 'DANGER')
    } else {
      setModalPreviewVisible(true)
    }
  }

  return (
    <>
      <ModalPreview
        visible={modalPreviewVisible}
        img={file.uri || uriGet}
        onClose={() => setModalPreviewVisible(false)}
      />

      <TouchableOpacity
        onPress={selectImage}
        style={{
          marginVertical: 15,
          width: '100%',
          height: 62,
          borderRadius: 10,
          borderColor: '#8E8E8E',
          borderWidth: 1,
          flexDirection: 'row',
          marginBottom: 15,
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            marginLeft: 20,
          }}
        >
          <Text style={[globalStyles.Text]}> {title} </Text>
        </View>

        <View
          style={{
            width: 80,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AntDesign name="upload" size={24} color={'#979CA3'} />
        </View>
      </TouchableOpacity>
     
      <View
        style={{
          width: '100%',
          height: 62,
          borderColor: '#8E8E8E',
          flexDirection: 'row',
          marginBottom: 15,
          marginRight: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 10,
            marginRight: 30,
          }}
        >
          <InsetShadow
            //
            bottom={Platform.OS === 'ios' ? false : true}
            containerStyle={{
              borderRadius: 10,
              borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
              borderBottomColor: '#aeb1b32d',
              justifyContent: 'center',
            }}
            shadowOpacity={0.3}
          >
            <Text style={[globalStyles.Text3, { marginLeft: 20 }]}>
              
              {file.name === '' ? `${nameImage || title}.jpg` :   file.name}
            </Text>
          </InsetShadow>
        </View>

        <TouchableOpacity
          onPress={() => handleViewPhoto( uriGet|| file.uri, setModalPreviewVisible)}
          style={{
            width: 80,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#8E8E8E',
            borderWidth: 1,
            borderRadius: 10,
          }}
        >
          <Text style={[globalStyles.Text3, { color: '#5B5B5B' }]}>Ver</Text>
        </TouchableOpacity>
      </View>
    
    </>
  )
}

export default GetImg
