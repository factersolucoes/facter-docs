---
title: "Fatia 9: Editorial é a ESLA inteira"
sidebar_position: 18
---

# Fatia 9: Editorial é a ESLA inteira

Entregue em 07/11/2026. Regra da arquiteta: "o Editorial deve ser exatamente igual ao que está em
produção na ESLA; não deve perder absolutamente nada visual; os estilos podem ter estrutura diferente".

## O que mudou de desenho

Na fatia 7 o Editorial era CSS por cima da vitrine comum (mesma estrutura: seções por categoria,
duas categorias pequenas lado a lado). Agora é um **site próprio dentro da vitrine**, portado do
código da ESLA (`~/Desktop/Developer/Freelas/esla`) para `app/store/[slug]/editorial/`:

| Tela | ESLA | Shop (Editorial) |
|---|---|---|
| Início | faixa de aviso, header (links · logo · Tudo + Sacola), carrossel, faixa de confiança (4), círculos de categoria, "Seleção / Em destaque" (8), rodapé preto | igual, `EditorialHome` |
| Todas as peças | `/produtos`, 24 por página | `/store/:slug/products?page=` |
| Coleção | `/categorias/:slug` | `/store/:slug/category/:key` |
| Peça | galeria, selos, nome, preço, material, variações, quantidade + "Adicionar à sacola · R$", lista (garantia, antialérgica, troca, WhatsApp), acordeões Descrição/Detalhes/Cuidados, "Complete o look / Combina com" | igual, `EditorialItem`; peça com opções/perguntas/extras vai pro "montar" guiado (`Personalizar · R$`) |
| Sacola | gaveta lateral + `/carrinho` com resumo, "Pagar com Pix ou cartão · em breve" e fechamento por WhatsApp (nome + telefone) | gaveta no shell + `/store/:slug/bag`, `WhatsappCheckout` registra o pedido na API e abre o WhatsApp com o número |
| Políticas | `/politicas/{trocas,cuidados,envio}` | `/store/:slug/policies/{exchanges,care,shipping}` |
| Menu do celular | painel lateral com coleções, ajuda, WhatsApp, @instagram | igual |

Os outros estilos não mudaram; as rotas novas redirecionam pra vitrine comum quando o estilo não é Editorial.

## Como foi portado

- Tailwind já existia na vitrine (v3, sem preflight) pros componentes do DS; o Editorial usa as
  utilidades com tokens prefixados no `tailwind.config.ts` (`paper`, `noir`, `ink`, `line`, `gold`,
  `font-ed-display`, `font-ed-sans`, `tracking-luxe`, `ease-luxe`). Classes de componente da ESLA
  (`btn`, `label`, `eyebrow`, `container`) viraram `ed-btn`, `ed-label`, `ed-eyebrow`, `ed-container`
  em `editorial.css`, porque a vitrine comum já tem `.btn` e `.label` globais.
- Sem preflight, utilidades de transformação, anel, sombra, blur e `border` não funcionam: o
  `editorial.css` define as variáveis `--tw-*` e `border-style: solid` dentro de `.ed-root`, tudo
  com `:where()` pra não ganhar das utilidades (armadilha paga: reset com a mesma especificidade e
  depois no arquivo apagava o `translate-x-full` da gaveta e a cor do botão).
- Mudar `tailwind.config.ts` exige reiniciar o `next dev`.
- Textos em `ed.*` no dicionário; as promessas da faixa de confiança (`ed.trust.quality*`) são vozes
  por ramo (joias: "Garantia do banho"; confeitaria: "Feito no dia"; personalizados: "Feito à mão").
- Testes: `editorial/words.test.ts` (preço do card, o que vai direto pra sacola, telefone, faixa).

## Catálogo da ESLA importado (pra comprar no local)

`facter-shop-api/scripts/import-esla.ts --store esla-acessorios [--replace]` lê a API pública do
site atual (categorias, produtos, ajustes da loja, home) e grava na loja do Shop: 10 categorias na
ordem do menu, 110 peças (43 esgotadas ficam ocultas até existir estoque no Shop), 3 banners, logo,
aviso, bio, WhatsApp, Instagram, parcelas, texto de cuidados e frete. As fotos apontam para o
storage da ESLA (Supabase), não são copiadas.

Mapeamento das variações, que o Shop guarda diferente do Payload:

- Variação **sem preço próprio** (cor/banho, letra) vira **uma escolha** na peça (`optionGroups`
  com um grupo "Cor", "Letra" ou "Tamanho"); a promoção fica na peça e o risco aparece no card.
  Só entram as opções com estoque.
- Variação **com preço próprio** vira **tamanho** (`sizes`), cada um com o seu preço; a peça perde
  a promoção única e o card mostra "a partir de".

No Editorial, uma escolha só aparece como chips ao lado dos tamanhos e vai pra sacola direto
(`needsBuild` só manda pra página guiada com perguntas, adicionais ou mais de uma escolha).

## Prévia de loja não publicada em todas as páginas

O painel abre a vitrine com `?preview=1&pt=<token>` uma vez; o `proxy.ts` guarda o token num
cookie por loja (`facter-shop-preview:<slug>`, 24h, só no caminho da loja) e `lib/preview.ts`
lê query ou cookie em toda página (peça, sacola, coleções, políticas). Antes, só a home
previa e o resto caía em "Loja não encontrada".

## O que a ESLA tem e o Shop ainda não (próxima fatia, dados)

Pra "não perder nada" quando migrar, o contrato e o painel precisam de: várias fotos por peça
(galeria + segunda foto no hover), selos Novo / Mais vendido, estoque (Esgotado, "Últimas N
unidades", limite na sacola), parcelamento (`maxInstallments` já existe na loja, falta sair no
catálogo + parcela mínima), desconto no Pix, frete grátis acima de X (barra na gaveta), textos de
políticas (trocas/garantia, envio), cidade/UF, banner com tom/alinhamento/overlay/CTA/foto do
celular, destaques escolhidos pela dona, blocos editoriais. Estimativa: um dia e meio de contrato +
API + painel; o tema já lê tudo isso assim que existir. Depois, o script de migração Payload → Shop.
