export function extractFiltersFromQuery(query: any){
    const enviado = queryBoolean(query.enviado)
    const numeroNota = queryNumber(query.numeroNota)
    const orderId = queryNumber(query.orderId)
    const nomeCliente = queryString(query.nomeCliente)

    const dataInicio = queryDate(query.dataInicio)
    const dataFinal = queryDate(query.dataFinal)

    const pedidoNoFalco = queryBoolean(query.pedidoNoFalco)
    const numeroPedidoFalco = queryNumber(query.numeroPedidoFalco)

    return {
        enviado,
        numeroNota,
        orderId,
        nomeCliente,
        dataInicio,
        dataFinal,
        pedidoNoFalco,
        numeroPedidoFalco
    }
}

export function queryNumber(param: unknown): number | undefined{
    let result = String(param).trim()

    if (result !== '' && /^[0-9]+$/.test(result)){
        return Number.parseInt(result)
    }
}

export function queryBoolean(param: unknown): boolean | undefined{
    let result = String(param).trim().toLocaleLowerCase()

    if(['true', '1'].includes(result)){
        return true
    }else if(['false', '0'].includes(result)){
        return false
    }
}

export function queryDate(param: unknown): Date | undefined{
    let result = String(param).trim()

    if(result === ''){
        return
    }

    const possibleDate = new Date(result)
    if(possibleDate.toString() === 'Invalid Date'){
        return
    }

    return possibleDate
}

export function queryString(param: unknown): string | undefined{
    if(param === undefined){
        return
    }
    
    let result = String(param).trim()

    if(result !== ''){
        return result
    }

    return
}