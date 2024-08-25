import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  TouchableHighlight,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  MaterialCommunityIcons,
  Octicons,
  AntDesign,
} from "@expo/vector-icons";
import { BACKGROUND, BCBUTTON, WHITE, globalStyles } from "../../theme/globalStyles";
import { PRIMARY_COLOR } from "../../theme/globalStyles";

interface Props {
  options: any;
  setDataZone: Dispatch<SetStateAction<undefined>>;
  data?:any
}

const DropdownSelect = ({ options, setDataZone,data }: Props) => {
  const [selectedOption, setSelectedOption] = useState<any>(data?data:options[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [marginButton, setMarginButton] = useState(0);
  const buttonRef = useRef<any>(null);

  useEffect(() => {
    buttonRef.current.measure(
      (x: any, y: any, width: any, height: any, pageX: any, pageY: any) => {
        let addNumber=Platform.OS === "android" ? 15 : 50
        let numberTop: number = parseInt(pageY) + addNumber;
        isNaN(numberTop) ? 0 : setMarginButton(numberTop);
      }
    );
  }, [modalVisible]);

  const handleOptionSelect = (option: any) => {
    setDataZone(option);
    setSelectedOption(option);
    setModalVisible(false);
  };

  const renderOption = ({ item }: any) => (
    <TouchableHighlight
      underlayColor="#F2F8FA"
      onPress={() => handleOptionSelect(item)}
      style={{ padding: 10 }}
    >
      <Text style={{...globalStyles.Text2,}} > {item}</Text>
    </TouchableHighlight>
  );

  return (
    <View>
      <TouchableHighlight
           underlayColor="#F2F8FA"
        onPress={() => setModalVisible(true)}
        style={{ ...styles.conainterButton }}
        ref={buttonRef}
      >
        <>
          <Text style={{...globalStyles.Text2,}}>{selectedOption ||"Selecciona Rol" }</Text>
          <AntDesign name="down" size={24} color={PRIMARY_COLOR} />
        </>
      </TouchableHighlight>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "transparent",
            }}
          >
            <View
              style={{
                marginHorizontal: 30,
                backgroundColor: WHITE,
                top: marginButton,
                height: 80,
                width:Platform.OS === "android" ? 351 : 354 ,
                borderBottomWidth: 0.5,
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
                borderBottomLeftRadius:5,
                borderBottomRightRadius:5,
                borderColor: BCBUTTON,
                borderWidth: 2,
                position: "absolute",
              }}
            >
              <FlatList
                data={options}
                renderItem={renderOption}
                keyExtractor={(item) => item.id}
              />
             
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default DropdownSelect;
const styles = StyleSheet.create({
  conainterButton: {
    width: '100%',
    height: 62,
    borderRadius: 10,
    borderColor: BCBUTTON,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: BACKGROUND,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
});
