import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';


export const LOCATION_TASK = 'background-location';


export class Task {
    static async isRegistered(bgFetchTask: string): Promise<boolean> {
        return await TaskManager.isTaskRegisteredAsync(bgFetchTask);
    }

    static defineTask(taskName: string, callback: () => Promise<void>) {
        TaskManager.defineTask(taskName, async ({ data, error }) => {
            const now = Date.now();
            console.log(`BackgroundTask ${taskName}: ${new Date(now).toISOString()}`);
            if (error) {
                return
            }
            if (data) {
                !!callback && await callback();
            }
            return BackgroundFetch.BackgroundFetchResult.NewData;
        })
    }
    static async unregister(bgFetchTask: string): Promise<void> {
        TaskManager.unregisterTaskAsync(bgFetchTask);
    }
}