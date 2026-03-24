import { Router, Request, Response } from "express";
import { obterPedidos } from "../modules/db/pedido";
import { formatarData } from "../modules/util/formatters";
import { Logger } from "../modules/Logger";
import ExcelJS from 'exceljs';
import { extractFiltersFromQuery, queryBoolean, queryDate, queryNumber, queryString } from "../modules/util/query";
import { retryAll } from "../modules/arquivo";

const rotasInterface = Router()

rotasInterface.get("/", async (req: Request, res: Response) => {
    let {
        enviado,
        dataInicio,
        dataFinal,
        nomeCliente,
        numeroNota,
        orderId,
        pedidoNoFalco,
        numeroPedidoFalco
    } = extractFiltersFromQuery(req.query)

    try{
        if(!dataFinal){
            dataFinal = new Date()
        }

        if(!dataInicio){
            const newDate = new Date()
            newDate.setDate(newDate.getDate() - 7)
            dataInicio = newDate
        }

        const pedidos = await obterPedidos({enviado, dataInicio, dataFinal, numeroNota, orderId, nomeCliente, pedidoNoFalco, numeroPedidoFalco})
        // const pedidos = pedidosMock()
        const novosPedidos = pedidos?.map(p => {return {
            ...p,
            data_envio_DT: formatarData(p.data_envio_DT),
            data_pedido_falco_DT: formatarData(p.data_pedido_falco_DT),
            nota_enviada_BT: p.nota_enviada_BT === null ? "" : !!p.nota_enviada_BT ? "Sim" : "Não"
        }
        })

        const queryString = new URLSearchParams(req.query as Record<string, string>).toString();

        const queryStringWithPrefix = queryString ? `?${queryString}` : '';

        const defaultValues = {
            dataInicio: dataInicio.toISOString().split('T').at(0),
            dataFinal: dataFinal.toISOString().split('T').at(0)
        }

        res.render('home', {pedidos: novosPedidos, query: req.query, queryString: queryStringWithPrefix, defaultValues});
    }catch(e: any){
        Logger.error(`Erro ao obter pedidos: ${e.originalError?.message || e.message || e}`, e)
        res.status(500).json({error: "Internal Server Error", message: "Erro ao obter pedido"})
    }
})

rotasInterface.get('/export', async (req: Request, res: Response) => {
    const {
        enviado,
        dataInicio,
        dataFinal,
        nomeCliente,
        numeroNota,
        orderId,
        pedidoNoFalco,
        numeroPedidoFalco
    } = extractFiltersFromQuery(req.query)

    try{
        const pedidos = await obterPedidos({enviado, dataInicio, dataFinal, numeroNota, orderId, nomeCliente, pedidoNoFalco, numeroPedidoFalco})
        const novosPedidos = pedidos?.map(p => {return {
            ...p,
            nota_enviada_BT: p.nota_enviada_BT === null ? "" : !!p.nota_enviada_BT ? "Sim" : "Não"
        }
        })
        
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('NFe')

        worksheet.columns = [
            {header: 'id', key: 'id_IN'},
            {header: 'Nº Nota', key: 'numero_nota_NM', width: 10},
            {header: 'Nº do pedido ML', key: 'order_id_NM', width: 25 },
            {header: 'Cliente', key: 'nome_cliente_VC', width: 50},
            {header: 'Data/Hora do envio', key: 'data_envio_DT', width: 15},
            {header: 'Enviado', key: 'nota_enviada_BT'},
            {header: 'Observação', key: 'observacao_VC', width: 80 }
        ]

        if(novosPedidos){
            for (let ped of novosPedidos){
                worksheet.addRow({...ped, order_id_NM: ped.order_id_NM.toString()})
            }
        }

        const filename = 'Relatório de NFe.xlsx'

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        await workbook.xlsx.write(res)
        res.end()

    }catch(e: any){
        Logger.error(`Erro ao exportar relatório: ${e.originalError?.message || e.message || e}`, e)
        res.status(500).json({error: "Internal Server Error", message: "Erro ao obter pedido"})
    }

})

rotasInterface.get('/admin', async (req: Request, res: Response) => {
    res.render('admin')
})

rotasInterface.post('/admin/retry', async (req: Request, res: Response) => {
    await retryAll()
})

export default rotasInterface