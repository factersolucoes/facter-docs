---
title: Arquitetura
sidebar_position: 2
tags: [padroes, arquitetura, decisoes]
---

# Padrões de arquitetura

Decisões de arquitetura que valem para **todos** os produtos. Antes de usar uma "ferramenta pesada" (flag, fila, cache, evento), veja se já existe decisão aqui. Tomou uma nova que serve pra mais de um repo? **Uma linha, no mesmo PR.**

---

## Feature flag × entitlement × nada

O Hub tem **dois** sistemas que vivem sendo confundidos. Decida **nesta ordem**:

1. **O liga/desliga é por PLANO pago?** → **entitlement** (`Feature` / `PlanFeature` / `Entitlement`, consultado via a porta de plataforma do produto, ex.: `PlatformService.can(company, 'quotes')`). **Nunca** feature flag — flag não cobra.
2. **É código novo que pode dar ruim em produção, que você quer soltar aos poucos, testar, ou ligar só pra um cliente piloto?** → **feature flag** (`FeatureFlag` no Hub, avaliada por `POST /api/feature-flags/evaluate`).
3. **Nenhum dos dois?** → **NÃO use flag. Sobe o código direto.** É a maioria dos casos. O **default é não ter flag**; flag demais é bagunça.

**Regra de bolso:** se o motivo é **dinheiro** (plano) → entitlement. Se é **risco/tempo** (lançar com segurança) → flag.

### Quando for feature flag, só assim
- Sempre por um **helper** (`flag('produto.chave', ctx)`), nunca chamando o endpoint do Hub na mão.
- Toda flag tem **default seguro**: Hub fora do ar → cai no default, a tela **nunca quebra**.
- O **nome diz o destino**: `rollout_*` (morre quando chegar a 100%) ou `ops_*` (kill-switch, fica).
- Flag `rollout_` que assentou em 100%: **tira o if e arquiva**. Não deixa acumular.

### Nunca
- Flag pro que é plano (vira bagunça de cobrança).
- Flag sem default (Hub dorme no free tier → tela quebra).
- `fetch` direto no endpoint de evaluate, fora do helper.

**Onde já está:** sistema de flag completo no `facter-hub-api` (`src/application/feature-flags/`, entidade `feature-flag.entity.ts`): tipos BOOLEAN/PERCENTAGE/SEGMENT, regras de targeting, override por empresa, cache e endpoint de avaliação.

---

## Preço vem do Hub, sempre

Qualquer lugar que mostra plano ou preço (landing, painel, checkout) **lê do Hub**, nunca tem valor escrito no código. O Hub é a fonte única: `GET /api/pricing/<slug>` devolve `{ data: { productName, plans, features } }`, preços em **centavos**, `priceYearly` é o total do ano. Mudou o preço? Muda só no Hub, pela tela, e todo mundo acompanha. Preço hardcoded na landing vira mentira no dia que alguém esquece de atualizar.

- Buscar com **timeout** e tratar falha: Hub fora do ar (free tier dorme) **não quebra a página**.
- Produto sem plano cadastrado (`plans: []`) é estado normal, não erro — veja o par disso em `interface.md` (seção sem dado some e vira CTA).

**Onde já está:** `facter-landing/app/techcare/Planos.tsx` (fetch com AbortController, desembrulha `data`, `brl(cents)`, delta "tudo do plano X e mais"). O Hub já serve `shop`, `techcare` e os demais em `/api/pricing/<slug>`.

---

## Dinheiro e histórico (lembretes gerais)

- **Dinheiro em centavos** (inteiro), nunca `float`. Formatação na borda, por `Intl`.
- **Histórico não se apaga.** Fato (transição, movimentação, pagamento) só recebe insert; correção é estorno, não update/delete.
- **O que não vai acontecer se cancela, com motivo; o que terminou se arquiva.** Quando um registro de trabalho (OS, pedido, comanda) foi criado por engano ou o cliente desistiu, use um status terminal `CANCELLED` alcançável de qualquer estado anterior à conclusão, com motivo obrigatório e sem reabertura; depois de concluído (peça saiu, garantia emitida) não se cancela mais, e dinheiro já recebido pede estorno antes. Arquivar fica só para o que chegou ao fim. Por quê: arquivar uma ordem errada a deixa no histórico como se tivesse acontecido, e excluir apaga fato. Onde já está: `facter-techcare` (`ServiceOrder.canTransitionTo`, `ChangeStatusUseCase.validateCancellation`); o Chef tem `CANCELADA`.

*(Mais decisões entram aqui à medida que forem tomadas.)*
