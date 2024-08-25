
import radigoApi from '../../api/radigoApi'
import { ResponseChat } from '../../interfaces/chatInterface'

const useChat = () => {

  const getMessagesChat = async (idChannel:number) => {
    const resp = await radigoApi.get<ResponseChat>(`/chat/${idChannel}`)
    return resp.data
  }

  return {
    getMessagesChat
  }
}

export default useChat
