import React, { useState } from 'react'
import { TouchableOpacity, View, StyleSheet, Image, ViewStyle } from 'react-native'
import { Feather, Octicons } from '@expo/vector-icons'
import { BACKGROUND, BCBUTTON } from '../../theme/globalStyles'
interface Props {
  pickImage?: any
  uri?: any
  imageUrl?: any
  styleImg?: ViewStyle;
}
export const SelectImageUser = ({ pickImage, uri,styleImg,imageUrl }: Props) => {
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

  return (
    <TouchableOpacity style={[styles.button, styleImg]} onPress={selectImage}>
      {file.uri === '' && !imageUrl? (
        <Feather name="camera" size={30} color={BCBUTTON} />
      ) : (
        <Image
          source={{ uri:  file.uri === '' ? imageUrl:file.uri   }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 120,
    height: 120,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BCBUTTON,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 100,
  },
})
