---
title: "Fatia 3: pedidos e Início"
sidebar_position: 12
---

# Fatia 3: pedidos e Início

Entregue em 06/11/2026. Mockup: seções 2 e 3 de `/telas/shop/gestao`.

## API (`facter-shop-api`)

| Rota | O quê |
|---|---|
| `GET /orders?status=new|confirmed|ready|delivered|refused|all&search&page&perPage` | A fila, mais recente primeiro, com `counts` por situação. Busca por nome, WhatsApp ou número. |
| `GET /orders/:id` | O pedido com as linhas (nome, tamanho, escolhas, extras, preço do dia). |
| `POST /orders/:id/confirm` | `NEW → CONFIRMED` com data, hora, como paga (`DEPOSIT`, `FULL`, `ON_DELIVERY`) e o sinal, que nunca passa do total. |
| `POST /orders/:id/refuse` | `NEW`/`CONFIRMED → REFUSED` com motivo opcional. |
| `POST /orders/:id/advance` | `CONFIRMED → PREPARING → READY → DELIVERED`; pular pra frente pode, voltar não. |
| `GET /home` | O dia da loja: pedidos novos, saem hoje (por retirada/entrega/envio), vendas do mês, pedidos de hoje, mais pedidos no mês, avisos (sem foto, fora do ar, pausada). |

Situações e carimbos: `confirmedAt`, `readyAt`, `deliveredAt`, `refusedAt`; `depositMode`, `depositCents`,
`neededTime`, `refusalReason` (migration `order_confirmation`). Testes em `orders.service.spec.ts`.

## Painel (`facter-shop-web`)

- `/orders`: console. À esquerda a fila (filtros com contagem, busca, linha com iniciais, número e nome,
  situação, itens, "há 12 min · pela loja · sáb 8/11 · retirada", total). À direita o pedido aberto
  (linhas com as escolhas da cliente destacadas, total, retirada/entrega e data, pagamento, cliente
  com atalho pro WhatsApp, ações da situação, linha do tempo). O pedido aberto fica na URL (`?order=`).
- **Confirmar** é diálogo (`ActionDialog` md): data e hora, pagamento (sinal de N% · R$, tudo agora,
  na retirada/entrega/postagem), mensagem editável já escrita com o Pix da loja, consequência
  ("Entra na agenda de sáb 8/11 e o pedido vai pra Confirmados"). "Confirmar e enviar" grava e abre o
  WhatsApp da cliente com o texto.
- **Recusar** é `ConfirmDialog` com motivo opcional; também abre o WhatsApp com o aviso.
- **Início**: saudação pela hora, data por extenso, três números (pedidos novos com borda forte,
  saem hoje, vendas no mês), pedidos de hoje (link pro pedido aberto), a sua loja (endereço, abrir,
  copiar, avisos) e mais pedidos no mês.

Palavras do pedido em `features/orders/lib/order-words.ts` (data curta, "há N min", mensagem de
confirmação), com teste.

## Como testar

Faz um pedido em `http://localhost:3100/store/made-in-voce` → painel `/orders` → abre, **Confirmar**
(escolhe data e sinal) → o WhatsApp abre com a mensagem → o pedido vai pra "Confirmados" → **Pronto** →
**Entregue**. O Início mostra o pedido do dia e a venda no mês.

## Pendências

"Pedido pelo direct" (cadastrar à mão o que chegou fora da loja); visitas na loja (analytics da
vitrine); comprovante do Pix fica no WhatsApp.
