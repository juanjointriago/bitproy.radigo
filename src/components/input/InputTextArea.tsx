import {
  StyleProp,
  StyleSheet,
  TextInput,
  ViewStyle,
  View,
  KeyboardTypeOptions,
  Platform,
} from "react-native";

// @ts-ignore
import InsetShadow from "react-native-inset-shadow";

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
  styleInput?: any;
  autofocus?: boolean;
}

type prefixIconName = "user" | "lock" | "key" | "mail" | "grid";
type autoCapitalize = "none" | "sentences" | "words" | "characters";

export const InputTextArea = ({
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
}: Props) => {
  return (
    <View
      style={{
        height: 150,
        backgroundColor: "white",
        borderRadius: 10,
        ...(style as any),
      }}
    >
      <InsetShadow
        //
        bottom={Platform.OS === "ios" ? false : true}
        containerStyle={{
          borderRadius: 10,
          borderBottomWidth: Platform.OS === "ios" ? 1 : 0,
          borderBottomColor: "#aeb1b32d",
        }}
        shadowOpacity={0.3}
      >
        <View style={{ ...stylesScreen.containerInput }}>
          <TextInput
            //
            style={{
              ...stylesScreen.inpuStyle,
              textAlignVertical: "top",
              ...styleInput,
            }}
            placeholder={text}
            value={value}
            onChangeText={(value) => onChange(value, name)}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
            numberOfLines={20}
            onSubmitEditing={onSubmitEditing}
            keyboardType={keyboardType}
            autoFocus={autofocus}
          />
        </View>
      </InsetShadow>
    </View>
  );
};

const stylesScreen = StyleSheet.create({
  containerInput: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  inpuStyle: {
    width: "100%",
    borderRadius: 10,
    marginVertical: 10,
  },
});
