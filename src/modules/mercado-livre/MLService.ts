import { Request, Response } from "express";
import { globais } from "../../globais";
import MLApi from "./MLApi";
import { salvarVendedorMercadoLivre } from "../db/vendedor";
import TokenService from "../TokenService";
import { obterPedidoPorOrderId, salvarPedidoMercadoLivre } from "../db/pedido";
import { isAxiosError } from "axios";
import obterMotivoFalhaEnvio from "./formatarErroEnvioNota";
import { salvarHistoricoNota } from "../db/historico";
import DatabaseError from "../db/DatabaseError";

export default class MLService{
    public async callback(code: string){
        let userId: number
        let refreshToken: string

        // Autoriza o vendedor na API do Mercado Livre, recebe e armazena o id e refresh_token desse vendedor
        const response = await MLApi.post("/oauth/token", null, {
            params: {
            grant_type: "authorization_code",
            client_id: globais.CLIENT_ID,
            client_secret: globais.CLIENT_SECRET,
            code: code,
            redirect_uri: globais.REDIRECT_URI,
            },
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        userId = response.data.user_id
        refreshToken = response.data.refresh_token

        await salvarVendedorMercadoLivre(userId, refreshToken)
    }

    public async notificacao(userId: number, topic: string, resource: string){
        if(topic === "orders_v2"){
            const orderId = parseInt(resource.split("/")[2])
            let accessToken = await TokenService.obterToken(userId)

            const response = await MLApi.get(`/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            })

            await salvarPedidoMercadoLivre(userId, orderId, response.data.shipping.id)
        }
    }
    
    public async enviarNota(orderId: number, content: any){
        try{
            const pedido = await obterPedidoPorOrderId(orderId)
            const accessToken = await TokenService.obterToken(pedido?.id_vendedor_mercadolivre_NM as number)
            const shipmentId = pedido?.shipment_id_NM as number
            
            await MLApi.post(`/shipments/${shipmentId}/invoice_data/?siteId=MLB`, content, {
                headers: {
                    "Content-Type": "text/xml",
                    Authorization: `Bearer ${accessToken}`
                }
            })
            console.log("Nota enviada com sucesso")
            await this.registrarHistoricoNota(orderId, true, "Nota enviada com sucesso")
        }catch(e){
            let motivoFalha = "Erro durante processamento da nota"
            if(isAxiosError(e) && e.status === 400){
                motivoFalha = obterMotivoFalhaEnvio(e)
                console.log(motivoFalha)
            }else if(e instanceof DatabaseError){
                console.log("[Database error] ", e)
            }else{
                console.log(e)
            }

            await this.registrarHistoricoNota(orderId, false, motivoFalha)
        }
    }

    public async registrarHistoricoNota(orderId: number, enviado: boolean, motivoFalha: string | null){
        try{
            await salvarHistoricoNota(orderId, enviado, motivoFalha)
        }catch(e){
            if(e instanceof DatabaseError){
                console.log("[Database error] ", e)
            }else{
                console.log(e)
            }
        }
    }
}