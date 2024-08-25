import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { ViewStyle } from "react-native";
import { ALERT, BACKGROUND, globalStyles } from "../../theme/globalStyles";

interface Props {
  styleBtn?: ViewStyle;
  func: any;
  //   icon?:JSX.Element;
  text?: number;
}

export default function BtnRequests({ styleBtn, func, text }: Props) {
  return (
    <TouchableOpacity onPress={func} style={styles.container}>
      <View style={styles.containerText}>
        <Text style={styles.textbtn}>Buscar Viajes</Text>
      </View>
      <View style={styles.circlebtn}>
        <Text style={{ ...globalStyles.btnmap, ...styleBtn }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "flex-end",
    flexDirection: "row",
    borderRadius: 10,
    height: 40,
    width: 150,
  },
  textbtn: {
    ...globalStyles.btntext,
    left: 10,
  },
  circlebtn: {
    justifyContent: "center",
    backgroundColor: ALERT,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 100,
    height: 35,
    width: 35,
    left: 15,
    shadowOffset: {
      shadowColor: "#000",
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.32,
    shadowRadius: 6.46,
    elevation: 39,
  },
  containerText: {
    alignSelf: "center",
  },
});
