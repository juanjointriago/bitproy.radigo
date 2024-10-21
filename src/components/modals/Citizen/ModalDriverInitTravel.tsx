import { View, TouchableOpacity, Text } from "react-native";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  Fragment,
} from "react";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  ALERT,
  INPUT1,
  PRIMARY_COLOR,
  globalStyles,
} from "../../../theme/globalStyles";
import { TravelByDriver } from "../../../interfaces/ITravel";
import { SharedValue } from "react-native-reanimated";
// import { AuthContext } from '../../../contexts/Auth/AuthContext';
// import { useAlerts } from '../../../service/hooks/useAlerts';
// import { AntDesign } from '@expo/vector-icons';
// import { TravelContext } from '../../../contexts/Travel/TravelContext';

type snapPoints =
  | Array<string | number>
  | SharedValue<Array<string | number>>
  | Readonly<(string | number)[] | SharedValue<(string | number)[]>>;
interface Props {
  state: any;
  close: any;
  snapPoints: snapPoints;
  children: any;
  dataTravels: TravelByDriver[];
  selectTravel?: TravelByDriver;
}

const ModalDriverInitTravel = ({
  state,
  close,
  snapPoints,
  children,
  dataTravels,
  selectTravel,
}: Props) => {
  // const { dataTravelContext } = useContext(TravelContext)
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [statusOpenModal, setStatusOpenModal] = useState(false);
  const refIndex = useRef(1);

  // const { user, } = useContext(AuthContext)
  // const { toast } = useAlerts()

  useEffect(() => {
    handleSheetChanges(state);
  }, [state]);

  const handleSheetChanges = useCallback((index: number) => {
    // bottomSheetRef.current?.snapToIndex(index);
    // if (index === 1) {
    //   close(1);
    //   setStatusOpenModal(false);
    // } else {
    //   setStatusOpenModal(true);
    // }
    // if (index === 0) {
    //   close(0);
    // }
  }, []);

  const CustomHandleComponentNotTravel = () => (
    <TouchableOpacity
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: 100,
        backgroundColor:
          selectTravel?.type_service_id === 1
            ? PRIMARY_COLOR
            : selectTravel?.type_service_id === 2
            ? INPUT1
            : dataTravels.length > 0
            ? ALERT
            : "#1f1f1f",
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
      }}
      onPress={() => {
        statusOpenModal ? handleSheetChanges(1) : handleSheetChanges(0);
      }}
    >
      <View
        style={{
          bottom: 15,
          backgroundColor: "white",
          width: 70,
          height: 3,
          borderRadius: 5,
          flexDirection: "row",
        }}
      ></View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {selectTravel?.id === 0 ? (
          <Fragment>
            <Text
              style={[globalStyles.Title, { color: "white", marginRight: 10 }]}
            >
              {dataTravels.length}
            </Text>
            <Text style={[globalStyles.Text, { color: "white", fontSize: 24 }]}>
              Solicitud(es)
            </Text>
          </Fragment>
        ) : (
          <Fragment>
            <Text style={[globalStyles.Text, { color: "white", fontSize: 24 }]}>
              {selectTravel?.type_service_id === 2
                ? "Solicitud encargo"
                : "Solicitud"}
            </Text>
          </Fragment>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Fragment>
      {/* <BottomSheetModal
        handleComponent={CustomHandleComponentNotTravel}
        backgroundStyle={{
          flex:1,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderTopColor: '#CFCFCF',
          borderEndColor: '#CFCFCF',
          borderStartColor: '#CFCFCF',
          borderTopWidth: 1,
          borderEndWidth: 0.5,
          borderStartWidth: 0.5,
          backgroundColor: 'white',
        }}
        ref={bottomSheetRef}
        index={refIndex.current}
        snapPoints={useMemo(() => snapPoints, [snapPoints])}
        onChange={handleSheetChanges}
      >
        <BottomSheetView>
        {children}
        </BottomSheetView> */}
      <BottomSheet
              backgroundStyle={{
                flex:1,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderTopColor: '#CFCFCF',
                borderEndColor: '#CFCFCF',
                borderStartColor: '#CFCFCF',
                borderTopWidth: 1,
                borderEndWidth: 0.5,
                borderStartWidth: 0.5,
                backgroundColor: 'white',
              }}
        handleComponent={CustomHandleComponentNotTravel}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
      >
        <BottomSheetView style={{ flex: 1}}>
          {children}
        </BottomSheetView>
      </BottomSheet>
      {/* </BottomSheetModal> */}
    </Fragment>
  );
};

export default ModalDriverInitTravel;
