import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { readFile } from 'fs/promises';
import { isAxiosError } from 'axios';
import chokidar from 'chokidar'
import localtunnel from 'localtunnel';
import authRoutes from './routes/authRoutes';
import notificacaoRoutes from './routes/notificacaoRoutes';
import MLApi from './modules/MLApi';
import { obterPedidoPorOrderId, salvarPedidoMercadoLivre } from './modules/db/pedido';
import { TokenService } from './modules/TokenService';

const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
app.use(authRoutes)
app.use(notificacaoRoutes)

const NFE_PATH = String(process.env.NFE_PATH)

const tokenService = new TokenService()

const watcher = chokidar.watch(NFE_PATH, {ignored: (file) => !file.endsWith('xml')})
watcher.on("add", async (path, stats) => {
    const content = await readFile(path, 'utf-8')
    let orderId = 0
    if(path.match(/\d+/)){
        orderId = parseInt(path.replace(/\D/g, ""))
    }

    const pedido = await obterPedidoPorOrderId(orderId)
    let accessToken = await tokenService.obterToken(pedido?.id_vendedor_mercadolivre_NM as number)
    const shipmentId = pedido?.shipment_id_NM as number
    try{
        await MLApi.post(`/shipments/${shipmentId}/invoice_data/?siteId=MLB`, content, {
            headers: {
                "Content-Type": "text/xml",
                Authorization: `Bearer ${accessToken}`
            }
        })
        console.log("Nota enviada com sucesso")
    }catch(e){
        if(!isAxiosError(e)){
            console.log("Erro antes de enviar nota: ", e)
        }
    }
});

// Executa o localtunnel
(async () => {
  const tunnel = await localtunnel({ port: 3000, subdomain: "falcotestes" });
  tunnel.url;

  tunnel.on("close", () => {
    console.log("Tunel fechado")
  });
})()

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})