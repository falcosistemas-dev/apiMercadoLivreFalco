import { Router, Request, Response } from "express";
import MLService from "../modules/mercado-livre/MLService";
import { globais } from "../globais";
import { isAxiosError } from "axios";
import { Logger } from "../modules/Logger";
import { notificationPublisher } from "../queues/notification-queue";

const rotasML = Router()
const mlService = new MLService()

// Redireciona para login do Mercado Livre
rotasML.get('/login', (req: Request, res: Response) => {
    const url = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${globais.CLIENT_ID}&redirect_uri=${globais.REDIRECT_URI}`
    res.redirect(url)
})

// Rota necessária pelo Mercado Livre para o vendedor autorizar o uso de suas informações
rotasML.get("/callback", async (req: Request, res: Response) => {
    try{
        const code = String(req.query.code)
        await mlService.callback(code)
        res.sendStatus(200)
    }catch(e: any){
        if(isAxiosError(e)){
            Logger.error(`Erro no callback: ${e.status} - ${e.response?.data.message}`)
            res.sendStatus(Number(e.status))
            return
        }else{
            Logger.error(`Erro no callback: ${e.message}`, e)
        }
        res.sendStatus(500)
    }
});

// Rota que recebe notificação quando um novo pedido/envio é criado
rotasML.post("/notificacoes", async (req: Request, res: Response) => {
    await notificationPublisher.send('notification', req.body)
    res.sendStatus(200)
});

export default rotasML;