import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes';

const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
app.use(authRoutes)

app.post("/notificacoes", (req: Request, res: Response) => {
    console.log("Notificação recebida:", req.body);
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})