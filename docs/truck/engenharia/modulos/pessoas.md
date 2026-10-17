---
title: "Pessoas"
sidebar_position: 20
tags: [engenharia, pessoas]
---

# Pessoas

Cadastro de cargos, funcionários e turnos, e a movimentação do funcionário. Contexto `people` (`apps/api/src/modules/people`). Produto: [Pessoas](../../produto/modulos/pessoas.md).

## Modelo de dados

- **`job_titles`** — cargo: `name`, `group_kind` (`shop` | `leadership`), `active`, `version`, `name_search` (gerada). Único `(org_id, lower(name))`.
- **`job_title_rates`** — valor da hora com histórico: `hourly_cost numeric(14,2)` + `currency`, `valid_during daterange` com **exclusion GiST** (sem sobreposição por cargo). Reajuste fecha o período anterior e abre o novo; o passado não é reescrito.
- **`employees`** — `name`, `registration` (opcional), `job_title_id`, `base_id`, `shift_id`, `active`, `version`, `name_search` + `registration_search` (geradas). Matrícula única por org (case-insensitive).
- **`shifts`** — `name`, `auto_pause_breaks`, `responsible_employee_id` (FK employees, deve ser Liderança), `active`, `version`, `name_search`. Único `(org_id, lower(name))`.
- **`shift_segments`** — expansão do turno: uma linha por dia/segmento (`weekday` 1–7, `starts_at`/`ends_at` `time`, `kind` em `work`|`meal_break`|`rest_break`).
- **`employee_changes`** — **log append-only** da movimentação (base, cargo, turno, nome, matrícula, situação): `field`, `from_label`, `to_label`, `changed_by`, `changed_at`. Só recebe insert (ADR-018).

Todas com `org_id not null`, **RLS habilitado e forçado** (`org_id = app_current_org()`), FKs compostas `(id, org_id)` com `restrict`, e `version` para concorrência otimista. Busca sem acento: colunas geradas `*_search = immutable_unaccent(lower(...))` (padrão da migration 0025), termo normalizado no servidor por `normalizeSearch` (`platform/database/search-text`). Migrations 0031–0035.

## Agregados e comandos

Estado muda só por **comando de ação** (rota `POST /.../acao`), nunca por PUT genérico. Concorrência por `version` (409).

| Comando | Rota | Permissão |
| --- | --- | --- |
| Criar / renomear / mudar grupo / reajustar / (des)ativar cargo | `POST /job-titles`, `.../rename`, `.../change-group`, `.../reprice`, `.../deactivate`, `.../reactivate` | `employee.manage` (reprice: `labor_rate.manage`) |
| Criar funcionário | `POST /employees` | `employee.manage` |
| Mudar cargo / corrigir nome / corrigir matrícula / (des)ativar | `POST /employees/:id/change-job-title`, `.../rename`, `.../change-registration`, `.../deactivate`, `.../reactivate` | `employee.manage` |
| Mudar base / mudar turno | `POST /employees/:id/change-base`, `.../change-shift` | `employee.assign` |
| Criar / editar / (des)ativar turno | `POST /shifts`, `.../edit`, `.../deactivate`, `.../reactivate` | `employee.manage` |
| Mudar responsável do turno | `POST /shifts/:id/change-responsible` | `shift.assign_responsible` |
| Ler listas, ficha, histórico, valor | `GET /job-titles`, `/employees`, `/shifts` (+ `/counts`, `/:id`), `GET /employees/:id/changes`, `GET /job-titles/:id/rates` | `employee.view` (rates: `labor_rate.view`) |

Cada comando de mudança do funcionário grava um fato em `employee_changes` na **mesma transação**.

## Invariantes

- Um agregado, um caminho de escrita; estado derivado calculado numa função só.
- **Reajuste não reescreve o passado** — exclusion GiST no `daterange`; valor congelado na sessão.
- **Leitura sensível não sai sem permissão** — `hourlyCost` vem nulo sem `labor_rate.view`.
- **Permissão por ação, negada por padrão** — teste de matriz varre toda rota (`test/platform/role-matrix`).
- **Responsável do turno é da Liderança** — validado no domínio (`SHIFT_RESPONSIBLE_NOT_LEADERSHIP`, 422).
- **Movimentação é imutável** — `employee_changes` só recebe insert.

## Leitura e performance

- Listas **paginadas por cursor** (keyset em `(name, id)`, limite ≤ 100), sustentadas pelos índices `(org_id, active, name, id)`. Busca filtra `*_search` dentro das linhas da org (índice como caminho de acesso), sem seq scan.
- Todo list/search/detalhe tem **teste de plano** (`test/people/people.query-plans.spec.ts`) exigindo sem `Seq Scan`.
- Ressalva conhecida: lista **sem filtro de status** usa um `Sort` em memória (o índice começa por `active`); com filtro (o caso da tela) é 100% índice. Um índice `(org_id, name, id)` dedicado removeria isso se precisar.

## Testes

`apps/api/test/people/`: `*.http.spec` (caminho feliz, recusas, acento, paginação, permissão, idempotência), `people.constraints.spec` (violação de constraint via insert do owner), `people.query-plans.spec` (plano real sem seq scan). Front: `apps/web/src/features/employees` (forms puros, `translations.spec`, `form-fields.spec`).

## Decisões

[ADR-018 — Módulo Pessoas](../adrs/adr-018-modulo-pessoas.md): grupo do cargo, responsável do turno, permissões granulares e movimentação append-only.
