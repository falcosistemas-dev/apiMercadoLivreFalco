CREATE TABLE pedidos_mercadolivre_T(
    order_id_NM NUMERIC PRIMARY KEY NOT NULL,
    shipment_id_NM NUMERIC NULL,
    id_vendedor_mercadolivre_NM NUMERIC NOT NULL,
    enviado_BT BOOLEAN NULL,
)