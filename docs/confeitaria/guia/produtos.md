---
title: "Produtos: o que você vende"
sidebar_position: 5
tags: [confeitaria, guia, produtos, precificacao]
---

# Produtos: o que você vende

**Produto** é o que a cliente compra: um bolo, um cento de brigadeiros, uma torta, um kit de festa. Ele junta **receitas** e **insumos** (como a caixa), soma o **tempo de trabalho** e de **forno**, e mostra o **preço sugerido** e o **lucro** do preço que você cobra. É o produto que entra nas encomendas.

Fica no menu em **Produção → Produtos**.

![Tela de editar produto: composição à esquerda; tempo, custo e preço à direita](/img/confeitaria/guia/produto.png)

## A lista

![Lista de produtos com o preço, o sugerido e o lucro](/img/confeitaria/guia/produtos-lista.png)

Cada produto mostra o **seu preço** (ex.: R$ 150,00 por unidade), o **preço sugerido** (R$ 152,61) e uma etiqueta com o **lucro de verdade** do seu preço:

- **Verde**: está dando o lucro que você quer (ou mais).
- **Amarelo** ("Lucro de 29%"): está lucrando, mas abaixo da meta de Configurações.
- **Vermelho**: o preço nem cobre o custo (prejuízo).

## Cadastrar um produto

Clique em **Novo produto**.

### 1. Dados do produto

- **Nome**: como aparece para a cliente e na encomenda. Ex.: "Bolo de chocolate com brigadeiro".
- **Tipo**: Bolo, Docinho, Torta, Sobremesa, Kit festa ou Outro.
- **Como você vende**:
  - **Por unidade**: um bolo, um cupcake, uma torta.
  - **Por kg**: bolo vendido a quilo (ex.: R$ 120,00 o kg).
  - **Por cento**: docinhos (ex.: R$ 180,00 o cento).
- **Descrição** (opcional): o que vai no produto, para lembrar na hora da encomenda.

### 2. Composição

Clique em **Adicionar item** e escolha **receitas** e **insumos** (principalmente embalagens). Em cada linha, coloque a **quantidade** que vai no produto:

| Item | Quantidade | Custo |
|---|---|---|
| Massa de chocolate *(receita)* | 1200 g | R$ 17,71 |
| Brigadeiro *(receita)* | 600 g | R$ 15,91 |
| Caixa 25 × 25 *(insumo)* | 1 un | R$ 3,20 |

Depois, **"Essa composição rende quantas…?"**: quantas unidades (ou kg, ou centos) saem dessa composição.

- Um bolo: **1**.
- 12 cupcakes com a mesma massa: **12** (o custo é dividido por 12).
- Bolo vendido por kg, que pesa 2,5 kg pronto: **2,5**.
- Docinhos por cento, com 100 unidades: **1**.

O **Custo da composição** (R$ 36,83 no exemplo) aparece embaixo.

### 3. Tempo (no painel da direita)

- **Trabalho (min)**: o tempo de mão na massa para fazer **a composição inteira**: preparar as receitas, montar, rechear, decorar e embalar. Ex.: 90 min.
- **Forno (min)**: quanto tempo o forno fica ligado. Ex.: 45 min.

O trabalho custa pela **hora de produção** (a sua hora + a da equipe, de [Configurações](./configuracoes.md)) e o forno pelo custo do forno por hora.

### 4. Preço (no painel da direita)

O painel mostra a conta inteira, por unidade de venda:

| Linha | No exemplo |
|---|---|
| Ingredientes e embalagens | R$ 36,83 |
| Trabalho (90 min × R$ 17,31 a hora) | R$ 25,97 |
| Forno (45 min × R$ 3,00 a hora) | R$ 2,25 |
| **Custo por unidade** | **R$ 65,05** |
| **Preço sugerido** (já com custos fixos 24%, impostos 0%, taxas 3% e lucro 30%) | **R$ 152,61** |

- **Usar este preço** copia o sugerido para o seu preço.
- **Seu preço de venda**: o preço que você vai cobrar de verdade (pode arredondar: R$ 150,00).
- Embaixo, o **lucro de verdade** desse preço: "Lucro de R$ 43,89 por unidade (29%), abaixo da sua meta de 30%". Se ficar abaixo da meta, aparece em amarelo; com prejuízo, em vermelho.

### 5. Salvar

Clique em **Salvar produto**. Ele aparece na lista e já pode ser escolhido nas encomendas.

## O preço sugerido muda sozinho

O preço sugerido é recalculado sempre que muda algo por baixo: o preço de um insumo, uma receita ou as Configurações. O **seu preço** não muda sozinho: ele é uma decisão sua. Por isso a lista mostra os dois lado a lado. Quando o sugerido passar do seu preço, a etiqueta de lucro fica amarela ou vermelha, avisando que é hora de reajustar.

:::info[Encomendas guardam o preço do dia]
Quando você cria uma encomenda, ela copia o nome, o preço e o custo do produto naquele dia. Reajustar o produto depois **não muda** encomendas antigas.
:::

## Arquivar

Parou de vender? Abra o produto e clique em **Arquivar**. Ele some da lista e das encomendas novas, mas as encomendas antigas continuam com ele. Para voltar: **Ver arquivados**, abra e **Reativar**.

## Dúvidas comuns

**O preço sugerido ficou muito alto. O que eu faço?**
Olhe o painel de preço: ele mostra de onde vem cada parte. Os culpados mais comuns são o **tempo de trabalho** (confira se não está contando o dia inteiro), os **custos fixos** muito altos para o faturamento, ou um **lucro** alto demais em Configurações. Você também pode cobrar menos: o painel mostra quanto lucro sobra com o seu preço.

**Vendo o mesmo bolo em tamanhos diferentes (1 kg, 2 kg, 3 kg).**
Duas opções: um produto **por kg** (a cliente escolhe o peso na encomenda) ou um produto para cada tamanho, cada um com a sua composição e o seu tempo.

**Qual a diferença entre o tempo da receita e o do produto?**
Só o tempo do **produto** entra no preço. O da receita é anotação. Veja [Receitas](./receitas.md#4-o-painel-da-direita).
