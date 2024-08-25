import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { BACKGROUND, BCBUTTON, PRIMARY_COLOR, TEXT, TEXT2, WHITE, globalStyles } from "../../theme/globalStyles";
import { Feather } from "@expo/vector-icons";
import { TextStyle } from 'react-native';

interface props {
  text?: any;
  name?: string;
  placeholder?: any;
  value?: any;
  onChange?: any;
  keyboardType?: KeyboardTypeOptions;
  styleText?: ViewStyle;
  secureTextEntry?: boolean;
  editable?: any;
  icon?: JSX.Element,
  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  maxLength?:any
  styleTextInput?:TextStyle
}
export const InputText = ({
  icon,
  editable,
  text,
  onChange,
  name,
  value,
  styleText,
  keyboardType,
  secureTextEntry,
  onKeyPress,
  placeholder,
  maxLength,
  styleTextInput
}: props) => {
  const [visiblePassword, setVisiblePassword] = useState(true);

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
      <View
        style={{
          left: 5,
          width: 65,
          height: 62,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {icon}
      </View>
      <TextInput
        editable={editable === undefined || editable === null
        ?true:editable===true
        ?true:editable===false
        ?false:false
        }
        value={value}
        style={{
          flex: 1,
          height: 62,
          ...globalStyles.Text2,
          ...styleTextInput,
          
        }}
        placeholderTextColor={TEXT}
        placeholder={text}
        onChangeText={(value) => onChange(value, name)}
        autoCapitalize='none'
        keyboardType={keyboardType}
        onKeyPress={(e) => (onKeyPress ? onKeyPress(e) : () => {})}
        secureTextEntry={secureTextEntry ? visiblePassword : false}
        maxLength={maxLength}
      />
      <TouchableOpacity
        onPress={() => setVisiblePassword(!visiblePassword)}
        style={{
          width: 40,
          height: 62,
          left: -15,
          justifyContent: 'center',
          alignItems: 'center',
          
        }}
      >
        {secureTextEntry && (
          <Feather
            name={visiblePassword ? 'eye' : 'eye-off'}
            size={24}
            color={PRIMARY_COLOR}
          />
        )}
      </TouchableOpacity>
    </View>
  )
};

