---
title: "Fatia 4: Aparência, Domínio e Configurações"
sidebar_position: 13
---

# Fatia 4: Aparência, Domínio e Configurações

Entregue em 06/11/2026. Mockup: seções 6, 7 e 8 de `/telas/shop/gestao`.

## API (`facter-shop-api`)

| Rota | O quê |
|---|---|
| `GET /store/me` | A loja inteira como o painel vê (palavras, cara, entrega, pagamento, endereço, contagens). |
| `PUT /store/settings` | A tela Configurações num PUT só: nome, ramo, WhatsApp, Instagram, sobre, retirada/entrega/envio com texto e taxa, Pix, sinal, pausa até uma data, no ar. |
| `PUT /store/look` | Estilo (`CLASSIC`, `VIBRANT`, `MINIMAL`), cor da marca (`#rrggbb` ou nula = a do estilo), frase de apoio, aviso no topo, logo. |
| `PUT /store/slug` | Troca a parte depois da barra **uma vez**; o endereço antigo fica em `previousSlug` e continua abrindo. |
| `GET/POST/PUT/DELETE /store/banners`, `POST /store/banners/reorder` | Banners com período (entra/sai) e ligado/desligado. |
| `GET/PUT/DELETE /store/domain`, `POST /store/domain/check` | Domínio próprio: registra no provedor, devolve os registros DNS pra dona colar, confere agora. |
| `GET /public/domains/:host` | Pra vitrine: qual loja atende nesse host (só domínio **no ar**). Resposta crua, cache de 60 s. |

**Domínio.** `DomainProvider` tem duas implementações: `ManualProvider` (sem API: a dona aponta o
CNAME pra `STOREFRONT_CNAME`, e o A pro `STOREFRONT_A_RECORD` quando é raiz) e `RenderProvider`
(com `RENDER_API_KEY` + `RENDER_SERVICE_ID`, adiciona o domínio ao serviço da vitrine pra emitir o
certificado). A conferência resolve os registros de verdade (`dns.resolve4/resolveCname`) e escreve
em `lastResult` o que falta, nas palavras da dona ("Registro CNAME de www.x ainda não apareceu").
Situações: `PENDING` (ainda não apareceu), `ERROR` (aponta pra outro lugar), `ACTIVE`.
Um domínio por loja, um por domínio: domínio de outra loja dá 409. O provedor entra por token Nest
(`DOMAIN_PROVIDER`), então o spec passa um falso.

O catálogo público ganhou `look` (contrato **0.6.0**: `catalogTheme`, `brandColor`, `tagline`,
`notice`). Migration `store_domain`. Testes: `domains.service.spec.ts`, `catalog.service.spec.ts`.

## Vitrine (`facter-shop`)

- Lê `store.look`: classe `theme-<estilo>`, cor da marca por variável CSS inline (`--brand`),
  aviso no lugar da faixa do topo, frase de apoio no lugar da bio.
- `?preview=1&theme&brand&tagline&notice` põe o que a dona ainda não salvou por cima do salvo.
  Sem `preview=1` a vitrine ignora esses parâmetros: a cliente nunca vê.
- `proxy.ts`: host que não é nosso vira `/store/<slug>` pelo `GET /public/domains/:host`, com
  cache de 60 s em memória. Hosts próprios, `/store/`, `/api/` e `/_next/` passam direto.

## Painel (`facter-shop-web`)

- `/store` com duas abas. **Aparência**: três cartões de estilo, marca (logo redondo com câmera,
  nome da loja como atalho pra Configurações, cor com "A" = do estilo + cinco cores + hex, frase,
  aviso), banners (lista com imagem, situação no ar/agendado/encerrado/desligado, switch, editar,
  apagar; diálogo `lg` com a imagem ao lado). À direita a **loja de verdade num celular** (iframe
  da vitrine com `preview=1`, debounce de 400 ms). Salvar só habilita com mudança.
- **Domínio**: endereço Facter (copiar, trocar uma vez com slug ao vivo), domínio próprio em três
  estados (campo → registros com copiar + "Já configurei, conferir agora" + trocar → no ar com
  cadeado, registros encontrados, abrir, remover). O campo fica travado quando o plano não tem
  `custom_domain`.
- `/settings` com `SettingsLayout` (seções na URL `?section=`): Ramo (seis cartões; "gestão no Chef"
  e "no TechCare" como etiquetas), Contato (WhatsApp formatado ao digitar), Entrega (linhas com
  switch que abrem os campos; pausar com data; loja no ar), Pagamento (Pix e sinal 0/50/100),
  Integrações (fonte do catálogo, Chef, TechCare, Hub), Conta (sair). Um Salvar pra tudo, desligado
  enquanto não muda ou tem problema (nome vazio, WhatsApp curto, pausa sem data).

Libs puras com teste: `features/store/lib/look-form.ts` (prévia, situação do banner, slug, host) e
`features/settings/lib/settings-form.ts`.
