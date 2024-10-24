import radigoApi from "../../api/radigoApi";
import axios from 'axios';
import {
  DataTravel,
  GetTravelsByUserLoggedResponse,
  INewTravel,
  ITravels,
  InterfaceQuality,
  InterfaceTravelById,
  PostTravelResponse,
  ResponseCostTravel,
  ResponseGetTravelByID,
  ResponsePutTravel,
  ResponseTravelsByDriver,
} from "../../interfaces/ITravel";
import { LatLng } from "react-native-maps";
import { GOOGLE_API_KEY } from "../helpers/constants";
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useTravel = () => {
  const postTravel = (data: INewTravel): Promise<PostTravelResponse> => {
    return new Promise((resolve, reject) => {
      radigoApi
        .post<PostTravelResponse>("/travel", data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => reject(error));
    });
  };

  const getTravelRequestToDayDriver = async () => {
    try {
      const { data } = await radigoApi.get<ResponseTravelsByDriver>(
        `/travel/request`
      );

      console.log(`RESULT => ${data}`);
      

      return data;
    } catch (error) {
      console.log(error);
      throw new Error("error!");
      
    }

    // const resp = await radigoApi.get<ResponseTravelsByDriver>(
    //   `/travel/request`
    // );
    // return resp.data;
  };

  const putTravel = async (
    status: "accept" | "complete" | "cancel" | "traveling",
    id: number
  ) => {
    const resp = await radigoApi.put<ResponsePutTravel>(
      `/travel/${status}/${id}`
    );
    return resp.data;
  };

  const putTravelComplete = async (
    id: number,
    dataTravel: {
      price: number;
      km: number;
      time: number;
    }
  ) => {
    const resp = await radigoApi.put<ResponsePutTravel>(
      `/travel/complete/${id}`,
      dataTravel
    );
    return resp.data;
  };

  const getTravelbyID = async (id: number) => {
    const resp = await radigoApi.get<ResponseGetTravelByID>(`/travel/${id}`);
    return resp.data;
  };

  const qualityTravel = async (data: InterfaceQuality) => {
    const resp = await radigoApi.post(`/travel/quality`, data);
    return resp.data;
  };

  const getCostTravel = async (km:number, time:number ) => {
    const resp = await radigoApi.get<ResponseCostTravel>(`/travel/cost/${km}/${time}` );
    return resp.data;
  };


  const getTravelsByUserLogged = (data: ITravels
    ): Promise<GetTravelsByUserLoggedResponse> => {
    return new Promise((resolve, reject) => {
      radigoApi
        .post<GetTravelsByUserLoggedResponse>("/travel/user", data)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getDataDistanceAndTime = async(location:LatLng) => {
    const travelStorage = await AsyncStorage.getItem('travelStorage')
    if (travelStorage) {
      const dataLocal: InterfaceTravelById = JSON.parse(travelStorage)
      if (dataLocal.status_id === 1 || dataLocal.status_id === 2){

        return new Promise((resolve, reject) => {
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          })
            .then((currentLocationPromise) => {
              if (!currentLocationPromise) return reject("Error: No se pudo obtener la ubicación actual.");
      
              const { latitude, longitude } = currentLocationPromise.coords;
              const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${location.latitude},${location.longitude}&destination=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
      
              axios
                .get(url)
                .then((response) => {
                  // La respuesta de la API contiene la información de la ruta, incluida la distancia y el tiempo estimado
                  const route = response.data.routes[0];
                  const distanceInMeters = route.legs.reduce((total:any, leg:any) => total + leg.distance.value, 0);
                  const timeInSeconds = route.legs.reduce((total:any, leg:any) => total + leg.duration.value, 0);
      
                  // Aquí puedes hacer lo que necesites con la distancia y el tiempo estimado
                  const distanceInKm = distanceInMeters / 1000;
                  const timeInHours = timeInSeconds / 3600;
                  resolve({
                    distance: distanceInKm,
                    time: timeInHours,
                  });
                })
                .catch((error) => {
                  reject("Error al obtener la ruta: " + error);
                });
            })
            .catch((error) => {
              reject("Error al obtener la ubicación actual: " + error);
            });
        });
      } 
    }
  };
  

  return {
    getCostTravel,
    postTravel,
    getTravelRequestToDayDriver,
    putTravel,
    getTravelbyID,
    qualityTravel,
    putTravelComplete,
    getTravelsByUserLogged,
    getDataDistanceAndTime
  };
};

export default useTravel;
