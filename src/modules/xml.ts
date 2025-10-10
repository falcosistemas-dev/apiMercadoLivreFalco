import { Parser } from "xml2js"

export default async function extrairInfoXml(content: string){
    const parser = new Parser()
    const parsedContent = await parser.parseStringPromise(content)
    const nfeInfo = parsedContent.nfeProc.NFe[0].infNFe[0]

    const nNota = Number(nfeInfo.ide[0].nNF[0]) // Número da nota
    const nomeCliente = String(nfeInfo.dest[0].xNome[0]) // Nome do cliente

    return {nNota, nomeCliente}
}