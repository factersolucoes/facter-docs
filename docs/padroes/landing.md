---
title: Landing
sidebar_position: 4
tags: [padroes, landing, copy, conversao, marketing]
---

# Playbook de landing

Como o Facter escreve e desenha uma landing de produto que **conta história e vende**, no nível de uma agência global. Vale pra toda landing (`facter-landing/app/<produto>`). Antes de criar ou refazer uma, leia esta página inteira. Decisão nova reusável? **Uma linha aqui, no mesmo PR.**

A regra de ouro: **a landing não é uma vitrine de features. É uma história onde quem lê é a heroína e o Facter é o guia.** Feature que não serve a essa história sai.

---

## 1. Antes de escrever: uma protagonista, um nível de consciência

Escolha **uma** pessoa e escreva a página inteira pra ela. Pela régua de Eugene Schwartz (5 níveis de consciência), prefira quem **já sente o problema e procura saída** (problema/solução-consciente): ela tem a dor viva e dinheiro pra resolver. Não escreva pra quem ainda nem sabe que tem problema, na mesma página.

- **Quem é ela?** O que ela já faz, o que a aperta, o que ela quer virar.
- **Qual o nível?** Problema/solução-consciente → o lead é **PAS** (começa pela dor). Público frio e inconsciente → AIDA. Uma página, um nível.
- **Quais as palavras dela?** Use o vocabulário real do "momento de aperto" (as frases que a cliente dela manda, as ferramentas que ela usa hoje). Dor real converte mais que dor inventada.

**Onde já está:** Shop escreve pra vendedora que já fatura e está afogada no direct e no catálogo em PDF.

---

## 2. A história (StoryBrand SB7)

Sete beats, nesta lógica: **personagem → problema → guia → plano → chamada → sucesso → o que evita falhar.**

- **A heroína é a cliente, o Facter é o guia.** O erro clássico é a marca se fazer de herói. O guia tem **empatia** ("a gente entende") e **autoridade** ("a gente resolve").
- **O problema tem três camadas.** Externa (o fato: a venda vive no direct), **interna** (o sentimento: exausta, parecendo amadora), filosófica (a crença: ela merece tocar um negócio de verdade). **É a camada interna que vende** — não deixe de fora.
- **O plano é simples** (3 passos) e a **chamada é direta** e repetida.

---

## 3. O trabalho dela (Jobs to be Done)

A pessoa não quer o produto, quer **fazer um progresso** na vida dela.

- **Job funcional no título** (o que ela consegue fazer: "ter uma loja", "vender sem atender uma por uma").
- **Jobs emocional e social no corpo** (como ela quer se sentir e ser vista: dona, no controle, uma marca de verdade). A maioria dos concorrentes só fala feature, então a camada emocional é o diferencial.
- **Cace o "momento de aperto"** real: a cena concreta do jeito antigo (o PDF que nasce velho, a tabela reenviada, o "ainda tem?"). Ancore a história nela.

---

## 4. Arquitetura de valor: antes → depois

Não liste features. Mostre a **transformação**. Monte a tabela antes→depois e deixe cada seção entregar uma linha dela.

| Hoje (o jeito antigo) | Depois (com o produto) |
| --- | --- |
| Refém de ferramenta dos outros | Dona do que é dela |
| Tudo espalhado, nada num lugar só | No controle, tudo num lugar que ela comanda |
| Ela faz a parte repetitiva na mão | O sistema faz sozinho |

**A aposta escondida** (ótima pra agitação): depender do jeito antigo é **frágil** (conta bloqueada, app que muda a regra, arquivo que some ou nasce velho). O produto é **chão firme**. Independência, controle e tempo se puxam.

**Onde já está:** Shop vende independência (sair do WhatsApp/PDF), controle (catálogo, pedidos e dinheiro num lugar só) e tempo (a loja trabalha sozinha).

---

## 5. Craft (o que faz parecer caro)

Não é copiar o hex da Stripe. É o **nível de acabamento**, consistente na página inteira.

- **Contraste alto + muito respiro.** Pegue o espaço que parece suficiente e **dobre**. Contraste sem respiro agride; respiro sem tipografia afiada entedia.
- **Base quase monocromática + um acento.** Cada produto tem a **sua** cor (não a azul do Facter/Truck, que é da marca-mãe). Cor só por token.
- **Mostre o produto real, não ilustração.** Pedaços de verdade da tela, sem ícone decorativo (tile com glyph genérico é amador).
- **Movimento que demonstra, não enfeita.** Econômico e denso em interação: cada coisa entra de uma direção que faz sentido, pra mostrar o produto funcionando. Respeita `prefers-reduced-motion`.
- **Favicon e cor do navegador seguem o produto.** Cada landing tem o próprio `app/<produto>/icon.svg`: **o mesmo logotipo** Facter, com o **fundo na cor primária do produto** e a marca no contraste (Truck e Facter azul, TechCare verde, Chef chocolate, Shop preto com a marca branca). O caramelo da Shop é só acento, não a cor da marca. E o `theme-color` (export `viewport` da página) segue o **fundo da landing aberta**, nunca o global. Onde já está: `facter-landing/app/shop/icon.svg` e o `viewport` em `app/shop/page.tsx`.

---

## 6. Mecânica de conversão

- **Uma página, um objetivo.** Tudo que não leva à ação sai. Nav enxuta.
- **A dobra faz o trabalho.** Em segundos: título de benefício, subtítulo que expande, visual do produto e CTA primário.
- **Prova responde objeção no momento certo.** 3 a 5 bem postas, não um mural. Autoridade no topo (ex.: "do grupo Facter"), depoimento nomeado perto do preço.
- **Derrube as 4 objeções antes do CTA:** é difícil? é mesmo meu? custa quanto (cobra por uso)? como funciona na prática? Cada uma vira uma seção ou uma linha.
- **CTA repetido, um verbo só, verdadeiro.** O rótulo diz o que acontece no clique (sem self-serve ainda → "Falar com a gente"/"Quero…", não "Criar conta"). Veja `copy.md`.
- **Microcopy de segurança** perto da ação (o que acontece depois, sem compromisso).

---

## 7. Antes de subir

- Reler **todo** texto contra o `copy.md` (sem travessão, sem antítese "X não Y", sem jargão, benefício na frente, número em algarismo).
- A página passa no teste da história: tem protagonista? tem a dor interna? o Facter é guia, não herói? as seções se conversam?
- Nada inventado: métrica, cliente ou depoimento só com o fato e a autorização.
- Preço vem do Hub (ver `arquitetura.md`); seção sem dado vira CTA (ver `interface.md`).

**Fonte do estudo:** StoryBrand (Donald Miller), Breakthrough Advertising (Eugene Schwartz), Jobs to be Done (Copyhackers/Bob Moesta), e a craft de Stripe, Linear e Vercel.
