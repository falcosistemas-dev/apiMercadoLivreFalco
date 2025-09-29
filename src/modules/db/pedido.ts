import { getPool } from "@/db"

interface PedidoMercadoLivre {
    order_id_NM: number,
    id_vendedor_mercadolivre_NM: number,
    shipment_id_NM: number | null | undefined,
}

export async function salvarPedidoMercadoLivre(userId: number, orderId: number, shipmentId?: number){
    const pool = await getPool()
    await pool
        .request()
        .input("id_vendedor_mercadolivre_NM", userId)
        .input("order_id_NM", orderId)
        .input("shipment_id_NM", shipmentId)
        .execute("SalvarPedidoMercadoLivre")
}

export async function obterPedidoPorOrderId(orderId: number): Promise<PedidoMercadoLivre | null>{
    const pool = await getPool()
    const result = await pool
        .request()
        .input("order_id_NM", orderId)
        .execute<PedidoMercadoLivre>("ObterPedidoPorOrderId")
    
    if (result.recordset.length > 0){
        return result.recordset[0]
    }
    
    return null
}