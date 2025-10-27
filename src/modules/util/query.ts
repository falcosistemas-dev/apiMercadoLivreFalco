export function queryNumber(param: string): number | undefined{
    param = param.trim()
    if (param !== '' && /^[0-9]+$/.test(param)){
        return parseInt(param)
    }
}

export function queryBoolean(param: string): boolean | undefined{
    param = param.trim().toLocaleLowerCase()
    if(['true', '1'].includes(param)){
        return true
    }else if(['false', '0'].includes(param)){
        return false
    }
}

export function queryDate(param: string): Date | undefined{
    param = param.trim()
    if(param === ''){
        return
    }

    const possibleDate = new Date(param)
    if(possibleDate.toString() === 'Invalid Date'){
        return
    }

    return possibleDate
}