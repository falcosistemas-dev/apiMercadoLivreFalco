CREATE PROCEDURE ObterPedidoPorOrderId
    @order_id_NM NUMERIC
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        order_id_NM,
        id_vendedor_mercadolivre_NM,
        shipment_id_NM,
        nota_enviada_BT,
        observacao_VC,
        numero_nota_NM,
        nome_cliente_VC,
        data_envio_DT
    FROM pedidos_mercadolivre_T
    WHERE order_id_NM = @order_id_NM;
END;