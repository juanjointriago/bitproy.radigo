import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { BACKGROUND, globalStyles } from "../../theme/globalStyles";

interface Props {
  styleBtn?: ViewStyle;
  styleContIcon?: ViewStyle;
  icon?: JSX.Element;
}

const IconService = ({ styleBtn, icon,styleContIcon }: Props) => {
  return (
   
    <View style={{  ...styleBtn, backgroundColor:BACKGROUND }}>
     {icon}
    </View>
  );
};

export default IconService;

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
