---
title: "Precificação: quanto cobrar"
sidebar_position: 6
tags: [confeitaria, guia, precificacao]
---

# Precificação: quanto cobrar

A tela **Precificação** é uma **calculadora rápida de preço**. Você digita quanto um produto custa e ela responde:

- **quanto cobrar** para ter o lucro que você quer;
- **para onde vai cada real** desse preço (custo, contas fixas, impostos, taxas e o seu lucro);
- **e se eu cobrar outro valor?**: quanto sobra de verdade, e qual o **mínimo** para não ter prejuízo.

Ela fica no menu, em **Gestão → Precificação**.

![Tela de Precificação com um custo de R$ 25,90 e o teste de cobrar R$ 40,00](/img/confeitaria/guia/precificacao.png)

:::info[Ela não salva nada]
A Precificação só faz contas. Nada do que você digita aqui fica guardado, e nenhum produto muda. Para um produto ter preço, cadastre-o em **Produtos**. Lá o mesmo cálculo é feito sozinho, com o custo que o sistema monta para você.
:::

## Quando usar esta tela (e quando usar Produtos)

| Situação | Onde |
|---|---|
| Uma cliente pediu algo que você nunca fez e quer o preço agora | **Precificação** |
| Você já sabe o custo de cabeça (ou de uma planilha) e só quer o preço | **Precificação** |
| Quer testar "e se eu cobrar R$ 40?" antes de decidir | **Precificação** |
| É um produto que você vende sempre | **Produtos**: ele calcula o custo pela receita, embalagem, trabalho e forno, e mantém o preço atualizado quando um insumo sobe |

## De onde vem cada coisa da tela

Esta é a parte mais importante: a tela tem **uma coisa que você digita** e **o resto vem de Configurações**.

| O que aparece | De onde vem | Onde mudar |
|---|---|---|
| **Custo do produto** | Você digita, nesta tela | Aqui mesmo |
| **Custos fixos (%)** | Conta feita com dois números de Configurações: *Total dos custos fixos do mês* ÷ *Faturamento médio por mês* | Configurações → Custos fixos do mês |
| **Impostos (%)** | Configurações → Percentuais sobre a venda | Configurações |
| **Taxas (%)** (maquininha, app) | Configurações → Percentuais sobre a venda | Configurações |
| **Lucro (%)** | Configurações → Percentuais sobre a venda | Configurações |
| **Preço sugerido**, **lucro**, **para onde vai cada real** | Calculados na hora, com o custo + os quatro percentuais | Mudam sozinhos |
| **Outro preço** | Você digita, nesta tela | Aqui mesmo |
| **Lucro desse outro preço** e **mínimo** | Calculados na hora | Mudam sozinhos |

Ou seja: **se o preço sugerido parece errado, quase sempre o motivo está em Configurações**. Uma conta de luz que ficou de fora, um faturamento médio muito alto ou muito baixo, uma taxa da maquininha esquecida.

:::tip[Os mesmos números dos seus produtos]
A Precificação usa exatamente os mesmos percentuais que os produtos usam. Se o mesmo custo der um preço aqui e outro no produto, a diferença está no **custo** (o produto soma trabalho e forno pelo tempo que você informou), não nos percentuais.
:::

## Parte por parte

### 1. Custo do produto (R$)

É o único número obrigatório. Coloque **tudo o que esse produto gasta para existir**:

- ingredientes;
- embalagem (caixa, fita, forminhas, etiqueta);
- **o seu trabalho** (o tempo que você leva × o valor da sua hora);
- forno (o tempo de forno × o custo do forno por hora).

:::warning[Não esqueça o seu trabalho]
Um erro muito comum é colocar só os ingredientes. Aí o preço sai baixo e o seu tempo vai de graça. Se você não sabe o valor da sua hora, veja o ajudante **Calcular para mim** em [Configurações](./configuracoes.md).
:::

O que **não** entra aqui: luz, aluguel, internet, MEI e outras contas do mês. Essas já estão nos **custos fixos (%)**, que a tela soma por você. Se você colocar no custo também, elas contam duas vezes.

### 2. Preço sugerido e lucro

Assim que você digita o custo, o quadro da direita mostra:

- **Preço sugerido**: quanto cobrar.
- **Lucro de**: quanto sobra para você em reais e em % do preço. Esse % é sempre o **Lucro (%)** de Configurações.
- **"Para um custo de…"**: repete o custo que você digitou, para conferir.

No exemplo da foto: custo de **R$ 25,90**, com custos fixos 10%, impostos 0%, taxas 3% e lucro 30%, o preço sugerido é **R$ 45,44** e o lucro é **R$ 13,64 (30%)**.

### 3. Para onde vai cada real

A barra colorida e a lista embaixo dela mostram como o preço sugerido se divide. As cinco partes sempre somam o preço:

| Parte | O que é | No exemplo |
|---|---|---|
| **Custo** | O que você digitou: volta para pagar o que foi gasto no produto | R$ 25,90 (57%) |
| **Custos fixos** | A parte do preço que ajuda a pagar as contas do mês | R$ 4,54 (10%) |
| **Impostos** | O imposto sobre a venda (se você paga um %; o DAS do MEI é valor fixo e fica nos custos fixos) | R$ 0,00 (0%) |
| **Taxas** | A taxa da maquininha ou do aplicativo | R$ 1,36 (3%) |
| **Seu lucro** | O que sobra de verdade, depois de pagar tudo | R$ 13,64 (30%) |
| **Total** | | **R$ 45,44** |

### 4. Antes de digitar o custo: "De cada R$ 100,00"

Com o custo vazio, a tela não tem preço para mostrar, mas já mostra **como fica cada R$ 100,00 que você cobra**: quantos reais vão para custos fixos, impostos, taxas e lucro, e quanto sobra para o custo. Serve para ver o peso dos seus percentuais antes de qualquer conta.

![Precificação antes de digitar o custo, mostrando a divisão de cada R$ 100,00](/img/confeitaria/guia/precificacao-vazia.png)

### 5. E se eu cobrar…?

Às vezes você quer cobrar um preço redondo, ou o preço da concorrência. Digite em **Outro preço (R$)** e veja o que acontece com o seu lucro. Ele só funciona com o **custo** preenchido.

O selo muda de cor:

| Cor | Quando | Exemplo (custo R$ 25,90) |
|---|---|---|
| **Verde** | O lucro fica no que você quer (ou mais) | Cobrar R$ 50,00 → lucro R$ 17,60 · 35% |
| **Amarelo** | Ainda dá lucro, mas **abaixo** do Lucro (%) de Configurações | Cobrar R$ 40,00 → lucro R$ 8,90 · 22%: "Abaixo dos 30% que você quer" |
| **Vermelho** | **Prejuízo**: o preço não paga o custo, as contas e as taxas | Cobrar R$ 28,00 → prejuízo de R$ 1,54 |

![Selo vermelho de prejuízo ao testar R$ 28,00](/img/confeitaria/guia/precificacao-prejuizo.png)

Embaixo aparece também o **mínimo**: *"Para não ter prejuízo, o mínimo é R$ 29,78"*. É o menor preço que ainda paga o custo, os custos fixos, os impostos e as taxas, com **lucro zero**. Abaixo dele você paga para trabalhar.

:::note[Por que o lucro de R$ 40,00 é só R$ 8,90?]
Porque os custos fixos, os impostos e as taxas são **% do preço que você cobra**. De R$ 40,00 saem 10% de custos fixos (R$ 4,00) e 3% de taxas (R$ 1,20). Sobra R$ 40,00 − R$ 25,90 − R$ 4,00 − R$ 1,20 = **R$ 8,90**.
:::

### 6. Os percentuais e o botão Mudar

No pé da calculadora aparece a linha **"Fixos 10% · impostos 0% · taxas 3% · lucro 30%"**: são os percentuais de Configurações que a conta está usando.

Clique em **Mudar** para testar outros números **só nesta conta**, sem mexer em Configurações. Por exemplo: "e se eu ganhasse 40% neste bolo de casamento?"

![Percentuais abertos para mudar só nesta conta](/img/confeitaria/guia/precificacao-mudar.png)

- O que você muda ali vale **só enquanto a tela estiver aberta**. Saiu da tela, volta para os de Configurações.
- **Voltar aos de Configurações** desfaz a mudança na hora.
- Para mudar de verdade (em todos os produtos), clique no link **Configurações** e salve lá.

## A conta por dentro

A tela usa o **markup divisor**, a forma que dá o lucro certo:

> **Preço = Custo ÷ (1 − soma dos percentuais)**

No exemplo:

1. Soma dos percentuais: 10% + 0% + 3% + 30% = **43%**
2. O que sobra para o custo: 100% − 43% = **57%** (ou 0,57)
3. Preço: R$ 25,90 ÷ 0,57 = R$ 45,438… → **R$ 45,44** (sempre arredonda para cima no centavo)

E o mínimo é a mesma conta com lucro 0%: R$ 25,90 ÷ (1 − 0,13) = **R$ 29,78**.

:::warning[Por que não "custo + 30%"?]
É o erro mais comum. R$ 25,90 + 30% = R$ 33,67. Parece lucro, mas desse preço ainda saem 10% de custos fixos (R$ 3,37) e 3% de taxas (R$ 1,01). Sobra **R$ 3,39**, só **10%**, e não os 30% que você queria. O markup divisor já desconta tudo isso **antes** de chegar ao lucro.
:::

## Avisos que podem aparecer

| Aviso | O que significa | O que fazer |
|---|---|---|
| *"A soma dos percentuais (…) precisa ser menor que 100%"* | Custos fixos + impostos + taxas + lucro deram 100% ou mais: não sobra nada para pagar o custo, então não existe preço possível | Baixe algum percentual. Se foram os custos fixos, confira o faturamento médio em Configurações |
| *"Use só números nos percentuais, por exemplo 12,5."* | Em **Mudar**, um campo ficou com letra ou símbolo | Corrija o campo |
| *"O custo vai até R$ 100.000,00…"* | O custo ficou grande demais (quase sempre um número a mais digitado) | Confira o valor |
| *"O preço vai até R$ 1.000.000,00…"* | O mesmo, no Outro preço | Confira o valor |

## Perguntas frequentes

**Os custos fixos aparecem com 0%. Está certo?**
Aparecem com 0% quando o **faturamento médio por mês** de Configurações está vazio ou zerado. Sem ele não dá para saber quanto cada venda precisa ajudar a pagar as contas. Preencha os dois (contas fixas e faturamento) em Configurações.

**Mudei um percentual em Mudar. Meus produtos mudaram?**
Não. O **Mudar** é só para testar. Os produtos usam o que está salvo em Configurações.

**Cobrei um preço "verde" no Outro preço. Posso usar esse preço no produto?**
Pode. Em **Produtos**, digite esse valor em *Seu preço de venda*. A lista de produtos vai mostrar o lucro de verdade dele.

**Por que o preço sugerido aqui é diferente do preço sugerido do produto?**
Os percentuais são os mesmos; o que muda é o **custo**. O produto calcula o custo sozinho (receitas, embalagens, trabalho e forno pelos minutos informados). Se você digitar aqui o mesmo "Custo por …" que aparece no produto, o preço sai igual.

## Resumo

- Você digita **o custo** (e, se quiser, **outro preço** para testar).
- **Tudo o mais vem de Configurações**: custos fixos (contas ÷ faturamento), impostos, taxas e lucro.
- **Preço = custo ÷ (1 − soma dos %)**. Assim o lucro que você pediu é o lucro que você recebe.
- **Verde** está bom, **amarelo** é lucro abaixo do que você quer, **vermelho** é prejuízo. O **mínimo** é o limite do prejuízo.
- **Nada é salvo** nesta tela.
