import { LatLng } from "react-native-maps";
import React from "react";
import Geocoder from "react-native-geocoding";
import axios from "axios";

import { GOOGLE_API_KEY } from "./constants";

interface IData {
  address: string;
  location: LatLng;
}
interface ICalcDistance {
  location1: LatLng;
  location2: LatLng;
}
interface IProvince {
  province: string;
}

 export default function geocoder() {
  Geocoder.init(GOOGLE_API_KEY);

  const getAddress = async (
    latitude: number,
    longitude: number
  ): Promise<IData> => {
    const resp = await Geocoder.from({
      latitude,
      longitude,
    });
    const formattedAddress: string = resp.results[0].formatted_address;
    return {
      address: formattedAddress,
      location: { latitude, longitude },
    };
  };
  const getProvince = async (
    latitude: number,
    longitude: number
  ): Promise<IProvince> => {
    let formattedProvince: any = "";

    await axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      )
      .then((res) => {
        formattedProvince = res.data.results[0].address_components.find(
          (a) => a.types[0] === "administrative_area_level_1"
        );
      })
      .catch((err) => {
        console.log("No se pudo obtener la provincia");
      });

    return {
      province: formattedProvince.long_name,
    };
  };

  return {
    getAddress,
    getProvince,
  };
} 

export const calculateDistanceKm = ({
  location1,
  location2,
}: ICalcDistance): number => {
  // Convertir todas las coordenadas a radianes
  const lat1 = gradosARadianes(location1.latitude);
  const lon1 = gradosARadianes(location1.longitude);
  const lat2 = gradosARadianes(location2.latitude);
  const lon2 = gradosARadianes(location2.longitude);
  const RADIO_TIERRA_EN_KILOMETROS = 6371;
  let diferenciaEntreLongitudes = lon2 - lon1;
  let diferenciaEntreLatitudes = lat2 - lat1;
  let a =
    Math.pow(Math.sin(diferenciaEntreLatitudes / 2.0), 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.pow(Math.sin(diferenciaEntreLongitudes / 2.0), 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return RADIO_TIERRA_EN_KILOMETROS * c;
};
const gradosARadianes = (grados: any) => {
  return (grados * Math.PI) / 180;
};
