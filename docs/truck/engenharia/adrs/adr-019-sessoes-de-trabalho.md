# ADR-019 — Sessões de trabalho e executores (fatia 2.4)

**Status:** aceito · 2026-10-17
**Contexto do schema:** [`manutencao.md`](../schema-v2/manutencao.md) (seções Serviços e "Executores e sessões")
**Invariantes:** SVC-1 a SVC-12 ([invariantes](../invariantes.md))

## Contexto

O `work_order_services` (fatia 1) já guarda o que fazer na OS. Falta o que torna a OS **viva** e o que alimenta o custo e os indicadores: **quem** trabalha em cada serviço, **por quanto tempo**, e o **custo de mão de obra**. Três pontos pediam decisão antes de codar: a identidade do executor, quando o custo congela, e como a pausa cascateia.

## Decisão

1. **Modelo (duas tabelas + status derivado).** `execution_assignments` (quem está designado a um `work_order_service`, com `removed_at` para histórico) e `work_sessions` (o intervalo de fato trabalhado, `during tstzrange`, aberto à direita enquanto corre). O **status do serviço** (`pending/in_progress/paused/completed/canceled`) é **derivado por uma função única** na mesma transação de cada comando (SVC-1) — nunca escrito direto.

2. **Identidade do executor — notebook primeiro.** A fatia entrega o fluxo do **notebook**: a supervisão **designa** um funcionário ao serviço e pode **iniciar/pausar** por ele (o ator é o usuário logado; o executor é o `employee` escolhido). O **tablet com PIN/crachá** (mecânico se inicia sozinho) fica para depois — depende da fatia 1.4. O schema é o mesmo (`work_sessions.employee_id`); muda só a camada de identidade/UI. Assim a 2.4 não trava na 1.4.

3. **Custo congelado no fechamento (ADR-009).** Ao **fechar** uma sessão, grava-se `hourly_cost` (o valor/hora do cargo **vigente no dia**, por `job_title_rates`) e `labor_cost` (com os adicionais vigentes — hora extra fora do turno, noturno, domingo, feriado — SVC-10). Nunca recalcula o passado: mudar o valor/hora depois não mexe em sessão já fechada.

4. **Tempo (SVC-7).** Tempo trabalhado = soma de `upper(during) − lower(during)` das sessões. **Pausa nunca conta** como trabalho; o tempo parado é registrado por motivo e alimenta o indicador de tempo parado.

5. **Cascata de pausa (explícita, sem `updateMany` mudo).**
   - Pausar o **serviço** → fecha as sessões abertas dele com `end_reason = service_paused`.
   - Pausar a **OS** → `work_order_paused` (WO-6).
   - **Iniciar outro serviço** → pausa o anterior com `other_service` (SVC-12: uma frente de trabalho por pessoa; `exclude using gist`).
   - **Intervalo** (`shifts.auto_pause_breaks`) → o início de `meal_break`/`rest_break` fecha com `break`; o "Voltar" do mecânico reabre as que o intervalo fechou, numa ação só.
   - **Cancelar serviço ou OS** → fecha **todas** as sessões abertas (SVC-3, WO-6) — era o bug do v1 que deixava executor "rodando para sempre".

6. **O servidor define o tempo (SVC-8).** Horário informado pelo usuário é ajuste explícito, com limite da organização, permissão própria e `adjusted_by` registrado.

7. **UX — operações são diálogos interativos.** Designar/iniciar/pausar/concluir/trocar são **diálogos guiados/visuais** (padrão de diálogos aprovado), não formulário. O **tablet do mecânico** tem pausa em 2 toques e "Meus serviços" (mockup `os-detalhe`). Entra com a identidade do tablet (PIN/crachá, 1.4).

## Permissões

`service.start/pause/resume/finish/cancel` e `service.assign` (designar/remover executor), por ação, negadas por padrão. Ajuste de horário por `service.adjust_time`.

## Consequências

- Invariantes **SVC-1 a SVC-12** saem de ⬜ para implementadas (cada uma com teste; os de banco — SVC-5, SVC-6, SVC-11, SVC-12 — com teste que tenta violar, incluindo concorrência).
- O **Detalhe da OS** acende: horas por serviço/executor, custo de mão de obra, e as linhas de serviço ganham "quem está trabalhando" (sai do "Em breve"). A liberação da OS passa a exigir serviços concluídos.
- O **indicador de tempo parado** e o **custo por veículo/km** ganham a parcela de mão de obra.

## Fica de fora (desta fatia)

Tablet com PIN/crachá (1.4), os adicionais de domingo/feriado dependem do **calendário de feriados** (entra junto com [escala e plantão](/telas/truck/escala-plantao)); até lá, SVC-10 aplica hora extra e noturno, e deixa o gancho para feriado.
