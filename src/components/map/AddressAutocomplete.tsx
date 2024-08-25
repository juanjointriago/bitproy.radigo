import React, { useEffect, useRef,} from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { INPUT2, globalStyles } from "../../theme/globalStyles";
import {
  GooglePlacesAutocomplete,
  GooglePlaceData,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "../../service/helpers/constants";
import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface IPropsAddressAutocomplete {
  styleView?: StyleProp<ViewStyle>;
  placeholder?: string;
  value?: string;
  onPress?: () => void;
  onPressItem?: (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null
  ) => void;
  autofocus?: boolean;
  address?: string;
  textInputProps?: any;
}

const AddressAutocomplete = ({
  styleView,
  placeholder = "Escoger lugar",
  onPress,
  onPressItem = () => {},
  autofocus,
  textInputProps,
  address,
}: IPropsAddressAutocomplete) => {
  const saveObj = (data: GooglePlaceData, detail: GooglePlaceDetail | null) => {
    if (onPressItem) {
      onPressItem(data, detail);
    }
  };
  const ref: any = useRef();
  useEffect(() => {
    if (address) ref.current.setAddressText(address);
  }, [address]);

  return (
    <TouchableOpacity
      style={{ zIndex: 1000, height: 65 }}
      disabled={onPress ? false : true}
      onPress={() => {
        if (onPress) onPress();
        else () => {};
      }}
      activeOpacity={0.8}
    >
      <View style={{ ...styles.contentAutoCompleted, ...(styleView as any) }}>
        <GooglePlacesAutocomplete
          placeholder={placeholder}
          GooglePlacesDetailsQuery={{ fields: "geometry" }}
          fetchDetails={true}
          textInputProps={{
            onChange: () => {
              textInputProps(true);
            },
            editable: onPress ? false : true,
            autoFocus: autofocus,
            placeholder: placeholder,
          }}
          // disableScroll

          keyboardShouldPersistTaps="always"
          onPress={(
            data: GooglePlaceData,
            detail: GooglePlaceDetail | null
          ) => {
            saveObj(data, detail);
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: "es",
            components: "country:ec",
          }}
          styles={searchInputStyle}
          renderRightButton={() => (
            <TouchableOpacity style={styles.buttonRight}>
              <AntDesign name="right" size={24} color={INPUT2} />
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableOpacity>
  );
};

export default AddressAutocomplete;
const searchInputStyle = {
  textInputContainer: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",

    // borderColor: "green",
    // borderWidth: 1,
    // borderColor: INPUT2,
  },
  textInput: {
    // borderWidth:1,
    // borderColor: "yellow",
    marginBottom: 0,
    // borderColor:INPUT2,

    ...globalStyles.Text,
  },
  poweredContainer: {
    display: "none",
  },
  row: {
    flexDirection: "row",
    borderRadius: 10,
    // borderColor: "blue",
    // borderWidth:1
  },
  separator: {
    height: 0.6,
    width: 4,
    // backgroundColor: "transparent",
    borderWidth: 2,
  },
  container: {
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: screenHeight > 700 ? 36 : 20,
    marginHorizontal: 20,
    top: screenHeight > 700 ? -75 : -15,
    borderWidth: 1,
    borderColor: INPUT2,
  },
};
const styles = StyleSheet.create({
  contentAutoCompleted: {
    borderRadius: 10,
    position: "absolute",
    width: "100%",
    zIndex: 1000,
    // borderWidth:1,
    top: 40,
  },
  buttonRight: {
    position: "absolute",
    right:10
  },
  
});
{
  /* <View style={{ width: "100%" }}>
          <AddressAutocomplete
            autofocus={true}
            onPressItem={(data, detail) => handleItemSelected(data, detail)}
            textInputProps={setAddressCompleted}
            address={addressText}
          />
        </View> */
}
