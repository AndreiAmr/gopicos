INSERT INTO
  "public"."User" ("id", "name", "email", "password")
VALUES
  (
    'a996c0af-96aa-4fc8-bb6a-dae4280904ea',
    'Andrei',
    'test@gmail.com',
    '$2b$10$uzg17qBIb9ct6AIcjca8huWvURpEHuBSRklubJx4t7gxCGVmH.Fwy'
  );

INSERT INTO "public"."User" ("id", "name", "email", "password") VALUES 
  ('b1111111-1111-4111-8111-111111111111', 'Carlos Silva', 'carlos@gmail.com', '$2b$10$uzg17qBIb9ct6AIcjca8huWvURpEHuBSRklubJx4t7gxCGVmH.Fwy'),
  ('b2222222-2222-4222-8222-222222222222', 'Mariana Costa', 'mariana@gmail.com', '$2b$10$uzg17qBIb9ct6AIcjca8huWvURpEHuBSRklubJx4t7gxCGVmH.Fwy'),
  ('b3333333-3333-4333-8333-333333333333', 'João Pedro', 'joao@gmail.com', '$2b$10$uzg17qBIb9ct6AIcjca8huWvURpEHuBSRklubJx4t7gxCGVmH.Fwy'),
  ('b4444444-4444-4444-8444-444444444444', 'Beatriz Souza', 'beatriz@gmail.com', '$2b$10$uzg17qBIb9ct6AIcjca8huWvURpEHuBSRklubJx4t7gxCGVmH.Fwy'),
  ('b5555555-5555-4555-8555-555555555555', 'Felipe Santos', 'felipe@gmail.com', '$2b$10$uzg17qBIb9ct6AIcjca8huWvURpEHuBSRklubJx4t7gxCGVmH.Fwy'),
  ('b6666666-6666-4666-8666-666666666666', 'Ana Paula', 'ana@gmail.com', '$2b$10$uzg17qBIb9ct6AIcjca8huWvURpEHuBSRklubJx4t7gxCGVmH.Fwy'),
  ('b7777777-7777-4777-8777-777777777777', 'Lucas Oliveira', 'lucas@gmail.com', '$2b$10$uzg17qBIb9ct6AIcjca8huWvURpEHuBSRklubJx4t7gxCGVmH.Fwy');


INSERT INTO "public"."Spot" (
  "id", 
  "name", 
  "description", 
  "authorId", 
  "modality", 
  "equipmentRequired", 
  "isPaid", 
  "alwaysOpen", 
  "entryAmount", 
  "openingHours", 
  "hasCoverage",
  "coordinates",
  "images"
) VALUES (
  '25d469e4-91d5-499e-9f2a-3cacdc5f7708',
  'TESTE DE REGRA',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque dui erat, ultrices nec sodales a, maximus et sapien. Fusce sed pretium lacus. Curabitur porta, ex ut maximus ornare, metus nisi varius augue, at vehicula odio ex non ipsum. Nullam velit enim, scelerisque nec tellus hendrerit, semper accumsan velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Donec nec mauris tristique, suscipit odio id, tempus mauris. Suspendisse at eleifend lectus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam lobortis tellus mi. Etiam aliquam ex purus, et egestas massa imperdiet ac.',
  'a996c0af-96aa-4fc8-bb6a-dae4280904ea',
  'vertical',
  false,
  false,
  true,
  NULL,
  NULL,
  false,
  '[[[-27.19309400914679,24.559960862087465],[-24.75288598960907,4.7868428639093565],[10.232247379408562,10.69479761334523],[10.857795682639306,35.876551237214954],[-27.19309400914679,24.559960862087465]]]'::jsonb,
  ARRAY[
    'https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784996319/a996c0af-96aa-4fc8-bb6a-dae4280904ea/10a8ee2c-304a-41de-9273-2ff66972f49c/file_kv5ql4.png',
    'https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784995898/a996c0af-96aa-4fc8-bb6a-dae4280904ea/358d0eb8-08ff-4cb4-951a-b3f805b365d6/file_t5wgzt.jpg',
    'https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784995900/a996c0af-96aa-4fc8-bb6a-dae4280904ea/358d0eb8-08ff-4cb4-951a-b3f805b365d6/file_nqjcan.jpg'
    ]
);
-- -- 1. INSERTS DOS USUÁRIOS (1 Original + 7 Novos)


INSERT INTO "public"."Spot" (
  "id", "name", "description", "authorId", "modality", "equipmentRequired", 
  "isPaid", "alwaysOpen", "entryAmount", "openingHours", "hasCoverage", "coordinates", "images"
) VALUES 
(
  'c1111111-1111-4111-8111-111111111111', 'Pista de Skate Centro', 'Ótima pista de street com vários caixotes e corrimões. Bastante movimentada nos fins de semana.', 
  'b1111111-1111-4111-8111-111111111111', 'street', false, false, true, NULL, NULL, false, 
  '[[[-23.5505,-46.6333],[-23.5505,-46.6324],[-23.5514,-46.6324],[-23.5514,-46.6333],[-23.5505,-46.6333]]]'::jsonb, 
  ARRAY['https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784996319/a996c0af-96aa-4fc8-bb6a-dae4280904ea/10a8ee2c-304a-41de-9273-2ff66972f49c/file_kv5ql4.png']::text[]
),
(
  'c2222222-2222-4222-8222-222222222222', 'Bowl do Parque', 'Bowl fundo e rápido, perfeito para treinar aéreo. Exige equipamento de segurança.', 
  'b2222222-2222-4222-8222-222222222222', 'vertical', true, true, false, '15', '08:00-20:00', true, 
  '[[[-23.5615,-46.6553],[-23.5615,-46.6544],[-23.5624,-46.6544],[-23.5624,-46.6553],[-23.5615,-46.6553]]]'::jsonb, 
  ARRAY['https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784995898/a996c0af-96aa-4fc8-bb6a-dae4280904ea/358d0eb8-08ff-4cb4-951a-b3f805b365d6/file_t5wgzt.jpg']::text[]
),
(
  'c3333333-3333-4333-8333-333333333333', 'Praça da Matriz', 'Pico de rua clássico. Chão liso e algumas escadas para pular. Cuidado com os pedestres.', 
  'a996c0af-96aa-4fc8-bb6a-dae4280904ea', 'street', false, false, true, NULL, NULL, false, 
  '[[[-23.5705,-46.6433],[-23.5705,-46.6424],[-23.5714,-46.6424],[-23.5714,-46.6433],[-23.5705,-46.6433]]]'::jsonb, 
  ARRAY['https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784996319/a996c0af-96aa-4fc8-bb6a-dae4280904ea/10a8ee2c-304a-41de-9273-2ff66972f49c/file_kv5ql4.png', 'https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784995900/a996c0af-96aa-4fc8-bb6a-dae4280904ea/358d0eb8-08ff-4cb4-951a-b3f805b365d6/file_nqjcan.jpg']::text[]
),
(
  'c4444444-4444-4444-8444-444444444444', 'Galpão Skatepark', 'Skatepark indoor completo com área de street e transição. Ótimo para dias de chuva.', 
  'b4444444-4444-4444-8444-444444444444', 'both', true, true, false, '35', '10:00-22:00', true, 
  '[[[-23.5405,-46.6233],[-23.5405,-46.6224],[-23.5414,-46.6224],[-23.5414,-46.6233],[-23.5405,-46.6233]]]'::jsonb, 
  ARRAY['https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784995900/a996c0af-96aa-4fc8-bb6a-dae4280904ea/358d0eb8-08ff-4cb4-951a-b3f805b365d6/file_nqjcan.jpg']::text[]
),
(
  'c5555555-5555-4555-8555-555555555555', 'Ladeira do Pôr do Sol', 'Ladeira suave, perfeita para treinar downhill slide. Asfalto de qualidade mediana.', 
  'b5555555-5555-4555-8555-555555555555', 'street', true, false, true, NULL, NULL, false, 
  '[[[-23.5805,-46.6733],[-23.5805,-46.6724],[-23.5814,-46.6724],[-23.5814,-46.6733],[-23.5805,-46.6733]]]'::jsonb, 
  ARRAY['https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784996319/a996c0af-96aa-4fc8-bb6a-dae4280904ea/10a8ee2c-304a-41de-9273-2ff66972f49c/file_kv5ql4.png']::text[]
),
(
  'c6666666-6666-4666-8666-666666666666', 'Half Pipe Abandonado', 'Half antigo, madeira um pouco gasta mas dá pra brincar. Leve sua vassoura antes de andar.', 
  'b6666666-6666-4666-8666-666666666666', 'vertical', false, false, true, NULL, NULL, true, 
  '[[[-23.5305,-46.6833],[-23.5305,-46.6824],[-23.5314,-46.6824],[-23.5314,-46.6833],[-23.5305,-46.6833]]]'::jsonb, 
  ARRAY['https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784995898/a996c0af-96aa-4fc8-bb6a-dae4280904ea/358d0eb8-08ff-4cb4-951a-b3f805b365d6/file_t5wgzt.jpg']::text[]
),
(
  'c7777777-7777-4777-8777-777777777777', 'Mini Ramp da Vila', 'Mini ramp coberta, transição delícia. Pico fechado, precisa falar com o dono pra entrar.', 
  'b7777777-7777-4777-8777-777777777777', 'vertical', false, true, false, '10', '14:00-21:00', true, 
  '[[[-23.5905,-46.6933],[-23.5905,-46.6924],[-23.5914,-46.6924],[-23.5914,-46.6933],[-23.5905,-46.6933]]]'::jsonb, 
  ARRAY['https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784995900/a996c0af-96aa-4fc8-bb6a-dae4280904ea/358d0eb8-08ff-4cb4-951a-b3f805b365d6/file_nqjcan.jpg']::text[]
),
(
  'c8888888-8888-4888-8888-888888888888', 'Pico da Estação', 'Bordas de granito e chão liso perto do metrô. Os guardas costumam embaçar depois das 22h.', 
  'b1111111-1111-4111-8111-111111111111', 'street', false, false, true, NULL, NULL, false, 
  '[[[-23.5205,-46.6133],[-23.5205,-46.6124],[-23.5214,-46.6124],[-23.5214,-46.6133],[-23.5205,-46.6133]]]'::jsonb, 
  ARRAY['https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784996319/a996c0af-96aa-4fc8-bb6a-dae4280904ea/10a8ee2c-304a-41de-9273-2ff66972f49c/file_kv5ql4.png']::text[]
),
(
  'c9999999-9999-4999-8999-999999999999', 'Bowl Clube', 'Piscina estilo old school. Coping block e azulejos. Clube cobra entrada.', 
  'a996c0af-96aa-4fc8-bb6a-dae4280904ea', 'vertical', true, true, false, '50', '09:00-18:00', false, 
  '[[[-23.6005,-46.7033],[-23.6005,-46.7024],[-23.6014,-46.7024],[-23.6014,-46.7033],[-23.6005,-46.7033]]]'::jsonb, 
  ARRAY['https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784995898/a996c0af-96aa-4fc8-bb6a-dae4280904ea/358d0eb8-08ff-4cb4-951a-b3f805b365d6/file_t5wgzt.jpg']::text[]
),
(
  'c0000000-0000-4000-8000-000000000000', 'Pista Nova Mogi', 'Pista recém construída. Transições perfeitas e área de street com corrimão redondo.', 
  'b3333333-3333-4333-8333-333333333333', 'both', false, false, true, NULL, NULL, false, 
  '[[[-23.5105,-46.6033],[-23.5105,-46.6024],[-23.5114,-46.6024],[-23.5114,-46.6033],[-23.5105,-46.6033]]]'::jsonb, 
  ARRAY['https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784995900/a996c0af-96aa-4fc8-bb6a-dae4280904ea/358d0eb8-08ff-4cb4-951a-b3f805b365d6/file_nqjcan.jpg', 'https://res.cloudinary.com/dmwqgvqfi/image/upload/v1784996319/a996c0af-96aa-4fc8-bb6a-dae4280904ea/10a8ee2c-304a-41de-9273-2ff66972f49c/file_kv5ql4.png']::text[]
);