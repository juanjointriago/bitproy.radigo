import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_HOST } from "../service/helpers/constants";


export const baseURL = `${API_HOST}/api/app`;
const radigoApi = axios.create({ baseURL });

radigoApi.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

export default radigoApi;
