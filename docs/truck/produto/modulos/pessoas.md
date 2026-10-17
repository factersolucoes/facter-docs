---
title: "Pessoas"
sidebar_position: 20
tags: [produto, pessoas]
---

# Pessoas

Quem trabalha na oficina — cargos, funcionários e turnos. É o cadastro que sustenta o **custo de mão de obra** e **quem executa cada serviço**. Separado de **Membros** (quem acessa o sistema): um funcionário pode existir sem login, e quem tem login nem sempre é da oficina.

**Status:** Em construção · **Desde:** 10/2026 (task 2.2)

## Para quem

| Papel | O que faz aqui |
| --- | --- |
| Administrador / Gestor | Cria e gere cargos, funcionários e turnos; define o valor da hora; designa base/turno; desativa |
| Supervisor de manutenção | Designa base e turno de quem trabalha na sua base; vê os cadastros |
| Finance | Vê os funcionários e o valor da hora para custo, sem poder alterar |
| Qualquer membro com `employee.view` | Lê as listas e a ficha |

## Fluxos

1. **Criar cargo** — nome + grupo (Oficina ou Liderança). O valor da hora entra depois, no reajuste, e vale a partir da data escolhida.
2. **Adicionar funcionário** — nome e cargo bastam (o cargo já traz grupo e valor); base, turno e matrícula são opcionais.
3. **Criar turno** — os dias e o horário desenhados numa régua do dia (bloco de trabalho e intervalo que se arrastam), o responsável (alguém da Liderança) e a pausa automática.
4. **Designar** — mudar a base ou o turno de alguém (ação nomeada, não edição livre).
5. **Corrigir** — nome e matrícula depois do cadastro.
6. **Reajustar valor** — abre um novo valor datado para o cargo; o passado não é reescrito.
7. **Mudar responsável do turno** — troca quem responde pelo turno, sem mexer no horário.
8. **Desativar / reativar** — sai das listas e das novas designações; o histórico fica guardado.

## Regras de negócio

- **O cargo carrega o grupo** (Oficina executa serviço; Liderança responde por turno e aprovações). O funcionário **herda o grupo do cargo** — é o que separa Oficina de Liderança na sidebar e nas listas.
- **Valor da hora com histórico datado.** Um reajuste abre um novo período; sessões já fechadas mantêm o valor congelado do passado. Ler o valor pede `labor_rate.view`; definir pede `labor_rate.manage`.
- **Turno é o padrão semanal** (dias + janela de trabalho + intervalo opcional). A exceção planejada (plantão de domingo/feriado) é outra tela, futura.
- **O responsável do turno é alguém da Liderança.** Não é um rótulo: é quem responde pelo turno e aparecerá como responsável nas OS daquele turno (comportamento ligado em 2.4). Por isso é da Liderança.
- **Mudança é por ação nomeada, nunca edição livre** — cada ação valida e mantém a consistência (ex.: trocar o turno não mexe no valor; mudar o responsável não mexe no horário).
- **Busca sem acento e sem caixa** — "meca" encontra "Mecânico".
- **Toda mudança do funcionário é gravada** (base, cargo, turno, nome, matrícula, situação) como fato imutável — fato não gravado não se recupera.

## Permissões

| Ação | Papéis padrão |
| --- | --- |
| Ver listas e ficha (`employee.view`) | Admin, Gestor, Supervisor, Finance |
| Designar base e turno (`employee.assign`) | Admin, Gestor, Supervisor, Planner |
| Criar/corrigir/desativar cargo, funcionário, turno (`employee.manage`) | Admin, Gestor, Supervisor |
| Ver o valor da hora (`labor_rate.view`) | Admin, Gestor, Finance |
| Definir o valor da hora (`labor_rate.manage`) | Admin, Gestor |
| Mudar o responsável do turno (`shift.assign_responsible`) | Admin, Gestor, Supervisor |

## Indicadores

Alimenta o **custo de mão de obra** (valor/hora por cargo, somável por base e por turno) e, pela **movimentação** gravada, a leitura de mudanças no tempo (turnover, remanejamento) — a base do organograma/BI e do custo por turno, que acendem com as sessões (2.4). Definições de custo em `engenharia/`.

## Limites conhecidos

- O **comportamento do turno** (horas trabalhadas, hora extra, noturno, pausa no tablet) depende das sessões — entra na 2.4.
- O **responsável nas OS** é gravado agora, mas só aparece na OS quando as sessões ligarem (2.4).
- **Boxes** não entraram nesta fatia.
- A tela de **histórico de movimentação** e a **escala/planejamento de turnos** estão desenhadas (mockups) e entram depois.

## Histórico

| Data | Mudança | PR / ADR |
| --- | --- | --- |
| 10/2026 | Módulo Pessoas: cargos, funcionários, turnos — cadastro, ações, permissões, busca e paginação | ADR-018 |
