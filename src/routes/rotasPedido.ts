import { Request, Response, Router } from "express";
import { obterPedidoPorOrderId } from "../modules/db/pedido";

const rotasPedido = Router()

rotasPedido.get("/pedidos/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    res.status(200).json({historico: await obterPedidoPorOrderId(id)})
})

export default rotasPedido;