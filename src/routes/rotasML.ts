import { Router, Request, Response } from "express";
import MLService from "../modules/mercado-livre/MLService";
import { globais } from "../globais";
import { isAxiosError } from "axios";
import { Logger } from "../modules/Logger";

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
    const userId = parseInt(req.body.user_id)
    const topic = String(req.body.topic)
    const resource = String(req.body.resource)

    try{
        await mlService.notificacao(userId, topic, resource)
        res.sendStatus(200)
    }catch(e: any){
        Logger.error(`Erro ao receber notificação: topic ${topic} - resource ${resource}`, e)
        res.sendStatus(500)
    }

});

export default rotasML;