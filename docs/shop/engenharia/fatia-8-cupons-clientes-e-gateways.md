---
title: "Fatia 8: cupons, clientes e gateways"
sidebar_position: 17
---

# Fatia 8: cupons, clientes e gateways

Entregue em 07/11/2026. Veio de três perguntas da arquiteta na mesma noite: "não temos clientes,
cupons?", "por que o diálogo do Mercado Pago não está 100% igual ao mockup?" e "fez de uma forma que
quando os outros gateways chegarem sejam fáceis?".

## Cupons

Um código que a cliente digita na sacola. A regra mora num lugar só (`core/coupons.ts`): a vitrine
pergunta antes do pedido e o pedido pergunta de novo na hora de fechar, e os dois recebem a mesma
resposta, ou a mesma recusa nas palavras da cliente.

| Onde | O quê |
|---|---|
| contrato `0.11.0` | `catalogOrderRequest.couponCode`; `POST /public/storefront/:slug/coupon` (`catalogCouponRequest` = código + itens da sacola; `catalogCouponResponse` = código, o que faz, desconto em centavos). Publicar no npm antes do deploy. |
| `facter-shop-api` | tabela `coupons` (código único por loja, `PERCENT` ou `FIXED`, pedido mínimo, começa/termina, limite de usos, ligado); `orders.couponCode` + `orders.discountCents` (o total já sai líquido; o desconto é sobre os itens, nunca sobre a entrega). Módulo `coupons` (CRUD da dona + `apply` + `consume` dentro da transação do pedido). Loja com catálogo no Chef responde 422: cupom é da loja hospedada aqui. |
| vitrine | campo "Tem um cupom?" no resumo da sacola; aplicado, vira a linha "Cupom X · 10% de desconto" com "tirar", e "Desconto" entra antes do total. Se a sacola muda, pergunta de novo. O código vai no pedido. |
| painel | **Cupons** na barra lateral: lista com código, o que faz, situação (valendo / agendado / vencido / esgotado / desligado), usos "1 de 20", interruptor; diálogo com código (vira maiúsculas, sem espaço), % ou R$, pedido mínimo, datas, limite de usos; a frase do rodapé resume tudo. O detalhe do pedido mostra a linha do cupom. |

Testes: `core/coupons.spec.ts` (porcentagem, fixo, teto, cada recusa, fim do dia), pedido com cupom no
`storefront/orders.service.spec.ts`, `coupon-form.test.ts` no painel.

## Clientes

Não existe cadastro: cliente é quem já pediu, uma linha por WhatsApp, lida dos próprios pedidos
(`GET /customers`, `groupBy`). Nome como ela escreveu da última vez, quantos pedidos, quanto gastou
(sem recusados e cancelados), último pedido. Tela **Clientes** com busca por nome ou número, "Ver
pedidos" (abre Pedidos em "Todos" já filtrado pelo número) e WhatsApp.

## Recebimentos na barra lateral

"Pagamento" em Configurações é só **como cobrar** (gateway, como o pedido fecha, o que a cliente
escolhe, Pix na mensagem). O **extrato** ganhou tela própria, **Recebimentos**: período (7/30/90
dias), filtro por situação, três números (recebido no período, aguardando, recebido no mês) e a
lista de links com pedido, cliente, sinal ou valor todo, forma, quando, situação, valor, "Conferir"
nos pendentes e o link. Sem gateway, a tela explica e manda pra Configurações.

## Conectar o Mercado Pago igual ao mockup

O diálogo ganhou o botão "Entrar com a minha conta do Mercado Pago" (OAuth), o divisor "ou cole as
chaves" e as duas chaves lado a lado; sumiu o passo a passo.

- API: `GET /payments/gateway/oauth/start?provider=` devolve a URL da página de consentimento (ou
  `null` sem aplicação configurada, e o painel avisa pra colar as chaves); `GET
  /public/payments/:provider/oauth/callback` troca o código pelo token, guarda criptografado e manda a
  dona de volta pro painel com `?gateway=connected|denied|error`. O `state` é assinado por loja e
  vale dez minutos (`oauth-state.ts`, com teste). Env: `MERCADO_PAGO_AUTH_URL`,
  `MERCADO_PAGO_CLIENT_ID`, `MERCADO_PAGO_CLIENT_SECRET` (os dois ou nenhum), `PANEL_URL`.
- Local: o stand-in do Mercado Pago (`scratchpad/fake-mercado-pago.mjs`, :3199) tem a página de
  consentimento e o `/oauth/token`. Em produção é preciso criar a aplicação da Facter no Mercado Pago
  e colar o client id/secret no Render.
- O que ficou diferente do mockup, de propósito: a frase do rodapé diz "a gente confere a chave com
  o Mercado Pago antes de guardar" em vez da cobrança de R$ 1 com estorno, porque o gateway não cobra
  sozinho sem um cartão de quem paga.
- Os interruptores de "Como o pedido fecha" mostram o que está valendo: sem gateway, "Pagar na loja"
  aparece desligado (antes aparecia ligado e travado, e parecia regra do ramo; não é).

## Gateways: um adaptador por provedor

`payments/gateway.adapter.ts` é a forma que o serviço conhece: conta do token, link de cobrança,
leitura de um pagamento, id que o webhook nomeia, OAuth opcional. `MercadoPagoAdapter` é o primeiro.
As rotas públicas levam o slug do provedor (`/public/payments/:provider`, `/public/payments/:provider/oauth/callback`),
o pedido guarda `provider`, o diálogo do painel recebe o provedor e o nome. Pagar.me, Asaas e Stripe
entram como um adaptador novo + um valor no enum `PaymentProvider`; nada no serviço nem no painel.

## Guia de primeiros passos (Início)

A dona nova cai no Início com o card **"Deixe a loja pronta"**: seis passos lidos da própria loja
(estilo/cor/logo escolhidos · primeiro produto com foto · WhatsApp e forma de entrega · como recebe,
opcional · loja publicada · endereço compartilhado), barra de progresso, o próximo passo em destaque
com a frase que explica, e um botão por passo que leva à tela certa. "Compartilhar" conta quando ela
copia ou abre o endereço (lembrado no navegador) ou quando já existe pedido. Com os obrigatórios
feitos, o card some sozinho e o Início vira o do dia a dia. Regras em `features/home/lib/setup-steps.ts`,
com teste. Loja criada pelo Hub nasce despublicada: o passo 5 é o que destrava a vitrine.

O guia é **compacto e fixo no topo** do Início: anel de progresso, o passo da vez com a frase e o
botão dele, e "Ver os passos" abre a lista inteira. Fechou tudo, some.

## Prévia de loja ainda não publicada

Loja nova (inclusive a que nasce pelo Hub) começa despublicada e a vitrine pública responde 404 até
publicar. A prévia do painel precisava enxergar antes disso, sem abrir pra quem chuta o endereço:
`store/me` entrega um `previewToken` (slug + validade de um dia, assinado com `JWT_SECRET`,
`core/preview-token.ts`), o painel manda em `?preview=1&pt=…`, a vitrine repassa à fonte e a API
aceita só com token válido, respondendo sem cache. Sem token, despublicada continua 404.

## Cookies com nome próprio

No local todo painel Facter grava `access_token`/`refresh_token` no mesmo `localhost` (porta não
separa cookie): entrar no Hub derrubava a sessão do Shop e o painel ficava em loop de 401. O Shop usa
`shop_access_token`/`shop_refresh_token` (API e middleware do painel), e a renovação que falha apaga
os cookies. TechCare, Chef e Hub ainda compartilham nomes entre si.
