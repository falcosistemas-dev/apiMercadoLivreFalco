import { Router, Request, Response } from "express";
import { obterPedidos } from "../modules/db/pedido";
import { formatarData } from "../modules/formatters";
import { Logger } from "../modules/Logger";
import ExcelJS from 'exceljs';

const rotasInterface = Router()

rotasInterface.get("/", async (req: Request, res: Response) => {
    const enviadoQuery = String(req.query.enviado).toLowerCase()
    let enviado: boolean | undefined
    if(["true", "yes", "y", "1"].includes(enviadoQuery)){
        enviado = true
    }else if(["false", "no", "n", "0"].includes(enviadoQuery)){
        enviado = false
    }

    let dataInicio: Date | undefined = undefined
    let dataFinal: Date | undefined = undefined
    if(req.query.dataInicio){
        dataInicio = new Date(String(req.query.dataInicio))
    }

    if(req.query.dataFinal){
        dataFinal = new Date(String(req.query.dataFinal))
    }

    try{
        const pedidos = await obterPedidos({enviado, dataInicio, dataFinal})
        const novosPedidos = pedidos?.map(p => {return {
            ...p,
            data_envio_DT: formatarData(p.data_envio_DT),
            nota_enviada_BT: p.nota_enviada_BT === null ? "" : !!p.nota_enviada_BT ? "Sim" : "Não"
        }
        })

        const queryString = new URLSearchParams(req.query as Record<string, string>).toString();

        const queryStringWithPrefix = queryString ? `?${queryString}` : '';

        res.render('home', {pedidos: novosPedidos, query: req.query, queryString: queryStringWithPrefix});
    }catch(e: any){
        Logger.error(`Erro ao obter pedidos: ${e.originalError?.message || e.message || e}`, e)
        res.status(500).json({error: "Internal Server Error", message: "Erro ao obter pedido"})
    }
})

rotasInterface.get('/export', async (req: Request, res: Response) => {
    const enviadoQuery = String(req.query.enviado).toLowerCase()
    let enviado: boolean | undefined
    if(["true", "yes", "y", "1"].includes(enviadoQuery)){
        enviado = true
    }else if(["false", "no", "n", "0"].includes(enviadoQuery)){
        enviado = false
    }

    let dataInicio: Date | undefined = undefined
    let dataFinal: Date | undefined = undefined
    if(req.query.dataInicio){
        dataInicio = new Date(String(req.query.dataInicio))
    }

    if(req.query.dataFinal){
        dataFinal = new Date(String(req.query.dataFinal))
    }

    try{
        const pedidos = await obterPedidos({enviado, dataInicio, dataFinal})
        const novosPedidos = pedidos?.map(p => {return {
            ...p,
            nota_enviada_BT: p.nota_enviada_BT === null ? "" : !!p.nota_enviada_BT ? "Sim" : "Não"
        }
        })
        
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('NFe')

        worksheet.columns = [
            {header: 'id', key: 'id_NM'},
            {header: 'Nº Nota', key: 'numero_nota_NM', width: 10},
            {header: 'Nº do pedido ML', key: 'order_id_NM', width: 25 },
            {header: 'Cliente', key: 'nome_cliente_VC', width: 50},
            {header: 'Data/Hora do envio', key: 'data_envio_DT', width: 15},
            {header: 'Enviado', key: 'nota_enviada_BT'},
            {header: 'Observação', key: 'observacao_VC', width: 80 }
        ]

        novosPedidos?.forEach(p => worksheet.addRow({...p, order_id_NM: p.order_id_NM.toString()}))

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

export default rotasInterface