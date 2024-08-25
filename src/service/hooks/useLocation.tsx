import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Coordinates } from "../../interfaces/InterfaceLocation";

export const useLocation = () => {
  const [location, setLocation] = useState<Coordinates>({
    latitude: 0,
    longitude: 0,
  });
  const [hasLocation, setHasLocation] = useState(false);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setHasLocation(true)
    })();
  }, []);

  return {
    location,
    hasLocation,
  };
};

const styles = StyleSheet.create({});
