import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import TextModal from "../../Text/TextModal";
import {
  ALERT,
  INPUT1,
  INPUT2,
  PRIMARY_COLOR,
  globalStyles,
} from "../../../theme/globalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Autocompleted } from "../../map/inputAddress/Autocompleted";
import CheckboxBtn from "../../check/CheckboxBtn";
import { FontAwesome } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { InputText } from "../../input/InputText";
import { useForm } from "../../../service/hooks/useForm";
import { useAlerts } from "../../../service/hooks/useAlerts";
import { ErrorMessage } from "../../../components/other/ErrorMessage";
import { INewTravel, InterfaceTravelById } from "../../../interfaces/ITravel";
import useTravel from "../../../service/hooks/useTravel";
import { InputArea } from "../../input/InputArea";
import { SocketContext } from "../../../contexts/sockets/SocketContext";
import { TravelContext } from "../../../contexts/Travel/TravelContext";
import { AuthContext } from "../../../contexts/Auth/AuthContext";
import { Text } from "react-native";
import { ModalLoading } from "../ModalLoading";
import Geocoder from "react-native-geocoding";
import { GOOGLE_API_KEY } from "../../../service/helpers/constants";
import { SimpleLineIcons } from "@expo/vector-icons";
// import DeviceInfo from "react-native-device-info";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
interface Props {
  state: any;
  close: (res: number) => void;
  snapPoints: any;
  stateTypeTravel: boolean;
  updateStateTravelModal: (status: boolean) => void;
  updateLocationUserFunc: () => void;
}
const ModalCreateRequest = ({
  state,
  close,
  snapPoints,
  stateTypeTravel,
  updateStateTravelModal,
  updateLocationUserFunc,
}: Props) => {
  Geocoder.init(GOOGLE_API_KEY);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const { socket } = useContext(SocketContext);
  const { changeTravel, dataTravelContext, removeTravel } =
    useContext(TravelContext);
  const { user } = useContext(AuthContext);
  const { confirmAlert, showAlert, toast } = useAlerts();
  const { postTravel, getCostTravel } = useTravel();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [statusOpenModal, setStatusOpenModal] = useState(false);
  const [statusCompleted, setStatusCompleted] = useState(false);
  const [statusCompleted2, setStatusCompleted2] = useState(false);

  const {
    type_service_id,
    time,
    order_description,
    price,
    distance,
    number_house,
    reference,
    extras,
    onChange,
    form,
    setFormValue,
  } = useForm({
    type_service_id: 1,
    time: 5,
    order_description: "",
    price: 10,
    distance: 50,
    number_house: "",
    reference: "",
    extras: [],
  });

  const [errors, setErrors] = useState({
    order_description: false,
    reference: false,
  });

  const [selectedExtras, setSelectedExtras] = useState([]);

  const handleExtrasChange = (value: any, name: any) => {
    setSelectedExtras(value);
    onChange(value, name);
  };

  const handleGoBack = () => {
    setCurrentPage(currentPage - 1);
    if (currentPage === 2) {
      changeTravel({
        ...dataTravelContext.dataTravel,
        lat_end: 0,
        lng_end: 0,
        address_end: "",
      });
    }
  };

  useEffect(() => {
    handleSheetChanges(state);
  }, [state]);

  const handleTravel = async () => {
    setLoading(true);

    const dataTravelCostTravel = {
      time: parseInt(dataTravelContext.dataTravel.time.toFixed()),
      distance: parseInt(dataTravelContext.dataTravel.distance.toFixed()),
    };

    const dataPriceTravel = await getCostTravel(
      dataTravelCostTravel.distance,
      dataTravelCostTravel.time
    );

    const data: INewTravel = {
      type_service_id: !stateTypeTravel ? 1 : 2,
      address_end: dataTravelContext.dataTravel.address_end,
      address_user: dataTravelContext.dataTravel.address_user,
      order_description: form.order_description,
      number_house: form.number_house,
      reference: form.reference,
      time: parseInt(dataTravelContext.dataTravel.time.toFixed()),
      price: dataPriceTravel.data.costTotal,
      distance: parseInt(dataTravelContext.dataTravel.distance.toFixed()),
      lng_user: dataTravelContext.dataTravel.lng_user,
      lat_user: dataTravelContext.dataTravel.lat_user,
      lng_end: dataTravelContext.dataTravel.lng_end,
      lat_end: dataTravelContext.dataTravel.lat_end,
      extras: form.extras,
    };
    postTravel(data)
      .then(async (res) => {
        setLoading(false);
        const data: InterfaceTravelById = {
          id: res.data.id,
          // uid: uniqueDeviceId,
          lng_user: res.data.lng_user,
          lng_end: res.data.lng_end,
          lat_user: res.data.lat_user,
          lat_end: res.data.lat_end,
          time: res.data.time,
          price: res.data.price,
          distance: res.data.distance,
          extras: res.data.extras,
          status_id: 1,
          client: {
            full_name: user!.full_name!,
            id: user!.id!,
            phone: user!.phone!,
            photo: user!.photo!,
            stars: 0,
          },
          driver: { full_name: "", id: 0, phone: "", photo: "", stars: 0 },
          type_service_id: res.data.type_service_id,
          address_end: res.data.address_end,
          address_user: res.data.address_user,
          order_description: res.data.order_description,
          number_house: res.data.number_house.toString(),
          reference: res.data.reference,
          car: { color: "", id: 0, model: "", plate: 0 },
        };
        toast(res.msg, "SUCCESS");
        changeTravel(data);
        socket.emit("new-travel", { idTravel: res.data.id, times: 1 });
      })
      .catch(async (err: any) => {
        setLoading(false);
        toast(err?.response.data || "Error, algo salio mal", "DANGER");
      });
  };

  const handleSheetChanges = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
    if (index === 1) {
      close(1);
      setStatusOpenModal(false);
    } else {
      setStatusOpenModal(true);
    }
    if (index === 0) {
      close(0);
    }
  }, []);

  const CustomHandleComponent = () => (
    <TouchableOpacity
      style={{ alignItems: "center", justifyContent: "center", height: 40 }}
      onPress={() => {
        statusOpenModal ? handleSheetChanges(1) : handleSheetChanges(0);
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

  /*   console.log('statusCompleted', statusCompleted)
  console.log('statusCompleted2', statusCompleted2) */

  return (
    <>
      {/* <BottomSheet
        handleComponent={CustomHandleComponent}
        backgroundStyle={{
          flex:1,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderTopColor: "#CFCFCF",
          borderEndColor: "#CFCFCF",
          borderStartColor: "#CFCFCF",
          borderTopWidth: 1,
          borderEndWidth: 0.5,
          borderStartWidth: 0.5,
          backgroundColor: "rgba(255, 255, 255, 0.95) ",
        }}
        index={1}
        ref={bottomSheetRef}
        snapPoints={useMemo(() => [...snapPoints], [snapPoints])}
        onChange={handleSheetChanges}
      > */}
      <Modal
        style={{
          flex: 1,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderTopColor: "#CFCFCF",
          borderEndColor: "#CFCFCF",
          borderStartColor: "#CFCFCF",
          borderTopWidth: 1,
          borderEndWidth: 0.5,
          borderStartWidth: 0.5,
          backgroundColor: "rgba(255, 255, 255, 0.95) ",
        }}
        animationType="slide"
        visible={statusOpenModal}
        onPointerDownCapture={(e) => {
          console.debug("onPointerDownCapture", e);
        }}
        onPointerDown={(e) => {
          console.debug("onPointerDown", e);
        }}
      >
        {/* <BottomSheetView style={{flex:1}}> */}
        <CustomHandleComponent />
        <View
          style={{
            width: "100%",
            height: "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ModalLoading visible={loading} />

          {currentPage && (
            <>
              {(() => {
                switch (currentPage) {
                  case 1:
                    return (
                      <View
                        style={{
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ width: "100%", height: 50 }}>
                          <TextModal
                            text="Selecciona tu servicio"
                            styleTitle={{
                              marginVertical: 10,
                              marginLeft: 20,
                            }}
                          />
                        </View>

                        <View
                          style={{
                            width: "90%",
                            height: "100%",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              stateTypeTravel && updateStateTravelModal(false);
                              form.type_service_id = stateTypeTravel ? 2 : 1;
                              setCurrentPage(2);
                              changeTravel({
                                ...dataTravelContext.dataTravel,
                                type_service_id: 1,
                              });
                            }}
                            style={{
                              width: "100%",
                              height: 60,
                              backgroundColor: stateTypeTravel
                                ? "#C0D0EB"
                                : PRIMARY_COLOR,
                              borderRadius: 10,
                              flexDirection: "row",
                              marginBottom: 10,
                            }}
                          >
                            <View
                              style={{
                                width: "80%",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  ...globalStyles.TitleSecondary,
                                  color: "#444444",
                                  left: 15,
                                }}
                              >
                                "Pedir taxi (Viajar)"
                              </Text>
                              <Text
                                style={{
                                  left: 50,
                                  color: INPUT2,
                                  fontSize: 12,
                                  fontFamily: "PoppinsRegular",
                                }}
                              >
                                Aproximadamente 2 min
                              </Text>
                            </View>

                            <View
                              style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {stateTypeTravel ? undefined : (
                                <MaterialCommunityIcons
                                  name="car-select"
                                  size={35}
                                  color="black"
                                />
                              )}
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              !stateTypeTravel && updateStateTravelModal(true);
                              form.type_service_id = stateTypeTravel ? 2 : 1;
                              setCurrentPage(2);
                              changeTravel({
                                ...dataTravelContext.dataTravel,
                                type_service_id: 2,
                              });
                            }}
                            style={{
                              width: "100%",
                              height: 60,
                              backgroundColor: !stateTypeTravel
                                ? "#C0D0EB"
                                : INPUT1,
                              borderRadius: 10,
                              flexDirection: "row",
                            }}
                          >
                            <View
                              style={{
                                width: "80%",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  ...globalStyles.TitleSecondary,
                                  color: "#444444",
                                  left: 15,
                                }}
                              >
                                "Pedir taxi (Encargo)"
                              </Text>
                              <Text
                                style={{
                                  left: 50,
                                  color: INPUT2,
                                  fontSize: 12,
                                  fontFamily: "PoppinsRegular",
                                }}
                              >
                                Aproximadamente 2 min
                              </Text>
                            </View>

                            <View
                              style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {!stateTypeTravel ? undefined : (
                                <MaterialCommunityIcons
                                  name="car-select"
                                  size={35}
                                  color="black"
                                />
                              )}
                            </View>
                          </TouchableOpacity>

                          {/*    <View style={{ width: '100%', marginTop: 120 }}>
                            <BtnPrimary
                              title="Siguienfdsfdte"
                              func={async () => {
                                form.type_service_id = stateTypeTravel ? 2 : 1

                                setCurrentPage(2)
                              }}
                              styleBtn={{
                                width: '100%',
                                height: 50,
                                backgroundColor: stateTypeTravel
                                  ? INPUT1
                                  : PRIMARY_COLOR,
                              }}
                              styleTitle={{
                                color: stateTypeTravel
                                  ? 'white'
                                  : SECONDARY_COLOR,
                              }}
                            />
                          </View> */}
                        </View>
                      </View>
                    );
                  case 2:
                    return (
                      <View style={{ height: "100%", width: "100%" }}>
                        <TouchableOpacity
                          onPress={updateLocationUserFunc}
                          style={{
                            right: 20,
                            width: 40,
                            height: 60,
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 9999,
                          }}
                        >
                          <MaterialIcons
                            name="location-history"
                            size={35}
                            color={stateTypeTravel ? INPUT1 : PRIMARY_COLOR}
                          />
                        </TouchableOpacity>
                        {stateTypeTravel ? (
                          <>
                            <View
                              style={{
                                marginTop: 20,
                                height: 100,
                                zIndex: 999,
                              }}
                            >
                              <TextModal
                                text={"¿A donde lo entregamos?"}
                                styleTitle={{
                                  left: 20,
                                }}
                              />

                              <Autocompleted
                                iconColor="green"
                                autofocus={true}
                                textInputProps={setStatusCompleted2}
                                address={
                                  dataTravelContext.dataTravel.address_user
                                }
                                onpress={(
                                  data: GooglePlaceData,
                                  detail: GooglePlaceDetail | null
                                ) => {
                                  setStatusCompleted(true);
                                  setStatusCompleted2(false);
                                  changeTravel({
                                    ...dataTravelContext.dataTravel,
                                    address_user: data.description,
                                    lat_user: detail!.geometry.location.lat,
                                    lng_user: detail!.geometry.location.lng,
                                  });
                                }}
                              />
                            </View>

                            <View
                              style={{
                                height: 100,
                                zIndex: 998,
                              }}
                            >
                              <TextModal
                                text={
                                  stateTypeTravel
                                    ? "¿Dónde recogemos tu pedido? "
                                    : "¿Dónde estas?"
                                }
                                styleTitle={{
                                  left: 20,
                                }}
                              />
                              <Autocompleted
                                iconColor="red"
                                autofocus={true}
                                textInputProps={setStatusCompleted}
                                address={
                                  dataTravelContext.dataTravel.address_end
                                }
                                onpress={(
                                  data: GooglePlaceData,
                                  detail: GooglePlaceDetail | null
                                ) => {
                                  setStatusCompleted2(true);
                                  setStatusCompleted(false);
                                  changeTravel({
                                    ...dataTravelContext.dataTravel,
                                    address_end: data.description,
                                    lat_end: detail!.geometry.location.lat,
                                    lng_end: detail!.geometry.location.lng,
                                  });
                                }}
                              />
                            </View>
                          </>
                        ) : (
                          <>
                            <View
                              style={{
                                marginTop: 20,
                                height: 100,
                                zIndex: 999,
                              }}
                            >
                              <TextModal
                                text={"¿Dónde estas?"}
                                styleTitle={{
                                  left: 20,
                                }}
                              />
                              <Autocompleted
                                iconColor="red"
                                autofocus={true}
                                textInputProps={setStatusCompleted2}
                                address={
                                  dataTravelContext.dataTravel.address_user
                                }
                                onpress={(
                                  data: GooglePlaceData,
                                  detail: GooglePlaceDetail | null
                                ) => {
                                  setStatusCompleted(true);
                                  setStatusCompleted2(false);
                                  changeTravel({
                                    ...dataTravelContext.dataTravel,
                                    address_user: data.description,
                                    lat_user: detail!.geometry.location.lat,
                                    lng_user: detail!.geometry.location.lng,
                                  });
                                }}
                              />
                            </View>

                            <View
                              style={{
                                height: 100,
                                zIndex: 998,
                              }}
                            >
                              <TextModal
                                text={
                                  stateTypeTravel
                                    ? "¿A donde lo entregamos?"
                                    : "¿Dónde viajas? (opcional)"
                                }
                                styleTitle={{
                                  left: 20,
                                }}
                              />

                              <Autocompleted
                                iconColor="green"
                                autofocus={true}
                                textInputProps={setStatusCompleted}
                                address={
                                  dataTravelContext.dataTravel.address_end
                                }
                                onpress={(
                                  data: GooglePlaceData,
                                  detail: GooglePlaceDetail | null
                                ) => {
                                  setStatusCompleted2(true);
                                  setStatusCompleted(false);
                                  changeTravel({
                                    ...dataTravelContext.dataTravel,
                                    address_end: data.description,
                                    lat_end: detail!.geometry.location.lat,
                                    lng_end: detail!.geometry.location.lng,
                                  });
                                }}
                              />
                            </View>
                          </>
                        )}
                        <View
                          style={{
                            alignItems: "center",
                            position: "absolute",
                            width: "100%",
                            top: statusOpenModal ? undefined : 310,
                            bottom: statusOpenModal ? 20 : undefined,
                          }}
                        >
                          <View
                            style={{
                              width: "90%",
                              height: 50,

                              flexDirection: "row",
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                borderRadius: 10,
                                marginHorizontal: 10,
                                width: "20%",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "black",
                              }}
                              onPress={() => {
                                handleGoBack();
                              }}
                            >
                              <Ionicons
                                name="arrow-back"
                                size={35}
                                color={"white"}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => {
                                console.log('PRESS IN!!');

                                if(dataTravelContext.dataTravel.lat_user === 0 || dataTravelContext.dataTravel.lng_end === 0) {
                                  toast(
                                    "Completa las direcciones",
                                    "DANGER"
                                  );
                                  console.log('should appear toast!!');
                                }else {
                                  setCurrentPage(3);
                                }

                                // if (!stateTypeTravel) {
                                //   if(dataTravelContext.dataTravel.lat_user === 0) {
                                //     toast(
                                //       "Sin dirección de origen",
                                //       "DANGER"
                                //     );
                                //   }else {
                                //     setCurrentPage(3);
                                //   }
                                //   // dataTravelContext.dataTravel.lat_user === 0
                                //   //   ? toast(
                                //   //     "Sin dirección de origen",
                                //   //     "DANGER"
                                //   //   )
                                //   //   : setCurrentPage(3);
                                // } else {
                                //   dataTravelContext.dataTravel.lat_user ===
                                //     0 ||
                                //     dataTravelContext.dataTravel.lng_end === 0
                                //     ? toast(
                                //       "Completa las dirrecciones",
                                //       "DANGER"
                                //     )
                                //     : setCurrentPage(3);
                                // }
                              }}
                              style={{
                                borderRadius: 10,
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: stateTypeTravel
                                  ? INPUT1
                                  : PRIMARY_COLOR,
                              }}
                            >
                              <Text style={{ ...globalStyles.TitleSecondary }}>
                                Siguiente
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  case 3:
                    return (
                      <View
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            marginHorizontal: 20,
                            marginTop: 10,
                          }}
                        >
                          <TextModal
                            text={
                              stateTypeTravel
                                ? "Tu pedido esta en: "
                                : "¿Dónde estas?"
                            }
                          />
                          <InputText
                            value={dataTravelContext.dataTravel.address_user}
                            styleText={{
                              height: 48,
                              backgroundColor: "#D3D3D3",
                            }}
                            styleTextInput={styles.styletextInput}
                            editable={false}
                          />

                          <TextModal
                            text="Número de casa"
                            styleView={{ top: -4 }}
                          />

                          <InputText
                            styleText={{ height: 48, top: -6 }}
                            styleTextInput={styles.styletextInput}
                            name="casa"
                            keyboardType={"numeric"}
                            maxLength={7}
                            value={number_house}
                            onChange={(value: any) =>
                              onChange(value, "number_house")
                            }
                          />

                          <TextModal
                            text=" Referencia"
                            styleView={{ top: -4 }}
                          />
                          <InputText
                            name="casa"
                            keyboardType={"default"}
                            maxLength={35}
                            value={reference}
                            styleText={{ height: 48, top: -6 }}
                            styleTextInput={styles.styletextInput}
                            onChange={(value: any) =>
                              onChange(value, "reference")
                            }
                          />

                          <ErrorMessage
                            style={{
                              fontSize: 14,
                              color: ALERT,
                              top: 5,
                              marginTop: screenHeight > 700 ? -12 : -10,
                            }}
                            message="Verifica esté campo."
                            status={errors.reference}
                          />

                          <View
                            style={{
                              alignItems: "center",
                              marginTop: 40,
                              width: "100%",
                              top: statusOpenModal ? undefined : 240,
                              bottom: statusOpenModal ? 20 : undefined,
                              position: "absolute",
                            }}
                          >
                            <View
                              style={{
                                width: "100%",
                                height: 50,
                                flexDirection: "row",
                              }}
                            >
                              <TouchableOpacity
                                style={{
                                  width: "20%",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  backgroundColor: "black",
                                  borderRadius: 10,
                                  marginHorizontal: 10,
                                }}
                                onPress={() => {
                                  handleGoBack();
                                }}
                              >
                                <Ionicons
                                  name="arrow-back"
                                  size={35}
                                  color={"white"}
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  if (!stateTypeTravel) {
                                    setCurrentPage(4);
                                  } else {
                                    const newErrors = {
                                      reference: false,
                                      order_description: false,
                                    };
                                    if (form.reference === "") {
                                      if (reference === "") {
                                        newErrors.reference = true;
                                      }
                                      setErrors(newErrors);
                                    } else {
                                      newErrors.reference = false;
                                      setErrors(newErrors);
                                      setCurrentPage(4);
                                    }
                                  }
                                }}
                                style={{
                                  flex: 1,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: stateTypeTravel
                                    ? INPUT1
                                    : PRIMARY_COLOR,
                                  borderRadius: 10,
                                }}
                              >
                                <Text
                                  style={{ ...globalStyles.TitleSecondary }}
                                >
                                  Siguiente
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  case 4:
                    return (
                      <>
                        <View
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              marginHorizontal: 20,
                              marginTop: 10,
                            }}
                          >
                            <TextModal
                              text={
                                stateTypeTravel
                                  ? "¿Qué deseas pedir hoy?"
                                  : "Selecciona tu servicio (Opcional)"
                              }
                            />
                            {stateTypeTravel ? (
                              <>
                                <InputArea
                                  style={{ height: 210, marginVertical: 10 }}
                                  text="Detalla tu petición aquí"
                                  value={order_description}
                                  name="order_description"
                                  onChange={(value: any) =>
                                    onChange(value, "order_description")
                                  }
                                />
                                <ErrorMessage
                                  style={{
                                    fontSize: 14,
                                    color: ALERT,
                                    marginTop: 10,
                                    left: 10,
                                  }}
                                  message="Verifica esté campo."
                                  status={errors.order_description}
                                />
                              </>
                            ) : (
                              <View
                                style={{
                                  width: "100%",
                                  alignItems: "center",
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: "white",
                                    width: "80%",
                                    borderRadius: 15,
                                    elevation: 22,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    shadowOffset: {
                                      width: 0,
                                      height: 6,
                                    },
                                    shadowOpacity: 0.32,
                                    shadowRadius: 6.46,
                                  }}
                                >
                                  <View
                                    style={{
                                      width: "100%",

                                      flexDirection: "row",

                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <CheckboxBtn
                                      title=""
                                      onChange={handleExtrasChange}
                                      value={3}
                                      name="extras"
                                      selectedExtras={selectedExtras}
                                      description="option1"
                                      icon={
                                        <Fontisto
                                          name="paralysis-disability"
                                          size={24}
                                          color="black"
                                        />
                                      }
                                    />

                                    <CheckboxBtn
                                      title=""
                                      onChange={handleExtrasChange}
                                      value={4}
                                      name="extras"
                                      selectedExtras={selectedExtras}
                                      description="option1"
                                      icon={
                                        <FontAwesome5
                                          name="car-battery"
                                          size={24}
                                          color="black"
                                        />
                                      }
                                    />
                                  </View>

                                  <View
                                    style={{
                                      width: "100%",

                                      flexDirection: "row",

                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <CheckboxBtn
                                      onChange={handleExtrasChange}
                                      value={1}
                                      name="extras"
                                      selectedExtras={selectedExtras}
                                      description="option1"
                                      icon={
                                        <FontAwesome
                                          name="paw"
                                          size={24}
                                          color="black"
                                        />
                                      }
                                    />
                                    <CheckboxBtn
                                      onChange={handleExtrasChange}
                                      value={2}
                                      name="extras"
                                      selectedExtras={selectedExtras}
                                      description="option1"
                                      icon={
                                        <FontAwesome5
                                          name="bicycle"
                                          size={24}
                                          color="black"
                                        />
                                      }
                                    />
                                  </View>

                                  <View
                                    style={{
                                      width: "100%",

                                      flexDirection: "row",

                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <CheckboxBtn
                                      onChange={handleExtrasChange}
                                      value={5}
                                      name="extras"
                                      selectedExtras={selectedExtras}
                                      description="option1"
                                      icon={
                                        <MaterialIcons
                                          name="sports-motorsports"
                                          size={24}
                                          color="black"
                                        />
                                      }
                                    />

                                    <CheckboxBtn
                                      onChange={handleExtrasChange}
                                      value={6}
                                      name="extras"
                                      selectedExtras={selectedExtras}
                                      description="option1"
                                      icon={
                                        <SimpleLineIcons
                                          name="envelope-letter"
                                          size={24}
                                          color="black"
                                        />
                                      }
                                    />
                                  </View>
                                </View>
                              </View>
                            )}

                            <View
                              style={{
                                width: "100%",
                                height: 50,
                                flexDirection: "row",
                                top: statusOpenModal ? undefined : 240,
                                bottom: statusOpenModal ? 20 : undefined,
                                position: "absolute",
                              }}
                            >
                              <TouchableOpacity
                                style={{
                                  width: "20%",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  backgroundColor: "black",
                                  borderRadius: 10,
                                  marginHorizontal: 10,
                                }}
                                onPress={() => {
                                  handleGoBack();
                                }}
                              >
                                <Ionicons
                                  name="arrow-back"
                                  size={35}
                                  color={"white"}
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={{
                                  flex: 1,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: stateTypeTravel
                                    ? INPUT1
                                    : PRIMARY_COLOR,
                                  borderRadius: 10,
                                }}
                                onPress={() => {
                                  if (stateTypeTravel) {
                                    const newErrors = {
                                      order_description: false,
                                      number_house: false,
                                      reference: false,
                                    };
                                    if (form.order_description === "") {
                                      if (order_description === "") {
                                        newErrors.order_description = true;
                                      }
                                      setErrors(newErrors);
                                    } else {
                                      newErrors.order_description = false;
                                      setErrors(newErrors);
                                      handleTravel();
                                    }
                                  } else {
                                    handleTravel();
                                  }
                                }}
                              >
                                <Text
                                  style={{ ...globalStyles.TitleSecondary }}
                                >
                                  {stateTypeTravel ? "Enviar" : "Viajar"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </>
                    );

                  default:
                    return 1;
                }
              })()}
            </>
          )}
        </View>
        {/* </BottomSheetView> */}
        {/* </BottomSheet> */}
      </Modal>
    </>
  );
};

const thirdIndicatorStyles = {
  stepIndicatorSize: 0, // Establecer tamaño a 0 para que desaparezca
  currentStepIndicatorSize: 0, // Establecer tamaño a 0 para que desaparezca
  separatorStrokeWidth: 0, // Establecer ancho a 0 para que desaparezca
  currentStepStrokeWidth: 0, // Establecer ancho a 0 para que desaparezca
  stepStrokeWidth: 0, // Establecer ancho a 0 para que desaparezca
  stepIndicatorLabelFontSize: 0, // Establecer tamaño a 0 para que desaparezca
  currentStepIndicatorLabelFontSize: 0, // Establecer tamaño a 0 para que desaparezca
  labelColor: "transparent", // Establecer color transparente para que desaparezca
  currentStepLabelColor: "transparent", // Establecer color transparente para que desaparezca
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
  styleTitle: {
    ...globalStyles.Text6,
    top: -30,
  },
  styleBtn: {
    borderWidth: 1,
    borderColor: INPUT2,
    elevation: 999,
  },
  stylebtn: {
    marginHorizontal: 15,
    width: "92%",
    height: 43,
    top: screenHeight > 700 ? 25 : 10,
  },
  step1: {
    // backgroundColor: "red",
    marginTop: -150,
  },
  styletextInput: { right: 50, alignSelf: "center" },
});

export default ModalCreateRequest;
