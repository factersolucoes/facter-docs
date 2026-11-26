---
title: Planejamento de manutenção (preventiva)
sidebar_label: Planejamento de manutenção
---

# Planejamento de manutenção: preventiva que roda sozinha e cabe no pátio

Em discussão desde 26/11/2026. Base do mockup da preventiva, que só começa depois desta proposta aprovada. Pesquisa feita sobre o código do v1, a [ADR-006](../../engenharia/adrs/adr-006-planejamento-de-manutencao.md), a documentação pública dos grandes e o SAP PM.

## O que o v1 tinha e por que não funcionou

O desenho do v1 era bom; o motor nunca rodou.

| Problema | Onde |
| --- | --- |
| **Não roda sozinho.** O agendador das 2h existe, mas o módulo nunca foi ligado no app | `facter-api/src/app.module.ts` |
| **Não recorre.** Nada avança o ponto de partida depois da execução; o agendamento vira "concluído" quando a OS nasce, não quando o serviço é feito | `generate-order-from-schedule.ts` |
| **Plano por km nunca vence.** O km inicial nunca é gravado; carreta fica com 0 km | `km-calculation.strategy.ts` |
| **Três hodômetros que não batem.** Gatilho sem leitura vira "OK": um caminhão com 195 mil km apareceu em dia | `trigger-evaluation.service.ts` |
| **Gerar duas vezes duplica.** A chave usa a data com milissegundos; a OS gerada nem sai como preventiva | [auditoria](../../engenharia/auditoria-2026-09.md) |
| **SAP, Sascar, Autotrac e Cobli** são esqueletos nunca testados com as APIs reais | `infra/integration/providers` |

**Fica do v1:** modelo de plano separado do plano aplicado ao veículo; o plano traz o kit (serviços e peças) para a OS; vários gatilhos, o que vier primeiro; aviso pelo que falta ("faltam 500 km"); níveis em dia, atenção, vencido; data prevista pela média de km por dia; aviso separado da OS, com alguém decidindo antes de abrir.

**Sai do v1:** o motor duplo, os gatilhos sem uso (combustível, ciclos, condição), plano aplicado a "frota inteira" sem FK, nota de saúde por média, cálculo a cada requisição, `Float` e `Cascade`.

## Como os grandes fazem

- **Fleetio, Samsara, Geotab, Motive, Sofit.** O mesmo modelo: programa (modelo aplicado a um grupo) e lembrete por veículo; km, horas de motor ou dias, o que vier primeiro; "vence em breve" por limite fixo (Fleetio: 2 semanas ou 500 mi) ou percentual (Sofit: 10%); o registro do serviço reinicia o lembrete. Na maioria, vencer só gera lembrete. Fullbay e Motive criam OS sozinhos; a Sofit junta serviços perto de vencer numa OS já aberta.
- **TMT (Trimble).** Níveis aninhados: a preventiva C inclui a B e a A.
- **SAP PM.** Plano de ciclo único, por estratégia (pacotes 10 mil / 30 mil / 60 mil) ou multicontador (OU / E). Leitura é um documento de medição num ponto de medição. O job IP30 transforma o que entrou no horizonte em nota ou ordem. Tem tolerância antecipada e atrasada e "fator de deslocamento": a próxima data parte da execução real, não da prevista. A próxima chamada só sai depois de concluída a anterior.

### Onde todos falham (reclamações de cliente e documentação)

1. **Carreta.** O mercado trata carreta como "sem hodômetro" e cai para calendário. Plano por km de carreta "nunca vence". No SAP, o km só passa do cavalo para a carreta se ela estiver instalada sob ele, e cada troca de engate seria uma reinstalação.
2. **Km ruim.** Queixa número um: o motorista digita errado e o próximo é obrigado a errar também; km do cartão combustível gera falso aviso; o lembrete não reinicia sem leitura válida.
3. **Um aviso por tarefa.** Excesso de alerta, nada agrupado por visita à oficina.
4. **Sem posição.** Ninguém tem plano preventivo por eixo ou roda; posição só existe nos produtos de pneu, separados.
5. **Telemetria sem oficina, oficina sem telemetria.** Samsara e Geotab só avisam; Fullbay e TMT não conhecem conjunto nem pátio.
6. **Conformidade que esconde custo.** No Fleetio, adiantar sempre conta como no prazo; adiantar também gasta vida útil.

## Proposta

### 1. Km confiável primeiro

Sem km bom, nenhuma preventiva funciona. Entra antes de qualquer tela de plano.

- **Uma leitura, um fato.** A tabela `meter_readings` (já desenhada em [ativos](../../engenharia/schema-v2/ativos.md)) com fonte (`work_order`, `manual`, `telematics`, `import`), troca de painel (`meter_installs`) e correção só por estorno (AST-5). Nunca três hodômetros.
- **O km de entrada na OS vira leitura** (hoje `entry_reading_id` fica nulo esperando essa tabela).
- **Salto impossível não vale.** Leitura acima do km/dia esperado fica "a conferir": não reinicia plano nem dispara aviso até alguém confirmar. Quem vem depois nunca é forçado a repetir o erro.
- **Horímetro** para quem precisa (guindaste, munck, refrigeração), mesmo modelo.

### 2. Km da carreta pelo engate

Onde ninguém resolve. O Truck já grava o engate (`couplings.start_meter/end_meter`).

- Cada engate fechado soma à carreta o km que o cavalo rodou com ela: um fato de inclusão, com a fonte da leitura do cavalo.
- O km da carreta é derivado, nunca digitado; carreta com hubodômetro usa o próprio medidor.
- Para o SAP, mandamos esse km já calculado como leitura do ponto de medição da própria carreta. Não dependemos da hierarquia do SAP.

### 3. O plano

- **Modelo versionado**, aplicado por tipo de veículo, modelo ou lista de veículos, com exceção por veículo. Mudar o modelo cria versão nova; o histórico de quem seguiu a antiga fica.
- **Item do plano = tipo de serviço + posição + gatilhos.** A posição usa a escala já aprovada em [posição no serviço](./posicao-no-servico.md): "lona de freio, eixo 3 da 2ª carreta, a cada 60 mil km ou 6 meses". O kit de peças vem do tipo de serviço.
- **O plano é feito de pacotes.** Cada pacote junta vários serviços e as peças deles, e vale para um veículo (cavalo ou cada carreta). No conjunto, os pacotes aparecem agrupados por veículo, para ver o que cabe numa parada.
- **Gatilhos:** km, dias, horas de motor e data no calendário ("todo ano em março"), sozinhos ou "o que vier primeiro". Pacote obrigatório (cronotacógrafo, CIPP) leva o selo "Obrigatório" e a validade do certificado.
- **Pacotes aninhados:** um pacote pode incluir outro ("Revisão 60 mil inclui a Preventiva 20 mil", como PM-A/B/C nos EUA e a hierarquia de pacotes do SAP). Quando o maior é feito, os incluídos reiniciam juntos.
- **Nome e regra na tela:** o nome do pacote é o da empresa ("Preventiva 20 mil", "PM-B", "Lubrificação carreta 15 dias") e nunca carrega o sentido sozinho. Embaixo dele aparece sempre a regra gerada dos dados, em português simples ("a cada 20 mil km ou 3 meses, o que vier primeiro", "a cada 250 horas de motor", "todo ano em março"), e o vencimento pelo gatilho que vence primeiro ("Vence em 1.200 km"). Nenhuma letra ou código interno na tela.
- **Janela por item:** antecipação permitida e tolerância de atraso, em quantidade (km, dias), não em percentual.

### 4. Vencimento que roda sozinho e não duplica

- **Recorre pela execução real.** O próximo ciclo parte do km e da data em que o serviço foi **concluído** (sessões de trabalho), nunca de quando a OS foi aberta.
- **Chave natural** plano + veículo + item + ciclo: rodar duas vezes não cria nada a mais.
- **Tabela de vencimentos** atualizada por evento (leitura nova, serviço concluído, engate fechado) e por um job diário com trava. Nada calculado na requisição.
- **Sem leitura não é "em dia".** O nível é "sem km", com o motivo à vista.

### 5. Vence na hora certa: na chegada

O diferencial. Em vez de um aviso por tarefa:

- **Na entrada no pátio** (e ao abrir a OS do conjunto), tudo o que vence ou está na janela de antecipação daquele cavalo e daquelas carretas aparece numa linha só: "3 preventivas vencem neste conjunto". Um toque coloca todas na OS, com posição e kit.
- **Agrupado por visita.** O que vence nas próximas semanas e cabe na janela entra junto, para o veículo não voltar daqui a 10 dias.
- **Aviso só para o que passou.** Vencido e fora do pátio vira um aviso, que alguém decide: agendar, chamar ou adiar com motivo (gravado).
- **No detalhe da OS**, cabe no "Precisa de atenção" já desenhado.

### 6. Agenda da frota (gestão, notebook)

- Vencido, vence agora, vence logo, por veículo, conjunto, base e transportadora; data prevista pelo km médio por dia de cada veículo.
- **Conformidade honesta** nos dois sentidos: atrasou (quanto km rodou vencido) e adiantou (quanto de vida útil foi gasto antes).
- Alimenta os indicadores 12 (corretiva × preventiva) e "preventiva vencendo".

### 7. SAP: um plano, um dono

Nunca dois motores no mesmo plano. Cada empresa escolhe o modo; o dono fica em `data_ownership`, os códigos em `external_refs`, e tudo passa pelo outbox.

| | **Modo A: o SAP planeja** (provável Suzano) | **Modo B: o Truck planeja** |
| --- | --- | --- |
| Dono do plano | SAP | Truck |
| Truck → SAP | Leituras de km e horas como documentos de medição (`API_MEASUREMENTDOCUMENT`), inclusive o km da carreta calculado pelo engate; conclusão da ordem com data e km reais | OS fechada com custo, para custeio |
| SAP → Truck | Ordens geradas pelo IP30 (`API_MAINTENANCEORDER`) viram OS no pátio, com operações como serviços | Nada |
| Cadastro | Equipamento (EQUNR) e ponto de medição ligados ao veículo | Opcional |

Cuidados conhecidos: o SAP às vezes responde 201 sem gravar a leitura (ler de volta para conferir); a API de nota não traz o status do usuário. Mecanismo de evento do SAP e API exata de confirmação ainda **não verificados**: confirmar com a TI do cliente antes de codar.

Mesmo no modo A, o Truck mostra a agenda (vinda do SAP) e faz a parte do pátio (seção 5). É ali que o SAP não chega.

## O que precisa existir antes, e a ordem

| Fatia | O que entrega | Depende de |
| --- | --- | --- |
| P0 | Leituras de km (`meter_readings`, `meter_installs`), km de entrada na OS ligado, leitura "a conferir" | Nada; **começar logo, para acumular histórico** |
| P1 | Km da carreta pelo engate | Engate (1.11) |
| P2 | Posição no serviço e "último serviço por veículo, tipo e posição" | [Posição no serviço](./posicao-no-servico.md), aprovada |
| P3 | Plano, itens, níveis, vencimentos, recorrência pela conclusão | P0, P2, sessões de trabalho (2.4) |
| P4 | Preventivas na chegada e na OS, aviso do vencido | P3 |
| P5 | Agenda da frota e conformidade | P3, tabelas de agregação |
| P6 | SAP modo A e modo B | P3; contrato com a TI do cliente |

O roadmap põe a preventiva logo depois do lançamento. P0 e P2 cabem antes, e são o que faz a preventiva nascer com histórico.

## Decisões para aprovar

1. Km confiável (P0) entra agora, antes da tela de plano.
2. Km da carreta derivado do engate, nunca digitado.
3. Item do plano com posição; gatilhos só km, horas e dias; níveis aninhados.
4. Recorrência pela conclusão real do serviço; sem leitura é "sem km", nunca "em dia".
5. Preventiva aparece na chegada ao pátio e entra na OS em um toque, agrupada por visita.
6. SAP: um dono por plano, modo A ou B por empresa.

## Em aberto

- Prazos legais brasileiros (tacógrafo, CIV/CIPP para produto perigoso, ANTT) como gatilho por data: levantar se os clientes querem no mesmo plano.
- Telemetria (Sascar, Autotrac, Cobli): só com API real em mãos; até lá, km pela OS, pelo pátio e importação.
