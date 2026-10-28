---
title: "Configurações: os números do seu negócio"
sidebar_position: 2
tags: [confeitaria, guia, configuracoes, precificacao]
---

# Configurações: os números do seu negócio

A tela **Configurações** guarda os números que o sistema usa para calcular o **preço sugerido** de todos os seus produtos: quanto vale a sua hora, quem trabalha com você, as contas fixas do mês e os percentuais que saem de cada venda. Você preenche uma vez e ajusta quando algo muda (a luz subiu, você contratou alguém, quer ganhar mais).

Ela fica no menu, em **Gestão → Configurações**.

![Tela de Configurações com o ajudante da hora aberto](/img/confeitaria/guia/configuracoes.png)

:::tip[Primeira vez?]
Enquanto você não salvar, a tela mostra o aviso **"Estes são valores de exemplo"**. Os preços sugeridos já funcionam com eles, mas só ficam certos depois que você coloca os seus números e clica em **Salvar**.
:::

:::info[Quem pode mexer]
Só a **dona** da confeitaria altera estes números. Quem entra como ajudante vê os preços, mas não muda as configurações.
:::

## Como a tela é organizada

- **À esquerda**, o que você preenche: *Sua hora*, *Equipe*, *Custos fixos do mês* e *Encomendas*.
- **À direita**, o resultado, que muda enquanto você digita: quanto custa **1 hora de produção**, quanto os **custos fixos** pesam no preço e os **percentuais sobre a venda**.
- **Salvar** fica no topo, ao lado do título (no celular, no fim da página). Ao salvar, os preços sugeridos de todos os produtos são recalculados na hora.

## Passo a passo

### 1. Sua hora

**Valor da sua hora de trabalho (R$)** é quanto você quer ganhar por hora, como se fosse um salário. Ele entra no custo de cada produto pelo tempo que você leva para fazer (o "Trabalho (min)" do produto).

Não sabe quanto vale a sua hora? Clique em **Calcular para mim** e responda três perguntas:

| Pergunta | Exemplo |
|---|---|
| Quero ganhar por mês | R$ 1.500,00 |
| Horas por dia | 6 |
| Dias por semana | 6 |

O sistema faz a conta: 6 h × 6 dias × **4,33 semanas** = **156 horas por mês**, e R$ 1.500 ÷ 156 h = **R$ 9,62 por hora**. Clique em **Usar R$ 9,62** e o valor vai para o campo.

:::note[Por que 4,33 semanas?]
Um mês tem, em média, 52 semanas ÷ 12 meses = 4,33 semanas. Contar só 4 semanas deixa as horas do mês curtas e a sua hora sai mais cara do que é.
:::

**Custo do forno por hora (R$)** é o gás ou a energia que o forno gasta. Exemplo: um botijão de R$ 120 que dura 40 horas de forno = R$ 3,00 por hora. Ele entra no produto pelo "Forno (min)".

### 2. Equipe

Se alguém trabalha com você, cadastre aqui. Clique em **+ Pessoa** e preencha:

- **Nome**
- **Salário por mês (R$)**
- **Horas por dia** e **Dias por semana**

A janela já mostra quanto **a hora dela custa**. Exemplo: R$ 800 por mês, 4 h por dia, 6 dias por semana = 104 horas no mês → **R$ 7,69 por hora**. Clique em **Adicionar pessoa**.

![Janela para cadastrar ou editar uma pessoa da equipe](/img/confeitaria/guia/configuracoes-pessoa.png)

A pessoa aparece numa lista com o salário, as horas e o custo da hora. Use o **lápis** para editar e a **lixeira** para tirar.

**Como a equipe entra no preço:** a hora de cada pessoa é somada à sua. É o que o painel da direita chama de **1 hora de produção**. Com você a R$ 9,62 e a Júlia a R$ 7,69, 1 hora de produção custa **R$ 17,31**. Um bolo com 90 minutos de trabalho paga 1,5 × R$ 17,31 = **R$ 25,97** de mão de obra.

:::warning[Não conte o salário duas vezes]
O salário da equipe já entra pela hora de produção. **Não lance o salário de novo nos custos fixos**, senão ele é cobrado duas vezes no preço.
:::

### 3. Custos fixos do mês

São as contas que existem **mesmo sem vender nada**. Clique em **+ Item** para cada uma e preencha o nome e o valor do mês:

| Conta | Valor por mês |
|---|---|
| Água | R$ 135,00 |
| Luz | R$ 600,00 |
| Aluguel | R$ 600,00 |
| Transporte | R$ 200,00 |
| Gás | R$ 130,00 |
| Internet | R$ 100,00 |
| Materiais de limpeza | R$ 100,00 |
| MEI (DAS) | R$ 85,00 |
| **Total por mês** | **R$ 1.950,00** |

O **total soma sozinho**. Para tirar uma conta, use a lixeira da linha.

Depois, preencha o **Faturamento médio por mês (R$)**: quanto entra num mês normal de vendas. O sistema divide os custos fixos pelo faturamento e transforma num percentual que cada venda reserva para pagar as contas. No exemplo, R$ 1.950 ÷ R$ 8.000 = **24,4%**, que aparece no painel em **Custos fixos no preço**.

:::tip[Sem faturamento, os custos fixos ficam de fora]
Enquanto o faturamento médio estiver vazio ou zerado, os custos fixos **não entram** no preço sugerido. O painel avisa: "Informe o faturamento médio para ver quanto os custos fixos pesam no preço".
:::

**O que é e o que não é custo fixo:**

- **É:** luz, água, aluguel, internet, telefone, gás de cozinha, transporte do dia a dia, materiais de limpeza, contador, **DAS do MEI**.
- **Não é:** ingredientes e embalagens (já entram pelo produto, pela composição), o salário da equipe (entra pela hora de produção) e o seu pró-labore (é o seu lucro e a sua hora).

### 4. Percentuais sobre a venda (no painel da direita)

Cada um é uma parte **do preço de venda** (não do custo):

- **Impostos (%)**: imposto que é uma porcentagem de cada venda.
- **Taxas (%)**: o que a maquininha de cartão ou o aplicativo de entrega cobra de cada venda.
- **Lucro (%)**: quanto do preço você quer que sobre de lucro, depois de pagar tudo.

O preço sugerido é calculado para que, depois de tirar o custo do produto, os custos fixos, os impostos e as taxas, sobre exatamente o lucro que você escolheu.

:::warning[É MEI? Deixe Impostos em 0]
O DAS do MEI é um **valor fixo por mês** (paga o mesmo vendendo pouco ou muito). Por isso ele vai em **Custos fixos**, como um item "MEI (DAS)", e **Impostos (%) fica em 0**. Se colocar nos dois lugares, o imposto entra duas vezes no preço. O campo Impostos serve para quem é ME no Simples Nacional, que paga uma porcentagem sobre o faturamento.
:::

:::danger[A soma não pode chegar a 100%]
Custos fixos + impostos + taxas + lucro precisam somar **menos de 100%**. Se passar, nenhum preço consegue cobrir tudo e o painel avisa: "A soma passa de 100%". Diminua o lucro ou as taxas.
:::

### 5. Encomendas

Estes dois números não mudam o preço, mas organizam as encomendas:

- **Sinal padrão (%)**: quanto a cliente paga para confirmar a encomenda. O mais comum é 50%. A tela de encomenda já sugere esse valor.
- **Limite de encomendas por dia**: quantas encomendas cabem num dia. A agenda avisa quando um dia enche. Deixe **vazio** para não ter limite.

### 6. Salvar

Clique em **Salvar**. Aparece a mensagem *"Configurações salvas. Os preços sugeridos já foram atualizados."* e todos os produtos passam a usar os números novos.

Os preços que você já cobrou em encomendas antigas **não mudam**: cada encomenda guarda o preço do dia em que foi feita.

## Perguntas frequentes

**Mudei um número. Preciso mexer nos produtos?**
Não. O preço sugerido de todos os produtos é recalculado sozinho. O **seu preço** (o que você decidiu cobrar) continua o mesmo; compare com o sugerido na tela do produto e ajuste se quiser.

**Já tinha um valor de custos fixos antes da lista. O que aconteceu com ele?**
Ele aparece como um item chamado **"Custos fixos"**. Você pode deixar assim ou trocar por uma conta por linha (luz, água, aluguel…), o que ajuda a lembrar de onde vem o número.

**Trabalho sozinha. Preciso preencher Equipe?**
Não. Deixe vazio: a hora de produção é só a sua.

**A minha funcionária só ajuda em alguns produtos. Como fica?**
A hora dela é somada a todos os produtos, pelo tempo de trabalho de cada um (como a planilha de precificação faz). Se ela ajuda pouco, uma opção é cadastrar só as horas em que ela trabalha na produção.

**Onde vejo para onde vai cada real do preço?**
Na **Precificação** (menu Gestão), que usa estes mesmos números: digite um custo e veja o preço sugerido, a divisão de cada real e o "E se eu cobrar…?".

## Resumo rápido

| Campo | O que colocar | Entra no preço por |
|---|---|---|
| Valor da sua hora | Quanto quer ganhar por hora (ou use *Calcular para mim*) | Tempo de trabalho do produto |
| Custo do forno por hora | Gás ou energia do forno por hora | Tempo de forno do produto |
| Equipe | Salário, horas por dia e dias por semana de cada pessoa | Tempo de trabalho (soma na hora de produção) |
| Custos fixos | Cada conta fixa do mês, incluindo o DAS do MEI | % do faturamento médio |
| Faturamento médio | Quanto entra num mês normal | Divide os custos fixos |
| Impostos (%) | 0 para MEI; a alíquota para ME no Simples | % do preço |
| Taxas (%) | Taxa da maquininha ou do aplicativo | % do preço |
| Lucro (%) | Quanto quer que sobre | % do preço |
| Sinal padrão (%) | Quanto a cliente paga para confirmar | Não muda o preço |
| Limite por dia | Quantas encomendas cabem num dia (vazio = sem limite) | Não muda o preço |
