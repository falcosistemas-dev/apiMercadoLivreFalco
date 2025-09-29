import axios, { isAxiosError } from "axios"
import dotenv from 'dotenv'
import MLApi from "@/lib/MLApi"
import { obterVendedorMercadoLivre } from "@/modules/db/vendedor"

interface Token{
    access_token: string
    expires_in: number
    created_at: number
}

dotenv.config({quiet: true})

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

export class AuthService{
    private tokenCache: Record<number, Token> = {}

    constructor(){}

    async obterToken(userId: number){
        if(this.tokenCache[userId] && !this.isTokenExpired(userId)){
            console.log("Utilizando token cache de usuario ", userId)
            return this.tokenCache[userId].access_token
        }else{
            return this.renovarToken(userId)
        }
    }

    private async renovarToken(userId: number){
        const refreshToken = (await obterVendedorMercadoLivre(userId)).refresh_token_VC
            try{
                const { data } = await MLApi.post("/oauth/token", {
                    grant_type: "refresh_token",
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    refresh_token: refreshToken
                })

                this.tokenCache[userId] = {access_token: data.access_token, expires_in: data.expires_in, created_at: Date.now()}

                return this.tokenCache[userId].access_token
            }catch(e){
                if(isAxiosError(e)){
                    console.error("Erro ao renovar token: ", e.status, " - ", e.response?.data.message)
                }
            }
    }

    private isTokenExpired(userId: number): boolean{
        return Date.now() > this.tokenCache[userId].created_at + this.tokenCache[userId].expires_in
    }
}