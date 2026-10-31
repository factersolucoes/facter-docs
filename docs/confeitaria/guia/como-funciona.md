---
title: "Como o preço é montado: insumo, receita e produto"
sidebar_position: 1
tags: [confeitaria, guia, precificacao, insumos, receitas, produtos]
---

# Como o preço é montado: insumo, receita e produto

O sistema calcula o custo e o preço sugerido do que você vende juntando três cadastros, um em cima do outro. Entender a diferença entre eles é o que faz o resto ficar fácil.

| Cadastro | O que é | Pergunta que responde | Exemplo |
|---|---|---|---|
| **Insumo** | O que você **compra** | "Quanto paguei e quanto custa cada grama?" | Leite condensado: 395 g por R$ 7,99 |
| **Receita** | O que você **prepara** e usa em vários produtos | "Quanto custa fazer 1 kg de brigadeiro?" | Brigadeiro: rende 1.000 g e custa R$ 26,52 |
| **Produto** | O que você **vende** para a cliente | "Por quanto eu vendo este bolo?" | Bolo de chocolate com brigadeiro: preço sugerido R$ 152,61 |

## Pense na sua cozinha

1. Você vai ao mercado e compra **insumos**: leite condensado, chocolate, farinha, ovos, caixas.
2. Na cozinha, você prepara **receitas** com eles: uma panela de brigadeiro, uma massa de chocolate. A receita é a "base": o mesmo brigadeiro vai num bolo, num docinho, numa torta.
3. Depois, monta o **produto** que vai para a cliente: um bolo com 1.200 g de massa, 600 g de brigadeiro e uma caixa. Só o produto tem **tempo de trabalho**, **preço de venda** e **lucro**.

```text
INSUMOS (o que compra)          RECEITAS (o que prepara)           PRODUTO (o que vende)
Leite condensado  ─┐
Creme de leite    ─┼──────────▶ Brigadeiro (1.000 g)  ── 600 g ──┐
Chocolate em pó   ─┤                                             │
Manteiga          ─┘                                             ├──▶ Bolo de chocolate com brigadeiro
Farinha, açúcar,  ────────────▶ Massa de chocolate    ── 1.200 g ┤     + 90 min de trabalho
ovos, leite…                     (1.200 g)                       │     + 45 min de forno
Caixa 25 × 25     ───────────────────────────────────── 1 un ────┘     = preço sugerido
```

Repare que a **caixa** vai direto do insumo para o produto: embalagem não precisa de receita.

## O caminho do dinheiro, com números

**1. Insumo → custo por grama.** Leite condensado: R$ 7,99 ÷ 395 g = R$ 0,0202 por grama (R$ 20,23 o kg).

**2. Receita → custo da panela.** O brigadeiro usa 790 g de leite condensado (R$ 15,98), 200 g de creme de leite (R$ 3,49), 120 g de chocolate (R$ 5,25, já com 2% de perda) e 30 g de manteiga (R$ 1,80). Total: **R$ 26,52** para 1.000 g, ou seja, R$ 26,52 o kg.

**3. Produto → custo do bolo.**

| Parte | Conta | Valor |
|---|---|---|
| Massa de chocolate | 1.200 g da receita que custa R$ 17,71 a cada 1.200 g | R$ 17,71 |
| Brigadeiro | 600 g × R$ 26,52 o kg | R$ 15,91 |
| Caixa 25 × 25 | 1 caixa (10 por R$ 32,00) | R$ 3,20 |
| **Ingredientes e embalagens** | | **R$ 36,83** |
| Trabalho | 90 min × R$ 17,31 a hora de produção (você + equipe) | R$ 25,97 |
| Forno | 45 min × R$ 3,00 a hora | R$ 2,25 |
| **Custo do bolo** | | **R$ 65,05** |

**4. Produto → preço sugerido.** Do preço de venda ainda saem os custos fixos (24,4%), os impostos (0% no MEI), as taxas (3%) e o lucro que você quer (30%). Somados, 57,4%. O preço que cobre tudo isso é R$ 65,05 ÷ (100% − 57,4%) = **R$ 152,61**.

Os percentuais e a hora de produção vêm de [Configurações](./configuracoes.md).

## A regra de ouro

- **Mudou o preço de um insumo?** Todas as receitas e produtos que usam ele mudam de custo sozinhos. Você não precisa refazer nada.
- **Mudou uma receita?** Todos os produtos que usam ela mudam junto.
- **Mudou as Configurações?** Todos os preços sugeridos são recalculados.
- **Encomendas já feitas não mudam:** cada encomenda guarda o preço do dia em que foi feita.

## Por onde começar

O caminho completo, das configurações às encomendas e ao financeiro, está em [Primeiros passos](./primeiros-passos.md). Para a parte de preço:

1. [Configurações](./configuracoes.md): a sua hora, a equipe, os custos fixos e o lucro. Uma vez só.
2. [Insumos](./insumos.md): cadastre o que você compra, começando pelos mais usados.
3. [Receitas](./receitas.md): as suas bases (massas, recheios, coberturas, docinhos).
4. [Produtos](./produtos.md): o que você vende, juntando receitas e embalagens, com o tempo e o preço.

:::tip[Preciso cadastrar receita para tudo?]
Não. Se um produto é simples (um brigadeiro gourmet que você compra pronto, um kit de festa), ele pode usar **insumos direto**, sem receita. A receita vale a pena quando a mesma base entra em mais de um produto, ou quando você quer saber o custo de uma panela inteira.
:::
