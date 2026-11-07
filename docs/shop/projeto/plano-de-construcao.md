---
title: Plano de construção
sidebar_position: 1
---

# Plano de construção do Shop

Aprovado em 06/11/2026 a partir do mockup da gestão (`/telas/shop/gestao`, revisado no mesmo dia:
ramo, como o item vende, como a loja entrega, fonte do catálogo por item). O que já existe: o
contrato de fonte de catálogo (`@facter/platform-contract` 0.4.0), o Chef respondendo nele e a
vitrine (`facter-shop`) lendo qualquer fonte, em inglês e com i18n.

Cada fatia termina com **uma URL local pra testar** e só a próxima começa depois do teste. O que a
arquiteta aprovar sobe junto com o lançamento da loja da Larissa ou depois dele, nunca no meio.

## Como fica montado

| Peça | Onde | O quê |
|---|---|---|
| **facter-shop-api** (novo) | NestJS 11 + Prisma 6 + Postgres (Supabase), mesmo desenho do Hub e do TechCare | Banco e regras do Shop: empresa, usuária, loja, catálogo, pedidos, aparência, domínio. **É uma fonte de catálogo** (responde o contrato) para as lojas que ele hospeda, e **encaminha** para a fonte de quem já tem produto Facter (hoje o Chef). Integra com o Hub pelo módulo `platform` (copiado do TechCare: liberações, provisionamento, webhooks). |
| **facter-shop** (existe) | Next 16 | Vitrine (`/store/<slug>`), que passa a falar **só com o shop-api** (`CATALOG_SOURCE_URL`). |
| **facter-shop-web** (novo) | Next 16 + Design System, mesma casca do Hub | O **painel** da dona, falando com o shop-api por `/api` (proxy, cookie de sessão no mesmo domínio). App separado da vitrine porque ela tem CSS próprio, flat, sem o preflight do Tailwind; no mesmo app um pisaria no outro. |
| **Chef** | módulo "Minha loja" | Loja de comida continua gerida no Chef (decisão de 05/11). Ganha Aparência e Domínio como abas quando o módulo Loja existir no Shop (fatia 6). |

Por que API separada em Nest: é o padrão da casa (Hub, TechCare), e o módulo de integração com o Hub já
existe pronto no TechCare. Domínio próprio da loja é resolvido na vitrine pelo host (fatia 4).

Regras que valem em tudo: código e identificadores em inglês; todo texto da tela em dicionário
(i18n); dinheiro em centavos inteiros; toda tabela com `companyId` e toda consulta filtrada por ele;
teste unitário nas regras, de API nas rotas, e a tela conferida no servidor local antes de avisar.

## Modelo (resumo)

- **Company** (`hubCompanyId`, nome) · **User** (e-mail, senha, papel OWNER; nasce pelo Hub)
- **Store** (uma por empresa): slug, nome, bio, WhatsApp, Instagram, logo; **ramo** (só palavras e sugestões); aparência (estilo, cor, frase, aviso); **entrega** (retirada, cidade com taxa/info, envio); Pix e sinal pra mensagem; pausada até; **fonte** (`self` ou a URL do produto que hospeda o catálogo)
- **Category**, **Item** (tipo produto/serviço, **como vende**, unidade, preço, foto, prazo, tamanhos com preço, grupos de opção, perguntas, extras ligados, disponível), **Extra**, **Banner** (com período)
- **Order** (número por loja, cliente nome/WhatsApp, retirada/entrega/envio, data, endereço, observação, situação: novo → confirmado → em preparo → pronto/enviado → entregue, ou recusado) e **OrderLine** (foto do item no dia: nome, tamanho, escolhas, extras, preço)
- **Domain** (endereço Facter e domínio próprio) na fatia 4

## Fatias

| # | Fatia | Mockup | O que entrega | O que você testa |
|---|---|---|---|---|
| 1 | **Fundação** | 0, 2 (casca) | shop-api com banco, login, módulo Hub (liberar produto cria empresa + dona), rotas públicas do contrato servindo o catálogo próprio e encaminhando o Chef; painel com login e casca (menu, Início vazio); vitrine apontada pro shop-api; loja de exemplo Made in Você por seed | Vitrine da Made in Você no ar sem Chef; a da Lari continua igual; login no painel; "Liberar produto" no Hub local cria a loja |
| 2 | **Produtos** | 4, 5 | Lista com busca e situação; **Editar produto** como tela guiada (foto, o que é, como vende, o que a cliente escolhe); extras; categorias; foto no Supabase Storage | Cadastrar um produto do zero e vê-lo na vitrine na hora |
| 3 | **Pedidos e Início** | 2, 3 | Fila, pedido aberto, confirmar (data, sinal, mensagem) e recusar, situações; Início com o dia da loja | Fazer um pedido na vitrine e confirmar no painel; mensagem abre no WhatsApp |
| 4 | **Aparência, Domínio, Configurações** | 6, 7, 8 | Estilo/marca/banners com prévia ao vivo; endereço Facter e domínio próprio (passo a passo + verificação); ramo, contato, entrega, pagamento na mensagem, integrações | Trocar o estilo e ver a vitrine mudar; apontar um domínio |
| 5 | **Pagamentos** | 9 | Gateway da própria dona (Mercado Pago primeiro), como o pedido fecha, formas, sinal, recebimentos | Conectar uma conta de teste e pagar um pedido |
| 6 | **Módulo no Chef e celular** | 1, 10 | Aparência e Domínio como abas do "Minha loja" do Chef; ajustes do painel no celular (abas embaixo, barra fixa) | A Larissa troca a cara da loja de dentro do Chef |

Fora do plano por enquanto: Correios/Melhor Envio, duas dimensões de variação com preço por
combinação, foto por variação, app instalável (PWA). Entram quando um cliente pedir.

## Situação

| Fatia | Situação | Onde testar |
|---|---|---|
| 1 | **entregue 06/11** ([detalhes](../engenharia/fatia-1-fundacao.md)) | API `localhost:3101/api/health` · vitrine `localhost:3100/store/made-in-voce` e `/store/doces-da-lari` · painel `localhost:3102` (`daniele@local.dev` / `senha-forte-123`) |
| 2 | **entregue 06/11** ([detalhes](../engenharia/fatia-2-produtos.md)) | painel `localhost:3102/items` (novo produto com foto → aparece na vitrine) |
| 3 | **entregue 06/11** ([detalhes](../engenharia/fatia-3-pedidos.md)) | pedido na vitrine → painel `localhost:3102/orders` → confirmar pelo WhatsApp; Início com o dia |
| 4 | **entregue 06/11** ([detalhes](../engenharia/fatia-4-aparencia.md)) | painel `localhost:3102/store` (trocar o estilo e ver o celular mudar; domínio) · `localhost:3102/settings` |
| 5 | **entregue 06/11** ([detalhes](../engenharia/fatia-5-pagamentos.md)) | `localhost:3102/settings?section=payment` (conectar, confirmar pedido com sinal → link na mensagem → recebimentos) |
| 6 | **entregue 06/11** ([detalhes](../engenharia/fatia-6-chef-e-celular.md)) | Chef `/loja` → abas Aparência e Domínio (com `SHOP_API_URL`); painel `localhost:3102` no celular |
| 7 | **entregue 06/11** ([detalhes](../engenharia/fatia-7-estilo-editorial-e-bio.md)) | vitrine `localhost:3100/store/esla` (estilo Editorial, igual ao site da ESLA) e `/store/esla/bio` · painel `localhost:3102/store` com `esla@local.dev` |

## Decisões em aberto

- Repositórios `facter-shop-api` e `facter-shop-web` no GitHub e projeto Supabase `facter-shop`: a arquiteta cria (ficam na conta da empresa). Os dois repos já existem localmente com o primeiro commit na `main`.
- Deploy do shop-api: Render free com o keep-alive do cron-job.org, como o TechCare, até ter cliente pagante.
