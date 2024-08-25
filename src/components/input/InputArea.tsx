import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  ViewStyle,
  View,
  KeyboardTypeOptions,
  Platform,
  Dimensions,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
} from "react-native";

// @ts-ignore
import InsetShadow from "react-native-inset-shadow";
import { BCBUTTON } from "../../theme/globalStyles";

interface Props {
  text: string;
  name: string;
  onChange: (value: string, name: string) => void;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
  secureTextEntry?: boolean;
  prefixIconName?: prefixIconName;
  autoCapitalize?: autoCapitalize;
  onSubmitEditing?: () => void;
  value: string;
  multiline?: any;
  styleInput?:StyleProp<ViewStyle>;
  autofocus?: boolean;
  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  editable?: any;
}

type prefixIconName = "user" | "lock" | "key" | "mail" | "grid";
type autoCapitalize = "none" | "sentences" | "words" | "characters";

export const InputArea = ({
  //
  text,
  onChange,
  name,
  style,
  autoCapitalize,
  onSubmitEditing,
  keyboardType,
  value,
  multiline,
  autofocus,
  styleInput,
  onKeyPress,
  editable,
}: Props) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  return (
    <View
      style={{
        height: screenHeight > 700 ? 250 : 200,
        // backgroundColor: "red",
        // top: 10,

        ...(style as any),
      }}
    >
      <View style={{ ...stylesScreen.containerInput }}>
        <TextInput
          //
          style={{
            ...stylesScreen.inpuStyle,
            textAlignVertical: "top",
            ...(styleInput as any),
          }}
          editable={editable}
          placeholder={text}
          value={value}
          onChangeText={(value) => onChange(value, name)}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={20}
          // onSubmitEditing={onSubmitEditing}
          keyboardType={keyboardType}
          // autoFocus={autofocus}
          onKeyPress={(e) => (onKeyPress ? onKeyPress(e) : () => {})}
        />
      </View>
    </View>
  );
};

const stylesScreen = StyleSheet.create({
  containerInput: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor:"yellow",
    borderRadius: 10,
    borderColor: BCBUTTON,
    borderWidth: 1,
    padding: 10,
  },
  inpuStyle: {
    width: "100%",
    borderRadius: 10,
    marginVertical: 10,
  },
});
