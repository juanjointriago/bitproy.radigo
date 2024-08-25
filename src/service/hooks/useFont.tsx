import { useFonts } from "expo-font";
const useFont = () => {
    const [loaded] = useFonts({
      PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
      PoppinsLight: require("../../assets/fonts/Poppins-Light.ttf"),
      PoppinsRegular: require("../../assets/fonts/Poppins-Regular.ttf"),
      PoppinsExtraBold: require("../../assets/fonts/Poppins-ExtraBold.ttf"),
      PoppinsSemiBold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });
    return { loaded };
  };
  
  export default useFont;
  