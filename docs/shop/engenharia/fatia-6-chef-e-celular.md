---
title: "Fatia 6: módulo no Chef e celular"
sidebar_position: 15
---

# Fatia 6: módulo no Chef e celular

Entregue em 06/11/2026. Mockup: seções 1 e 10 de `/telas/shop/gestao`.

## Aparência e Domínio dentro do Chef

Uma loja de comida continua gerida no Chef. O catálogo é do Chef; a **cara** e o **domínio** da loja
são do Shop. A linha entre os dois é servidor a servidor, com um segredo compartilhado:

| Lado | O quê |
|---|---|
| `facter-shop-api` | `GET/PUT /source/stores/:slug/look`, `GET/PUT/DELETE /source/stores/:slug/domain`, `POST …/domain/check`. `@Public()` + `SourceSecretGuard` (`authorization: Bearer <CATALOG_SOURCE_SECRET>`, comparação em tempo constante). Sem a variável, as rotas não existem (404). Só lojas com `catalogSourceUrl`; loja hospedada aqui responde 404 pra fonte. |
| `facter-shop-api` | O catálogo encaminhado do Chef sai com o `look` e o `segment` da loja no Shop por cima (o Chef não sabe de estilo). |
| Chef API | `ShopLink` (`src/storefront/shop-link.ts`): `SHOP_API_URL` + `SHOP_SOURCE_SECRET` (os dois ou nenhum). Rotas logadas `GET/PUT /storefront/look`, `GET/PUT/DELETE /storefront/domain`, `POST /storefront/domain/check`, pelo slug da confeitaria. Sem a ligação, 503 com a explicação. |
| Chef shared | `storefrontLookInput`, `StorefrontLookView`, `storefrontDomainInput`, `StorefrontDomainView`. |
| Chef web | "Minha loja" ganhou as abas **Aparência** (três estilos, cor da marca, frase, aviso; enquanto a aba está aberta, a prévia da direita é a **vitrine de verdade** com `?preview=1`) e **Domínio** (endereço Facter, domínio próprio com registros, "já configurei", trocar, remover). Cada aba salva por conta própria; o Salvar da loja continua só pro que é do Chef. |

Testes: `source-admin.controller.spec.ts` (guard), `shop-link.test.ts` (Chef), `storefront.test.ts`.
Pra ligar local: `CATALOG_SOURCE_SECRET` no `.env` da shop-api e `SHOP_API_URL=http://localhost:3101/api` +
`SHOP_SOURCE_SECRET=<o mesmo>` na API do Chef. Em produção, os dois no Render.

## Painel no celular

- Barra de baixo com cinco abas: Início, Pedidos, Produtos, Loja, **Mais** (= Configurações: conta e sair ficam lá).
- Navbar cabe no celular (o bloco nome/e-mail só aparece de `sm` pra cima).
- Pedidos: o pedido aberto toma a tela, com "Todos os pedidos" pra voltar; as seis situações rolam de lado.
- Grades de uma coluna declaradas (`grid-cols-[minmax(0,1fr)]`): sem isso a coluna crescia até a linha
  mais larga (banners, tabela de registros) e a página rolava de lado.

Fora desta fatia: notificação push e PWA (pendência do mockup).
