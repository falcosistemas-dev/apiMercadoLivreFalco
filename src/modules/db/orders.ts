import { getPool } from "../../db"

export async function salvarPedido(userId: number, orderId: number){
    const pool = await getPool()
    await pool
        .request()
        .input("id_vendedor_mercadolivre_NM", userId)
        .input("order_id_NM", orderId)
        .execute("SalvarPedidoMercadoLivre")
}