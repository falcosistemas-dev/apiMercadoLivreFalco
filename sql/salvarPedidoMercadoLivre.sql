CREATE PROCEDURE SalvarPedidoMercadoLivre
    @id_vendedor_mercadolivre_NM NUMERIC,
    @order_id_NM NUMERIC,
    @shipment_id_NM NUMERIC = NULL,
    @enviado_BT BOOLEAN = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM pedidos_mercadolivre_T WHERE order_id_NM = @order_id_NM)
    BEGIN
        INSERT INTO pedidos_mercadolivre_T(id_vendedor_mercadolivre_NM, order_id_NM, shipment_id_NM, enviado_BT) VALUES (@id_vendedor_mercadolivre_NM, @order_id_NM, @shipment_id_NM, @enviado_BT);
    END
END;
GO