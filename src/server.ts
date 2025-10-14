import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { readFile } from 'fs/promises';
import { isAxiosError } from 'axios';
import chokidar from 'chokidar'
import localtunnel from 'localtunnel';
import MLApi from './modules/mercado-livre/MLApi';
import { obterPedidoPorOrderId, obterPedidos } from './modules/db/pedido';
import { globais } from './globais';
import TokenService from './modules/TokenService';
import rotasML from './routes/rotasML';
import MLService from './modules/mercado-livre/MLService';
import { Logger } from './modules/Logger';
import rotasPedido from './routes/rotasPedido';
import { Parser } from 'xml2js';
import moverArquivo from './modules/moverArquivo';
import path from 'path';

const app = express()

app.use(cors())
app.use(express.json())

app.use(rotasML)
app.use(rotasPedido)

app.set('view engine', 'ejs')
app.set('views', './views')

const mlService = new MLService() 

const watcher = chokidar.watch(globais.CAMINHO_NFE, {ignored: (file) => !file.endsWith('xml')})
watcher.on("add", async (filepath) => {
    if(filepath.match(/\d+/)){
        const orderId = parseInt(filepath.replace(/\D/g, ""))
        const content = await readFile(filepath, 'utf-8')

        const {success} = await mlService.enviarNota(orderId, content)
        if(success){
          await moverArquivo(filepath, path.join(globais.CAMINHO_NFE, "enviado", orderId + ".xml"))
        }
    }

});

// Executa o localtunnel
(async () => {
  const tunnel = await localtunnel({ port: 3000, subdomain: "falcotestes" });
  tunnel.url;

  tunnel.on("close", () => {
    Logger.info("Tunel fechado")
  });
})()

app.listen(3000, () => {
    Logger.info("Servidor rodando na porta 3000")
})