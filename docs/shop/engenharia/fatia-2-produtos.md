---
title: "Fatia 2: produtos"
sidebar_position: 11
---

# Fatia 2: produtos, categorias, extras e foto

Entregue em 06/11/2026. Mockup: seções 4 e 5 de `/telas/shop/gestao`.

## API (`facter-shop-api`)

| Rota | O quê |
|---|---|
| `GET /items?search&status&categoryId&page&perPage` | Lista da loja da dona, com `counts` (todos, ocultos, esgotados, sem foto) e `total`. Busca sem acento e sem símbolo, por palavra. |
| `GET /items/:id` · `POST /items` · `PUT /items/:id` | O item inteiro: nome, descrição, categoria, tipo, **como vende**, unidade, preço, foto, prazo, disponível, visível, **tamanhos**, **grupos de opção**, **perguntas**, **extras**. O `PUT` troca as listas inteiras numa transação. |
| `PATCH /items/:id/visible` | O toggle "na loja" da linha. |
| `DELETE /items/:id` | Apaga quando nunca entrou em pedido; senão esconde e responde 409 com o motivo. |
| `POST /items/reorder` | Ordem dentro da loja (a tela de arrastar fica pra depois). |
| `GET/POST/PUT/DELETE /categories` (+ `reorder`) | Categorias da loja; apagar deixa os produtos em "Outros". |
| `GET/POST/PUT/DELETE /extras` | Extras da loja; pedidos antigos guardam nome e preço do dia. |
| `POST /uploads` (multipart `file`) | Uma imagem (JPG/PNG/WebP/GIF, até 5 MB) → URL pública. Supabase Storage com `SUPABASE_*`; sem eles, disco local servido em `GET /public/uploads/:store/:name`. |

Regras que a API garante: categoria e extra de outra loja nunca se ligam a um item (404 mesmo com id
certo); produto sem preço e sem tamanho é recusado, serviço não; preço do card é o menor tamanho
disponível. Testes em `items.service.spec.ts` (20 no total na API).

## Painel (`facter-shop-web`)

- `/items`: PageHeader com "N na loja · M ocultos", abas Produtos · Categorias · Extras, busca
  (servidor, com atraso de 300 ms), filtros com contagem, tabela (foto, nome e pedidos, categoria,
  preço "a partir de", escolhas, situação, toggle na loja, ações), paginação do servidor, vazio com o
  passo a passo.
- **Editar produto** é um diálogo endereçável (`?new=1`, `?edit=<id>`), no `ActionDialog` grande do
  DS: foto e prévia do card à esquerda; à direita as três perguntas do mockup (o que é · como vende
  · o que a cliente escolhe), com os chips ligando blocos (tamanhos com preço, variações, perguntas,
  extras) e a consequência no rodapé ("Aparece em Canecas · a partir de R$ 49,00", "Sem foto: não
  aparece na loja"). Categoria e extra novos nascem de dentro do diálogo.
- Categorias e Extras: listas com edição na linha e confirmação pra apagar.
- Textos em `src/lib/i18n/pt-BR.ts`; teste garante que toda chave usada existe. Fonte Sora nos
  títulos (`--font-heading`), como no Truck e no TechCare.

## Como testar

Painel `http://localhost:3102/items` (`daniele@local.dev` / `senha-forte-123`): novo produto com foto,
"sob encomenda", uma pergunta → Salvar → abre `http://localhost:3100/store/made-in-voce` e o produto está
lá, com a pergunta no "montar".

## Pendências

Arrastar pra reordenar (a API já tem `reorder`); foto por tamanho; duas dimensões de variação com
preço por combinação (só se cliente pedir).

## Preço promocional (regra de 06/11, padrão Nuvemshop)

Dois campos no produto: **Preço** (normal) e **Preço promocional** (`promoPriceCents`, o que a cliente
paga). Nunca "Preço de" / `compareAtPrice`. Vazio ou zero = sem promoção. O painel recusa promocional
maior ou igual ao normal ("O preço promocional precisa ser menor que o preço normal."); a API valida
de novo. A regra mora no contrato (`@facter/platform-contract` 0.7.0): `hasPromo`, `sellingPriceCents`
e `promoPercent`, usados por vitrine, painel, sacola e pedido. Com promoção a vitrine mostra o normal
riscado, o promocional em destaque e a etiqueta `-N%`; a sacola e o pedido cobram o promocional.
Tamanho tem preço próprio, então item com tamanhos não tem promoção (o catálogo nem a devolve).
Testes: `item-form.test.ts` (painel), `catalog.test.ts` (vitrine), `orders.service.spec.ts` e
`catalog.service.spec.ts` (API).

## Ficha técnica e "Combina com" (06/11, pedido da ESLA)

O produto ganhou o passo 4, **Ficha técnica**: o que a cliente pergunta antes de comprar, e os campos
mudam com o ramo (semijoias: material, banho, medidas, peso, garantia, pedra, cuidados e os selos
antialérgico/sem níquel/pode molhar; personalizados: material, medidas, peso, o que personaliza, prazo;
comida: ingredientes, serve, validade, conservação e os selos sem glúten/lactose/açúcar, vegano,
contém castanhas; assistência: o que inclui, garantia, tempo, peças). Todo ramo pode acrescentar
linhas livres (rótulo e valor). As chaves vivem em `core/specs.ts` (API) e `features/items/lib/specs.ts`
(painel) e têm que bater. `Item.specs` é JSON `{ values, flags, lines }`; o catálogo (contrato **0.9.0**)
entrega `specs` já como linhas rótulo/valor nas palavras da dona e `badges` como etiquetas; vazio não
aparece. "Cuidados" vazio usa o **texto padrão da loja** (`Store.careText`, Configurações › Contato).
A vitrine mostra "Detalhes" embaixo da descrição e os selos como chips.

Passo 5, **Combina com** (`Item.relatedIds`, até seis): escolhidos pelo nome no diálogo, aparecem
primeiro na seção de relacionados da vitrine (depois vêm os automáticos da mesma categoria).
Testes: `catalog.service.spec.ts` (ficha, cuidados padrão, relacionados visíveis), `item-form.test.ts`,
`catalog.test.ts`.

