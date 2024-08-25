import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import {
  BACKGROUND,
  SECONDARY_COLOR,
  globalStyles,
} from "../../theme/globalStyles";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  text: string;
  func: () => void;
  styleBtn?: ViewStyle;
  StyleText?: any;
}
const BtnStateTypeTravel = ({ text, func, styleBtn, StyleText }: Props) => {
  return (
    <TouchableOpacity
      onPress={func}
      style={{
        alignItems: "center",
        height: 60,
        width: 60,
        backgroundColor: BACKGROUND,
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.32,
        shadowRadius: 6.46,
        elevation: 20,
        ...styleBtn,
        justifyContent: "center",
      }}
    >
      {text ? <Text style={{ ...globalStyles.btntravels, ...StyleText }}>{text}</Text> : null}
    </TouchableOpacity>
  );
};

export default BtnStateTypeTravel;
