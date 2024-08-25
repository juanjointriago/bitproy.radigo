import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  BACKGROUND,
  BCBUTTON,
  ICONUPLOAD,
  TEXT,
  globalStyles,
} from "../../theme/globalStyles";
import BtnIcon from "../icons/BtnIcon";

interface Props {
  funcText?: any;
  funcView: any;
  value: any;
  name: string;
  editable?: boolean;
  placeholder?: string;
  keyboardType?: any;
  icon?: any;
  opacityIconBtn?: number;
  showIcon?: boolean;
  fullWidth?: boolean;
  styleText?: ViewStyle;
}

const InputImage = ({
  funcText,
  funcView,
  placeholder,
  name,
  value,
  keyboardType,
  editable,
  icon,
  opacityIconBtn,
  showIcon = true,
  fullWidth,
  styleText,
}: Props) => {
  return (
    <View
      style={{
        width: "100%",
        height: 62,
        borderRadius: 10,
        borderColor: BCBUTTON,
        flexDirection: "row",
        marginBottom: 15,
        backgroundColor: BACKGROUND,
        ...styleText,
      }}
    >
      <View
        style={{
          left: 5,
          width: 65,
          height: 62,
          justifyContent: "center",
          alignItems: "center",
        }}
      ></View>
      <TextInput
        style={{
          flex: 1,
          height: 62,
          ...globalStyles.Text,
        }}
        placeholderTextColor={ICONUPLOAD}
        placeholder={placeholder}
        defaultValue={value}
        editable={
          editable === undefined || editable === null
            ? false
            : editable === true
            ? true
            : false
        }
        keyboardType={keyboardType}
        onChangeText={(value) => funcText(value, name)}
      ></TextInput>
      {showIcon ? (
        <View style={{ ...styles.styleBtn }}>
          <BtnIcon
            func={() => {}}
            text={"ver"}
            styleBtn={{    borderRadius: 11.32, 
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

export default InputImage;

const styles = StyleSheet.create({
  styleBtn: {
    borderWidth: 1,
    borderColor: BCBUTTON,
    width: 74,
    height: 50,
    borderRadius: 11.32,
    // marginHorizontal:290,
    right: 50,
    alignSelf:"center",
    ...globalStyles.Text,
  },
});
