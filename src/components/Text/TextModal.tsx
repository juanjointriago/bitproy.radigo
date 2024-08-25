import React from "react";
import { Text, TextStyle, View, StyleSheet, ViewStyle } from "react-native";
import { globalStyles } from "../../theme/globalStyles";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  text: string;
  styleTitle?: TextStyle;
  styleView?: ViewStyle;
}
const TextModal = ({ text, styleView,styleTitle }: Props) => {
  return (
    <View style={{  ...styleView }}>
      <Text style={{ ...globalStyles.Text4, ...styleView, ...styleTitle }}>{text}</Text>
    </View>
  );
};

export default TextModal;

