import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { readFile } from 'fs/promises';
import { isAxiosError } from 'axios';
import chokidar from 'chokidar'
import localtunnel from 'localtunnel';
import MLApi from './modules/mercado-livre/MLApi';
import { obterPedidoPorOrderId } from './modules/db/pedido';
import { globais } from './globais';
import TokenService from './modules/TokenService';
import rotasML from './routes/rotasML';
import MLService from './modules/mercado-livre/MLService';

const app = express()

app.use(cors())
app.use(express.json())

app.use(rotasML)

const mlService = new MLService()

const watcher = chokidar.watch(globais.CAMINHO_NFE, {ignored: (file) => !file.endsWith('xml')})
watcher.on("add", async (path) => {
    if(path.match(/\d+/)){
        const orderId = parseInt(path.replace(/\D/g, ""))
        const content = await readFile(path, 'utf-8')

        await mlService.enviarNota(orderId, content)
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