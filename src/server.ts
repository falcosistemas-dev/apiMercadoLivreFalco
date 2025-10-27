import express from 'express'
import cors from 'cors'
import { readFile } from 'fs/promises';
import chokidar from 'chokidar'
import localtunnel from 'localtunnel';
import { globais } from './globais';
import rotasML from './routes/rotasML';
import MLService from './modules/mercado-livre/MLService';
import { Logger } from './modules/Logger';
import rotasPedido from './routes/rotasPedido';
import moverArquivo from './modules/moverArquivo';
import path from 'path';
import rotasInterface from './routes/rotasInterface';

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(rotasML)
app.use(rotasPedido)
app.use(rotasInterface)

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

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