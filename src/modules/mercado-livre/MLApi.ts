import axios, { AxiosError } from "axios"

const MLApi = axios.create({
    baseURL: "https://api.mercadolibre.com"
})

MLApi.interceptors.response.use(function onFulfilled(response){ return response}, function onReject(error: AxiosError){
    let mensagem = `\x1b[33m${error?.status} [API ML]\x1b[0m `

    if(error?.status === 400){
        const responseData = error?.response?.data as any
        mensagem += responseData?.message || error.message
    }else{
        mensagem += error.message
    }

    console.error(mensagem)
    return Promise.reject(error);
})

export default MLApi