---
title: "Índice de propostas"
sidebar_position: 0
tags: [propostas, indice, v2]
---

# Índice de propostas

Todas as propostas de produto do Truck, com o status real e o que cada uma significa para a v2. As propostas foram escritas sobre o v1: as decisões de produto continuam valendo, mas a implementação na v2 segue os [padrões de engenharia](../../engenharia/padroes/padroes-de-engenharia.md).

| Proposta | Status | Data | Na v2 |
| --- | --- | --- | --- |
| [Aprender com o cliente](./aprender-com-o-cliente.mdx) ("Quero isso", analytics de uso, feedback, Novidades) | Em discussão | 2026-09-26 | **Levar** para o lançamento: cerca de 1 semana |
| [Devolução de peças](./part-return.mdx) | Implementado | 2026-07-15 | **Levar.** Entra no livro de movimentações; devoluções concorrentes contam em dobro no v1 (STK-3) |
| [Unidade de medida e conversão](./unit-of-measure.mdx) | Implementado, com o fator de conversão ignorado no custo (FACTRK-10) | 2026-07-19 | **Levar**, corrigindo a conversão no cálculo de custo |
| [Convenção de custo por unidade](./part-cost-convention.mdx) | Implementado (Opção A) | 2026-07-30 | Custo por unidade de consumo, `cost_price`/`minimum_qty` na peça; entregue na task 2.5 |
| [Custeio de mão de obra](./labour-cost.mdx) | Aprovado; código fora da `homolog` | 2026-08-04 | **Levar**, calculando pelo tempo das sessões de trabalho, não pelo tempo decorrido |
| [Rateio de materiais compartilhados](./shared-material-allocation.mdx) | Implementado | 2026-07-28 | **Levar para o lançamento** (decidido em 26/09/2026), completo, sobre o livro de movimentações, com preço congelado e mês cortado no fuso da empresa |
| [Formulário de peça em drawer](./part-form-drawer.mdx) | Em discussão | 2026-07-19 | **Levar** para a fase 3 (frontend) |
| [Kit de peças por tipo de serviço](./service-parts-kit.mdx) | Em discussão | 2026-09-27 | Portar o "kit" do v1: tipo de serviço pré-preenche as peças na requisição (nova tabela `service_type_parts`); entra na task 2.6 |
| [Detalhe da OS, repensado por papel](./detalhe-da-os-por-papel.mdx) | Em discussão | 2026-10-19 | Repensa a tela de detalhe da OS a partir dos papéis e dos grandes players (cockpit do consultor + terminal do mecânico); `os-detalhe` "Opção A" fica em revisão. Mockup novo antes do código |
| [Checklists na v2: plano](./checklists-v2.md) (onde entra, funcionalidades, dependências, fatias, decisões) | Em discussão | 2026-11-07 | **Levar**: task 3.2 em seis fatias; as quatro primeiras podem ir antes dos pneus |
| [OS por conjunto: análise](./os-por-conjunto.md) (conjunto vivo com OS aberta, seis caminhos, como os grandes fazem, recomendação) | Em discussão | 2026-11-08 | **Decidir**: recomendação F, uma OS com uma frente por veículo |
