import React, { useEffect, useRef, useState, useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import * as Location from "expo-location";
import MapDriverBtns from "../other/MapDriverBtns";
import { TravelContext, travelInitialState } from '../../contexts/Travel/TravelContext';
import Geocoder from "react-native-geocoding";
import { GOOGLE_API_KEY } from "../../service/helpers/constants";
import { Dimensions } from "react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SocketContext } from "../../contexts/sockets/SocketContext";
import { calculateDistanceKm } from "../../service/helpers/geocoder";
import haversine from "haversine";
import axios from "axios";
import useTravel from "../../service/hooks/useTravel";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../../theme/globalStyles";

const { width, height } = Dimensions.get("window");

interface Props {
  btnSos: () => void;
  btnChat: () => void;
  btnChatAdmin: () => void;
  btnStateTypeTravel: (res: boolean) => void;
  funcOnPress?: () => void;
  img: string;
  stateTypeTravel: boolean;
  newMessage: boolean;
  dataAproxLocationDriver: (res: { time: number; distance: number }) => void;
  updateLocationUserFunc: boolean
}

export const MapCitizen = ({
  btnSos,
  btnChat,
  img,
  btnStateTypeTravel,
  stateTypeTravel,
  dataAproxLocationDriver,
  newMessage,
  btnChatAdmin,
  funcOnPress,
  updateLocationUserFunc
}: Props) => {
  Geocoder.init(GOOGLE_API_KEY);
  const { dataTravelContext, changeTravel } = useContext(TravelContext);
  const { getDataDistanceAndTime } = useTravel();
  const [stateNavigation, setStateNavigation] = useState(false);
  const mapRef = useRef<MapView>(null);

  const [markerAddress, setMarkerAddress] = useState("");
  const [markerCoordinate, setMarkerCoordinate] = useState(null);

  const [userLocation, setUserLocation] = useState<LatLng>({
    longitude: 0,
    latitude: 0,
  });

  const [locationTracking, setLocationTracking] = useState<LatLng>({
    longitude: 0,
    latitude: 0,
  });

  const navigationActiveRef = useRef(false);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    onListenTracking();
  }, [socket]);

  useEffect(() => {
    getCurrentLocation();
  }, [updateLocationUserFunc]);

  const getCurrentLocation = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.LocationAccuracy.Low,
    });
    if (currentLocation) {
      setUserLocation((prev) => ({
        ...prev,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      }));

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        });
      }

      if (dataTravelContext.dataTravel.status_id !== 0) return;

      const res = await Geocoder.from(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

      const address = res.results[0].formatted_address;
      changeTravel({
        ...dataTravelContext.dataTravel,
        address_user: address,
        lat_user: currentLocation.coords.latitude,
        lng_user: currentLocation.coords.longitude,
      });
    }
  };

  const handleCenterMap = async () => {
    getCurrentLocation();
    navigationActiveRef.current = false;
  };

  const handleMarkerDragUser = async (e: any) => {
    const newCoordinate = e.nativeEvent.coordinate;
    // Obtener la dirección a partir de las nuevas coordenadas del marcador
    if (dataTravelContext.dataTravel.status_id !== 0) return;
    try {
      const res = await Geocoder.from(
        newCoordinate.latitude,
        newCoordinate.longitude
      );
      const address = res.results[0].formatted_address;
      setMarkerAddress(address);
      setMarkerCoordinate(newCoordinate);

      // Pasar las coordenadas actualizadas al componente padre
      changeTravel({
        ...dataTravelContext.dataTravel,
        address_user: address,
        lat_user: newCoordinate.latitude,
        lng_user: newCoordinate.longitude,
      });
    } catch (error) {
      console.error("Error al obtener la dirección:", error);
    }
  };

  const handleMarkerDragEnd = async (e: any) => {
    const newCoordinate = e.nativeEvent.coordinate;
    // Obtener la dirección a partir de las nuevas coordenadas del marcador
    if (dataTravelContext.dataTravel.status_id !== 0) return;
    try {
      const res = await Geocoder.from(
        newCoordinate.latitude,
        newCoordinate.longitude
      );
      const address = res.results[0].formatted_address;
      setMarkerAddress(address);
      setMarkerCoordinate(newCoordinate);

      // Pasar las coordenadas actualizadas al componente padre
      changeTravel({
        ...dataTravelContext.dataTravel,
        address_end: address,
        lat_end: newCoordinate.latitude,
        lng_end: newCoordinate.longitude,
      });
    } catch (error) {
      console.error("Error al obtener la dirección:", error);
    }
  };

  const onListenTracking = () => {
    try {
      socket!.on(
        `listen-tracking-travel`,
        async (res: { lat: number; lng: number }) => {
          setLocationTracking({ latitude: res.lat, longitude: res.lng });
          const data: any = await getDataDistanceAndTime({
            latitude: res.lat,
            longitude: res.lng,
          });

          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: res.lat,
              longitude: res.lng,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,
            });
          }

          if (data === undefined) return;
          dataAproxLocationDriver({
            distance: data.distance,
            time: data.time,
          });
        }
      );
    } catch (error) { }
  };

  return (
    <View style={styles.container}>
      <>
        <MapDriverBtns
          btnChatAdmin={btnChatAdmin}
          newMessage={newMessage}
          arrived={false}
          stateTypeTravelBtn={stateTypeTravel}
          btnStateTypeTravel={(res: boolean) => btnStateTypeTravel(res)}
          btnChat={btnChat}
          statusClient={true}
          navigationState={stateNavigation}
          btnSos={btnSos}
          btnNavigation={handleCenterMap}
        />
        <MapView
          ref={mapRef}
          style={styles.map}
          showsMyLocationButton={false}
          showsCompass={false}
          provider={"google"}

          onTouchStart={funcOnPress}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.009,
            longitudeDelta: 0.009,
          }}
        >
          {dataTravelContext.dataTravel.status_id === 0 && (
            <>
              <Marker
                coordinate={{
                  latitude:
                    dataTravelContext.dataTravel.lat_user ||
                    userLocation.latitude,
                  longitude:
                    dataTravelContext.dataTravel.lng_user ||
                    userLocation.longitude,
                }}
                draggable={true}
                onDragEnd={handleMarkerDragUser}
              >
                <View
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 100,
                    borderColor: "#5CBCF8",
                    borderWidth: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{
                      uri:
                        img !== undefined
                          ? img
                          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                    }}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 100,
                      backgroundColor: "white",
                    }}
                    resizeMode="contain"
                  />
                </View>
              </Marker>

              {dataTravelContext.dataTravel.lat_end !== 0 && (
                <Marker
                  coordinate={{
                    latitude: dataTravelContext.dataTravel.lat_end,
                    longitude: dataTravelContext.dataTravel.lng_end,
                  }}
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                >
                    {dataTravelContext.dataTravel.type_service_id === 1 ?

                      <Ionicons name="location" size={40} color={PRIMARY_COLOR} />
                      :
                      <FontAwesome5 name="box-open" size={40} color={"#5CBCF8"} />

                    }

                </Marker>
              )}

              {dataTravelContext.dataTravel.id === 0 &&
                dataTravelContext.dataTravel.lat_end !== 0 && (
                  <MapViewDirections
                    apikey={GOOGLE_API_KEY}
                    origin={{
                      latitude: dataTravelContext.dataTravel.lat_user,
                      longitude: dataTravelContext.dataTravel.lng_user,
                    }}
                    strokeColor={"red"}
                    strokeWidth={5}
                    destination={{
                      latitude: dataTravelContext.dataTravel.lat_end,
                      longitude: dataTravelContext.dataTravel.lng_end,
                    }}
                    resetOnChange={false}
                    onReady={(res: any) => {
                      changeTravel({
                        ...dataTravelContext.dataTravel,
                        distance: res.distance,
                        time: res.duration,
                      });
                      mapRef?.current?.fitToCoordinates(res?.coordinates, {
                        edgePadding: {
                          right: width / 20,
                          bottom: height / 20,
                          left: width / 10,
                          top: height / 20,
                        },
                        animated: true,
                      });
                    }}
                  />
                )}
            </>
          )}

          {(dataTravelContext.dataTravel.status_id === 1 ||
            dataTravelContext.dataTravel.status_id === 2 ||
            dataTravelContext.dataTravel.status_id === 5) && (
              <>
                <Marker
                  coordinate={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  }}
                  draggable={false}
                >
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 100,
                      borderColor: "#5CBCF8",
                      borderWidth: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{
                        uri:
                          img !== undefined
                            ? img
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                      }}
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 100,
                        backgroundColor: "white",
                      }}
                      resizeMode="contain"
                    />
                  </View>
                </Marker>

                {locationTracking.latitude !== 0 && (
                  <Marker coordinate={locationTracking}>
                    <Image
                      resizeMode="contain"
                      source={require("../../assets/icons/car.png")}
                      style={{ height: 90, width: 90 }}
                    />
                  </Marker>
                )}
              </>
            )}
        </MapView>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 28,
  },

  map: {
    width: "100%",
    height: "100%",
  },
});
