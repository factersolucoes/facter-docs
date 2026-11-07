---
title: "Fatia 10: Esqueci a senha e e-mail"
sidebar_position: 10
---

# Fatia 10: Esqueci a senha e e-mail

Entregue em 07/11/2026, local. A dona recupera a conta sozinha, por e-mail. O envio é o primeiro
e-mail do Shop e abre caminho para boas-vindas e avisos de pedido, no mesmo modelo
([mockup dos e-mails](/telas/shop/emails)).

## Como funciona

1. Na tela de entrar, "Esqueci a senha" leva a `/forgot-password`. A dona digita o e-mail.
2. A API responde sempre a mesma coisa, exista a conta ou não, e a tela diz "Link mandado" nos dois
   casos. Ninguém descobre por aqui quem tem loja.
3. Se o e-mail é de uma conta ativa, a API grava **só o hash** do token (`password_resets`), com
   validade de **uma hora**, e manda o e-mail com o link `PANEL_URL/reset-password?token=…`.
   Um pedido novo dentro de um minuto do anterior é ignorado em silêncio; um pedido novo depois
   disso invalida os links anteriores.
4. O link abre `/reset-password`: senha nova duas vezes, mínimo de 6 caracteres (o mesmo do Hub).
   Ao salvar, a API troca a senha, marca o link como usado e **derruba todas as sessões** da pessoa
   (`revokeAllUserTokens`). A tela diz "Senha salva" e leva a Entrar.
5. Link usado, vencido ou inventado: a tela diz "Link vencido" e oferece pedir outro.

Limite: as duas rotas estão sob o throttler `auth` (5 por minuto por IP), o mesmo do login.

## Envio

`infra/mail/MailService`: com `RESEND_API_KEY` manda pelo Resend (`MAIL_FROM`, padrão
`Facter <nao-responda@facter.com.br>`); sem a chave, escreve o e-mail inteiro no log, que é como
roda no local. Se o Resend falhar, a resposta para a pessoa não muda e o erro vai para o log.

O HTML segue o mockup: `core/password-reset.ts` tem o `mailFrame` (marca em texto, título, corpo,
motivo no rodapé), `paragraph`, `button` e `divider`, tudo em tabela e estilo em linha, sem imagem
nem fonte externa. Os próximos e-mails reusam essas peças.

## Arquivos

| Onde | O quê |
|---|---|
| API | `core/password-reset.ts` (+ spec), `application/auth/use-cases/password-reset.use-case.ts` (+ spec), `dto/password-reset.dto.ts`, rotas `POST auth/forgot-password` e `POST auth/reset-password`, `infra/mail/*`, migração `20261107030000_password_resets`, env `RESEND_API_KEY` e `MAIL_FROM` |
| Painel | `features/auth/components/{forgot-password-form,reset-password-form}.tsx`, `hooks/use-password-reset.ts`, rotas públicas `/forgot-password` e `/reset-password` no `middleware.ts`, link na tela de entrar, textos `forgot.*` e `reset.*` |

## Para produção

Conta no Resend (plano gratuito: 3.000 por mês, 100 por dia, lido em resend.com/pricing em
07/11/2026), domínio facter.com.br verificado com os registros DNS que o Resend mostra, e a
chave em `RESEND_API_KEY`. Até lá o e-mail só sai no log.

## Também nesta fatia: "Mais" no celular

A barra de baixo cabe cinco abas. A quinta, "Mais", abre uma folha (o `Dialog` do DS, que no celular
vira folha de baixo) com o que ficou de fora, na ordem da sidebar: Clientes, Cupons, Recebimentos
(só com o recurso liberado), Link na bio e Configurações; depois o link da loja, quem está logada e
Sair. É o mesmo desenho do "Mais" do Chef. `config/navigation.tsx` tem `moreItems` e `isInMore`
(a aba acende quando a página aberta é uma das que ela guarda), com teste em
`config/__tests__/navigation.test.ts`.
