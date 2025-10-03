import { AxiosError } from "axios";

const envioErros = {
    shipment_invoice_already_saved: "Já existe uma nota fiscal salva para o envio informado.",
    duplicated_fiscal_key: "Já existe uma nota fiscal salva com a chave fiscal informada.",
    invalid_nfe_cstat: "A nota fiscal possui um status diferente de autorizada.	",
    wrong_invoice_date: "A data informada na nota fiscal é inválida.",
    wrong_sender_zipcode: "O CEP do vendedor informado na nota fiscal é inválido ou nulo.",
    wrong_receiver_zipcode: "O CEP do comprador informado na nota fiscal é inválido ou nulo.",
    wrong_receiver_cnpj: "O CNPJ do comprador informado na nota fiscal é inválido ou nulo.",
    wrong_receiver_cpf: "O CPF do comprador informado na nota fiscal é inválido ou nulo.",
    wrong_receiver_state_tax: "A Inscrição Estadual do comprador informada na nota fiscal é inválida ou nula.",
    invalid_user: "Você não tem permissão para realizar operações no envio informado.",
    seller_not_allowed_to_import_nfe: "Você não tem permissão para realizar a importação de NF-e",
    shipment_invoice_should_contain_company_state_tax_id: "A Inscrição Estadual do comprador não foi informada na nota fiscal.",
    invalid_state_tax_id: "A Inscrição Estadual do comprador informada na nota fiscal é inválida ou nula.",
    invalid_operation_for_site_id: "Operação inválida para a região informada.",
    error_parse_invoice_data: "Erro ao converter dados da nota fiscal para json.",
    invalid_parameter: "A nota fiscal informada não contém o número de identificação.",
    invalid_caller_id: "Caller Id informado é inválido ou não foi informado.",
    sender_ie_not_found: "O CNPJ do vendedor não está cadastrado na Sefaz como contribuinte ou está bloqueado.",
    invalid_sender_ie_for_state: "A inscrição estadual do vendedor é inválida para o estado cadastrado.",
    invalid_sender_ie: "A inscrição estadual do vendedor é diferente da cadastrada junto à Sefaz.",
    invalid_sender_cnpj: "O CNPJ do vendedor é diferente do cadastrado junto à Sefaz.",
    different_state_nfe_shipment_origin: "A UF da nota é diferente do estado de origem do envio.",
    nfe_order_value_divergence: "O valor da nota fiscal diverge do valor total dos itens do pedido.",
    wrong_invoice_type: "Nota fiscal de serviço ou contém valor de ISSQN.",
    unexpected_error_post_biller: "XML inválido ou com campos incorretos.",
    shipment_already_being_processed: "Foi enviada mais de uma requisição ao mesmo tempo.",
    batch_nfe_not_supported: "Não é possível informar nota fiscal com formato em lote.",
    nfe_layout_not_supported: "Não é possível informar nota fiscal com esse formato.",
    nf_already_generated: "Já existe uma NFe emitida pelo faturador.",
    internal_error: "Houve um erro interno",
    invalid_shipment: "O shipment se encontra em um status em que a importação da NF-e não é aceita",
    invalid_nfe: "Os dados do destinatário são inválidos ou não está corretamente preenchidos",
    malformed_XML: "O arquivo XML enviado possui algum erro de sintax ou estrutura"
}

// Verifica se o erro retornado é conhecido, senão retorna a mensagem original do erro
export default function obterMotivoFalhaEnvio(e: AxiosError){
    const responseData = e.response?.data as any
    const error = responseData.error as string
    
    
    if(Object.keys(envioErros).includes(error)){
        return envioErros[error as keyof typeof envioErros]
    }
    return e.message

}