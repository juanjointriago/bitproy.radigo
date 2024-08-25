import React from "react";
import {Image, StyleSheet, View, ViewStyle,Dimensions } from "react-native";

interface Props {
  imgStyle?: ViewStyle;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const LogoContainer = ({ imgStyle }: Props) => {

  return (
    <View style={{...styles.container_img}}>
      <Image
        source={require("../../assets/icons/radiGoLogo.png")}
        resizeMode="cover"
        style={{ ...styles.image, ...(imgStyle as any) }}
      ></Image>
       
    </View>
  );
};

export default LogoContainer;

const styles = StyleSheet.create({
  container_img: {
    // backgroundColor: "#999",
    marginTop:  20,
    width:'100%',
    paddingLeft:35
  },
  image: {
    width: 100,
    height: 100,
    borderRadius:20,
  },
  
});
