import { Request, Response } from "express";
import { globais } from "../../globais";
import MLApi from "./MLApi";
import { salvarVendedorMercadoLivre } from "../db/vendedor";
import TokenService from "../TokenService";
import { atualizarEnvioPedido, obterPedidoPorOrderId, salvarPedidoMercadoLivre } from "../db/pedido";
import { isAxiosError } from "axios";
import obterMotivoFalhaEnvio from "./obterErroEnvioNota";
import DatabaseError from "../db/DatabaseError";
import { Logger } from "../Logger";
import extrairInfoXml from "../xml";

export default class MLService{
    public async callback(code: string){
        let userId: number
        let refreshToken: string

        try{
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
        }catch(e: any){
            if(isAxiosError(e) && e.status === 400){
                Logger.error(`Erro no callback: ${e.response?.data.message}`, e)
            }else{
                Logger.error(`Erro ao salvar vendedor no callback: ${e.message}`, e)
            }
        }

    }

    public async notificacao(userId: number, topic: string, resource: string){
        if(topic === "orders_v2"){
            const orderId = Number.parseInt(resource.split("/")[2])

            try{
                let accessToken = await TokenService.obterToken(userId)
    
                const response = await MLApi.get(`/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })
    
                await salvarPedidoMercadoLivre(userId, orderId, response.data.shipping.id)
            }catch(e: any){
                if(isAxiosError(e) && e.status === 400){
                    Logger.error(`Erro ao obter info do pedido ${orderId} pelas notificações: ${e.response?.data.message}`, e)
                }else{
                    Logger.error(`Erro ao salvar info do pedido ${orderId} pelas notificações: ${e.message}`, e)
                }
            }
        }
    }
    
    public async enviarNota(orderId: number, content: any){
        const nfeInfo = await extrairInfoXml(content)
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
            Logger.info(`Nota do pedido ${orderId} enviada com sucesso`)
            await this.atualizarEnvio(orderId, true, "Nota enviada com sucesso", nfeInfo.nNota, nfeInfo.nomeCliente)
            return {success: true}
        }catch(e: any){ 
            let motivoFalha = `Erro durante processamento da nota`
            if(isAxiosError(e) && e.status === 400){
                motivoFalha = obterMotivoFalhaEnvio(e)
                Logger.error(`Erro no envio da nota do pedido ${orderId}: ${motivoFalha}`, e.message)
            }else if(e instanceof DatabaseError){
                Logger.error(`Erro no envio da nota do pedido ${orderId}: ${e.originalError.message}`, e.originalError)
            }else{
                Logger.error(`Erro no envio da nota do pedido ${orderId}: ${e.message}`, e)
            }

            await this.atualizarEnvio(orderId, false, motivoFalha, nfeInfo.nNota, nfeInfo.nomeCliente)
            return {success: false}
        }
    }

    public async atualizarEnvio(orderId: number, enviado: boolean, observacao: string, numeroNota: number | null, nomeCliente: string | null){
        try{
            await atualizarEnvioPedido(orderId, enviado, observacao, numeroNota, nomeCliente)
        }catch(e){
            Logger.error(`Erro ao atualizar nota do pedido ${orderId}`, e)
        }
    }
}