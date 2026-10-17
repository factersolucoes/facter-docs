# Débito técnico

Pontos conscientes que ficaram para depois — cada um com o que falta e **quando/quem** destrava. Não é bug: é escopo adiado de propósito, registrado para não se perder.

## Detalhe da OS — painéis "Em breve"

A página do [Detalhe da OS](/telas/truck/os-detalhe) (opção A) foi implementada na **fatia 1** com o que já tem dado real — topo da OS, hero da parada (estado, duração, etapas das transições), régua de números (serviços), painel de **serviços** (anexar/remover) e o histórico. Os demais painéis aparecem na mesma estrutura marcados **"Em breve"** e precisam ser ligados quando a condição existir. **Validar quando os conjuntos subirem** e conforme as fatias avançam:

| Painel "Em breve" | O que falta | Destrava com |
| --- | --- | --- |
| Conjunto (hero, direita) + serviço por unidade | Tabelas `trailer_sets`/`couplings`/`trailer_set_slots` e o alvo da OS por conjunto/implemento/posição | **Conjuntos** (fatia do marido; dep. 1.11). A OS já tem o gancho `trailer_set_id` |
| Previsão e tempo parado (hero, direita) | Previsão de liberação + quebra do tempo parado por motivo | Sessões de trabalho (fatia 2) + a previsão (a decidir) |
| Números: Horas, Custo | Horas trabalhadas e custo de mão de obra | Sessões (fatia 2) |
| Números: Peças · painel Peças · parte do Custo | Requisição/consumo com preço congelado | Estoque na OS (fatias 2.5/2.6) |
| Serviços externos | Serviço de oficina terceira (fornecedor, NF, valor) | Fatia de peças/externos |
| Custo (coluna lateral) | Mão de obra + peças + externos, congelado; leitura sensível (`cost.view`) | Sessões + peças |
| Observações e fotos | Anexos e notas (storage de objetos) | Fatia 2.8 (anexos/PDF) |
| Linhas de serviço: executor, sessões, tempo, retrabalho, seleção em lote | Quem trabalha, iniciar/pausar, horas, barra de ações em lote | Sessões (fatia 2) |

## Detalhe da OS — ações de estado

Na fatia 1 as ações de estado (iniciar/pausar/concluir/cancelar) estão num diálogo acionado por **"Ações"** no topo, em vez dos botões diretos do mockup (Pausar OS / Liberar na barra). Rever quando as sessões entrarem (a liberação depende dos serviços concluídos).
