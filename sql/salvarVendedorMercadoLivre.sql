CREATE PROCEDURE SalvarVendedorMercadoLivre
    @id_mercadolivre_NM NUMERIC,
    @refresh_token_VC VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM vendedores_T WHERE id_mercadolivre_NM = @user_id_mercado_livre_NM)
    BEGIN
        UPDATE vendedores_T
        SET refresh_token_VC = @refresh_token_VC
        WHERE id_mercadolivre_NM = @user_id_mercado_livre_NM
    END
    ELSE
    BEGIN
        INSERT INTO vendedores_T(id_mercadolivre_NM, refresh_token_VC) VALUES (@user_id_mercado_livre_NM, @refresh_token_VC);
    END
END;
GO