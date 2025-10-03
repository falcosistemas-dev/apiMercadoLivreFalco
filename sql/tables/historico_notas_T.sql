CREATE TABLE historico_notas_T(
    nota_id_NM INT IDENTITY(1,1) PRIMARY KEY,
    order_id_NM NUMERIC NOT NULL,
    enviado_BT NUMERIC NOT NULL DEFAULT 0,
    motivo_falha_VC VARCHAR(255),
    data_DT DATETIME DEFAULT GETDATE()
);