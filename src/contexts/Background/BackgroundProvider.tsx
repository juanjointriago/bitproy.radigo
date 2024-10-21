import { Fragment, useCallback, useEffect } from "react";
import { Background } from "./Background";
import { LOCATION_TASK, Task } from "./task";
import { AppState, Platform } from "react-native";
import { startTracking } from "./TrackingHelper";
import * as ExpoDevice from "expo-device";

interface Props {
  children: JSX.Element;
}
if (Platform.OS !== "ios")
  () =>
    Task.defineTask(LOCATION_TASK, async () => {
      if (!ExpoDevice.isDevice) return;
      if (await Task.isRegistered(LOCATION_TASK)) {
        await Background.unregisterBackgroundFetchAsync(LOCATION_TASK);
      }
      if (AppState.currentState === "background") {
        console.debug("🐕🐕🐕🐕🐕 BACKGROUND  TRACKING");
        //aqui va el metodo que se ejecuta al trackear
        await startTracking();
      }
    });

export const BackgroundProvider = ({ children }: Props) => {
  if (ExpoDevice.isDevice) {
    const init = useCallback(async () => {
      if (await Task.isRegistered(LOCATION_TASK)) {
        await Task.unregister(LOCATION_TASK);
        await Background.unregisterBackgroundFetchAsync(LOCATION_TASK);
      }
    }, []);
    useEffect(() => {
      init();
    }, []);
  }

  return <Fragment>{children}</Fragment>;
};
