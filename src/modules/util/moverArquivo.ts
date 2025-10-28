import fs from 'node:fs/promises'
import { Logger } from '../Logger'

export default async function moverArquivo(origem: string, destino: string){
    try{
        await fs.rename(origem, destino)
    }catch(e: any){
        Logger.error(`Erro ao mover arquivo: ${e.message}`, e)
    }
}