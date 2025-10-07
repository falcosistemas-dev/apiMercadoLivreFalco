import { Request, Response, Router } from "express";
import { obterPedidoPorOrderId, obterPedidos } from "../modules/db/pedido";
import { Logger } from "../modules/Logger";

const rotasPedido = Router()


rotasPedido.get("/pedidos", async (req: Request, res: Response) => {
    try{
        const pedidos = await obterPedidos()
        res.status(200).json({pedidos})
    }catch(e: any){
        Logger.error(`Erro ao obter pedidos: ${e.message}`, e)
        res.status(500).json({error: "Internal Server Error", message: "Erro ao obter pedido"})
    }
})


rotasPedido.get("/pedidos/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    try{
        const pedido = await obterPedidoPorOrderId(id)
        if(!pedido){
            res.status(404).json({error: "Not found", message: `Pedido com id ${id} não encontrado`})
            return
        }

        res.status(200).json({pedido})
    }catch(e: any){
        Logger.error(`Erro ao obter pedido por id: ${e.message}`, e)
        res.status(500).json({error: "Internal server error", message: "Erro ao obter pedido"})
    }
})


export default rotasPedido;