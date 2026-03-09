import { randomInt } from "node:crypto"
import { PedidoMercadoLivre } from "../db/pedido"

const observacoes = [null, "Nota enviada com sucesso", "Erro ao enviar", "Um texto muito grande feito para testar a responsividade do site porque preciso que seja bem longo, mas ainda sem sentido"]
const clientes = [null, "Pedro Alvares Cabral", "Pero Vaz de Caminha", "Bandeirantes"]

function pedidosMock(){

    const pedidos: PedidoMercadoLivre[] = []
    
    for(let i = 1000; i <= 1010; i++){
        const enviado = Boolean(randomInt(0,2))
        const noFalco = Boolean(randomInt(0,2))
        const obs = observacoes[randomInt(0,observacoes.length)]
        const cliente = clientes[randomInt(0,clientes.length)]
        pedidos.push({
            id_IN: i,
            order_id_NM: randomInt(1000, 10000),
            id_vendedor_mercadolivre_NM: i,
            shipment_id_NM: i,
            nota_enviada_BT: enviado,
            pedido_no_falco_BT: noFalco,
            observacao_VC: obs,
            data_envio_DT: new Date().toISOString(),
            numero_nota_NM: String(i+10),
            nome_cliente_VC: cliente,
            data_pedido_falco_DT: new Date().toISOString()
        })
    }

    return pedidos
}

export { pedidosMock }