import { createContext, useReducer, useEffect } from 'react'
import { AuthState, authReducer } from './authReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  GetRenewToken,
  LoginData,
  LoginResponse,
  RegisterUserResponse,
  ResponseUpdateUser,
  UserLogged,
} from '../../interfaces/authInterfaces'
import radigoApi, { baseURL } from '../../api/radigoApi'
import { User } from '../../interfaces/authInterfaces'
import { useAlerts } from '../../service/hooks/useAlerts'

type AuthContextProps = {
  errorMessage: string
  token: string | null
  user: User | null
  status: 'checking' | 'authenticated' | 'not-authenticated'
  signUp: (registerData: FormData) => void
  signIn: (loginData: LoginData) => void
  logOut: () => void
  updateDataUser: (data: User) => void
  removeError: () => void
  resetPassword: (email: string) => void
  signInGoogle: (token: string) => void;
}

export const authInicialState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMessage: '',
}

export const AuthContext = createContext({} as AuthContextProps)

export const AuthProvider = ({ children }: any) => {
  const { toast } = useAlerts()
  const [state, dispatch] = useReducer(authReducer, authInicialState)

  useEffect(() => {
    checkToken();
  }, [])

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token')
    //no hay token, token no  autorizado
    if (!token) return dispatch({ type: 'notAuthenticated' })
    //si hay token
    try {
      const resp = await radigoApi.get('/auth/renewToken', {
        headers: { Authorization: token },
      })
      await AsyncStorage.setItem('token', resp.data.data.token)
      const response = await radigoApi.get<GetRenewToken>(`user`)
      console.log("✔✔✔✔✔",response.data.data)
      dispatch({
        type: 'signUp',
        payload: {
          token: resp.data.data.token,
          user: response.data.data.user,
        },
      })
    } catch (error) {
      return dispatch({ type: 'notAuthenticated' })
    }
  }


  const signIn = async ({ email, password }: LoginData): Promise<boolean> => {
    try {
      const { data }: any = await Promise.race([
        radigoApi.post<LoginResponse>('/auth/signin', {
          email,
          password,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 5000)
        ),
      ]);

      if (!data) {
        // Request timed out
        return false;
      }

      await AsyncStorage.setItem('token', data.data.token);
      const resp = await radigoApi.get<UserLogged>(`user`);
      dispatch({
        type: 'signUp',
        payload: {
          token: data.data.token,
          user: resp.data.data.user,
        },
      });
      return true; // Successful login
    } catch (error: any) {
      dispatch({
        type: 'addError',
        payload:
          error?.response?.data?.msg || 'Error, usuario o contraseña incorrecto',
      });
      return false; // Error in login
    }
  };

  const signUp = async (registerData: FormData) => {
    try {
      const { data } = await radigoApi.post<RegisterUserResponse>(
        `${baseURL}/auth/signup`,
        registerData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return data
    } catch (error: any) {
      return error.response.data
    }
  }

  const updateDataUser = async (data: User) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return false;
    try {
      const resp = await radigoApi.put<ResponseUpdateUser>("user", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },)
      dispatch({
        type: 'signUp',
        payload: {
          token: token,
          user: resp.data.data,
        },
      });

      return resp.data;
    } catch (error: any) {
      return error.response?.data || error.message;
    }
  };

  const logOut = async () => {
    updateDataUser({expo_token:"null"}).then(async(res)=>{
      dispatch({ type: 'logout' })
      await AsyncStorage.clear()
          }).catch((err)=>{
            console.log("err",err)
      })
  }

  const removeError = () => {
    dispatch({ type: 'removeError' })
  }

  const resetPassword = (email: string) => {
    return new Promise((resolve, reject) => {
      if (email !== '') {
        radigoApi
          .post<LoginResponse>('/auth/sendEmailResetPassword', {
            email,
          })
          .then(async (res: any) => {
            toast(res?.data.msg || 'Lo siento algo salió mal...', 'SUCCESS');
            resolve(true);
          })
          .catch((err: any) => {
            toast(err?.response.data.msg || 'Ingrese un correo, por favor', 'DANGER');
            resolve(false);
          });
      } else {
        toast('Ingrese un correo, por favor', 'DANGER');
        resolve(false);
      }
    });
  };

  const signInGoogle = async (id_token: string) => {
    try {
      const { data } = await radigoApi.post(`auth/google`, {
        id_token: id_token,
      });
      await AsyncStorage.setItem("token", data.data.token);
      const resp = await radigoApi.get<UserLogged>(`user`);
      dispatch({
        type: "signUp",
        payload: {
          token: data.data.token,
          user: resp.data.data.user,
        },
      });
    } catch (error: any) {
      dispatch({
        type: "addError",
        payload: error?.response.data.msg || "Error, usuario o contraseña incorrecto",
      });
      toast('Lo siento algo salio mal.', 'DANGER');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        logOut,
        updateDataUser,
        removeError,
        resetPassword,
        signInGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
