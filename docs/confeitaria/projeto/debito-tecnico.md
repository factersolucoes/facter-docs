---
title: Débito Técnico
sidebar_position: 1
tags: [chef, projeto, debito-tecnico, convencoes]
---

# Débito Técnico do Facter Chef

> Não impede o produto de funcionar, mas cobra pedágio em toda alteração. Registrado em 07/11/2026.

## Médio · Código e banco legados em português

**O padrão Facter é código em inglês**: identificadores, comentários, nomes de arquivo e de teste. Só o que a usuária vê fica em português. O Chef nasceu antes dessa regra e o CLAUDE.md dele mandava português; corrigido em 07/11/2026.

| O que | Hoje | Exemplos |
|---|---|---|
| Tabelas e colunas | Português | `Usuario`, `Empresa`, `Encomenda`, `senhaHash`, `criadoEm`, `precoEmbalagemCentavos` |
| Rotas e funções da API | Português | `rotasEncomendas`, `exigirLogin`, `usuarioDaSessao` |
| Telas e componentes | Português | `paginas/`, `CabecalhoPagina`, `Campo` |
| Testes | Português | `ajuda.ts`, `criarContaLogada`, nomes de `it` |
| Código novo | **Inglês** | `platform/`, `storefront`, `product-updates`, coluna `updatesSeenAt` |

**Regra até pagar:** código novo nasce em inglês, como módulo próprio que referencia o legado por id. O legado em português **não** é renomeado aos poucos dentro de uma tarefa qualquer.

**Como pagar:** uma tarefa só para isso, planejada, porque mexe no banco de produção com a confeitaria usando todo dia:

1. Renomear tabelas e colunas com `@@map`/`@map` no Prisma primeiro (o nome no código muda, o banco não), sem migração destrutiva.
2. Renomear rotas internas, funções e telas em lotes, com o `test:all` verde a cada lote.
3. Só depois, se valer, renomear no banco, numa janela combinada, com backup.

As URLs que a usuária vê (`/encomendas`, `/loja`) ficam como estão até existir redirecionamento.
