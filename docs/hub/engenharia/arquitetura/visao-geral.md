---
title: Visão geral
sidebar_position: 1
---

# Arquitetura do Hub

O Hub é o painel de controle dos produtos Facter. Dois repositórios:

- **`facter-hub-api`**: NestJS 11, Prisma 6, PostgreSQL, Redis, Stripe. Prefixo global `/api`. Arquitetura em camadas: `core/domain` (entidades, repositórios), `application/<módulo>` (controllers, casos de uso, DTOs, mappers), `infra` (Prisma, auth, cache).
- **`facter-hub-web`**: Next 16 (App Router), design system `@facter/ds-core` via link local, TanStack Query, Zustand, react-hook-form + zod. Estrutura por feature em `src/features/<nome>/{domain,data,presentation}`.

## O que existe (05/11/2026)

| Área | API | Painel |
|---|---|---|
| Auth, sessões, troca de empresa | sim | sim |
| Usuários (bloquear, papéis do Hub) | `admin/users` | sim |
| Empresas, membros, convites | `companies`, `admin/companies` | sim, com assinaturas da empresa |
| Produtos | `admin/products` | sim |
| Features e planos (o que cada plano libera) | `admin/features`, `admin/plans/:id/features` | sim, no detalhe do produto |
| Assinaturas (trial, trocar plano, cancelar, reativar) | `admin/subscriptions` | sim |
| Entitlements pros produtos | `integration/entitlements/:companyId/:productId[/:featureKey]`, com `ProductAuthGuard` (segredo por produto) | n/a |
| Papéis declarados pelo produto | `integration/products/roles` | n/a |
| Cobrança (Stripe): cliente, fatura, pagamento, cupom, checkout | sim, modelado | sim |
| Feature flags | só `feature-flags/evaluate`; **não há CRUD admin na API** | telas existem, chamam `/admin/feature-flags` que não existe |
| OAuth (SSO) | `oauth/authorize`, `token`, `introspect`, `userinfo` | não ligado |
| Notificações, auditoria, analytics | modelado | telas |

## Como um produto fala com o Hub

1. O produto é cadastrado no painel (slug, URLs, cor) e recebe um **segredo** (`ProductSecret`).
2. Com o segredo, o produto chama `GET /api/integration/entitlements/:companyId/:productId` e recebe o que a empresa pode usar, derivado da assinatura ativa e das features do plano.
3. O Hub avisa o produto por **webhook** quando a assinatura muda (`webhookUrl` do produto).
4. O usuário final continua logando no produto. O Hub não participa do login até o SSO entrar.

## Rodar local

```bash
# containers (colima)
docker start facter-hub-db facter-hub-redis   # ou docker run postgres:16-alpine na 5433 e redis:7-alpine na 6380

# API
cd facter-hub-api && cp .env.example .env
npx prisma generate && npx prisma migrate deploy
pnpm run prisma:seed            # admin@facter.com / Admin@123, empresas de exemplo
pnpm run prisma:seed:products   # Chef, Shop, TechCare, Truck com features e planos
pnpm run dev                    # http://localhost:3002/api

# painel
cd facter-hub-web
echo 'NEXT_PUBLIC_API_URL="http://localhost:3002/api"' > .env.local
pnpm run dev                    # http://localhost:3005 (webpack; Turbopack falha neste projeto)
```

O painel depende do design system pelo link `../facter-design-system/packages/core` (os dois repos lado a lado na pasta Facter) e fixa `react-hook-form` na mesma versão do DS, senão os tipos do `Form` não batem.

## Decisões

- SSO fica em backlog: produtos mantêm o próprio login; o Hub é consultado servidor a servidor.
- Produtos seguem três regras pra migrar sem retrabalho: `hubCompanyId` na empresa, uma função única de "pode usar X?", e nenhuma tela própria de plano ou cobrança.
- Ver [ADR-001](../adrs/adr-001-use-prisma.md) e o [roadmap](../../projeto/roadmap.md).
