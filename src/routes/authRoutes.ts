import { Router, Request, Response } from "express";
import MLApi from "../lib/MLApi";
import { salvarVendedorMercadoLivre } from "../modules/db/vendedor";

const router = Router()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI

router.get('/login', (req: Request, res: Response) => {
    const strUrl = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`
    res.redirect(strUrl)
})

router.get("/callback", async (req: Request, res: Response) => {
    let code: string
    let userId: number
    let refreshToken: string
    code = String(req.query.code);

    try {
        const response = await MLApi.post("/oauth/token", null, {
            params: {
            grant_type: "authorization_code",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            redirect_uri: REDIRECT_URI,
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