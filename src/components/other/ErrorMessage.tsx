import React from "react";
import { StyleProp, Text, TextStyle, View } from "react-native";

interface Props {
  message: String;
  style?: StyleProp<TextStyle>;
  status?: boolean;
}

export const ErrorMessage = ({ message, style, status }: Props) => {
  return (
    <>
      {status && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            bottom: 13,
            width: "100%",
          }}
        >
          <Text
            style={{
              ...(style as any),
            }}
          >
            {message}
          </Text>
        </View>
      )}
    </>
  );
};
