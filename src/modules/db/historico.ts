import { getPool } from "../../db";
import DatabaseError from "./DatabaseError";

export async function salvarHistoricoNota(orderId: number, enviado: boolean, motivoFalha: string | null){
    const pool = await getPool()

    try{
        await pool
            .request()
            .input("order_id_NM", orderId)
            .input("enviado_BT", enviado)
            .input("motivo_falha_VC", motivoFalha)
            .execute("SalvarHistoricoNota")
    }catch(e){
        throw new DatabaseError("Falha em SalvarHistoricoNota", e)
    }
}