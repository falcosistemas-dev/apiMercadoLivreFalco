import * as amqp from "amqplib";

export class SetupRabbitMQ {

    private connection!: amqp.ChannelModel
    private channel!: amqp.Channel
    
    private QUEUE: string = 'XMLs'

    async init(){
        await this.connect()
        await this.createChannel()
        await this.assertQueue()
    }

    private async connect(){
        this.connection = await amqp.connect(
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
        )
    }

    private async createChannel(){
        this.channel = await this.connection.createChannel()
    }

    private async assertQueue(){
        await this.channel.assertQueue(this.QUEUE, {
            durable: true
        })

    }

    public async sendMessage(message: string){
        this.channel.sendToQueue(
            this.QUEUE,
            Buffer.from(message)
        )
    }

    public async consume(handler: (msg: string) => Promise<void>) {

        await this.channel.consume(this.QUEUE, async (msg) => {

            if(!msg) return

            try {

                const content = msg.content.toString()

                await handler(content)

                this.channel.ack(msg)

            } catch(err){

                console.error("Erro ao processar mensagem", err)

                this.channel.nack(msg, false, true)
            }

        })
    }

}