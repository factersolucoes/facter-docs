# Como fazer mockups

O mockup é a **fonte da verdade da tela antes do código**. Depois de aprovado, a implementação segue ele (ver [Interface: UI e UX](../engenharia/padroes/interface-e-ux.md), seção 1). Toda tela nova ou repensada nasce como mockup aqui, é discutida, aprovada, e só então vira código.

Tudo que já existe está no [quadro de mockups](/mockups), com todos os produtos lado a lado: arrastar para mover, ctrl e scroll (ou pinça) para zoom, um clique mostra os detalhes, dois cliques abrem o protótipo. A mesma lista em texto fica em [Mockups](./mockups.mdx).

## Onde ficam os arquivos

Um mockup tem três partes:

1. **O HTML**, self-contained, em `facter-docs/static/mockups/truck/<slug>/index.html`.
2. **A página** que abre em tela cheia, em `facter-docs/src/pages/telas/truck/<slug>.tsx`, usando o `MockupScreen`:

   ```tsx
   import MockupScreen from '@site/src/components/MockupScreen';

   export default function Page() {
     return <MockupScreen title="Nome da tela" status="Em revisão · DD/MM/AAAA" file="/mockups/truck/<slug>/index.html" />;
   }
   ```

   Isso publica a rota `/telas/truck/<slug>`.
3. **A entrada na galeria**, em `docs/truck/produto/mockups.mdx`: um `### Título`, um parágrafo com o **status** no começo e a descrição, e o link `[Ver o mockup](/telas/truck/<slug>)`. Uma imagem `desktop.png` (1440 × 900) na mesma pasta serve de prévia no quadro; sem ela, o quadro mostra a página ao vivo, que é mais pesado. O quadro lê o título e o status da página e a seção e a descrição desta entrada, então não há outro lugar para cadastrar.

## O kit: a casca de verdade e os átomos

**Todo mockup novo do Truck usa o [kit de mockups](/telas/truck/kit)** (`static/mockups/truck/_kit/`). Ele desenha a casca real do app (menu lateral com os mesmos itens e ícones, barra do topo com o modo console, busca com Ctrl K, empresa e perfil, a navegação de baixo do celular) e os átomos que o app usa, com os tokens do DS. O mockup desenha **só o conteúdo da tela**; casca inventada não entra mais.

```html
<link rel="stylesheet" href="/mockups/truck/_kit/kit.css">
…
<fx-app device="web" section="os" console eyebrow="Ordens de serviço" title="OS 1042">
  <div data-render="detalhe"></div>
</fx-app>
<div class="states" data-for="detalhe"><button data-s="ok" aria-pressed="true">Com dados</button>…</div>
<script src="/mockups/truck/_kit/kit.js"></script>
<script>FX.bind({ detalhe: (estado, aparelho) => '…html…' });</script>
```

- `device`: `web` (notebook), `tablet-l` (tablet deitado, 1180 × 820), `tablet-p` (tablet em pé, 820 × 1180), `phone` (390 × 844). Os tamanhos são os reais; o app abaixo de 768 px troca o menu lateral pela navegação de baixo, e o kit faz o mesmo.
- `section` marca o item ativo do menu; `console` com `eyebrow` e `title` põe o nome da tela na barra do topo (sem `console`, a página leva o próprio cabeçalho com `FX.pageHeader`); `dots` dá o fundo pontilhado da área de trabalho.
- Átomos: `FX.plate`, `chip`, `tile`, `avatar`, `ring`, `cbar`, `selbar`, `btn`, `dialog`, `sheet`, `sk`, `empty`, `notice`, `seg`, `fchip`, `tooltip`. Diálogo no celular é `FX.sheet` (folha de baixo).
- **A casca bate com o app.** Mudou o `app-shell.tsx` ou o DS, atualiza o kit no mesmo ciclo.

## A régua de qualidade

O que a dona do produto já recusou ("amador", "minimalista", "seco", "tudo muito branco") e o que aprovou (movimentação de pneus, cartões de inspeção, barra escura de seleção) viram regra:

- **Cada aparelho é desenhado, não encolhido.** Tablet deitado e em pé e celular têm o próprio arranjo; nada de coluna branca vazia nem tela de notebook espremida.
- **Hierarquia por cartão:** um elemento dominante (placa, número, título em Sora), o secundário em muted, o terciário pequeno. Números em algarismos tabulares.
- **Tom com significado:** bloco de tom com ícone para estado e tipo; `primary-soft` no que está ativo; `warning`/`danger` suaves para o que trava; `success` suave para o feito.
- **Profundidade:** cartões com a sombra do app, fundo de tela atrás dos painéis, pontilhado nas áreas de trabalho vazias.
- **Densidade no notebook, toque no tablet:** sem faixas vazias no notebook; alvos de 44 px no tablet e no celular.
- **Pessoas e andamento à vista:** iniciais das pessoas, anel ou barra de progresso, barra de composição do conjunto.
- Sem barra colorida na lateral, sem gradiente (salvo anel de progresso), seleção neutra fora dos casos documentados.

## O contrato de design

- **Tokens do tema** (`--primary`, `--foreground`, `--muted`, `--border`, `--success`, `--warning`, `--danger`…) — as mesmas cores do produto. Nunca cor solta.
- **Cor só onde decide** (o dia de hoje, o item escolhido, a faixa do período). Sem arco-íris, sem tom que não faz parte. Paleta calma.
- Fontes **Inter** (texto) e **Sora** (títulos), via Google Fonts.
- Ícones **Phosphor via iconify** (`api.iconify.design/ph/...`) como máscara CSS.
- **Sem build**: o HTML abre sozinho; o kit é o único arquivo compartilhado.
- **Responsivo**: mostra o notebook e o celular quando o comportamento muda entre eles.
- Segue os [padrões de UI e UX](../engenharia/padroes/interface-e-ux.md): diálogos lideram pelo título (sem contexto), estados completos, tabelas pequenas, carregamento com skeleton, filtros chip-style.
- **Mostra a interação inteira** — o que a setinha abre, o estado do dropdown aberto, o passo de confirmação. Nada pela metade.
- Texto do mockup segue o [`COPY.md`](https://github.com/tamicaires/facter-truck/blob/main/COPY.md) como qualquer tela.

## Status e aprovação

Cada mockup carrega um status, na página (`MockupScreen status=`) e no parágrafo da galeria:

- **Rascunho · DD/MM** — em desenho, ainda mudando.
- **Em revisão · DD/MM** — pronto pra discussão.
- **Aprovado em DD/MM/AAAA** — travado; a tela codada tem que bater com ele.

**A implementação segue o mockup aprovado.** Mudou a tela depois de aprovada, atualiza o mockup **antes** de mexer no código.

## Passo a passo

1. Escreve o HTML em `static/mockups/truck/<slug>/index.html` sobre o kit (`_kit/kit.css` e `_kit/kit.js`), com o notebook, o tablet e o celular desenhados.
2. Cria a página `src/pages/telas/truck/<slug>.tsx` com o `MockupScreen`.
3. Adiciona a entrada em `produto/mockups.mdx` (com status `Em revisão`).
4. Manda o link `/telas/truck/<slug>` pra revisão.
5. Aprovado: marca o status como `Aprovado em ...` na página e na galeria, e implementa fiel.
