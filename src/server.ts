import express from 'express'
import cors from 'cors'
import chokidar from 'chokidar'
import localtunnel from 'localtunnel';
import { globais } from './globais';
import rotasML from './routes/rotasML';
import { Logger } from './modules/Logger';
import rotasPedido from './routes/rotasPedido';
import path from 'node:path';
import rotasInterface from './routes/rotasInterface';
import { onAddFile } from './modules/arquivo';

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

const watcher = chokidar.watch(globais.CAMINHO_NFE)
console.log(Number(globais.PORT))
watcher.on("add", onAddFile);

app.listen(Number(globais.PORT), () => {
    Logger.info(`Servidor rodando na porta ${globais.PORT}`)
})