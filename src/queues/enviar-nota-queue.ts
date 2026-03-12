import { onAddFile } from "../modules/arquivo";
import { Logger } from "../modules/Logger";
import { mqConnection } from "./connection";

const enviarNotaConsumer = mqConnection.createConsumer({queue: 'enviarNota'}, async (msg) => {
    const filepath = String(msg.body.filepath)
    if(filepath !==  ''){
        await onAddFile(filepath)
    }

})

enviarNotaConsumer.on('ready', () => {
    Logger.info('enviarNota consumer ready')
})

const enviarNotaPublisher = mqConnection.createPublisher({confirm: true, maxAttempts: 2})

export {enviarNotaConsumer, enviarNotaPublisher}
