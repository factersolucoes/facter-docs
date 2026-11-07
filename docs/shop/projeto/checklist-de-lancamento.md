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
| ☐ | **Fotos no storage do Shop.** O import copia cada imagem da ESLA para o bucket do Shop. | Hoje as peças apontam para o Supabase do site antigo; quando ele cair, a loja fica sem foto. | meio dia |
| ☐ | **Redirecionamento dos endereços antigos** (`/produtos/<slug>` do site atual → `/item/<id>` no Shop). O import guarda o slug antigo de cada peça. | Links em stories, mensagens e no Google dariam "não encontrado" depois da troca de DNS. | meio dia |
| ☐ | **Esqueci a senha por e-mail**: pedido pela tela de entrar, link com validade de uma hora, senha nova derruba as sessões antigas, limite por e-mail e IP; telas no painel com todos os estados. Envio pelo Resend, plano gratuito (3.000 por mês, 100 por dia, resend.com/pricing em 07/11/2026). | A dona não tem como recuperar a conta sozinha. | 1 dia |
| ☐ | **Página "Mais" no celular**: Clientes, Cupons, Recebimentos e Link na bio alcançáveis pelo telefone. | Metade do painel não existe no celular. | meio dia |
| ☐ | **Vazios do Editorial** (destaques, coleção e política sem conteúdo) e voz do ramo "outros". | Loja nova aparece quebrada antes de ter peça. | meio dia |
| ☐ | **Mercado Pago de verdade** em modo teste: conectar pelo OAuth, gerar link, pagar com cartão de teste, webhook chegar. | Até aqui só rodou no simulador local. Precisa das chaves (seção 2). | meio dia |
| ☐ | **Varredura final**: `verify` nos três repositórios, testes verdes, diff contra o CLAUDE.md, nada de texto fixo fora do i18n. | | 1 hora |

Total estimado: **4 a 5 dias** de código.

## 2. Contas, acessos e segredos (Tamires)

Tudo que é segredo vai no arquivo de credenciais ignorado pelo git, nunca no chat.

| | Item | Observação |
|---|---|---|
| ☐ | Publicar `@facter/platform-contract` **0.11.0** no npm | Sem ele a API e o painel não buildam fora da sua máquina. |
| ☐ | Criar os repositórios `facter-shop-api` e `facter-shop-web` no GitHub e subir a `main` | Hoje só existem na sua máquina. |
| ☐ | Mesclar as PRs abertas: vitrine (`feat/store-voice`) e Chef (`feat/hub`) | |
| ☐ | Dar o "pode" nos commits do design system que o Shop usa | |
| ☐ | **Projeto Supabase do Shop** (banco + bucket `shop`, o nome padrão da API) | O gratuito permite dois projetos ativos por organização. Hub e TechCare já ocupam dois se estiverem juntos: confira antes de criar. |
| ☐ | **Conta no Resend** (plano gratuito) com o domínio facter.com.br verificado (registros DNS que o serviço mostra) e a chave da API no arquivo de credenciais | Trava o esqueci a senha. Depois serve para boas-vindas pelo Hub e avisos de pedido. |
| ☐ | **Mercado Pago**: conta de desenvolvedor, aplicação com OAuth, URL de retorno de produção, credenciais de teste e de produção | Decisão à parte: ligar ou não o recurso `payments` para a ESLA no lançamento (seção 4). |
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
| ☐ | Plano e preço do Shop no Hub, e a assinatura da ESLA criada por lá |
| ☐ | Decidir se o recurso `payments` liga para a ESLA no lançamento ou só WhatsApp no começo |
| ☐ | Termos de uso e política de privacidade publicados (a vitrine coleta nome e WhatsApp de cliente; LGPD) |
| ☐ | Canal de suporte combinado com a dona (WhatsApp da Facter) |
| ☐ | A landing do Shop em facter.com.br falando do produto como pronto |

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

Estoque por peça, galeria de fotos, selos Novo e Mais vendido, parcela mínima, desconto no Pix,
frete grátis acima de X na gaveta, escolher à mão as peças da bio, e-mail de boas-vindas pelo Hub,
avisos de pedido por e-mail, InfinitePay como segundo gateway (quando houver credenciais de teste).
Detalhes em [Fatia 9](../engenharia/fatia-9-editorial-inteiro.md), seção "O que a ESLA tem e o
Shop ainda não".
