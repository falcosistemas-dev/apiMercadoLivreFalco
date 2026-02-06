CREATE OR ALTER PROCEDURE ObterPedidoPorId
    @id_IN NUMERIC
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        id_IN,
        order_id_NM,
        id_vendedor_mercadolivre_NM,
        shipment_id_NM,
        nota_enviada_BT,
        pedido_no_falco_BT,
        observacao_VC,
        numero_nota_NM,
        nome_cliente_VC,
        data_envio_DT
    FROM pedidos_mercadolivre_T
    WHERE id_IN = @id_IN;
END;

GRANT EXECUTE ON ObterPedidoPorId TO PUBLIC;