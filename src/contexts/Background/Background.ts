import * as BackgroundFetch from 'expo-background-fetch';


export class Background {

    static async registerBackgroundFetchAsync(
        bgFetchTask: string,
        options: BackgroundFetch.BackgroundFetchOptions
    ) {
        return BackgroundFetch.registerTaskAsync(bgFetchTask, options);
    }

    static async unregisterBackgroundFetchAsync(bgFetchTask: string) {
        return await BackgroundFetch.unregisterTaskAsync(bgFetchTask);
    }

    static async getStatus(){
        return await BackgroundFetch.getStatusAsync();
    }

}