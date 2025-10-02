import { Router, Request, Response } from "express";
import MLApi from "../modules/mercado-livre/MLApi";
import { salvarVendedorMercadoLivre } from "../modules/db/vendedor";
import { globais } from "../globais";

const router = Router()

// Redireciona para login do Mercado Livre
router.get('/login', (req: Request, res: Response) => {
    const url = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${globais.CLIENT_ID}&redirect_uri=${globais.REDIRECT_URI}`
    res.redirect(url)
})

// Rota necessária pelo Mercado Livre para o vendedor autorizar o uso de suas informações
router.get("/callback", async (req: Request, res: Response) => {
    let code: string
    let userId: number
    let refreshToken: string
    code = String(req.query.code);

    // Autoriza o vendedor na API do Mercado Livre, recebe e armazena o id e refresh token desse vendedor
    try {
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
        console.log(`Usuário ${userId} logou no sistema`)
        res.sendStatus(200)

    } catch (err: any) {
        console.error("Erro no callback:", err.response?.data || err.message); 
        if(err.response?.data.error === "invalid_grant"){
            console.log("Token inválido ou expirado. Acesse /login novamente para renovar seu token")
        }
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

export default router;