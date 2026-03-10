import { onAddFile } from "../modules/arquivo";
import { mqConnection } from "./connection";

const enviarNotaConsumer = mqConnection.createConsumer({queue: 'enviarNota'}, async (msg) => {
    const filepath = String(msg.body.filepath)
    if(filepath !==  ''){
        await onAddFile(filepath)
    }

})

const enviarNotaPublisher = mqConnection.createPublisher({confirm: true, maxAttempts: 2})

export {enviarNotaConsumer, enviarNotaPublisher}
