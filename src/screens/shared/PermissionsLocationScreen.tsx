import { useContext } from 'react'
import { View, Text, Button, StyleSheet, Platform, Linking } from 'react-native'
import { PermissionsLocationContext } from '../../contexts/LocationPermissions/PermissionsLocationContext';

const PermissionsLocationScreen = () => {
  const { permissions, askLocationPermissions } = useContext(
    PermissionsLocationContext
  );

  const getStateGps = async () => {
    const resp:any= await  askLocationPermissions()
    if (!resp) {
      if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:')
      } else {
        Linking.openSettings()
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitud de permisos de GPS</Text>
      <Text style={styles.description}>
       {/*  Esta aplicación requiere acceso al GPS para proporcionar una mejor
        experiencia de usuario */}
        {permissions.locationStatus}
      </Text>
      <Button title="Solicitar permisos" onPress={getStateGps} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
})

export default PermissionsLocationScreen
