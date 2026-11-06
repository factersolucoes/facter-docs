---
title: "Fatia 1: fundação"
sidebar_position: 10
---

# Fatia 1: fundação

Entregue em 06/11/2026. Plano completo em [Plano de construção](../projeto/plano-de-construcao.md).

## Repositórios

| Repo | O quê | Local |
|---|---|---|
| `facter-shop-api` | NestJS 11 + Prisma 6 + Postgres. Banco e regras; fonte de catálogo; integração com o Hub | `:3101/api` (banco Docker `facter-shop-db`, porta 5435) |
| `facter-shop-web` | Painel da dona (Next 16 + DS), mesma casca do Hub | `:3102` |
| `facter-shop` | Vitrine (o que a cliente vê). Lê **só** a API do Shop | `:3100/store/<slug>` |

Por que o painel é um app separado da vitrine: a vitrine tem CSS próprio, flat, sem o preflight do
Tailwind e com os tokens da marca da loja; o painel usa o Design System inteiro. No mesmo app um
pisaria no outro. (O plano dizia um app só; mudou aqui.)

## O que a API faz

- **Fonte de catálogo** (`@facter/platform-contract`): `GET /public/storefront/:slug` e
  `POST /public/storefront/:slug/orders`, respondidos **crus** (sem o envelope `{data}` das outras rotas),
  para a loja hospedada aqui. Loja despublicada, pausada ou fora do plano → 404, igual ao Chef.
- **Encaminhador**: `Store.catalogSourceUrl` preenchido (hoje o Chef) → a mesma rota busca lá, valida com
  o contrato e devolve. A vitrine só conhece esta API; a fonte é por loja hoje e vira por item quando
  precisar.
- **Pedido**: preço nunca vem do navegador. `OrdersService` recalcula por tamanho, extras por unidade e
  taxa de entrega, numera por loja numa transação (`Store.orderCounter`) e copia o item na linha
  (`OrderLine`: nome, tamanho, escolhas, extras, preço do dia).
- **Sessão**: `POST /auth/login` → cookies httpOnly `access_token` (15 min) e `refresh_token` (7 dias,
  caminho `/api/auth`), `GET /auth/me` (dona, empresa, loja, liberações do plano), `POST /auth/refresh`,
  `POST /auth/logout`. Guard global: toda rota exige sessão salvo `@Public()`.
- **Hub** (`src/infra/platform`, copiado do TechCare): liberações `storefront` e `custom_domain` em cache
  (`hub_entitlements`, TTL em vigor vale sobre o guardado), webhooks assinados (`POST /webhooks/hub`),
  "Liberar produto" (`POST /integration/companies`) abre **empresa + dona + loja despublicada** com slug do
  nome. Sem `HUB_*`, tudo liberado.

## Modelo

`Company` (hubCompanyId) → `User` (OWNER/STAFF, uma empresa) → `Store` (uma por empresa: slug, palavras, ramo,
aparência, entrega, Pix/sinal, pausa, publicada, `catalogSourceUrl`, `orderCounter`) → `Category`, `Item`
(tipo produto/serviço, **como vende** READY/MADE_TO_ORDER/SCHEDULED/SERVICE, unidade, preço, foto, prazo,
disponível, visível; `ItemSize`, `ItemOptionGroup`/`ItemOption`, `ItemQuestion`, `ItemExtra`), `Extra`,
`Banner` (período), `Order` (número por loja, cliente, retirada/entrega/envio, data, endereço, observação,
total, situação) e `OrderLine`.

## Invariantes

| Id | Regra | Onde prova |
|---|---|---|
| SH-1 | Preço de pedido é calculado na API a partir das linhas da loja; o navegador manda ids e quantidades | `orders.service.spec.ts` |
| SH-2 | Toda resposta pública passa pelo `catalogStore.parse` antes de sair; drift do contrato falha na API | `catalog.service.spec.ts` |
| SH-3 | Loja fora do plano (Hub) responde 404 como despublicada | `catalog.service.spec.ts`, `platform.service.spec.ts` |
| SH-4 | Número de pedido é sequencial por loja, dentro da transação que cria o pedido | `orders.service.ts` |
| SH-5 | A vitrine só fala com a API do Shop; nunca com o Chef ou outro produto | `facter-shop/lib/catalog-source.ts` |

## Como testar

1. API: `npm run dev` em `facter-shop-api` (banco: `docker start facter-shop-db`; seed: `npm run prisma:seed`).
2. Vitrine: `pnpm dev` em `facter-shop` com `CATALOG_SOURCE_URL=http://localhost:3101/api` →
   `http://localhost:3100/store/made-in-voce` (hospedada) e `/store/doces-da-lari` (encaminhada ao Chef em :3333).
3. Painel: `pnpm dev` em `facter-shop-web` → `http://localhost:3102`, `daniele@local.dev` / `senha-forte-123`.
4. Hub local: "Liberar produto" do Shop pra uma empresa chama `POST /integration/companies` e cria a loja.

## Fica pra próxima fatia

Produtos e Editar produto (fatia 2). O ramo (`segment`) entrou no contrato 0.5.0 como opcional, pra
vitrine falar no vocabulário certo; publicar junto com a fatia.
