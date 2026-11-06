---
title: "Fatia 5: Pagamentos"
sidebar_position: 14
---

# Fatia 5: Pagamentos

Entregue em 06/11/2026. Mockup: seção 9 de `/telas/shop/gestao`. Primeiro gateway: Mercado Pago.

O dinheiro não passa pela Facter. A dona cola as credenciais da conta dela; a API só pede cobranças
e lê o resultado. Nesta fatia o pedido fecha como antes (a dona confirma) e a cliente recebe um
**link de pagamento** junto da confirmação, pro sinal ou pro valor todo. "Pagar na loja" (cobrar no
checkout, antes de chegar pra dona) ficou gravado no schema (`checkoutPayment`) mas não é oferecido
ainda: precisa de mudança no contrato e, pra comida, da vitrine conferir a agenda do Chef.

## API (`facter-shop-api`)

| Rota | O quê |
|---|---|
| `GET/PUT/DELETE /payments/gateway` | A conta conectada (provider, modo teste/produção, e-mail, dica da chave). Conectar valida a chave no Mercado Pago (`/users/me`) antes de guardar; chave recusada nunca entra. |
| `GET /payments?days=30` | Recebimentos: os links dos últimos N dias e o total pago no mês. |
| `POST /payments/orders/:id/check` | "Conferir agora": procura no gateway os pagamentos pendentes do pedido. |
| `POST /public/payments/mercado-pago?store=` | Webhook. Público e sem throttle. O corpo só diz **qual** pagamento mudou; a situação vem de uma leitura com a chave da dona. Responde 200 sempre. |
| `PUT /store/settings` | Ganhou `allowPix`, `allowCard`, `allowBoleto`, `maxInstallments`. |
| `POST /orders/:id/confirm` | Com gateway e sinal/valor todo, cria o `Payment` e a preferência (Checkout Pro) com `external_reference` = id do pagamento. Falha do gateway não bloqueia a confirmação. O pedido devolve `payments`. |

**Segurança.** Chave guardada com AES-256-GCM (`PAYMENT_SECRET_KEY`, 32 bytes hex); sem a variável
ninguém conecta gateway. O painel só recebe `tokenHint` (`APP_USR-…ab12`). Pagamento só vira "pago"
se o gateway disse `approved` **e** o valor pago cobre o pedido; estorno nunca é desfeito por
notificação atrasada. `MERCADO_PAGO_API_URL` troca o destino (um stand-in local para teste).

Modelos: `PaymentGateway` (um por loja) e `Payment` (sinal ou valor todo; pendente, pago, estornado,
não pagou; forma pix/cartão/boleto; `externalId` único). Migration `payments`. Testes:
`payments.service.spec.ts` (crypto, mapeamento, conectar, link, webhook, valor menor, estorno),
`orders.service.spec.ts` (link só pra sinal/valor todo).

## Painel (`facter-shop-web`)

- **Configurações → Pagamento**: "Onde o dinheiro cai" (Mercado Pago: conectar / conectado como X
  desde Y / desconectar com confirmação; etiqueta "em teste" quando a chave é `TEST-`); diálogo de
  conectar com o passo a passo, chave secreta validada no formato, chave pública opcional e a nota
  de segurança; "O que a cliente pode escolher" (Pix, cartão com parcelas no máximo, boleto); sinal;
  "Sem gateway" (Pix na mensagem como fallback); **Recebimentos** (pedido, forma, quando, situação,
  valor; recebido no mês; abrir no Mercado Pago).
- **Pedido**: ao confirmar com gateway, a consequência avisa "vai junto um link de pagamento" e a
  mensagem do WhatsApp troca "me manda o comprovante" pelo link. No pedido aberto aparece a linha do
  pagamento (Pago / Aguardando / Estornado, valor, forma, "Abrir link", "Conferir agora").

Palavras em `features/payments/lib/payment-words.ts`, com teste.

## Pra testar local

Rodar o stand-in do Mercado Pago (`fake-mercado-pago.mjs`, porta 3199) e deixar
`MERCADO_PAGO_API_URL=http://localhost:3199` no `.env` da API. Conectar com qualquer chave `TEST-…`,
confirmar um pedido com sinal, e `POST http://localhost:3199/_pay/<pref-id>` faz a "cliente" pagar e
dispara o webhook. Com a conta real: tirar a variável e colar a chave de produção.
