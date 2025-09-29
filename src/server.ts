import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes';
import { readFile } from 'fs/promises';
import axios, { isAxiosError } from 'axios';
import { AuthService } from './modules/authService';
import { obterPedidoPorOrderId, salvarPedido } from './modules/db/orders';
import { watch } from 'fs';
import chokidar from 'chokidar'

const authService = new AuthService()
const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
app.use(authRoutes)

app.post("/notificacoes", async (req: Request, res: Response) => {
    console.log("Notificação recebida:", req.body);
    const userId = req.body.user_id as number
    const topic = req.body.topic as string
    const resource = req.body.resource as string
    if(topic === "orders_v2"){
        const orderId = parseInt(resource.split("/")[2])
        console.log("orderId", orderId)
        let accessToken = await authService.obterToken(userId)
        try{
            const response = await axios.get(`https://api.mercadolibre.com/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            await salvarPedido(userId, orderId, response.data.shipping.id)
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

const watcher = chokidar.watch("notas-xml", {ignored: (file) => !file.endsWith('xml')})
watcher.on("add", async (path, stats) => {
    const content = await readFile(path, 'utf-8')
    let orderId = 0
    if(path.match(/\d+/)){
        orderId = parseInt(path.replace(/\D/g, ""))
    }

    const pedido = await obterPedidoPorOrderId(orderId)
    console.log("pedido ", pedido)
    let accessToken = await authService.obterToken(pedido.id_vendedor_mercadolivre_NM)
    const shipmentId = pedido.shipment_id_NM as number
    try{
        await axios.post(`https://api.mercadolibre.com/shipments/${shipmentId}/invoice_data/?siteId=MLB`, content, {
            headers: {
                "Content-Type": "text/xml",
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log("Nota enviada com sucesso")
    }catch(e){
        if(isAxiosError(e)){
            console.log(e.status," - ", e.response?.data.message)
        }else{
            console.log("Erro antes de enviar nota: ", e)
        }
    }
})

app.post("/enviarNota/:orderId", async (req: Request, res: Response) => {
    const content = await readFile("./notas-xml/test.xml", 'utf-8')
    const orderId = parseInt(req.params.orderId)

    const pedido = await obterPedidoPorOrderId(orderId)
    console.log("pedido ", pedido)
    let accessToken = await authService.obterToken(pedido.id_vendedor_mercadolivre_NM)
    const shipmentId = pedido.shipment_id_NM as number
    try{
        await axios.post(`https://api.mercadolibre.com/shipments/${shipmentId}/invoice_data/?siteId=MLB`, content, {
            headers: {
                "Content-Type": "text/xml",
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log("Nota enviada com sucesso")
        res.sendStatus(200)
    }catch(e){
        if(isAxiosError(e)){
            console.log(e.status," - ", e.response?.data.message)
            res.status(400).send(e.response?.data)
        }else{
            console.log("Erro antes de enviar nota: ", e)
        }
    }

})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})