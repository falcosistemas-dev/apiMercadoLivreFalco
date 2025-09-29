CREATE PROCEDURE ObterVendedorPorId
    @id_mercadolivre_NM NUMERIC
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        id_mercadolivre_NM,
        refresh_token_VC
    FROM vendedores_mercadolivre_T
    WHERE id_mercadolivre_NM = @id_mercadolivre_NM;
END;