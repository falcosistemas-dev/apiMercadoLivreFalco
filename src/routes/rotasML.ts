import { Router, Request, Response } from "express";
import MLService from "../modules/mercado-livre/MLService";
import { globais } from "../globais";

const rotasML = Router()
const mlService = new MLService()

// Redireciona para login do Mercado Livre
rotasML.get('/login', (req: Request, res: Response) => {
    const url = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${globais.CLIENT_ID}&redirect_uri=${globais.REDIRECT_URI}`
    res.redirect(url)
})

// Rota necessária pelo Mercado Livre para o vendedor autorizar o uso de suas informações
rotasML.get("/callback", async (req: Request, res: Response) => {
    const code = String(req.query.code)
    await mlService.callback(code)
});

// Rota que recebe notificação quando um novo pedido/envio é criado
rotasML.post("/notificacoes", async (req: Request, res: Response) => {
    const userId = parseInt(req.body.user_id)
    const topic = String(req.body.topic)
    const resource = String(req.body.resource)

    await mlService.notificacao(userId, topic, resource)
});

export default rotasML;