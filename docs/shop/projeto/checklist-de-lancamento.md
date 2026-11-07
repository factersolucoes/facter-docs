---
title: Checklist de lançamento
sidebar_position: 2
---

# Checklist de lançamento do Shop

Escrito em 07/11/2026. O Shop sai como produto oficial quando **tudo** daqui estiver marcado.
A primeira loja é a **ESLA Acessórios**, que migra do site atual (Payload + Netlify) para o Shop.
Quem faz cada item está na coluna. Marca na ordem: o que está embaixo depende do que está em cima.

:::info[Regra de ouro]
Nada vai para produção sem a Tamires aprovar no local antes. Dados de teste quem cria é ela, pela tela.
:::

## 1. Código que ainda falta (Claude)

| | Item | Por quê trava | Tamanho |
|---|---|---|---|
| ☑ | **Fotos no storage do Shop** (feito 07/11, testado no disco local: 114 fotos copiadas). A rodada em produção usa o Supabase do Shop assim que existir. | As peças apontavam para o Supabase do site antigo; quando ele caísse, a loja ficaria sem foto. | feito |
| ☑ | **Redirecionamento dos endereços antigos** (feito 07/11): o import grava 125 pares (`/produtos/<slug>`, `/categorias/<slug>`, `/carrinho`, `/politicas/...`) e a vitrine responde com redirecionamento permanente no domínio da loja. | Links em stories, mensagens e no Google dariam "não encontrado" depois da troca de DNS. | feito |
| ☑ | **Esqueci a senha por e-mail** (feito 07/11, local; falta só a chave do Resend): pedido pela tela de entrar, link com validade de uma hora, senha nova derruba as sessões antigas, limite por e-mail e IP; telas no painel com todos os estados. Envio pelo Resend, plano gratuito (3.000 por mês, 100 por dia, resend.com/pricing em 07/11/2026). | A dona não tem como recuperar a conta sozinha. | 1 dia |
| ☑ | **"Mais" no celular** (feito 07/11): a quinta aba abre uma folha com Clientes, Cupons, Recebimentos, Link na bio, Configurações, o link da loja e Sair, como no Chef. | Metade do painel não existia no celular. | feito |
| ☑ | **Vazios do Editorial** (feito 07/11): loja sem peça mostra as palavras e o WhatsApp no lugar do "Em destaque"; coleção vazia manda para todas as peças; rodapé sem coleções some; voz própria para "outros" e assistência. | Loja nova aparecia quebrada antes de ter peça. | feito |
| ☑ | **Varredura final** (07/11): lint limpo nos três repositórios do Shop (a vitrine ganhou configuração; a API passou a formatar em 160 colunas), typecheck e testes verdes (API 62, painel 57, vitrine 46). Chef `feat/hub`: `test:all` verde (134 unitários, 153 de API, 172 E2E) depois de dois ajustes nos testes. | | feito |

Total estimado: **4 a 5 dias** de código.

## 2. Contas, acessos e segredos (Tamires)

Tudo que é segredo vai no arquivo de credenciais ignorado pelo git, nunca no chat.

| | Item | Observação |
|---|---|---|
| ☐ | Publicar `@facter/platform-contract` **0.12.0** no npm (inclui os pedidos de recurso) e, no Chef, rodar `npm install @facter/platform-contract@0.12.0` para atualizar o lockfile | Sem ele a API do Shop, o painel e o Chef não buildam fora da sua máquina. |
| ☐ | Criar os repositórios `facter-shop-api` e `facter-shop-web` no GitHub e subir a `main` | Hoje só existem na sua máquina. |
| ☐ | Mesclar as PRs abertas: vitrine (`feat/store-voice`) e Chef (`feat/hub`) | |
| ☐ | Dar o "pode" nos commits do design system que o Shop usa | |
| ☐ | **Projeto Supabase do Shop** (banco + bucket `shop`, o nome padrão da API) | O gratuito permite dois projetos ativos por organização. Hub e TechCare já ocupam dois se estiverem juntos: confira antes de criar. |
| ☐ | **Conta no Resend** (plano gratuito) com o domínio facter.com.br verificado (registros DNS que o serviço mostra) e a chave da API no arquivo de credenciais | Trava o esqueci a senha. Depois serve para boas-vindas pelo Hub e avisos de pedido. |
| ☐ | **Chave de API do Render** e id do serviço da vitrine | Para o Shop emitir o certificado do domínio próprio de cada loja. |
| ☐ | Conta no Hub: produto Shop com `apiUrl` e webhook de produção, segredo do produto e do webhook | O seed local já mostra o formato. |

## 3. Infra e deploy (Tamires decide, Claude prepara)

Desenho já decidido em 05/11: pagar só o necessário.

| | Serviço | Onde | Custo |
|---|---|---|---|
| ☐ | API do Shop | Render, web service pago | US$ 7 |
| ☐ | Vitrine (`facter-shop`) | Render, web service pago (cliente chega pelo story, não pode dormir) | US$ 7 |
| ☐ | Painel (`facter-shop-web`) | Vercel. **Hobby não permite uso comercial**: com a ESLA pagando, vai para o Pro ou para o Render | Pro US$ 20/pessoa |
| ☐ | Banco e fotos | Supabase, projeto do Shop | grátis no começo |

Preços de 05/11/2026 lidos em render.com/pricing e vercel.com/pricing. Confirmar na hora de contratar.

**Endereços**, todos dentro do facter.com.br (domínio próprio do produto só quando sair do Brasil):

| Peça | Endereço |
|---|---|
| Vitrine das lojas sem domínio próprio | `shop.facter.com.br/store/<slug>` |
| Painel da dona | `app.shop.facter.com.br` |
| API | `api.shop.facter.com.br` (ou o endereço do Render, com `PUBLIC_API_URL` apontando para ele) |

**Variáveis de produção.** Cada uma precisa existir antes do primeiro deploy.

| Serviço | Variáveis |
|---|---|
| API | `NODE_ENV` `PORT` `DATABASE_URL` `JWT_SECRET` `JWT_ACCESS_EXPIRATION` `JWT_REFRESH_EXPIRATION` `REDIS_URL` `FRONTEND_URL` `ALLOWED_ORIGINS` `PUBLIC_API_URL` `SUPABASE_URL` `SUPABASE_SERVICE_KEY` `SUPABASE_BUCKET` `STOREFRONT_URL` `STOREFRONT_CNAME` `STOREFRONT_A_RECORD` `RENDER_API_KEY` `RENDER_SERVICE_ID` `CATALOG_SOURCE_SECRET` `PAYMENT_SECRET_KEY` `MERCADO_PAGO_API_URL` `MERCADO_PAGO_AUTH_URL` `MERCADO_PAGO_CLIENT_ID` `MERCADO_PAGO_CLIENT_SECRET` `PANEL_URL` `HUB_API_URL` `HUB_PRODUCT_SLUG` `HUB_PRODUCT_ID` `HUB_PRODUCT_SECRET` `HUB_WEBHOOK_SECRET` `HUB_CACHE_TTL_MS` (+ as do e-mail quando o esqueci a senha entrar) |
| Painel | `NEXT_PUBLIC_API_URL` `NEXT_PUBLIC_APP_NAME` `NEXT_PUBLIC_STORE_URL` |
| Vitrine | `CATALOG_SOURCE_URL` (a API do Shop, servidor a servidor) |

| | Passo de deploy |
|---|---|
| ☐ | Migrações do banco rodadas (`prisma migrate deploy`) no Supabase do Shop |
| ☐ | API no ar e respondendo `/api/health` |
| ☐ | Vitrine no ar, lendo a API |
| ☐ | Painel no ar, cookies `shop_access_token` / `shop_refresh_token` funcionando no domínio de produção |
| ☐ | Hub de produção com o produto Shop apontando para a API nova; criar uma loja de teste pelo Hub e ver o painel abrir |
| ☐ | **Teste de domínio próprio** com um subdomínio nosso (ex.: `teste.shop.facter.com.br`) antes de qualquer domínio de cliente: registros, conferência, certificado no Render, vitrine atendendo |

## 4. Produto e comercial (Tamires)

| | Item |
|---|---|
| ☐ | Plano do Shop no Hub, com um plano de cortesia (sem cobrança) para a ESLA, e a assinatura dela criada por lá |
| ☑ | Decidido em 07/11: o recurso `payments` fica **desligado** no lançamento; o pedido fecha pelo WhatsApp. A ESLA entra como **cortesia**: plano sem cobrança no Hub |
| ☐ | Termos de uso e política de privacidade publicados (a vitrine coleta nome e WhatsApp de cliente; LGPD) |
| ☐ | Canal de suporte combinado com a dona (WhatsApp da Facter) |
| ☐ | A landing do Shop em facter.com.br falando do produto como pronto |

## Ligar a Larissa ao Hub (Chef em produção)

Ela já tem conta no Chef. A ligação é pelo **Liberar produto** do Hub, e o Chef reconhece a conta pelo e-mail.

| | Passo |
|---|---|
| ☐ | Conferir no Chef de produção, em Administração, o **e-mail de login** dela. |
| ☐ | No Hub, criar a empresa dela pela tela e clicar em **Liberar produto**: Facter Chef, plano com a loja, **o mesmo e-mail**, senha em branco. |
| ☐ | Conferir: o Chef respondeu que ligou a conta existente (não "criou"); o Chef aparece em Produtos da empresa no Hub; ela entra com a senha de sempre e a Minha loja abre o editor. |

**Ordem do deploy:** o Hub sobe antes do Chef. O botão **Quero a minha loja** do Chef manda o pedido para o Hub (tela **Pedidos**, com o número de pedidos esperando no menu). Você aprova escolhendo o plano, e o Chef libera a loja na hora pelo webhook. Se recusar, escreva o motivo: ela vê esse texto na Minha loja e pode pedir de novo. Conta do Chef sem ligação com o Hub continua com o botão do WhatsApp.

**Se o e-mail estiver errado:** o Chef cria uma confeitaria nova e vazia com aquele e-mail. Nada da conta dela é apagado nem alterado; encomendas, agenda e financeiro continuam iguais. Ela ainda não tem loja no ar (a loja chega com este deploy), então o efeito é só que a conta dela fica sem ligação e a Minha loja mostra a página "Quero a minha loja" em vez do editor. Correção, na Administração do Chef: ligar a confeitaria dela à empresa do Hub (botão Hub da confeitaria) e bloquear a confeitaria vazia que nasceu por engano.

## 5. Migração da ESLA

| | Item | Quem |
|---|---|---|
| ☐ | Criar a loja da ESLA pelo Hub de produção (pela tela) | Tamires |
| ☐ | Rodar o import do catálogo em produção com fotos copiadas e slugs antigos guardados | Claude, com aprovação |
| ☐ | Conferir com a Naty: categorias, preços, promoções, variações, peças esgotadas (43 ficam ocultas até ter estoque), textos de políticas | Tamires + Naty |
| ☐ | Naty entra no painel, troca a senha, revisa a loja na prévia | Naty |
| ☐ | Publicar a loja (Configurações → Entrega) | Naty ou Tamires |
| ☐ | Link na bio atualizado no Instagram | Naty |
| ☐ | Descobrir onde está o DNS da ESLA hoje: registros A/CNAME no registro.br, ou nameservers na Vercel | Tamires |
| ☐ | Registrar o domínio da ESLA em Loja → Domínio e colar os registros que o painel mostra | Tamires |
| ☐ | **Dia da troca**, horário calmo: trocar os registros, conferir no painel, abrir no celular, fazer um pedido de teste | Tamires |
| ☐ | Site antigo fica no ar uma semana como reserva | |
| ☐ | Derrubar Netlify, Payload e o Supabase antigo | Tamires |

## 6. Depois do lançamento (não trava)

**Pagamentos:** conta de desenvolvedor no Mercado Pago (aplicação OAuth, URL de retorno, credenciais de teste e de produção) e o teste de verdade em modo teste: conectar, gerar link, pagar com cartão de teste, webhook chegar. Só depois disso o recurso `payments` liga para alguma loja.

**Chef:** levar o esqueci a senha por e-mail e o modelo de e-mail da Facter para lá (hoje a troca é pela administração, via WhatsApp). Portagem para Fastify e código em português, com o `test:all` verde; só depois de fechar a branch do Hub no Chef. O e-mail de boas-vindas pelo Hub cobre os dois produtos.

Estoque por peça, galeria de fotos, selos Novo e Mais vendido, parcela mínima, desconto no Pix,
frete grátis acima de X na gaveta, escolher à mão as peças da bio, e-mail de boas-vindas pelo Hub,
avisos de pedido por e-mail, InfinitePay como segundo gateway (quando houver credenciais de teste).
Detalhes em [Fatia 9](../engenharia/fatia-9-editorial-inteiro.md), seção "O que a ESLA tem e o
Shop ainda não".
