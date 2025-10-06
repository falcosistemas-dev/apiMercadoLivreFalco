CREATE PROCEDURE AtualizarEnvioPedido
    @order_id_NM NUMERIC
    @nota_enviada_BT BIT
    @observacao_VC VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE pedidos_mercadolivre_T
    SET 
        nota_enviada_BT = @nota_enviada_BT,
        observacao_VC = @observacao_VC,
        data_envio_DT = GETDATE()
    WHERE
        order_id_NM = @order_id_NM
END;
GO