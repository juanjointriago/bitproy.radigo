export interface INewTravel {
  type_service_id: number;
  lng_user: number;
  time: number;
  order_description: string;
  address_end: string;
  address_user: string;
  price: number;
  distance: number;
  lat_user: number;
  lng_end: number;
  lat_end: number;
  number_house: string;
  reference: string;
  extras: Extras[];
}

export interface PostTravelResponse {
  ok: boolean;
  msg: string;
  data: DataTravel;
}

export interface DataTravel {
  client_id: number;
  type_service_id: number;
  status_id: number;
  lng_user: number;
  time: number;
  order_description: string;
  address_end: string;
  address_user: string;
  price: number;
  distance: number;
  lat_user: number;
  lng_end: number;
  lat_end: number;
  driver_id: null;
  id: number;
  created_at: string;
  updated_at: string;
  number_house: number;
  reference: string;
  extras: [];
}

// Generated by https://quicktype.io

export interface ResponseTravelsByDriver {
  ok: boolean;
  msg: string;
  data: Data;
}

export interface Data {
  count: number;
  travels: TravelByDriver[];
}

export interface TravelByDriver {
  id: number;
  lng_user: number;
  time: number;
  address_end: string;
  address_user: string;
  price: number;
  distance: number;
  lat_user: number;
  lng_end: number;
  lat_end: number;
  created_at: string;
  client: Client;
  extras: Extras[];
  type_service_id: number;
}

export const InitialTravelByDriver: TravelByDriver = {
  id: 0,
  lng_user: 0,
  time: 0,
  address_end: "",
  address_user: "",
  price: 0,
  distance: 0,
  lat_user: 0,
  lng_end: 2,
  lat_end: 2,
  created_at: "",
  client: { full_name: "", id: 0, phone: "", photo: "", stars: 0 },
  extras: [],
  type_service_id: 0
};

export interface Extras {
  id: number;
  extra_service_id: number;
}

export interface Client {
  id: number;
  full_name: string;
  photo: string;
}

// Generated by https://quicktype.io

export interface ResponsePutTravel {
  ok: boolean;
  msg: string;
  data: Data;
}

export interface Data {
  id: number;
}

// Generated by https://quicktype.io

export interface ResponseGetTravelByID {
  ok: boolean;
  msg: string;
  data: InterfaceTravelById;
}

export interface InterfaceTravelById {
  id: number;
  // uid?:string;
  status_id: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  lng_user: number;
  time: number;
  price: number;
  distance: number;
  lat_user: number;
  lng_end: number;
  lat_end: number;
  client: Client;
  driver: Client;
  extras: Extras[];
  type_service_id: number;
  address_end: string;
  address_user: string;
  order_description: string;
  number_house: string;
  reference: string;
  car: Car;
}
export interface Car {
  id: number;
  plate: number;
  color: string;
  model: string;
}

export interface Extras {
  id: number;
  extra_service_id: number;
}

export interface Client {
  id: number;
  full_name: string;
  phone: string;
  photo: string;
  stars: number;
  expo_token?:string;
}

// Generated by https://quicktype.io

export interface InterfaceQuality {
  idTravel: number;
  stars: number;
  observation: string;
  idUser: number;
}

// Generated by https://quicktype.io

export interface GetTravelsByUserLoggedResponse {
  ok: boolean;
  msg: string;
  data: DataTravel;
}

export interface DataTravel {
  travels: Travel[];
  count: number;
}

export interface Travel {
  id: number;
  time: number;
  price: number;
  distance: number;
  created_at: string;
  driver: Client;
  client: Client;
  rowNumber: number;
}

export interface Client {
  id: number;
  full_name: string;
  photo: string;
}

export interface ITravels {
  idStatus: number;
  offset: number;
  limit: number;
}

// Generated by https://quicktype.io

export interface ResponseCostTravel {
  ok:   boolean;
  msg:  string;
  data: Data;
}

export interface Data {
  costTravelMin: number;
  costStart:     number;
  costDistance:  number;
  costTime:      number;
  costTotal:     number;
}
