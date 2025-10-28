CREATE PROCEDURE ObterPedidos
    @nota_enviada_BT BIT = NULL,
    @data_envio_de_DT DATE = NULL,
    @data_envio_ate_DT DATE = NULL,
    @numero_nota_NM NUMERIC = NULL,
    @order_id_NM NUMERIC = NULL,
    @nome_cliente_VC VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        id_NM,
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
        (@nota_enviada_BT IS NULL OR nota_enviada_BT = @nota_enviada_BT)
        AND ((@data_envio_de_DT IS NULL OR @data_envio_ate_DT IS NULL) OR (data_envio_DT >= @data_envio_de_DT AND data_envio_DT < DATEADD(DAY, 1, @data_envio_ate_DT) ) )
        AND (@numero_nota_NM IS NULL OR numero_nota_NM = @numero_nota_NM)
        AND (@order_id_NM IS NULL OR order_id_NM = @order_id_NM)
        AND (@nome_cliente_VC IS NULL OR nome_cliente_VC = @nome_cliente_VC);
END;