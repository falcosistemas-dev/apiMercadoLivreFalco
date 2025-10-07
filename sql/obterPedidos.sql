CREATE PROCEDURE ObterPedidos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        order_id_NM,
        id_vendedor_mercadolivre_NM,
        shipment_id_NM,
        nota_enviada_BT,
        observacao_VC,
        data_envio_DT
    FROM pedidos_mercadolivre_T
END;