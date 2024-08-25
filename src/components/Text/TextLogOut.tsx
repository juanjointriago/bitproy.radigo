import React from "react";
import { Text, TextStyle, View,StyleSheet,} from "react-native";
import { globalStyles } from "../../theme/globalStyles";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  text: string;
  styleTitle?:TextStyle ;
  onPress?: () => void

}

const TextLogOut = ({ text, styleTitle, onPress }: Props) => {
  return (
  <View style={styles.textlogout}>
     <TouchableOpacity  onPress={onPress} >
     <Text style={{ ...globalStyles.Text4, ...styleTitle }}>
      {text}
    </Text>
   </TouchableOpacity>
  </View>
  );
};

export default TextLogOut;
const styles = StyleSheet.create({
 
  textlogout: {
    marginHorizontal: 35,
    marginTop: 20,
  },
});
