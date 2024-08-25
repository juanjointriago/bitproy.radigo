import React from "react";
import { GetTermsResponse } from "../../interfaces/TermsInterfaces";
import radigoApi from "../../api/radigoApi";

export const useTerms = () => {
  const getTerms = (): Promise<GetTermsResponse> => {
    return new Promise((resolve, reject) => {
      radigoApi
        .get<GetTermsResponse>("/terms")
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  return { getTerms };
};
