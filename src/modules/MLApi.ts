import axios, { AxiosError } from "axios"

const MLApi = axios.create({
    baseURL: "https://api.mercadolibre.com"
})

const ML_error_codes: any = {
    "shipment_invoice": "Já existe uma nota fiscal salva para o envio informado.",
    "duplicated_fiscal_key	": "Já existe uma nota fiscal salva com a chave fiscal informada.",
    "invalid_nfe_cstat": "A nota fiscal possui um status diferente de autorizada.",
    "wrong_invoice_date": "A data informada na nota fiscal é inválida.",
    "wrong_sender_zipcode": "O CEP do vendedor informado na nota fiscal é inválido ou nulo.",
    "wrong_receiver_zipcode": "O CEP do comprador informado na nota fiscal é inválido ou nulo.",
    "wrong_receiver_cnpj": "O CNPJ do comprador informado na nota fiscal é inválido ou nulo.",
    "wrong_receiver_cpf": "O CPF do comprador informado na nota fiscal é inválido ou nulo.",
    "wrong_receiver_state_tax": "A Inscrição Estadual do comprador informada na nota fiscal é inválida ou nula.",
    "invalid_user": "Você não tem permissão para realizar operações no envio informado.",
    "seller_not_allowed_to_import_nfe": "Você não tem permissão para realizar a importação de NF-e",
    "shipment_invoice_should_contain_company_state_tax_id": "A Inscrição Estadual do comprador não foi informada na nota fiscal.",
    "invalid_state_tax_id": "A Inscrição Estadual do comprador informada na nota fiscal é inválida ou nula.",
    "invalid_operation_for_site_id": "A Inscrição Estadual do comprador informada na nota fiscal é inválida ou nula.",
    "error_parse_invoice_data": "Erro ao converter dados da nota fiscal para json.",
    "invalid_parameter": "A nota fiscal informada não contém o número de identificação.",
    "invalid_caller_id": "Caller Id informado é inválido ou não foi informado.",
    "sender_ie_not_found": "O CNPJ do vendedor não está cadastrado na Sefaz como contribuinte ou está bloqueado.",
}

MLApi.interceptors.response.use(function onFulfilled(response){ return response}, function onReject(error: AxiosError){
    let mensagem = `\x1b[33m${error?.status} [API ML]\x1b[0m `

    if(error?.status === 400){
        const responseData = error?.response?.data as any
        mensagem += ML_error_codes[responseData?.error] || responseData?.message || error.message
    }else{
        mensagem += error.message
    }

    console.error(mensagem)
    return Promise.reject(error);
})

export default MLApi