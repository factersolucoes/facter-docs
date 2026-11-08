---
title: Interface
sidebar_position: 1
tags: [padroes, interface, ux, design]
---

# Padrões de interface

Decisões de interface que valem para **todos** os produtos Facter (Truck, TechCare, Shop, Chef, Vagas, Hub). Tomou uma decisão de tela que serve para mais de um lugar? **Registra uma linha aqui, no mesmo PR.** Antes de criar uma tela, leia esta página e **repete o padrão; não reinventa**.

Formato de cada entrada: **quando** acontece, **o que usar**, **por quê**, e **onde já está** (pra copiar).

---

## Trocar de contexto × filtrar

**Quando:** a pessoa muda o que a tela **é** (ex.: ver Itens, depois Categorias, depois Extras do catálogo) vs. apenas **recortar** o que já está na tela (ex.: filtrar os itens por categoria).

**Use:**
- **Trocar de contexto** → **tab em estilo de link** (`Tabs` do `@facter/ds-core`). A descrição da tela acompanha a tab ativa.
- **Filtrar dentro do contexto** → **chip pequeno** (`FilterChip` / `FilterChipGroup`), com a opção "geral" em tom muted.

**Por quê:** contexto muda o conteúdo da página; filtro só reduz o que já está nela. Misturar os dois (tab que filtra, ou chip que troca de tela) confunde o que é navegação e o que é recorte.

**Onde já está:** `facter-shop-web/src/features/items/components/items-screen.tsx` (tabs Itens/Categorias/Extras) e `FilterChipGroup` nas listas do Truck.

---

## Opção neutra e ação num select

**Quando:** um select/dropdown tem, além das opções de dado, uma opção **neutra/baseline** (ex.: "Sem categoria", "Geral", "Todos") e/ou uma **ação** (ex.: "+ Nova categoria").

**Use:**
- **Opção de dado** (ex.: "Teste") → estilo normal.
- **Neutra/baseline** → **tom muted/cinza**. É ausência de escolha, não compete com os dados.
- **Ação de criar** → **destacada** (accent + o "+") e **separada** do grupo (divisória), porque é ação, não valor.

**Por quê:** baseline e ação não são "mais uma opção". Tratá-las igual faz a pessoa ler "Sem categoria" como se fosse uma categoria e "+ Nova" como se fosse um item. A cor e a posição dizem o papel de cada uma. É a mesma lógica da "opção geral em muted" nos chips de filtro.

**Trava ideal:** nasce no DS — o `Select` expõe item `variant="muted"` pra baseline e um slot de ação no rodapé (separado), pra ninguém estilizar na mão.

---

## Diálogo lidera pelo título

**Quando:** qualquer diálogo de ação (criar, editar, confirmar).

**Use:** título com **verbo + objeto** ("Registrar ajuste", "Abrir OS"). **Não** usar `ActionDialog.Context` (o eyebrow com ícone que repete o que está sendo mexido) por reflexo — só quando agrega significado de verdade.

**Por quê:** o título já diz o que vai acontecer; o contexto repetido vira ruído.

**Onde já está:** `facter-docs/docs/truck/engenharia/padroes/interface-e-ux.md`.

---

## Cor só por token de tom

**Quando:** qualquer cor com significado (deu certo, atenção, erro, informação).

**Use:** os tokens de tom do DS (`success`, `warning`, `danger`, `primary`, `info`) com `-ink`/`-soft`. **Nunca** literal do Tailwind (`text-green-600`, `bg-amber-50`).

**Por quê:** literal não troca com o tema (o modo escuro não vem junto) e a mesma ideia fica com tons diferentes em telas diferentes.

**Onde já está:** `facter-design-system` (`src/utils/tone.ts`).

---

## Tooltip quase preto

**Quando:** qualquer tooltip, em qualquer produto, no tema claro e no escuro.

**Use:** o `SimpleTooltip`/`TooltipContent` do DS sem `variant`. O padrão é o balão quase preto (cor `tooltip` do preset, igual nos dois temas). As variantes `light`, `dark` e `inverted` ficam só para caso pensado.

**Por quê:** o balão branco some em cima de cartão branco, e o `inverted` fica branco no modo escuro. Com o padrão certo no DS, ninguém precisa lembrar de passar a variante.

**Onde já está:** `facter-design-system` (`Tooltip.tsx`, cor `tooltip` no `tailwind-preset.ts`).

---

## Toda tela entrega todos os estados

**Quando:** qualquer lista ou tela de dados.

**Use:** skeleton (carregando), vazio (nada ainda), sem resultado (busca/filtro), sem permissão, erro, e paginação — **de uma vez**. Carregamento com skeleton; `dots` só no scroll infinito ou quando não há layout pra espelhar.

**Por quê:** estado faltando é bug que aparece só em produção, com o cliente na frente.

---

## Seção sem dado não aparece; quando cabe, vira CTA

**Quando:** uma seção depende de dado que pode não existir ainda (ex.: preço na landing enquanto o produto não tem plano no Hub; depoimentos, banners, integrações).

**Use:** se o dado não veio, a seção **some** — nada de placeholder, "em breve" ou valor inventado. Onde a ausência tem uma próxima ação óbvia (preço → "fale com a gente" / "começar"), o buraco **vira um CTA** que direciona, em vez de sumir calado.

**Por quê:** seção vazia parece bug e preço hardcoded vira mentira no dia que ninguém atualiza. Sumir mantém a página honesta; o CTA transforma a ausência em caminho. O par de arquitetura disso (preço sempre do Hub) está em `arquitetura.md`.

**Onde já está:** `facter-landing/app/techcare/Planos.tsx` — sem plano no Hub, a seção de preço não renderiza e entra o CTA. (Shop hoje tem `plans: []` no Hub, então nasce já nesse modo.)

---

## Mobile-first não é mobile-only

**Quando:** telas de gestão (painel, notebook).

**Use:** o desktop é **projetado**, denso e comparativo — não a tela de tablet esticada.

**Por quê:** quem decide no notebook precisa de densidade; quem opera no celular precisa de toque. São telas diferentes.

---

## Área de trabalho vazia, esperando uma escolha ao lado

**Quando:** a tela tem uma lista de um lado e o trabalho do outro, e nada foi escolhido ainda (planta de pneus, editor de modelo, começar checklist).

**Use:** o `EmptyState` do DS com `surface="canvas"`: fundo pontilhado na cor de borda do tema, ícone no círculo `primary-soft`, título que diz o que escolher e uma dica curta. Se houver o que retomar, um cartão "Continuar de onde parou" por cima dos pontos.

**Por quê:** o vazio com textura diz "aqui vai aparecer o trabalho" sem parecer tela quebrada, e o mesmo visual em todo produto dispensa reinventar a cada tela.

**Onde já está:** `facter-design-system` (`EmptyState`, desde a 1.43.0); no Truck, a movimentação de pneus e os modelos de checklist.
