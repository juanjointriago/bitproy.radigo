import { View, Text, TextStyle } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { ViewStyle } from "react-native";
import { BACKGROUND, globalStyles } from "../../theme/globalStyles";

interface Props {
  styleBtn?: ViewStyle;
  func: any;
  icon?: JSX.Element;
  text?: string;
  styleIcon?: ViewStyle;
  styleText?: TextStyle;
}

export default function BtnCircle({
  styleBtn,
  func,
  icon,
  text,
  styleIcon,styleText
}: Props) {
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
        justifyContent: 'center',
      }}
    >
      {text ? <Text style={{ ...globalStyles.btnmap,...styleText }} >{text}</Text> : null}
      {icon}





      {/* <View style={{ height: 5 }}></View> */}
    </TouchableOpacity>
  );
}
