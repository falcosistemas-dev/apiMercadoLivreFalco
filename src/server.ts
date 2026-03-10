import express from 'express'
import cors from 'cors'
import chokidar from 'chokidar'
import cron from 'node-cron'
import { globais } from './globais';
import rotasML from './routes/rotasML';
import { Logger } from './modules/Logger';
import rotasPedido from './routes/rotasPedido';
import path from 'node:path';
import rotasInterface from './routes/rotasInterface';
import { enviarNotaPublisher } from './queues/enviar-nota-queue';
import { retryAll } from './modules/arquivo';
import { mqConnection } from './queues/connection';

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

const watcher = chokidar.watch(globais.CAMINHO_NFE, {depth: 0})

watcher.on("add", async (filepath) => {
    const filename = path.basename(filepath, ".xml");
    if(filename.match(/^\d+$/) && filepath.endsWith('.xml')){
        await enviarNotaPublisher.send('enviarNota', {filepath})
    }
});

const cronS = cron.schedule('*/10 * * * *', retryAll)

app.listen(Number(globais.PORT), () => {
    Logger.info(`Servidor rodando na porta ${globais.PORT}`)
})

cronS.destroy()
mqConnection.close()