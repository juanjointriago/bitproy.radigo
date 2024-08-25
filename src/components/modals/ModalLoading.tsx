import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Extrapolate,
  withRepeat,
  withDelay,
  Easing,
} from "react-native-reanimated";
import {
  WHITE,
} from "../../theme/globalStyles";
interface Props {
  visible: boolean;
  text?: string;
}

export const ModalLoading = ({
  visible,
  text = "Espere un momento",
}: Props) => {
  const [pulse, setPulse] = useState([1]);

  const Pulse = ({ delay = 0, repeat }:any) => {
    const animation = useSharedValue(0);
    useEffect(() => {
      animation.value = withDelay(
        delay,
        withRepeat(
          withTiming(1, {
            duration: 2000,
            easing: Easing.linear,
          }),
          repeat ? -1 : 1,
          false
        )
      );
    }, []);
    const animatedStyles = useAnimatedStyle(() => {
      const opacity = interpolate(
        animation.value,
        [0, 1],
        [0.8, 0],
        Extrapolate.CLAMP
      );
      return {
        opacity: opacity,
        transform: [{ scale: animation.value }],
      };
    });
    return <Animated.View style={[styles.circle, animatedStyles]} />;
  };

  return (
    <Modal animationType="fade" visible={visible} transparent>
      <View
        style={{
          backgroundColor: "rgba(247,247,247,0.4)",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.contentModal}>
          {pulse.map((item, index) => (
            <Pulse repeat={index === 0}  key={index}/>
          ))}
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  contentModal: {
    backgroundColor: WHITE,
    width: "70%",
    height: "30%",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    elevation: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: "5%",
  },

  text: {
    top: "25%",
    fontFamily: "PoppinsBold",
    marginHorizontal: 10,
  },
  
  circle: {
    width: 130,
    borderRadius: 150,
    height: 130,
    position: "absolute",
    borderColor: '#2270E3',
    borderWidth: 4,
    backgroundColor: 'white',
    top:20
  },
  
});
