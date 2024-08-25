import { View, StyleProp, ViewStyle, StyleSheet, ImageBackground } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";

interface Props {
  style?: StyleProp<ViewStyle>;
  children: any;
  styleBlur?: any;
  styleViewChildren?: any;
  urlImage?: any;
  intensity?:any;
  
}

const ContentBlur = ({
  style,
  children,
  styleBlur,
  styleViewChildren,
  urlImage,
  intensity=20
}: Props) => {
  return (
    <View
      style={{
        // borderRadius: 27,
        overflow: "hidden",
        ...(style as any),
        // width: '100%',
        height:"100%",
        // backgroundColor:"yellow",
        // position:"relative"
      }}
    >
      <ImageBackground
        source={urlImage}
        blurRadius={intensity}
        style={{
          flex: 1,
          // borderRadius: 27,
          backgroundColor: "rgba(255,255,255,0.5)",
          ...(styleBlur as any),
          transform: [{ scale: 1.9 }],
          position: "absolute",
          width: "100%",
          height: "100%",
          // left:130

        }}
      >
        <BlurView
          style={{
            flex: 1,
            // marginHorizontal: 30,
            // marginVertical: 20,
            ...(styleViewChildren as any),
            width: "100%",
            height:"100%"
          }}
          tint="light"
          intensity={5}
        >
        </BlurView>
      </ImageBackground>
      <View
            style={{
              flex: 1,
              // marginHorizontal: 20,
              // marginTop: 30,
              ...(styleViewChildren as any),
            }}
          >
            {children}
          </View>
    </View>
  );
};

export default ContentBlur;

const styles = StyleSheet.create({});
