import { Router, Request, Response } from "express";
import { TokenService } from "../modules/TokenService";
import MLApi from "../modules/MLApi";
import { isAxiosError } from "axios";
import { salvarPedidoMercadoLivre } from "../modules/db/pedido";

const router = Router()

const tokenService = new TokenService()

router.post("/notificacoes", async (req: Request, res: Response) => {
    console.log("Notificação recebida:", req.body?.topic);
    const userId = req.body.user_id as number
    const topic = req.body.topic as string
    const resource = req.body.resource as string
    if(topic === "orders_v2"){
        const orderId = parseInt(resource.split("/")[2])
        let accessToken = await tokenService.obterToken(userId)
        try{
            const response = await MLApi.get(`/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                
            })

            await salvarPedidoMercadoLivre(userId, orderId, response.data.shipping.id)
        }catch(e){
            if(isAxiosError(e)){
                console.log(e.status, " - ", e.response?.data)
            }else{
                console.error("Erro ao salvar pedido: ", e)
            }
        }
    }
    res.sendStatus(200);
});

export default router