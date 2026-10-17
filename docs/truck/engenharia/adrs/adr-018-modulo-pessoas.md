---
title: "ADR-018: Módulo Pessoas (grupo, responsável, permissões, movimentação)"
sidebar_position: 18
tags: [adr, pessoas, permissoes]
---

# ADR-018: Módulo Pessoas (grupo, responsável, permissões, movimentação)

**Status:** Proposto (17/10/2026), implementado na task 2.2 — aguarda aprovação da arquiteta

## Contexto

A task 2.2 cadastra **quem trabalha na oficina**: cargos, funcionários e turnos. É a base de duas coisas que o produto vende — o **custo de mão de obra** (valor/hora) e **quem executa cada serviço** (executor escolhido por cargo e turno). Algumas decisões não estavam no schema-v2 e precisavam ser registradas antes de virar código em cima: o **grupo do cargo**, o **responsável do turno** (o mockup de Funcionários já apontava "não está no schema-v2, registrar num ADR"), e como **graduar as permissões** num cadastro que mistura ação operacional (designar) com ação sensível (valor). E, por ser pré-lançamento, há o risco clássico: perder o histórico de mudanças porque "ninguém pediu relatório ainda".

## Decisão

1. **O cargo carrega um grupo** (`group_kind` = `shop` | `leadership`); o funcionário **herda o grupo do cargo**. Oficina executa serviço e tem o tempo contado; Liderança responde por turno e aprovações. É o que separa as duas áreas na sidebar e nas listas, e quem pode ser responsável de turno. Funcionários são **separados de Membros** (quem acessa o sistema): um funcionário existe sem login.

2. **Valor da hora com histórico datado.** `job_title_rates` com `daterange` + **exclusion GiST**: um reajuste fecha o período anterior e abre o novo. O passado nunca é reescrito; a sessão congela o valor vigente. Ler o valor pede `labor_rate.view` (leitura sensível, sai nulo sem a permissão); definir pede `labor_rate.manage`.

3. **O turno é o template semanal** (dias + janela + intervalo, expandido em `shift_segments`). O **responsável do turno** é um funcionário da **Liderança** — não é um rótulo: é quem responde pelo turno e aparecerá como responsável nas OS daquele turno (comportamento ligado em 2.4). Mudar o responsável é uma **ação própria** (`POST /shifts/:id/change-responsible`), fora do editar, para não ter dois caminhos de escrita do mesmo estado.

4. **Permissão granular por ação**, negada por padrão, separando operacional de sensível:
   - `employee.view` — ver listas e ficha (inclui finance, que vê sem mexer).
   - `employee.assign` — designar: mudar **base** e **turno** de alguém.
   - `employee.manage` — criar, corrigir (nome, matrícula), mudar cargo, desativar — cargos, funcionários e turnos.
   - `labor_rate.view` / `labor_rate.manage` — ver / definir o **valor**.
   - `shift.assign_responsible` — **designar o responsável do turno** (autoridade que pode ser dada sem dar "mexer no horário/custo").
   Ninguém muda estado por PUT genérico: toda mudança é uma ação nomeada que valida e mantém a consistência (ex.: trocar o turno não toca no valor).

5. **Busca sem acento e sem caixa**, e **paginação por cursor**, como padrão de toda lista: colunas geradas `*_search = immutable_unaccent(lower(...))` (reaproveitando a migration 0025) com o termo normalizado por `normalizeSearch`, e keyset em `(name, id)` sobre os índices existentes. Teste de acento e de plano acompanham cada lista.

6. **Movimentação do funcionário gravada como fato append-only** (`employee_changes`): cada mudança de base, cargo, turno, nome, matrícula ou situação insere uma linha imutável com o de→para (rótulos resolvidos na hora), quem e quando, na **mesma transação** do comando. É data-first — o fato não volta se não for gravado. É a base do histórico da ficha, do organograma/BI e do custo por turno/responsável, que acendem com as sessões (2.4).

## Consequências

- O `shift.assign_responsible` é a primeira permissão do namespace `shift.*`; o resto do turno segue sob `employee.manage` (o módulo Pessoas é governado por `employee.*`). Exceção intencional, documentada aqui.
- Para alguém de fato liderar um turno sem ser da Liderança, promove-se o cargo — é a modelagem certa (a pessoa assume um papel de liderança), não uma fricção a contornar.
- O `employee_changes` cresce ~0,2 KB por mudança (centavos/ano mesmo em frota grande); não há custo relevante de armazenamento, e indicadores saem de agregação por evento, não de varredura.
- A lista sem filtro de status ainda ordena com `Sort` em memória; o caso da tela (com status) é 100% índice. Um índice `(org_id, name, id)` dedicado resolve se precisar.

## Alternativas consideradas

| Alternativa | Por que não |
| --- | --- |
| Responsável do turno = qualquer funcionário | É accountability (aparece nas OS); abrir para a oficina inteira borra a separação Oficina/Liderança e tira a autoridade do papel |
| Responsável mudado dentro do "editar turno" | Dois caminhos de escrita do mesmo estado; contraria "um agregado, um caminho" |
| Um "employee.edit" amplo | Mistura designar (leve) com definir valor (sensível); impede papéis finos (ex.: supervisor designa, não mexe no valor) |
| Não gravar a movimentação até pedirem relatório | Fato não gravado não se recupera; o histórico nasceria vazio |
