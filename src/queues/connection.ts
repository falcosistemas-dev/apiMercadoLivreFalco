import Connection from "rabbitmq-client"

const mqConnection = new Connection('amqp://guest:guest@localhost')

mqConnection.on('error', (err) => {
  console.log('RabbitMQ connection error', err)
})
mqConnection.on('connection', () => {
  console.log('RabbitMQ successfully connected')
})

export {mqConnection}