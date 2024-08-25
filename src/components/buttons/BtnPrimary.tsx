import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import {
  ACTIVE_OPACITY_BTN,
  globalStyles,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from "../../theme/globalStyles";
import { TextStyle } from 'react-native';

interface Props {
  title: string;
  color?: string;
  textLoading?: string;

  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  func: () => void;
  styleBtn?: ViewStyle;
  styleTitle?: TextStyle;
  loading?: boolean;
  showIconLoading?: boolean;
  activeOpacity?: number;
  disabled?: boolean;
    inverted?: boolean;

}

const BtnPrimary = ({
    inverted = false,
  title,
  color,
  iconRight,
  textLoading = "Cargando...",
  func = () => {},
  styleBtn,
  loading = false,
  disabled = false,
  showIconLoading = true,
  styleTitle,
  activeOpacity = ACTIVE_OPACITY_BTN,
  iconLeft,
}: Props) => {
  const handlePressBtn = () => {
    if (!loading) {
      func();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={handlePressBtn}
      style={{
        width: "100%",
        height: 62,
        backgroundColor: color || PRIMARY_COLOR,
        borderRadius: 10,
        flexDirection: "row",
// borderWidth:1,
        ...styleBtn,
      }}
      disabled={disabled}
    >
      {/* <View
          style={{
            left: 25,
            width: 50,
            height: 62,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
   
        </View> */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          paddingHorizontal: 15,
          left: 25,

          ...(styleTitle as any),
        }}
      >
        {iconLeft ? iconLeft : null}

        <Text style={{ ...globalStyles.TitleSecondary, ...styleTitle }}>
          {loading ? textLoading : title}
        </Text>
       
      </View>
      <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 50,
            height: 62,
            right: 25,
            // borderWidth:1
          }}
        >
          {loading && showIconLoading ? (
            <ActivityIndicator size={25} color={SECONDARY_COLOR} />
          ) : iconRight ? (
            iconRight
          ) : null}
        </View>
    </TouchableOpacity>
  );
};

export default BtnPrimary;
