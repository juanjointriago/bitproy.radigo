import { useCallback, useEffect } from "react";
import { Background } from "./Background";
import { LOCATION_TASK, Task } from "./task";
import { AppState } from "react-native";
import { startTracking } from "./TrackingHelper";


interface Props {
    children: JSX.Element
}
  

Task.defineTask(LOCATION_TASK, async () => {
    if (await Task.isRegistered(LOCATION_TASK)) {
        await Background.unregisterBackgroundFetchAsync(LOCATION_TASK);
    }
    if (AppState.currentState === 'background') {
        console.debug('🐕🐕🐕🐕🐕 BACKGROUND  TRACKING');
        //aqui va el metodo que se ejecuta al trackear
        await startTracking();
    }
})

export const BackgroundProvider = ({ children }: Props) => {
    const init = useCallback(async () => {
        if (await Task.isRegistered(LOCATION_TASK)) {
            await Task.unregister(LOCATION_TASK);
            await Background.unregisterBackgroundFetchAsync(LOCATION_TASK);
        }

    }, []);

    useEffect(() => {
        init();
    }, []);
    
    return <>
        {children}
    </>
}
