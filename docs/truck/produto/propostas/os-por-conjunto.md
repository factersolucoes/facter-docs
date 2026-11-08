---
title: "OS por conjunto: análise"
sidebar_position: 13
tags: [truck, proposta, os, conjunto, manutenção]
---

# OS por conjunto: análise

**Status:** em análise · 08/11/2026 · decide o modelo antes de implementar.

**Decidido com a dona até aqui:** o padrão é **uma OS para o conjunto** (os reboques entram juntos); OS de um veículo só é a exceção. O **cavalo fica fora** da OS do conjunto e tem OS própria; a empresa poderá juntar os dois numa configuração. O **km de entrada** é só o do cavalo. **Todo serviço é feito num veículo**, com eixo e lado quando fizer sentido (como o v1 fazia).

**A pergunta aberta:** o conjunto é vivo. Reboque sai, reboque entra, cavalo troca, conjunto é desfeito, e isso acontece **com a OS aberta**. O que a OS faz em cada caso?

## 1. Os casos do pátio

| # | Caso | Exemplo |
| --- | --- | --- |
| 1 | Reboque bom sai antes | O 3º reboque não tem nada e precisa seguir viagem em outro conjunto; os outros dois continuam na oficina |
| 2 | Reboque sai com serviço pela metade | O 2º reboque é chamado para uma carga urgente com a lona trocada só de um lado |
| 3 | Reboque entra depois | Um reboque que chegou de outro conjunto precisa de serviço e vai junto com este |
| 4 | Troca de cavalo | O conjunto sai da oficina puxado por outro cavalo |
| 5 | Conjunto desfeito | Os reboques são remontados em dois conjuntos novos durante a manutenção |
| 6 | Reboque vai para outro conjunto que também está na oficina | Dois conjuntos na oficina trocam um reboque entre si |
| 7 | Defeito descoberto no meio do serviço | Na revisão aparece um problema num reboque que não tinha nada aberto |

## 2. Como os sistemas grandes resolvem

Nenhum dos grandes trata o conjunto como uma coisa só que muda por dentro da OS. Todos separam **onde está** de **o que é**, e o **trabalho** fica sempre no equipamento.

- **SAP PM:** separa **local de instalação** (a posição: "3º reboque do conjunto", "eixo 2, lado esquerdo") de **equipamento** (o reboque físico, o pneu), com histórico de instalação e desmontagem. A ordem tem uma **lista de objetos** (vários equipamentos) e cada operação aponta um equipamento. Trocar um equipamento de lugar não muda a ordem: muda o histórico de instalação.
- **IBM Maximo:** **OS mãe com OS filhas**. A mãe é o "pacote" (a visita, a parada programada); cada filha é de um ativo, com status, custo e mão de obra próprios. A mãe fecha quando as filhas fecham; uma filha pode fechar antes.
- **Fleetio e similares de frota:** OS **por ativo**; o reboque e o cavalo são ativos separados, ligados por "acoplamento". Quem quer ver o conjunto vê as OS dos ativos juntas.

O ponto comum: **o fato de manutenção é do veículo físico**, gravado com a posição em que ele estava naquela hora. O conjunto é contexto, não dono do trabalho.

## 3. Os caminhos

| | Caminho | Em uma frase |
| --- | --- | --- |
| A | Foto da abertura | A OS guarda os veículos da abertura; mudar o conjunto depois não muda a OS |
| B | Bloquear | Com OS aberta, o conjunto não engata nem desengata |
| C | Acompanhar | A OS muda sozinha junto com o conjunto |
| D | Foto + decisão | Como A, e cada mudança no conjunto vira uma pendência na OS para alguém decidir |
| E | Uma OS por veículo, agrupadas | Cada reboque tem sua OS; uma "entrada do conjunto" agrupa e mostra como uma só |
| F | OS do conjunto com uma frente por veículo | Uma OS (o número que todo mundo usa), com uma **frente** por veículo; cada frente tem status, serviços, trava e custo próprios (o modelo mãe/filhas do Maximo) |

## 4. Cada caminho em cada caso

| Caso | A | B | C | D | E | F |
| --- | --- | --- | --- | --- | --- | --- |
| 1 Reboque bom sai | Fica na OS, travado até fechar tudo | Não sai | Sai sozinho | Pendência; alguém tira | Fecha a OS dele e sai | Fecha a frente dele e sai |
| 2 Sai pela metade | Fica travado; ou espera, ou "some" da oficina com OS aberta | Não sai | Sai; serviço fica sem dono | Pendência; alguém decide | Pausa ou fecha a OS dele | Pausa a frente (motivo: saiu) ou leva o pendente para uma OS nova dele |
| 3 Entra depois | Só com "adicionar veículo" | Não entra | Entra sozinho | Pendência; alguém aceita | Abre OS nova e agrupa | Abre uma frente nova na mesma OS |
| 4 Troca de cavalo | Nada (cavalo fora) | Bloqueia à toa | Nada | Nada | Nada | Nada |
| 5 Conjunto desfeito | OS fica com veículos espalhados | Não desfaz | OS perde o sentido | Várias pendências | Nada muda | Cada frente segue; a OS mostra "conjunto desfeito" |
| 6 Troca entre dois conjuntos na oficina | Reboque fica em duas histórias confusas | Não troca | Serviços trocam de OS | Pendências nos dois | Muda só o agrupamento | Leva a frente com o histórico para a outra OS, registrado |
| 7 Defeito novo | Adiciona serviço no veículo | Igual | Igual | Igual | Na OS dele | Na frente dele |

## 5. Contra os princípios do produto

| Critério | A | B | C | D | E | F |
| --- | --- | --- | --- | --- | --- | --- |
| Dados primeiro (custo, tempo parado e retrabalho por veículo) | Parcial: tempo parado é da OS toda | Parcial | Ruim | Parcial | Ótimo | Ótimo: cada frente tem tempo, custo e status |
| Registrar sem atrito | Bom | Ruim (trava o pátio) | Bom, mas confuso | Médio (pendências) | Médio (vários números) | Bom: um número, frentes automáticas |
| Histórico não se apaga | Bom | Bom | Ruim | Bom | Ótimo | Ótimo: transferência e saída viram eventos |
| WO-3 (uma OS aberta por veículo) | Trava o reboque bom à toa | Bom | Frágil | Bom | Natural | Natural: a trava é da frente |
| Um número de OS para o conjunto (o que o pátio pediu) | Sim | Sim | Sim | Sim | Não (um por reboque) | Sim |
| Indicadores (disponibilidade por veículo, MTTR) | Distorce | Distorce | Distorce | Distorce pouco | Certo | Certo |
| Complexidade | Baixa | Média, e acopla os módulos | Alta | Média | Média | Média |

## 6. Recomendação: F, OS do conjunto com uma frente por veículo

É o modelo dos grandes adaptado ao pátio: **um número de OS** para o conjunto, como o pátio pediu, e **o trabalho no veículo**, como os indicadores precisam.

**Como funciona:**

- **Abrir:** a OS do conjunto nasce com uma **frente por reboque**, na ordem de engate, gravando a posição de cada um naquela hora ("2º reboque do conjunto C-320"). OS de um veículo só é uma OS com uma frente.
- **Frente:** tem status próprio (na fila, em manutenção, pausada, concluída, saiu), serviços, sessões de trabalho, tempo parado e custo. A **trava WO-3 é da frente**: o reboque não abre outra OS enquanto a frente dele estiver aberta.
- **Serviço:** sempre numa frente (o veículo) e, quando fizer sentido, com eixo, lado e posição da roda, ligados ao cadastro de eixos do veículo.
- **Reboque sai (casos 1 e 2):** a pessoa conclui a frente dele, ou registra "saiu" com o motivo; o que ficou pendente pode ir para uma **OS nova só daquele reboque**, com o histórico ligado. Os outros reboques não esperam.
- **Reboque entra (caso 3) ou defeito novo (caso 7):** "Adicionar veículo à OS" cria uma frente nova.
- **Troca entre conjuntos (caso 6):** a frente é transferida para a outra OS, com o evento registrado; nada se apaga.
- **Mudança no cadastro do conjunto:** não é bloqueada. O detalhe da OS mostra o aviso ("SRK9H46 saiu do conjunto em 08/11") e a frente continua até alguém decidir. Assim o módulo de conjuntos não depende da OS.
- **Fechar a OS:** quando todas as frentes estiverem concluídas ou tiverem saído.

**O que muda no banco (para a fatia de implementação):**

- `work_order_vehicles` vira a **frente**: um veículo por linha, com `position`, `status`, `version`, e o `trailer_set_id` de origem como contexto. A OS guarda o conjunto de origem.
- A trava WO-3 (`open_work_order_locks`) passa a ser por veículo da frente, inserida e liberada com a frente.
- `work_order_services` aponta a frente; ganha eixo, lado e posição da roda opcionais, com FK para o cadastro de eixos do mesmo veículo.
- Eventos novos e só de inserção: frente adicionada, frente saiu (com motivo), frente transferida.
- As transições de status da frente seguem a mesma regra da OS (comando de ação, uma transação, condicional por `version`).

**O que muda nas telas:**

- Fila e lista: uma linha por OS com o conjunto ("Conjunto C-320 · 3 reboques"), e o estado das frentes ("2 em manutenção, 1 saiu").
- Detalhe da OS: as frentes lado a lado, como o checklist do conjunto; cada uma com seus serviços e seu status.
- Abrir OS: escolher o conjunto (padrão) ou um veículo.

## 7. Km

Reboque não tem hodômetro de painel, mas precisa de km: o pneu é avaliado por **custo por km** e **desgaste por km**, e o reboque tem preventiva por km (lubrificação, rolamento, freio). O schema já decidiu de onde vem esse km ([ativos](../../engenharia/schema-v2/ativos.md), invariante **AST-12**): **o km do reboque nunca é digitado solto**. Ele vem, nesta ordem:

1. do **hodômetro de cubo** do próprio reboque, quando ele tem;
2. do **hodômetro do cavalo cadastrado**, nos períodos em que estiveram engatados (soma dos trechos);
3. do **km informado no engate e no desengate**, quando o cavalo é de fora (de terceiro).

O km do **pneu** é a soma do km dos veículos em que ele esteve instalado, período a período.

**Como a OS por conjunto usa isso:**

- **Na entrada do conjunto, a pessoa informa o km do cavalo que trouxe o conjunto**, mesmo que o cavalo não entre na OS (ele fica fora, por decisão). Essa leitura é do cavalo e alimenta o km dos reboques pelo engate. Se o reboque tem hodômetro de cubo, pede a leitura dele também.
- **Cada frente congela o km do seu reboque na abertura** (calculado, não digitado), como fato: é a base da preventiva por km, do km entre falhas e do retrabalho ("voltou com 3.000 km").
- **Cavalo de terceiro:** pede o km dele na entrada e na saída do conjunto, que vira o km dos reboques no período.
- **Saída do conjunto:** o km de saída fecha o período de cada reboque.

**O que falta construir:** a tabela de leituras (`meter_readings`), o histórico de medidores e as regras AST-5, AST-6 e AST-12 são da tarefa **1.11**, ainda aberta. Hoje a OS guarda o km de entrada numa coluna dela (`work_order_vehicles.entry_km`), sem a leitura do medidor. Para o km de reboque e de pneu funcionar de verdade, a 1.11 precisa vir **antes ou junto** da OS por conjunto. Sem ela, a OS por conjunto grava só o km do cavalo informado, e os reboques ficam sem km até a 1.11 entrar (o fato do cavalo não se perde: o km dos reboques é calculado depois a partir dele).

## 8. SAP PM (Suzano)

Se a Suzano entrar, a OS do Truck conversa com o SAP PM pelo modelo que o schema já deixou pronto ([integração com ERP](../../engenharia/schema-v2/plataforma-e-ecossistema.md#integração-com-erp-sap-e-outros)): `external_refs` liga cada registro do Truck ao número do SAP, `data_ownership` diz quem é dono de cada cadastro, e tudo sai pelo outbox, com a oficina trabalhando mesmo com o SAP fora do ar.

**Como o caminho F encaixa no SAP:**

| Truck (caminho F) | SAP PM | Observação |
| --- | --- | --- |
| Reboque, cavalo | Equipamento (EQUI) | Já mapeado em `vehicles` |
| Conjunto e a posição de cada reboque | Local de instalação (IFLOT), com o equipamento instalado e desmontado (histórico de engate) | O engate e o desengate viram instalação e desmontagem no SAP |
| Eixo e lado, posição da roda | Sublocal de instalação, ou a posição na operação | Igual ao que o SAP faz com pneu |
| OS do conjunto | Ordem de manutenção (AUFK/AFIH) com **lista de objetos** (OBJK) | Uma ordem com os reboques na lista |
| Frente (um veículo na OS) | Item da lista de objetos, e as operações daquele equipamento | Cada frente tem `external_refs` próprio |
| Serviço | Operação (AFVC) apontando o equipamento | Já mapeado |
| Sessão de trabalho | Confirmação (AFRU) da operação | Já mapeado |
| Não conformidade do checklist | Nota de manutenção (QMEL) no equipamento | A OS nasce das notas, como no SAP |
| Km do cavalo na entrada | Documento de medição (IMRG) | Já mapeado |
| Reboque sai com pendência | Ordem de acompanhamento (follow-up) com as operações pendentes | O SAP não move operação entre ordens; o Truck também não move: fecha a frente e abre a nova, ligadas |

**Por que o F é o mais seguro para o SAP:** o mesmo dado sai nos dois formatos que uma empresa usa no SAP. Se a Suzano abre **uma ordem por conjunto**, a OS vai como uma ordem com lista de objetos. Se abre **uma ordem por equipamento**, cada frente vai como uma ordem própria. Os caminhos A, C e D só servem ao primeiro formato; o E, só ao segundo.

**O que muda no caminho F por causa do SAP:**

- **Transferir frente entre OS (caso 6)** não move a frente: fecha na OS de origem como "transferida" e abre uma nova na OS de destino, ligadas. Fica igual ao follow-up do SAP, e nada se apaga.
- **Cada frente e cada serviço têm id próprio**, para o `external_refs` guardar o item da lista de objetos e a operação.
- **Quem é dono da OS** (`data_ownership`): se a Suzano abrir a ordem no SAP, o Truck importa e a abertura fica bloqueada aqui; se abrir no Truck, o Truck envia. Precisa ser configurável por empresa desde já, mesmo sem a integração rodar.

**O que perguntar à Suzano:**

1. Hoje vocês abrem **uma ordem por conjunto ou uma por equipamento**? E o conjunto existe no SAP como local de instalação?
2. A ordem nasce no SAP (o Truck importa) ou na oficina (o Truck envia)?
3. Que tipo de ordem (PM01 corretiva, PM02 preventiva…) e que centro de trabalho cada oficina usa?
4. Pneu é equipamento no SAP, com histórico de posição?

## 9. O que falta decidir

1. **Caminho:** F, como recomendado, ou outro?
2. **Status da OS a partir das frentes:** a OS fica "em manutenção" se **qualquer** frente estiver, e "concluída" quando **todas** terminarem? (Estado derivado numa função só, como manda a regra de engenharia.)
3. **Reboque que sai com pendência:** o pendente vai sempre para uma OS nova daquele reboque, ou a pessoa pode escolher cancelar?
4. **Checklist:** um checklist de entrada por OS (o conjunto inteiro, como hoje) continua valendo?
5. **Cavalo junto (configuração da empresa):** com F, o cavalo vira só mais uma frente quando a empresa escolher "juntos". Confirmar que é isso.
6. **SAP:** as quatro perguntas da seção 8 para a Suzano. A resposta da primeira não muda o modelo (o F serve aos dois formatos), mas muda o que a integração envia.
7. **Km (seção 7):** a 1.11 (leituras de medidor e km de reboque) vem antes da OS por conjunto, junto com ela, ou depois?

## Referências

- Integração com ERP: [plataforma-e-ecossistema.md](../../engenharia/schema-v2/plataforma-e-ecossistema.md#integração-com-erp-sap-e-outros).
- Schema da manutenção: [manutencao.md](../../engenharia/schema-v2/manutencao.md) (já previa `trailer_set_id` e a trava WO-3 por conjunto).
- Débito técnico: [debito-tecnico.md](../../projeto/debito-tecnico.md) ("Conjunto (hero, direita) + serviço por unidade").
- Checklists por conjunto: [checklists-v2.md](./checklists-v2.md).
