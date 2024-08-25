import { View, Text } from 'react-native'
import React from 'react'
import radigoApi from '../../api/radigoApi'
import { ResponseAvailableDriver } from '../../interfaces/ITravelDriver'
import {
  DeleteUserResponse,
  GetDataAdmins,
} from '../../interfaces/userInterfaces'
import { GetRenewToken } from '../../interfaces/authInterfaces'

const useUser = () => {
  const geInfotUserLogged = async () => {
    const resp = await radigoApi.get<GetRenewToken>(`user`)
    return resp.data
  }

  const availableDriver = async (is_available: boolean) => {
    const resp = await radigoApi.put<ResponseAvailableDriver>(
      `/user/available`,
      { is_available },
    )
    return resp.data
  }
  const deleteUser = async () => {
    const resp = await radigoApi.delete<DeleteUserResponse>(`/user/`)
    return resp.data
  }

  const getAdminsChat = async () => {
    const resp = await radigoApi.get<GetDataAdmins>(`/user/admins`)
    return resp.data
  }

  return {
    geInfotUserLogged,
    availableDriver,
    deleteUser,
    getAdminsChat,
  }
}

export default useUser
