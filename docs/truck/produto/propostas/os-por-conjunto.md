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

## 7. O que falta decidir

1. **Caminho:** F, como recomendado, ou outro?
2. **Status da OS a partir das frentes:** a OS fica "em manutenção" se **qualquer** frente estiver, e "concluída" quando **todas** terminarem? (Estado derivado numa função só, como manda a regra de engenharia.)
3. **Reboque que sai com pendência:** o pendente vai sempre para uma OS nova daquele reboque, ou a pessoa pode escolher cancelar?
4. **Checklist:** um checklist de entrada por OS (o conjunto inteiro, como hoje) continua valendo?
5. **Cavalo junto (configuração da empresa):** com F, o cavalo vira só mais uma frente quando a empresa escolher "juntos". Confirmar que é isso.

## Referências

- Schema da manutenção: [manutencao.md](../../engenharia/schema-v2/manutencao.md) (já previa `trailer_set_id` e a trava WO-3 por conjunto).
- Débito técnico: [debito-tecnico.md](../../projeto/debito-tecnico.md) ("Conjunto (hero, direita) + serviço por unidade").
- Checklists por conjunto: [checklists-v2.md](./checklists-v2.md).
