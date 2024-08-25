import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View,  ViewStyle,
} from "react-native";
import { AntDesign } from '@expo/vector-icons';import { BACKGROUND, BCBUTTON, ICONUPLOAD, TEXT, globalStyles } from "../../theme/globalStyles";
import BtnIcon from "../icons/BtnIcon";

interface Props {
  funcText?: any;
  funcUpload: any;
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

const InputUpload = ({
  funcText,
  funcUpload,
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
        width: '100%',
        height: 62,
        borderRadius: 10,
        borderColor: BCBUTTON,
        borderWidth: 1,
        flexDirection: 'row',
        marginBottom: 15,
        backgroundColor: BACKGROUND,
        ...styleText,
      }}
    >
      <View  style={{
          left: 5,
          width: 65,
          height: 62,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
     
      </View>
      <TextInput
        style={{
            flex: 1,
            height: 62,
            ...globalStyles.Text,
        }}
        placeholderTextColor={TEXT}
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
        <View style={{}}>
          <BtnIcon
            func={() => funcUpload()}
            opacity={opacityIconBtn}
            icon={
              icon || (
                <AntDesign name="upload" size={24} color={ICONUPLOAD} />
              )
            }
          />
        </View>
      ) : null}
    </View>
  );
};

export default InputUpload;

const styles = StyleSheet.create({});
