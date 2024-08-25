import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { BACKGROUND, globalStyles } from "../../theme/globalStyles";

interface Props {
  func: () => void;
  text?:any
  styleBtn?: ViewStyle;
  styleContIcon?: ViewStyle;
  icon?: JSX.Element;
  opacity?: number;
}

const BtnIcon = ({ func, styleBtn, icon, opacity, styleContIcon,text }: Props) => {
  return (
   
    <View style={{  ...styleBtn, backgroundColor:BACKGROUND }}>
      <TouchableOpacity
        style={styles.touchAbleOpacity}
        activeOpacity={opacity || 0.5}
        onPress={() => func()}
      >
        <View style={{ ...styles.contIcon, ...styleContIcon }}>{icon}</View>
        <Text>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BtnIcon;

const styles = StyleSheet.create({
 
  contIcon: {
    width: 24.11,
    height: 22.69,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    right: 20.24
  },
  touchAbleOpacity: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
