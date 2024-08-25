import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Linking,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { globalStyles } from "../../../theme/globalStyles";
import CardSos from "../../other/CardSos";
import BtnPrimary from "../../buttons/BtnPrimary";
import { Info } from "../../../interfaces/SupportInterfaces";
import { useSupport } from "../../../service/hooks/useSupport";

interface Props {
  openModalState: boolean;
  btnCancel: () => void;
}

const ModalSos = ({ openModalState, btnCancel }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  const{getSupportInfo}=useSupport();
  
  const [info, setInfo] = useState<Info>();


  useEffect(() => {
    if (openModalState) {
      handleOpenSheet();
    } else {
      handleCloseSheet();
    }
  }, [openModalState]);


  useEffect(() => {
    getInfo()
  }, []);

  const handleCloseSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const handleOpenSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0); // Índice de la hoja inferior que deseas mostrar
    }
  };

  const getInfo = () => {
    getSupportInfo().then((resp) => {
        
      setInfo(resp.data.info);
    }).catch((error) => {
      console.log(error);
    })
  }

  const CustomHandleComponent = () => (
    <TouchableOpacity
      style={{ alignItems: "center", justifyContent: "center", height: 40 }}
      onPress={() => {
        handleCloseSheet();
      }}
    >
      <View
        style={{
          backgroundColor: "#717171",
          width: 90,
          height: 3,
          borderRadius: 5,
        }}
      ></View>
      <View
        style={{
          borderBottomColor: "#717171",
          borderBottomWidth: 0.7,
          width: "90%",
          position: "absolute",
          bottom: 0,
        }}
      ></View>
    </TouchableOpacity>
  );

  const SlideInView = ({ children }: any) => {
    const slideAnim = useRef(new Animated.Value(500)).current;

    useEffect(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, [slideAnim]);
    return (
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          transform: [{ translateY: slideAnim }],
        }}
      >
        {children}
      </Animated.View>
    );
  };

  return (
    <>
      <BottomSheet
        handleComponent={CustomHandleComponent}
        backgroundStyle={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderTopColor: "#CFCFCF",
          borderEndColor: "#CFCFCF",
          borderStartColor: "#CFCFCF",
          borderTopWidth: 1,
          borderEndWidth: 0.5,
          borderStartWidth: 0.5,
          backgroundColor: "white",
        }}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["60%"]} 
        enablePanDownToClose
      >
          <View style={{ alignItems: "center", paddingTop: 10, flex: 1 }}>
            <CardSos
              onPress={async () => {
                Linking.openURL(`tel:${911}`);
              }}
              direc={"EMERGENCIA"}
              desc={"En caso de emergencia comunicarse al 911"}
            />

            <CardSos
              onPress={async () => { Linking.openURL(`tel:${info?.phone_primary}`);}}
              direc={"Administrador"}
              desc={"Puedes comunicarte con el administrador del taxi"}
            />

            <View
              style={{
                width: "100%",
                alignItems: "flex-end",
                position: "absolute",
                bottom: 10,
              }}
            >
              <BtnPrimary
                title="Cancelar"
                func={btnCancel}
                styleBtn={{
                  marginRight: 20,
                  width: 200,
                  height: 50,
                  backgroundColor: "#1F1F1F",
                }}
                styleTitle={{
                  color: "white",
                }}
              />
            </View>
          </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurView: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ModalSos;
