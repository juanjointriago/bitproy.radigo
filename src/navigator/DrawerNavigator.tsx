import {
  StyleSheet, View,
  // Dimensions,
  ScrollView, Text,
  AppState
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  // DrawerContentScrollView,
} from "@react-navigation/drawer";
import StackNavigator from "./StackNavigator";
// import ContentBlur from "../components/containers/ContentBlur";
import { UserInfo } from "../components/menu/UserInfo";
import { ItemsUser } from "../components/menu/ItemsUser";
import LogoContainer from "../components/ContainerLogo/LogoContainer";
import TextLogOut from "../components/Text/TextLogOut";
import { globalStyles } from "../theme/globalStyles";
import { AuthContext } from "../contexts/Auth/AuthContext";
import { useContext, useEffect } from "react";
import {
  // API_HOST,
  API_HOST_IMG
} from "../service/helpers/constants";
import { registerBGTask, startTracking } from '../contexts/Background/TrackingHelper';

const Drawer = createDrawerNavigator();
// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        swipeEdgeWidth: 0,
        drawerType: "front",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="StackNavigator" component={StackNavigator} />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = ({ navigation }: DrawerContentComponentProps) => {
  const { logOut, user } = useContext(AuthContext);

  useEffect(() => {
    registerBGTask();
  }, []);

  useEffect(() => {
    let intervalValue: NodeJS.Timeout | null = null;
    if (AppState.currentState === 'active') {
      intervalValue = setInterval(async () => {
        await startTracking()
      }, 1000 * 60);
    }
    return () => {
      if (intervalValue) clearInterval(intervalValue);
    }
  }, [])



  const logoutFunc = async () => {
    logOut();
    navigation.toggleDrawer();
  };
  return (
    <>
      <UserInfo
        img={`${API_HOST_IMG}/profile/${user?.photo}`}
        name={user?.full_name}
        email={user?.email}
      />
      <View style={styles.containerMenu}>
        <ScrollView>
          <ItemsUser
            onPress={() => navigation.navigate("EditProfileScreen")}
            title="Mi Cuenta"
          />
          <ItemsUser
            onPress={() => navigation.navigate("HistoryScreen")}
            title="Mis Viajes"
          />
          {user?.role_id === 3 && (
            <ItemsUser
              onPress={() => navigation.navigate("MyCarsScreen")}
              title="Mis autos"
            />
          )}
          <ItemsUser
            onPress={() => navigation.navigate("SupportScreen")}
            title="Soporte"
          />
          <ItemsUser
            onPress={() => navigation.navigate("TermsScreen")}
            title="Terminos y condiciones"
          />
          <TextLogOut onPress={logoutFunc} text={"Cerrar sesión"} />
          <LogoContainer />
          <View style={{ width: '100%', alignItems: 'center', marginTop: 30 }}>
            <Text
              style={{ ...globalStyles.Text3, }}
            >
              Versión: 0.2.0
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default DrawerNavigator;
const styles = StyleSheet.create({
  containerMenu: {
    // backgroundColor: "yellow",

  },
});
