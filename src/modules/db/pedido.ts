import { getPool } from "../../db"
import { Logger } from "../Logger"
import DatabaseError from "./DatabaseError"

interface PedidoMercadoLivre {
    id: number
    order_id_NM: number
    id_vendedor_mercadolivre_NM: number
    shipment_id_NM: number | null
    nota_enviada_BT: boolean | null
    observacao_VC: string | null
    data_envio_DT: string | null
    numero_nota_NM: string | null
    nome_cliente_VC: string | null
}

export async function salvarPedidoMercadoLivre(userId: number, orderId: number, shipmentId?: number){
    const pool = await getPool()

    try{
        await pool
            .request()
            .input("id_vendedor_mercadolivre_NM", userId)
            .input("order_id_NM", orderId)
            .input("shipment_id_NM", shipmentId ?? null)
            .execute("SalvarPedidoMercadoLivre")
    }catch(e){
        Logger.error("Falha em SalvarPedidoMercadoLivre", e)
    }
}

interface PedidosFiltros{
    enviado?: boolean,
    dataInicio?: Date,
    dataFinal?: Date,
    numeroNota?: number
}

export async function obterPedidos(filtros?: PedidosFiltros){
    const pool = await getPool()
    try{
        const result = await pool
            .request()
            .input("nota_enviada_BT", filtros?.enviado)
            .input("data_envio_de_DT", filtros?.dataInicio)
            .input("data_envio_ate_DT", filtros?.dataFinal)
            .input("numero_nota_NM", filtros?.numeroNota)
            .execute<PedidoMercadoLivre[]>('ObterPedidos')
        
            if (result.recordset.length > 0){
                return result.recordset
            }
    }catch(e: any){
        throw new DatabaseError("Falha em ObterPedidos", e)
    }
}

export async function obterPedidoPorOrderId(orderId: number): Promise<PedidoMercadoLivre | null>{
    const pool = await getPool()
    try{
        const result = await pool
            .request()
            .input("order_id_NM", orderId)
            .execute<PedidoMercadoLivre>("ObterPedidoPorOrderId")
        
        if (result.recordset.length > 0){
            return result.recordset[0]
        }

        return null
    }catch(e: any){
        throw new DatabaseError("Falha em ObterPedidoPorOrderId", e)
    }
    
}


export async function obterPedidoPorId(id: number): Promise<PedidoMercadoLivre | null>{
    const pool = await getPool()
    try{
        const result = await pool
            .request()
            .input("id_NM", id)
            .execute<PedidoMercadoLivre>("ObterPedidoPorId")
        
        if (result.recordset.length > 0){
            return result.recordset[0]
        }

        return null
    }catch(e: any){
        throw new DatabaseError("Falha em ObterPedidoPorId", e)
    }
    
}


export async function atualizarEnvioPedido(orderId: number, notaEnviada: boolean, observacao: string, numeroNota: number | null, nomeCliente: string | null){
    const pool = await getPool()
    try{
        await pool
            .request()
            .input('order_id_NM', orderId)
            .input('nota_enviada_BT', notaEnviada)
            .input('observacao_VC', observacao)
            .input("numero_nota_NM", numeroNota)
            .input("nome_cliente_VC", nomeCliente)
            .execute('AtualizarEnvioPedido')
    }catch(e: any){
        throw new DatabaseError("Falha em AtualizarEnvioPedido", e)
    }
}