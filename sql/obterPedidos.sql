CREATE PROCEDURE ObterPedidos
    @nota_enviada_BT BIT = NULL,
    @data_envio_de_DT DATETIME = NULL,
    @data_envio_ate_DT DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        order_id_NM,
        id_vendedor_mercadolivre_NM,
        shipment_id_NM,
        nota_enviada_BT,
        observacao_VC,
        data_envio_DT,
        numero_nota_NM,
        nome_cliente_VC
    FROM pedidos_mercadolivre_T
    WHERE 
        (@nota_enviada_BT IS NULL OR nota_enviada_BT = @nota_enviada_BT) AND
        ((@data_envio_de_DT IS NULL OR @data_envio_ate_DT IS NULL) OR (data_envio_DT BETWEEN @data_envio_de_DT AND @data_envio_ate_DT))
        ;
END;