import { getPool } from "@/db"

export async function salvarVendedorMercadoLivre(userId: number, refreshToken: string){
    const pool = await getPool()
    await pool
        .request()
        .input("id_mercadolivre_NM", userId)
        .input("refresh_token_VC", refreshToken)
        .execute("SalvarVendedorMercadoLivre")
}

export async function obterVendedorMercadoLivre(userId: number){
    const pool = await getPool()
    const result = await pool
        .request()
        .input("id_mercadolivre_NM", userId)
        .execute("ObterVendedorPorId")

    if (result.recordset.length > 0){
        return result.recordset[0]
    }

    return null
}