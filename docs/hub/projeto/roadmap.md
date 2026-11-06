---
title: Roadmap
sidebar_position: 1
---

# Hub — Roadmap

O Hub é o painel de controle dos produtos Facter: empresas, produtos, planos, o que cada plano libera, assinaturas, cobrança, flags e backoffice. Os produtos (Chef, Shop, TechCare, Truck) perguntam ao Hub, servidor a servidor, o que uma empresa pode usar. Login único (SSO) fica em backlog: cada produto mantém o seu login.

Repositórios: `facter-hub-api` (NestJS, Prisma, Redis) e `facter-hub-web` (Next, design system). Como rodar local: ver [Visão geral](../engenharia/arquitetura/visao-geral.md).

## Fase 1 · Controlar os produtos (05/11/2026 → )

| Etapa | O que sai | Situação |
|---|---|---|
| 1.0 Reabrir | Repos clonados, banco e Redis locais, seed, painel rodando (webpack), link do DS corrigido, doc de como rodar | feito 05/11 |
| 1.1 Telas de Produtos, Planos e Assinaturas | No painel admin, sobre a API que já existe: listar/criar/editar produto; planos e features de cada produto; assinaturas por empresa (criar, trocar plano, cancelar, trial) | feito 05/11 (commit local, sem push) |
| 1.2 Nossos produtos cadastrados | Seed idempotente com Chef (planos de R$ 79 e R$ 99 e o que liberam), Shop, TechCare e Truck; empresas reais entram pelo painel | feito 05/11 (`prisma:seed:products`) |
| 1.3 Contrato da plataforma | `@facter/platform-contract` (em `facter-hub-api/packages/contract`): schemas do entitlement e do webhook, assinatura HMAC e verificação. Hub: assinatura muda → entitlements sincronizam → webhook assinado. Chef: `Empresa.hubCompanyId`, cache `HubEntitlement` sem dado pessoal, `platform.can(empresa, 'storefront')` com fallback, webhook `/api/webhooks/hub`, publicar e vitrine pública gateados, aviso no "Minha loja", rota admin de vínculo. Provado de ponta a ponta no local (trial → libera; cancela → trava; reativa → volta) | feito 05/11 (commits locais: Hub em `master`, Chef em `feat/hub`) |
| 1.3b 2FA | O Hub **não tem** segunda etapa de login (verificado 05/11). Entra como obrigatório pra SUPER_ADMIN e SUPPORT: TOTP + códigos de recuperação | a fazer |
| 1.4 Consertos | Rotas de integração renomeadas pra `/api/integration/...` (feito); `dev` com `--webpack` (feito); lista de assinaturas com plano e empresa (feito). Pendente: a API não tem CRUD admin de flags, o painel chama uma rota que não existe; Turbopack ainda quebra; 11 suítes antigas de auth/OAuth falham desde antes (jest) | parcial |
| 1.5 Deploy | Postgres e Redis gerenciados, API e painel publicados, `hub.facter.com.br`, e-mail transacional. Executa com aprovação da arquiteta | a fazer |

Critério de pronto da fase: no painel em produção, ver Chef, Shop, TechCare e Truck como produtos, a Larissa como empresa assinando o Chef, e o Chef lendo do Hub se a loja está liberada.

## Fase 2 · Cobrança automática

Mensalidade dos produtos cobrada pelo Hub em Pix, boleto e cartão. O código já tem Stripe (cliente, fatura, pagamento, webhook); decidir, com taxas levantadas com fonte, se o Stripe Brasil cobre Pix e boleto ou se entra um gateway daqui. Inadimplência mínima: carência e bloqueio de acesso via entitlements.

Não confundir com o pagamento que a dona da loja recebe do cliente dela: isso é do Chef e do Shop, com o gateway da própria dona.

## Backlog

- SSO (o back já tem `oauth/authorize`, `token`, `introspect`, `userinfo`): entra quando a mesma pessoa usar dois produtos.
- Flags com rollout gradual, analytics, cupons, checkout hospedado, notificações: modelados, não ligados.
- Registro de lojas da vitrine (slug e domínio → fonte) vindo do Shop.
