CREATE PROCEDURE AtualizarEnvioPedido
    @order_id_NM NUMERIC,
    @nota_enviada_BT BIT,
    @observacao_VC VARCHAR(255),
    @numero_nota_NM NUMERIC,
    @nome_cliente_VC VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE pedidos_mercadolivre_T
    SET 
        nota_enviada_BT = @nota_enviada_BT,
        observacao_VC = @observacao_VC,
        data_envio_DT = GETDATE(),
        numero_nota_NM = @numero_nota_NM,
        nome_cliente_VC = @nome_cliente_VC
    WHERE
        order_id_NM = @order_id_NM
END;
GO