export function formatarData(data: string | null){
  if(data){
    const date = new Date(data)
    date.setHours(date.getHours() + 3)
  
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return ''
}