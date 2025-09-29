CREATE PROCEDURE SalvarPedidoMercadoLivre
    @id_vendedor_mercadolivre_NM NUMERIC,
    @order_id_NM NUMERIC
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM pedidos_mercadolivre_T WHERE id_vendedor_mercadolivre_NM = @id_vendedor_mercadolivre_NM)
    BEGIN
        INSERT INTO pedidos_mercadolivre_T(id_vendedor_mercadolivre_NM, order_id_NM) VALUES (@user_id_mercado_livre_NM, @order_id_NM);
    END
END;
GO