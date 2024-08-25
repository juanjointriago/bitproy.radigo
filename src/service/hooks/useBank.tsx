import radigoApi from "../../api/radigoApi"
import { BankInterface, ResponseBank, ResponseBankingParamsByIDDriver } from "../../interfaces/BankInterface"


const useBank = () => {
    const getBankById = async () => {
        const resp = await radigoApi.get<ResponseBank>(`/user/bankingParams`)
        return resp.data
      }

      const putBank = async (data:BankInterface) => {
        const resp = await radigoApi.put<ResponseBank>(`/user/bankingParams`,data)
        return resp.data
      }

      const getInfoBankByIdDriver = async (idDriver: number) => {
        const resp = await radigoApi.get<ResponseBankingParamsByIDDriver>(`/user/bankingParams/${idDriver}`)
        return resp.data
      }

    return {getBankById,putBank,getInfoBankByIdDriver}
}

export default useBank