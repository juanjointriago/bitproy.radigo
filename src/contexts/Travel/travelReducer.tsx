import { travelProgress, } from "./TravelContext";
import { DataTravel } from "../../interfaces/ITravel";

type travelAction =
  | { type: "changeTravel"; payload: travelProgress }
  | { type: "removeData"; payload: travelProgress }
  
//genera estado
export const travelReducer = (
  state: travelProgress,
  action: travelAction
): travelProgress => {
  switch (action.type) {
    case "changeTravel":
      return {
        ...state,
        dataTravel: action.payload.dataTravel,
      };

    case "removeData":
      return {
        ...state,
        dataTravel: action.payload.dataTravel,
      };
     
   
     
    default:
      return state;
  }
};
