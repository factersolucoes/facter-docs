---
title: "Encomendas: do orçamento à entrega"
sidebar_position: 9
tags: [confeitaria, guia, encomendas]
---

# Encomendas: do orçamento à entrega

A **encomenda** é o pedido da cliente: o que ela quer, para quando, se retira ou recebe em casa, quanto custa e quanto já pagou. Ela passa pelos passos **Orçamento → Confirmada → Em produção → Pronta → Entregue**, e você sempre sabe quanto falta receber.

Fica no menu em **Vendas → Encomendas** (e na barra de baixo do celular).

**Antes de começar:** você precisa de pelo menos um [produto](./produtos.md) cadastrado. A cliente pode ser cadastrada na hora.

## A lista

![Lista de encomendas em aberto, agrupadas por dia](/img/confeitaria/guia/encomendas-lista.png)

- No alto, quatro números: **Em aberto**, **Para hoje**, **Atrasadas** (vermelho quando tem alguma) e **A receber**.
- Abas **Em aberto**, **Entregues**, **Canceladas** e **Todas**. Em aberto, a entrega mais próxima vem primeiro.
- **Busca** pelo nome da cliente ou pelo **número** da encomenda.
- As encomendas ficam **agrupadas por dia** ("Hoje", "Amanhã", "Ter., 03/11"), com o total de cada dia.
- Cada linha mostra a hora, o número, a cliente, o status, se é entrega ou retirada, o total e **"Falta R$ X"** ou **"Pago"**.
- O botão da linha **avança o passo** sem abrir a encomenda: **Confirmar**, **Produzir**, **Pronta**, **Entregar**.

## Registrar uma encomenda

Clique em **Nova encomenda**. Também dá para começar pela [Agenda](./agenda.md) (a data já vem preenchida) ou pela ficha da [cliente](./clientes.md) (ela já vem escolhida).

![Tela de nova encomenda: cliente, quando e onde, produtos e o resumo ao lado](/img/confeitaria/guia/encomenda-nova.png)

1. **Cliente**: **Escolher cliente**, busque pelo nome ou telefone e clique nela. Cliente nova? **Cadastrar nova cliente**, preencha e **Cadastrar e usar**. Se ela tem alguma restrição, aparece numa caixa amarela.
2. **Quando e onde**:
   - **Data** e **Hora** da entrega ou retirada (as duas são obrigatórias).
   - **Como a cliente recebe**: **Retira** ou **Entrega**. Na entrega, preencha o **Endereço de entrega** (ou clique em **Usar o endereço da cliente**) e a **Taxa de entrega (R$)**, se cobrar.
3. **Produtos**: **Adicionar produto** e escolha. Para cada um, ajuste a **Quantidade** (em kg, cento ou unidades, conforme o produto) e, se quiser, o **Preço** só nesta encomenda. O preço que vem é o que você definiu no produto.
4. **Observações**: tema, cores, frase no bolo, horário combinado.
5. No painel da direita, confira o **Resumo**, dê um **Desconto (R$)** se quiser, e veja o **Total** e o **Sinal sugerido** (o percentual vem de [Configurações](./configuracoes.md)).
6. Clique em **Criar encomenda**. Ela ganha um **número** (nº 1, nº 2…) e nasce como **Orçamento**.

:::warning[Dia cheio ou bloqueado]
Se o dia já atingiu o seu **limite de encomendas** ou está **bloqueado** na Agenda, aparece um aviso amarelo antes de salvar, por exemplo "O dia 24/12 já tem 5 encomendas (seu limite é 5)". Você escolhe: **Escolher outro dia** ou **Salvar mesmo assim**. É só um aviso: quem decide é você.
:::

:::info[O preço do pedido não muda depois]
A encomenda guarda o nome, a unidade e o preço de cada produto **do dia em que foi feita**. Se você aumentar o preço do produto amanhã, os pedidos já registrados continuam com o valor combinado.
:::

## Acompanhar uma encomenda

Clique numa encomenda para abrir o detalhe.

![Detalhe da encomenda: os passos no alto, cliente e produtos à esquerda, pagamento à direita](/img/confeitaria/guia/encomenda-detalhe.png)

### Os passos

No alto ficam os passos e um botão com o próximo: **Confirmar encomenda**, **Começar a produção**, **Marcar como pronta**, **Marcar como entregue**.

| Passo | Quando usar |
|---|---|
| **Orçamento** | Você passou o preço e a cliente ainda não fechou |
| **Confirmada** | A cliente fechou (normalmente quando paga o sinal) |
| **Em produção** | Você começou a fazer |
| **Pronta** | Está pronta para retirar ou sair para entrega |
| **Entregue** | Chegou na cliente. A encomenda está concluída |

Os passos vão sempre em ordem, um de cada vez, e não voltam. Registrar um pagamento **não** muda o passo sozinho.

### Mandar o orçamento no WhatsApp

Na seção **Cliente**, o botão **Enviar orçamento no WhatsApp** abre o WhatsApp com a mensagem pronta: os produtos, o total, o dia da entrega e o valor do sinal. Só aparece se a cliente tem WhatsApp cadastrado.

### Registrar um pagamento

Na seção **Pagamento** você vê o total, quanto já foi pago (com uma barra verde) e **Falta receber** ou **Tudo pago ✓**.

1. Clique em **Registrar pagamento**.
2. **O que é**: **Sinal**, **Restante** ou **Outro**. No primeiro pagamento já vem Sinal com o valor sugerido; depois, Restante com o que falta.
3. **Valor (R$)**, **Data** (vem hoje) e **Forma**: Pix, Dinheiro, Cartão de crédito, Cartão de débito ou Outra.
4. A janela mostra como fica: "tudo pago" ou "ainda falta R$ X".
5. **Registrar pagamento**.

A **data do pagamento** é a que vale no [Financeiro](./financeiro.md). Errou? Use o botão **↺ Desfazer** ao lado do pagamento.

### Editar

O botão **Editar** funciona enquanto a encomenda está em **Orçamento**, **Confirmada** ou **Em produção**. Depois de **Pronta**, ela não muda mais. O novo total não pode ficar menor do que a cliente já pagou.

### Cancelar

**Cancelar encomenda**, no pé do painel de pagamento. A encomenda sai da lista em aberto, **libera a vaga do dia** na agenda e não pode mais ser alterada. Se a cliente já pagou algo, o sistema lembra de combinar a devolução; os pagamentos continuam registrados.

## Dúvidas comuns

**Como imprimir o pedido?**
Ainda não há opção de impressão. Use a mensagem do WhatsApp ou a tela do detalhe.

**A cliente mudou de ideia sobre o sabor.**
Se ainda não está **Pronta**, clique em **Editar** e troque o produto.

**Dá para registrar um pagamento num orçamento?**
Sim. Muitas clientes pagam o sinal para fechar: registre o sinal e depois clique em **Confirmar encomenda**.
