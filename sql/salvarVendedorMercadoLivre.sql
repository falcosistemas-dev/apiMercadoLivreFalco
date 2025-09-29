CREATE PROCEDURE SalvarVendedorMercadoLivre
    @id_mercadolivre_NM NUMERIC,
    @refresh_token_VC VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM vendedores_mercadolivre_T WHERE id_mercadolivre_NM = @id_mercadolivre_NM)
    BEGIN
        UPDATE vendedores_mercadolivre_T
        SET refresh_token_VC = @refresh_token_VC
        WHERE id_mercadolivre_NM = @id_mercadolivre_NM
    END
    ELSE
    BEGIN
        INSERT INTO vendedores_mercadolivre_T(id_mercadolivre_NM, refresh_token_VC) VALUES (@id_mercadolivre_NM, @refresh_token_VC);
    END
END;
GO