import { getPool } from "../../db"
import DatabaseError from "./DatabaseError"

interface VendedorMercadoLivre{
    id_mercadolivre_NM: number,
    refresh_token_VC: string
}

export async function salvarVendedorMercadoLivre(userId: number, refreshToken: string){
    const pool = await getPool()
    try{
        await pool
            .request()
            .input("id_mercadolivre_NM", userId)
            .input("refresh_token_VC", refreshToken)
            .execute("SalvarVendedorMercadoLivre")
    }catch(e){
        throw new DatabaseError("Falha em SalvarVendedorMercadoLivre", e)
    }
}

export async function obterVendedorPorId(userId: number){
    const pool = await getPool()

    try{
        const result = await pool
            .request()
            .input("id_mercadolivre_NM", userId)
            .execute<VendedorMercadoLivre>("ObterVendedorPorId")
    
        if (result.recordset.length > 0){
            return result.recordset[0]
        }
    
        return null
    }catch(e){
        throw new DatabaseError("Falha em ObterVendedorPorId", e)
    }
}