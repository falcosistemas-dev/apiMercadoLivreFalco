import axios, { isAxiosError } from "axios"
import dotenv from 'dotenv'
import { obterVendedorPorId } from "./db/vendedor"
import MLApi from "./mercado-livre/MLApi"
import { globais } from "../globais"
import { Logger } from "./Logger"

interface Token{
    access_token: string
    expires_in: number
    created_at: number
}

export default class TokenService{
    private static tokenCache: Record<number, Token> = {} // Isso diminui a quantidade de vezes que é necessário chamar a API do ML para obter tokens

    // Verifica se o access token ainda é válido, senão renova
    public static async obterToken(userId: number){
        if(TokenService.tokenCache[userId] && !this.isTokenExpired(userId)){
            return TokenService.tokenCache[userId].access_token
        }else{
            return this.renovarToken(userId)
        }
    }

    // Renova access_token através do refresh_token armazenado
    private static async renovarToken(userId: number){
        const refreshToken = (await obterVendedorPorId(userId))?.refresh_token_VC
            try{
                const { data } = await MLApi.post("/oauth/token", {
                    grant_type: "refresh_token",
                    client_id: globais.CLIENT_ID,
                    client_secret: globais.CLIENT_SECRET,
                    refresh_token: refreshToken
                })

                TokenService.tokenCache[userId] = {access_token: data.access_token, expires_in: data.expires_in, created_at: Date.now()}

                return TokenService.tokenCache[userId].access_token
            }catch(e: any){
                if(isAxiosError(e)){
                    Logger.error(`Erro ao renovar token: ${e.status} - ${e.response?.data.message}` , e)
                }else{
                    Logger.error(`Erro ao renovar token: ${e?.message}`, e)
                }
            }
    }

    // Verifica se o access_token expirou
    private static isTokenExpired(userId: number): boolean{
        return Date.now() > TokenService.tokenCache[userId].created_at + TokenService.tokenCache[userId].expires_in
    }
}