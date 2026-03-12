import Connection from "rabbitmq-client";
import fs from 'fs'
import MLService from "../modules/mercado-livre/MLService";
import { Logger } from "../modules/Logger";
import { mqConnection } from "./connection";

const mlService = new MLService()
const notificationConsumer = mqConnection.createConsumer({ queue: 'notification' }, async (msg) => {
    const userId = Number.parseInt(msg.body.user_id)
    const topic = String(msg.body.topic)
    const resource = String(msg.body.resource)

    try{
        await mlService.notificacao(userId, topic, resource)
        Logger.info(`Pedido gravado`)
    }catch(e: any){
        Logger.error(`Erro ao receber notificação: topic ${topic} - resource ${resource}`, e)
    }
})

notificationConsumer.on('ready', () => {
    Logger.info('Notification consumer ready')
})


const notificationPublisher = mqConnection.createPublisher({confirm: true, maxAttempts: 2})

export {notificationConsumer, notificationPublisher}