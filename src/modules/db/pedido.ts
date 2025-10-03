import { getPool } from "../../db"
import DatabaseError from "./DatabaseError"

interface PedidoMercadoLivre {
    order_id_NM: number,
    id_vendedor_mercadolivre_NM: number,
    shipment_id_NM: number | null | undefined,
}

export async function salvarPedidoMercadoLivre(userId: number, orderId: number, shipmentId?: number){
    const pool = await getPool()

    try{
        await pool
            .request()
            .input("id_vendedor_mercadolivre_NM", userId)
            .input("order_id_NM", null)
            .input("shipment_id_NM", shipmentId ?? null)
            .execute("SalvarPedidoMercadoLivre")
    }catch(e){
        console.log("Falha em SalvarPedidoMercadoLivre", e)
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