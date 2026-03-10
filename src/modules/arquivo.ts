import fs from 'node:fs/promises'
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Logger } from './Logger'
import MLService from './mercado-livre/MLService';
import { globais } from '../globais';
import { enviarNotaPublisher } from '../queues/enviar-nota-queue';

export async function moveFile(origem: string, destino: string){
    try{
        await fs.rename(origem, destino)
    }catch(e: any){
        Logger.error(`Erro ao mover arquivo: ${e.message}`, e)
    }
}

export async function onAddFile(filepath: string){
    const filename = path.basename(filepath, ".xml");

    const mlService = new MLService()
    const orderId = Number.parseInt(filename)
    const content = await readFile(filepath, 'utf-8')

    const {success} = await mlService.enviarNota(orderId, content)
    if(success){
        await moveFile(filepath, path.join(globais.CAMINHO_NFE, "enviado", orderId + ".xml").replace('C:', '\\'))
    }else{
        Logger.error('Erro ao enviar nota')
    }
}

export async function retryAll(){
    const arquivos = await fs.readdir(globais.CAMINHO_NFE, {recursive: false});
    Logger.info("Tentando reenviar arquivos xml")
    for (let arq of arquivos){
        const filename = path.basename(arq, ".xml");
        if(arq.endsWith('xml') && filename.match(/^\d+$/)){
            await enviarNotaPublisher.send('enviarNota', {filepath: path.join(globais.CAMINHO_NFE, arq)})
        }
    }
}