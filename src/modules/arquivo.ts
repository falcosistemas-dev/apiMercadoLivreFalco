import fs from 'node:fs/promises'
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Logger } from './Logger'
import MLService from './mercado-livre/MLService';
import { globais } from '../globais';

export async function moveFile(origem: string, destino: string){
    try{
        await fs.rename(origem, destino)
    }catch(e: any){
        Logger.error(`Erro ao mover arquivo: ${e.message}`, e)
    }
}

export async function onAddFile(filepath: string){
    const filename = path.basename(filepath, ".xml");

    if(filename.match(/^\d+$/) && filepath.endsWith('.xml')){
        const mlService = new MLService()
        const orderId = Number.parseInt(filename)
        const content = await readFile(filepath, 'utf-8')
    
        const {success} = await mlService.enviarNota(orderId, content)
        if(success){
            await moveFile(filepath, path.join(globais.CAMINHO_NFE, "enviado", orderId + ".xml"))
        }else{
            Logger.error('Erro ao enviar nota')
        }
    }
}

export async function retryAll(){
    const arquivos = await fs.readdir(globais.CAMINHO_NFE);
    Logger.info("Tentando reenviar arquivos xml")
    for (let arq of arquivos){
        if(arq.endsWith('xml') && arq.match(/\d+/)){
            onAddFile(arq)
        }
    }
}