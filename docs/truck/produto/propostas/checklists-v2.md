---
title: "Checklists na v2: plano"
sidebar_position: 12
tags: [truck, proposta, checklist, v2, plano]
---

# Checklists na v2: plano

**Status:** aprovado em 07/11/2026 (mockup aprovado com as recomendações 1 a 4) · fatia 3.2.1 entregue em 07/11/2026 · task [3.2](../../projeto/plano-de-execucao.md) do plano de execução.

O que já está decidido (schema de setembro, invariantes CHK-1 e CHK-2, permissões, a [proposta de ações por reboque](./checklist-contextual-actions.mdx)) continua valendo. Esta página junta tudo, diz onde o checklist entra no produto, o que fazer agora e o que fica para depois, do que ele depende e o que falta decidir antes do mockup.

## 1. Para que serve

O checklist é o jeito mais barato de **descobrir defeito antes que ele pare o veículo** e de deixar isso registrado. Para o cliente, vale por três coisas:

- **Trocar o papel.** A Vale das Carretas faz o checklist em folha de papel, sem histórico. É o ganho mais visível no piloto: no primeiro dia o pátio já tem registro.
- **Virar serviço sem redigitar.** O item não conforme cria o serviço na OS com componente e tipo já preenchidos (registrar sem atrito). No v1 isso não existia.
- **Alimentar indicadores.** Indicador 13 (não conformidades recorrentes por item e ativo), indicador 4 (disponibilidade: "checklist reprovado" é um motivo de parada) e itens de segurança como base de ESG.

## 2. Onde entra no produto

### Os momentos em que alguém faz um checklist

| Momento | Quem faz | Com OS? | O que acontece com a não conformidade |
| --- | --- | --- | --- |
| **Entrada na oficina** (recepção do veículo) | Inspetor, mecânico, supervisor | Sim, ligado à OS aberta | Vira serviço na mesma OS |
| **Durante a manutenção** (revisão, preventiva de carreta) | Mecânico, inspetor | Sim | Vira serviço na OS |
| **Saída / liberação** (conferência final) | Supervisor, inspetor | Sim | Volta serviço para a OS antes de liberar |
| **Inspeção de pátio ou saída de viagem** | Inspetor, motorista (depois) | Não (decidido em 26/09) | A OS nasce só se houver não conforme, com origem `checklist` |

### Onde aparece na tela

| Lugar | Modo | O que mostra |
| --- | --- | --- |
| **Tablet do pátio** | Operação | Começar checklist do veículo ou da OS, responder item por item no conjunto, concluir |
| **Detalhe da OS** | Notebook e tablet | Checklists da OS, não conformes ainda sem decisão, botão "Criar serviço" por item |
| **Detalhe do veículo** | Notebook | Histórico de inspeções e itens que mais reprovam neste veículo |
| **Checklists** (item da sidebar, módulo contratável) | Notebook | Lista de execuções com filtro, e **Modelos** (criar, publicar versão) |
| **Configurações** | Notebook | Nada novo: modelos ficam no próprio módulo |
| **Indicadores** (depois) | Notebook | Indicador 13 |

## 3. Funcionalidades

### Modelos (notebook, quem tem `checklist_template.manage`)

| Funcionalidade | Lançamento | Nota |
| --- | --- | --- |
| Criar modelo com nome e tipos de veículo a que se aplica | Sim | `applies_to` do schema |
| Itens agrupados em **seções** (Freios, Elétrica, Pneus…) | Sim | Falta no schema v2; ver decisão 1 |
| Por item: componente, serviço sugerido, item de segurança, foto obrigatória | Sim | Já no schema |
| Publicar cria versão nova; execução antiga mostra o que foi perguntado | Sim | CHK-1 |
| Desativar modelo | Sim | Some do "começar", fica no histórico |
| **Modelos padrão do Facter** (Entrada, Saída de viagem, Preventiva de carreta) que a empresa duplica | Sim | Mesma lógica dos papéis: padrão não se edita, se duplica. Itens do v1 servem de base |
| Reordenar itens arrastando | Sim | |
| Resposta numérica com faixa (sulco, pressão, nível) | Depois | Ver decisão 6 |
| Periodicidade ("todo dia antes da viagem") e alerta de atraso | Depois | |

### Execução (tablet, quem tem `checklist.execute`)

| Funcionalidade | Lançamento | Nota |
| --- | --- | --- |
| Começar em até 2 toques: pela OS ou pelo veículo; o modelo vem sugerido pelo tipo do veículo | Sim | Princípio "registrar sem atrito" |
| **Conjunto inteiro num checklist só**: cada item é respondido por implemento | Sim | `checklist_results.vehicle_id`; linha expansível por reboque (proposta aprovada em 10/07) |
| Respostas: conforme, não conforme, não se aplica | Sim | Ver decisão 2 |
| Botão "tudo conforme" por seção | Sim | O caso comum é quase tudo conforme |
| Observação no item | Sim | Obrigatória no não conforme sem serviço sugerido (decisão 3) |
| Foto no item | Sim, quando existir anexo (2.8) | CHK-2 |
| Cada resposta é gravada na hora, sem botão "salvar" | Sim | Comando por resposta, com `Idempotency-Key`; fila offline quando existir (2.9) |
| Concluir só com todos os itens respondidos | Sim | Ver decisão 4 |
| Tablet compartilhado: quem respondeu cada item fica registrado | Sim | `recorded_by`, login por PIN |
| Assinatura de quem inspecionou | Depois | Junto com o PDF da OS (2.8) |

### Não conformidade (quem tem `checklist.create_service`)

| Funcionalidade | Lançamento | Nota |
| --- | --- | --- |
| "Criar serviço" num toque, com componente e tipo de serviço do item, no veículo certo do conjunto | Sim | Uma vez só por resultado (idempotente) |
| Vários não conformes de uma vez: "Criar 4 serviços" na conclusão | Sim | Uma intenção, uma chamada |
| Checklist sem OS com não conforme: "Abrir OS" já com os serviços | Sim | OS com `origin = checklist` |
| Reprovação de item de segurança registra **parada** do veículo | Sim | `vehicle_stoppages.reason = checklist_fail`; alimenta disponibilidade |
| Pedir peça a partir do item | Sim, pelo serviço | A peça nasce dentro do serviço criado (origem "checklist" da proposta de peças) |
| Não conforme que o gestor decide não tratar agora: "Deixar para depois" com motivo | Depois | Hoje fica visível na OS como pendente |

### Gestão (notebook)

| Funcionalidade | Lançamento | Nota |
| --- | --- | --- |
| Lista de checklists com filtro por status, modelo, veículo, base e período | Sim | Cursor, busca sem acento, teste de plano |
| Detalhe somente leitura com fotos e quem respondeu | Sim | |
| Histórico no detalhe do veículo | Sim | |
| Indicador 13 por item e ativo | Depois | Precisa das tabelas de agregação |
| Exportar | Depois | Junto com as exportações (`data.export`) |
| Modelo da Suzano executado pela oficina parceira | Depois | Ecossistema (3.3) |

## 4. Do que depende

| Dependência | Situação | Efeito no checklist |
| --- | --- | --- |
| Serviços da OS, componentes, tipos de serviço | ✅ prontos | Não conforme vira serviço |
| Conjuntos (`trailer_sets`) | ✅ prontos | Checklist do conjunto inteiro |
| Paradas (`vehicle_stoppages`) | ✅ prontas | Reprovação vira parada |
| Sequências (`sequences`) | ✅ prontas | Número do checklist |
| Anexos e storage de objetos (2.8) | ⬜ | **Sem isso não há foto**; CHK-2 bloqueia conclusão de item com foto obrigatória |
| PWA com fila offline (2.9) | ⬜ | Pátio tem sinal ruim; sem fila, resposta perdida vira erro na tela |
| Outbox + fila (BullMQ) | ⬜ não existe no código | Eventos para o indicador 13 e notificações |
| Tabelas de agregação (leitura) | ⬜ | Indicador 13 |
| Módulos contratáveis (3.4) | ⬜ | Até lá, checklist fica sempre ligado |

**Consequência prática:** dá para entregar modelos, execução e não conformidade antes de 2.8 e 2.9, desde que o modelo não use "foto obrigatória" até os anexos existirem e o tablet avise quando estiver sem rede.

## 5. Ajustes no schema v2

A [página do schema](../../engenharia/schema-v2/pessoas-pneus-checklists.md#checklists) foi escrita em setembro. Antes de codar:

1. **Seções.** Acrescentar `section` (texto) e `section_position` em `checklist_template_items`, ou uma tabela `checklist_template_sections` por versão. Recomendação: tabela, porque a seção tem ordem e "tudo conforme" age nela.
2. **Nome errado.** `generated_service_id` aponta para `service_executions`; na v2 a tabela é `work_order_services`.
3. **Número.** `checklists.number` pela tabela `sequences`, como a OS.
4. **Escopo por base.** `checklists.base_id`, para o escopo B das permissões ser aplicado na consulta.
5. **Resposta muda até concluir.** Hoje o resultado tem `unique (checklist, item, veículo)`. Duas opções: (a) a linha muda enquanto o checklist está em andamento, com `version`, e congela na conclusão; (b) cada resposta é um fato e a atual é a última. Recomendação: (a), porque histórico de cliques não tem valor de decisão e a regra "fato só recebe insert" vale para o checklist concluído.
6. **Km na entrada.** Checklist de entrada pode registrar o km do veículo, reaproveitando a leitura de hodômetro da OS. Só se o checklist puder nascer sem OS (inspeção de pátio).
7. **Serviço gerado é único:** índice único em `generated_service_id`.

## 6. Invariantes novos

| ID | Invariante | Camada |
| --- | --- | --- |
| CHK-3 | Checklist só conclui com todos os itens respondidos, em cada veículo a que o item se aplica | Domínio |
| CHK-4 | Um resultado não conforme gera no máximo um serviço, mesmo com dois toques ou dois tablets ao mesmo tempo | Banco + domínio |
| CHK-5 | Checklist concluído ou cancelado não muda; correção é um checklist novo | Domínio + banco |
| CHK-6 | Resultado só para veículo que estava no alvo (veículo ou conjunto) quando o checklist começou | Domínio |
| CHK-7 | Só se executa versão publicada de modelo ativo | Domínio |

Cada um com teste que tenta quebrá-lo, CHK-4 com concorrência.

## 7. Permissões

A matriz atual serve sem mudança. O que ela já diz: **inspetor** vê, executa e cria serviço na base; **mecânico** e **borracheiro** executam só o que é deles e o mecânico não cria serviço; **motorista** executa o próprio; modelos só com administrador, gestor e supervisor. Possível acréscimo: `checklist.cancel`, hoje sem dono.

## 8. Fatias

Cada fatia é API, tela e teste juntos, e só começa com o mockup dela aprovado.

| Fatia | O que entrega | Depende de | Tamanho |
| --- | --- | --- | --- |
| **3.2.1 Modelos** ✅ 07/11 | Lista e editor de modelo com seções, publicar versão, desativar, modelos padrão do Facter para duplicar | Ajustes do schema | ~1 semana |
| **3.2.2 Execução ligada à OS** ✅ 07/11 | Começar pela OS, grade por implemento, responder, "tudo conforme", concluir; aba na OS | 3.2.1 | ~1,5 semana |
| **3.2.3 Não conformidade** | Criar serviço (um e em lote), abrir OS a partir de checklist sem OS, parada por reprovação | 3.2.2 | ~1 semana |
| **3.2.4 Gestão** | Lista com filtros, detalhe somente leitura, histórico no veículo | 3.2.2 | ~0,5 semana |
| **3.2.5 Foto e offline** | Foto por item (CHK-2) e respostas na fila local | 2.8 e 2.9 | ~0,5 semana sobre as tasks base |
| **3.2.6 Indicador 13** | Não conformidades por item e ativo | Outbox e agregações | Junto com a leitura |

**Ordem sugerida:** 3.2.1 a 3.2.4 podem ir **antes dos pneus (3.1)**, logo depois de fechar a OS (2.3). É o que o piloto mais sente (sai do papel) e não depende de nada que falte.

## 9. Mockups a fazer

Seguindo [como fazer mockups](../como-fazer-mockups.md), um por fatia:

1. **Modelos**: lista de modelos e editor (seções, item com componente, serviço sugerido, segurança, foto).
2. **Execução no tablet**: escolha do modelo, grade conjunto × item com a linha expansível por reboque, "tudo conforme" por seção, item não conforme aberto com observação e foto, estado sem rede.
3. **Conclusão**: resumo com os não conformes e "Criar N serviços", e o caminho sem OS ("Abrir OS").
4. **Na OS**: onde os checklists e os não conformes pendentes aparecem no detalhe já redesenhado.
5. **Gestão**: lista e detalhe somente leitura; bloco no detalhe do veículo.

## 10. Decisões para fechar antes do mockup

| # | Pergunta | Recomendação |
| --- | --- | --- |
| 1 | Modelo tem seções? | Sim, tabela própria (o v1 tinha categorias e o pátio pensa por sistema do veículo) |
| 2 | Quantas respostas? O v1 tinha cinco (pendente, conforme, não conforme, não se aplica, não verificado) | Três: conforme, não conforme, não se aplica. "Não deu para verificar" é não se aplica com observação. Pendente é só "sem resposta" |
| 3 | Não conforme exige observação? | Sim quando o item não tem serviço sugerido; senão é opcional |
| 4 | Concluir exige todos os itens? | Sim (CHK-3). O "tudo conforme" por seção tira o atrito |
| 5 | Checklist de saída bloqueia liberar a OS? | Configurável por modelo, desligado no lançamento |
| 6 | Resposta numérica (sulco, pressão) agora? | Depois. Sulco já é medido no módulo de pneus; não duplicar |
| 7 | Mecânico cria serviço a partir do checklist? | A matriz diz que não (inspetor e supervisor sim). Manter, e o não conforme fica visível na OS para quem decide |
| 8 | Checklist vai antes dos pneus? | Sim, 3.2.1 a 3.2.4 logo depois da OS |

**Decididas em 07/11/2026** com a aprovação do [mockup](/telas/truck/checklists): 1 a 4 como recomendado. Ainda abertas: 5 a 8.

**Diferenças do mockup na 3.2.1:** reordenar itens e seções é pelo menu ⋮ (mover para cima, mover para baixo) até o design system ter uma lista ordenável; o mockup já foi ajustado. O rascunho fica na tela e numa cópia no aparelho, não no servidor.

## Decidido na 3.2.2 (07/11/2026)

- **Onde se começa:** pela aba Checklists da OS (os veículos da OS) e pela página de início, escolhendo o veículo sem OS (entra a combinação dele: cavalo engatado e carretas do conjunto). Veículos que o modelo não pergunta ficam de fora.
- **Uma OS, um checklist por modelo:** começar de novo o mesmo modelo na mesma OS reabre o que está em andamento; concluído, é 409.
- **Respostas** mudam livremente enquanto o checklist está em andamento e congelam ao concluir (CHK-5). Concluir trava a linha do checklist; uma resposta simultânea espera.
- **Número** `CHK-000001` pela tabela `sequences`; o número da OS fica gravado no checklist, que não lê a tabela da manutenção.
- **Foto obrigatória** aparece no item, mas só bloqueia quando os anexos existirem (3.2.5).
- **Escopo por base e "próprio"** ainda não é aplicado nas consultas (o mesmo vale para os outros módulos hoje); entra com a gestão (3.2.4).
