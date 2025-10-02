import axios, { isAxiosError } from "axios"
import dotenv from 'dotenv'
import { obterVendedorMercadoLivre } from "./db/vendedor"
import MLApi from "./mercado-livre/MLApi"
import { globais } from "../globais"

interface Token{
    access_token: string
    expires_in: number
    created_at: number
}

export default class TokenService{
    private static tokenCache: Record<number, Token> = {}

    constructor(){}

    static async obterToken(userId: number){
        if(TokenService.tokenCache[userId] && !this.isTokenExpired(userId)){
            console.log("Utilizando token cache de usuario ", userId)
            return TokenService.tokenCache[userId].access_token
        }else{
            return this.renovarToken(userId)
        }
    }


    private static async renovarToken(userId: number){
        const refreshToken = (await obterVendedorMercadoLivre(userId))?.refresh_token_VC
            try{
                const { data } = await MLApi.post("/oauth/token", {
                    grant_type: "refresh_token",
                    client_id: globais.CLIENT_ID,
                    client_secret: globais.CLIENT_SECRET,
                    refresh_token: refreshToken
                })

                TokenService.tokenCache[userId] = {access_token: data.access_token, expires_in: data.expires_in, created_at: Date.now()}

                return TokenService.tokenCache[userId].access_token
            }catch(e){
                if(isAxiosError(e)){
                    console.error("Erro ao renovar token: ", e.status, " - ", e.response?.data.message)
                }else{
                    console.error("Erro ao renovar token: ", e)
                }
            }
    }

    private static isTokenExpired(userId: number): boolean{
        return Date.now() > TokenService.tokenCache[userId].created_at + TokenService.tokenCache[userId].expires_in
    }
}