import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import MapView, {
  Marker,
  LatLng,
  MapTypes,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_API_KEY } from "../../service/helpers/constants";
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from "../../theme/globalStyles";

export interface ILocationMarker {
  title?: string;
  desctiption?: string;
  draggable?: boolean;
  latLng?: LatLng;
  onDragEnd?: (event: LatLng, index: number) => void;
  pinColor?: string;
}

interface Props {
  locations?: ILocationMarker[];
  showCurrentLocation?: boolean;
  styleContainerMap?: ViewStyle;
  currentLocationProps?: ILocationMarker;
  showBuildings?: boolean;
  showTraffic?: boolean;
  mapType?: MapTypes;
  showDirections?: boolean;
  onDragEndMarker?: (event: LatLng, index: number) => void;
  colorizeLocations?: boolean;
  customIcons?: boolean;
}

export const MapLocation = ({
  locations,
  showCurrentLocation,
  styleContainerMap,
  currentLocationProps = { title: "Mi ubicación" },
  mapType,
  showBuildings,
  showTraffic,
  showDirections,
  onDragEndMarker,
  colorizeLocations = false,
  customIcons,
}: Props) => {
  //? HOOKS
  // const { getCurrentLocation } = useLocation();

  //? STATES
  const [currentLocation, setCurrentLocation] = useState<LatLng>({
    latitude: 44,
    longitude: -80,
  });
  const [LocationsList, setLocationsList] = useState<ILocationMarker[]>([]);

  const getLocation = async () => {
    // const resp = await getCurrentLocation();
    // if (resp) {
    //   setCurrentLocation({
    //     latitude: resp.latitude,
    //     longitude: resp.longitude,
    //   });
    // }
  };

  useEffect(() => {
    if (showCurrentLocation) {
      getLocation();
    }
  }, [showCurrentLocation]);

  useEffect(() => {
    if (locations) setLocationsList(locations);
  }, [locations]);

  return (
    <View style={{ ...styles.containerMap, ...styleContainerMap }}>
      <MapView
        showsBuildings={showBuildings}
        showsTraffic={showTraffic}
        loadingIndicatorColor={SECONDARY_COLOR}
        style={{ flex: 1 }}
        loadingEnabled={true}
        region={{
          latitude: currentLocationProps.latLng
            ? currentLocationProps.latLng?.latitude
            : showCurrentLocation
            ? currentLocation.latitude
            : LocationsList.length > 0
            ? LocationsList[0].latLng?.latitude!
            : 0,
          longitude: currentLocationProps.latLng
            ? currentLocationProps.latLng?.longitude
            : showCurrentLocation
            ? currentLocation.longitude
            : LocationsList.length > 0
            ? LocationsList[0].latLng?.longitude!
            : 0,
          latitudeDelta: 0.009,
          longitudeDelta: showCurrentLocation
            ? 0.009
            : LocationsList.length > 0
            ? 0.06
            : 0,
        }}
      >
        {showCurrentLocation && (
          <Marker
            pinColor={currentLocationProps.pinColor}
            title={currentLocationProps.title}
            description={currentLocationProps.desctiption}
            coordinate={currentLocationProps.latLng || currentLocation}
            draggable={currentLocationProps.draggable}
            onDragEnd={(e) =>
              currentLocationProps.onDragEnd
                ? currentLocationProps.onDragEnd(e.nativeEvent.coordinate, -1)
                : {}
            }
          />
        )}
        {LocationsList.map((el, index) => {
          return (
            <Marker
              pinColor={
                customIcons
                  ? undefined
                  : el.pinColor
                  ? el.pinColor
                  : colorizeLocations
                  ? index === 0
                    ? undefined
                    : index === LocationsList.length - 1
                    ? "#0f6"
                    : "#06f"
                  : undefined
              }
              key={index}
              title={el.title}
              description={el.desctiption}
              draggable={el.draggable}
              coordinate={el.latLng!}
              onDragEnd={(e) =>
                onDragEndMarker
                  ? onDragEndMarker(e.nativeEvent.coordinate, index)
                  : {}
              }
            >
              {customIcons ? (
                index === 0 ? (
                  <View style={{ width: 30, height: 30 }}>
                    <Image
                      source={require("../../assets/images/Home.png")}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="contain"
                    />
                  </View>
                ) : index == LocationsList.length - 1 ? (
                  <View style={{ width: 30, height: 30 }}>
                    <Image
                      source={require("../../assets/images/logo.png")}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <View style={{ width: 30, height: 30 }}>
                    <Image
                      source={require("../../assets/images/slide1.png")}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="contain"
                    />
                  </View>
                )
              ) : null}
            </Marker>
          );
        })}
        {showDirections &&
          LocationsList.map((el, index) => (
            <MapViewDirections
              key={index}
              apikey={GOOGLE_API_KEY}
              origin={el.latLng}
              strokeColor={PRIMARY_COLOR}
              strokeWidth={3}
              destination={
                LocationsList[index + 1]
                  ? LocationsList[index + 1].latLng?.latitude === 0
                    ? el.latLng
                    : LocationsList[index + 1].latLng
                  : el.latLng
              }
            />
          ))}
      </MapView>
    </View>
  );
};
const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  containerMap: {
    width: "100%",
    height: 300,
    zIndex: 9999,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
});
