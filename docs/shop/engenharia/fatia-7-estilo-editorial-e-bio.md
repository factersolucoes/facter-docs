---
title: "Fatia 7: estilo Editorial e link na bio"
sidebar_position: 16
---

# Fatia 7: estilo Editorial e link na bio

Entregue em 06/11/2026. Referência: o site da ESLA no ar (`useesla.netlify.app`) e o mockup
"Editorial Vitrine" do link na bio.

## Estilo Editorial

Regra que motivou a fatia: quando a ESLA migrar pro Shop, **a vitrine dela não muda nada
visualmente**; só o painel muda. Então o site atual virou um estilo do produto, o quarto ao lado
de Clássica, Vibrante e Minimal. Não leva o nome da cliente: é o **Editorial** (preto e branco,
serifa fina em caixa alta, tracking largo, sem cantos nem sombra). Outra loja pode escolher.

| Onde | O quê |
|---|---|
| contrato `0.10.0` | `catalogTheme` ganha `editorial`. Publicar no npm antes do deploy. |
| `facter-shop-api` | enum `StoreTheme.EDITORIAL` (migração `store_theme_editorial`), DTO, `lookOf` por mapa; seed da ESLA no Editorial sem cor própria. |
| vitrine | `theme-editorial` em `globals.css` (tokens: papel `#fbfaf7`, preto `#0d0c0a`, dourado `#b8963e` como acento, Cormorant Garamond 300 + Manrope) e um bloco de regras no `store.css` que redesenha header (links à esquerda, marca no centro, "Sacola" em texto), banner, faixa de confiança, círculos de categoria sob a faixa (em todas as telas), "Em destaque" em grade de 8, cards sem moldura com a sacola num anel à direita, rodapé preto, página do produto e sacola. No `Storefront.tsx` o estilo muda só o que o CSS não alcança: posição das categorias, 8 destaques com "Ver tudo", coluna "Atendimento" no rodapé, logo invertido no rodapé. |
| vozes | `topbar.bag`, `topbar.bagAria`, `store.highlights`, `store.highlightsEyebrow` viraram palavras do ramo: joias dizem "Sacola" e "Seleção / Em destaque". |
| painel e Chef | quarto card de estilo ("Editorial · preto e branco, serifa fina"), cor própria `#0d0c0a`. A prévia do painel ficou mais larga (400/460px). |

O que fica diferente do site da ESLA hoje, de propósito: a linha "loja feita com Facter Shop" no
rodapé (pequena, em caixa alta cinza) e a ausência de selos "Novo / Mais vendido / Esgotado" nos
cards (a vitrine não tem esses dados ainda; entram com o estoque de pronta entrega).

## Link na bio (`/store/:slug/bio`, e `/bio` no domínio próprio)

A página do mockup "Editorial Vitrine": marca, nome, frase, @instagram; trilho "Mais pedidos" com
as primeiras peças do catálogo (com foto primeiro, `bioPicks`); tocar numa peça abre a folha com
"Comprar agora" (vai pro montar) e "Ver detalhes"; depois os links "Ver toda a loja" e "Falar no
WhatsApp"; rodapé com as redes. Tudo em `bio.css` sobre as variáveis do estilo da loja, então
troca de pele com a loja (Editorial em caixa alta e sem cantos, Vibrante em negrito, etc.).

Ainda não tem: links extras editados pela dona, faixa de campanha e a contagem clique → carrinho →
pedido do mockup. São a próxima fatia da bio (painel + `bio_clicks`), estimada em um dia.

Testes: `lib/theme.test.ts` (quatro estilos, prévia, cor da dona), `bioPicks` em `catalog.test.ts`;
painel e Chef passam no typecheck com o enum novo.
