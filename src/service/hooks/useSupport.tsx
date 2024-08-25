import React from 'react'
import { GetSupportInfoResponse } from '../../interfaces/SupportInterfaces';
import radigoApi from '../../api/radigoApi';

export const useSupport = () => {
    const getSupportInfo = (): Promise<GetSupportInfoResponse> => {
        return new Promise((resolve, reject) => {
          radigoApi
            .get<GetSupportInfoResponse>("/support")
            .then((resp) => {
              resolve(resp.data);
            })
            .catch((error) => {
              reject(error);
            });
        });
      };
  return {getSupportInfo}
}
