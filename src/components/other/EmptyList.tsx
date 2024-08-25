import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

interface IProps {
  description?: string;
}

export default function EmptyList({ description }: IProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 300,
          height: 300,
        }}
      >
        <Image
          source={require("../../assets/images/emptyList.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>

      {description && (
        <Text style={{ textAlign: "center", fontSize: 20, marginTop: 50 , fontWeight: "800"}}>
          {description}
        </Text>
      )}
    </View>
  );
}
