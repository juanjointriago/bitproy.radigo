import radigoApi, { baseURL } from '../../api/radigoApi'
import { ResponseCar, ResponseMyCars, ResponseSelectMyCar } from '../../interfaces/CarInterface'

const useCars = () => {

  const postCar = async (carData: FormData) => {
    try {
      const { data } = await radigoApi.post<ResponseCar>(
        `${baseURL}/car`,
        carData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return data
    } catch (error:any) {
      return error.response.data
    }
  }

  
  const putCarByID = async (id:number, carData: FormData) => {
    try {
      const { data } = await radigoApi.put<ResponseCar>(
        `${baseURL}/car/${id}`,
        carData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return data
    } catch (error:any) {
      return error.response.data
    }
  }


  const getCarsDriver = async () => {
    const resp = await radigoApi.get<ResponseMyCars>(`/car`)
    return resp.data
  }

  const selectMyCar = async (idCar:number) => {
    const resp = await radigoApi.put<ResponseSelectMyCar>(`/car/select/${idCar}`)
    return resp.data
  }


  const deleteCar = async (id: number) => {
    const resp = await radigoApi.delete(`/car/${id}`)
    return resp.data
  }

  return { postCar, getCarsDriver, deleteCar,putCarByID,selectMyCar }
}

export default useCars
