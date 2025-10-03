CREATE PROCEDURE SalvarHistoricoNota
    @order_id_NM NUMERIC,
    @enviado_BT BIT,
    @motivo_falha_VC VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO historico_notas_T (order_id_NM, enviado_BT, motivo_falha_VC) VALUES (@order_id_NM, @enviado_BT, @motivo_falha_VC);
END;
GO