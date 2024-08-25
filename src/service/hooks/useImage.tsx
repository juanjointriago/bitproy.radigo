import * as ImagePicker from 'expo-image-picker'

export const useImage = () => {

  const getPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!")
      return
    }
    return status !== 'granted'
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.8,
    })
    if (!result.canceled) {
      let name: any = result.assets[0].uri.split('/').pop()
      return { path: result.assets[0].uri, fileName: name }
    }else{
      return null
    }
  }
  const pickMultipleImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10,
      // allowsEditing: true,
    })
    if (!result.canceled) {
      return { images: result.assets }

    }
  }
  const openCamera = async () => {
    getPermission()
    let result = await ImagePicker.launchCameraAsync({
      // @ts-ignore
      cameraType: 'back',
    })
    if (!result.canceled) {
      let name: any = result.assets[0].uri.split('/').pop()
      return { path: result.assets[0].uri, fileName: name }
    }else{
      return null
    }
  }

  return {
    getPermission,
    pickImage,
    openCamera,
    pickMultipleImage,
  }
}
