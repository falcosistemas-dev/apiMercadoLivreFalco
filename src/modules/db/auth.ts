import { getPool } from "../../db"

export async function salvarVendedorMercadoLivre(userId: number, refreshToken: string){
    const pool = await getPool()
    await pool
        .request()
        .input("id_mercadolivre_NM", userId)
        .input("refresh_token_VC", refreshToken)
        .execute("SalvarVendedorMercadoLivre")
}