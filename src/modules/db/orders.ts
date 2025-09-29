import { getPool } from "../../db"

export async function salvarPedido(userId: number, orderId: number, shipmentId?: number){
    const pool = await getPool()
    await pool
        .request()
        .input("id_vendedor_mercadolivre_NM", userId)
        .input("order_id_NM", orderId)
        .input("shipment_id_NM", shipmentId)
        .execute("SalvarPedidoMercadoLivre")
}

export async function obterPedidoPorOrderId(orderId: number){
    const pool = await getPool()
    const result = await pool
        .request()
        .input("order_id_NM", orderId)
        .execute("ObterPedidoPorOrderId")
    
    return result.recordset[0]
}