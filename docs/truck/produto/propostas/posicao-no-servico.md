---
title: Posição no serviço (eixo, lado e roda)
sidebar_label: Posição no serviço
---

# Posição no serviço: eixo, lado e roda

Aprovada em 09/11/2026. Base da tela 5 do [mockup da OS por conjunto](/telas/truck/os-conjunto) e da quantidade de peça por posição em [De onde vem a peça](/telas/truck/pecas-do-servico).

## Como os grandes fazem

- **VMRS (ATA/TMC; Fleetio, Decisiv, TMT, Samsara).** Separa sempre **o quê** (sistema, montagem e componente) de **onde** (código de posição, por linha do reparo). Para pneu há uma chave própria com quatro dados: tipo de eixo, número do eixo, lado e interno, externo ou centro. Só tem posição o componente que se repete no veículo.
- **SAP PM (Suzano).** A nota tem itens; cada item leva parte do objeto, dano e causa, de catálogos. Mais de uma parte afetada vira mais de um item. A posição costuma virar código de parte do objeto ou nível da hierarquia do veículo.
- **Sistemas de pneu (inclusive o nosso).** Eixo, lado e encaixe sobre a planta real do veículo.

## O que já existe no Truck

`vehicle_axles` (eixos, função, rodado duplo), `wheel_positions` (eixo, lado e encaixe; usado por pneus) e `work_order_services.component_id` (o "o quê"). Falta o "onde".

## Decisões

1. **Posição é dado estruturado, nunca texto livre.** Aponta para os eixos e rodas reais do veículo, escolhidos na planta (a mesma de pneus); só aparece o que existe naquele veículo.
2. **O tipo de serviço diz quanto de posição pede:** `none` (troca de óleo), `side` (estrutura), `axle` (suspensão), `axle_side` (freio, cubo), `wheel` (pneu). É a mesma escala do "conta por" do kit de peças.
3. **Um serviço cobre uma ou várias posições** ("eixo 2, os dois lados" é um serviço, um mecânico, um tempo), gravadas uma por linha. Tempo e custo por posição, quando alguém pedir, saem por rateio proporcional.
4. **Congelada no serviço.** Além do vínculo com eixo ou roda, grava eixo, lado e encaixe como estavam no dia; mudar a configuração do veículo não reescreve o histórico.
5. **No checklist, quem inspeciona marca a posição** na faixa do não conforme; na OS aberta à mão, é pedida só quando o tipo exige. Veículo sem eixos cadastrados: aviso e segue sem posição (fica registrado como "sem posição", não inventado).
6. **Pronta para integrar.** Formato compatível com a chave de pneu do VMRS; a tradução para a parte do objeto do SAP vai para `external_refs` quando a integração chegar.

## O que destrava

Falha recorrente por posição, retrabalho na mesma posição, km por posição e a quantidade de peça pela posição (3.2.3).
