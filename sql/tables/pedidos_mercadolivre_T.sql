CREATE TABLE pedidos_mercadolivre_T(
    id_IN INT IDENTITY(1,1) PRIMARY KEY,
    order_id_NM NUMERIC NOT NULL,
    shipment_id_NM NUMERIC NULL,
    id_vendedor_mercadolivre_NM NUMERIC NOT NULL,
    nota_enviada_BT BIT NULL,
    observacao_VC VARCHAR(255) NULL,
    data_envio_DT DATETIME NULL,
    numero_nota_NM NUMERIC NULL,
    nome_cliente_VC VARCHAR(255) NULL
)