import axios from "axios"

const MLApi = axios.create({
    baseURL: "https://api.mercadolibre.com"
})

export default MLApi