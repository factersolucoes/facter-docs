---
title: Segurança da integração
sidebar_position: 3
---

# Segurança do Hub e da integração com os produtos

Regra-mãe: **o Hub decide o que uma empresa pode usar. Nunca decide quem é a pessoa nem a que empresa ela pertence.** Login, sessão e isolamento por empresa continuam sendo de cada produto. Um registro de liberação trocado no pior caso dá uso sem pagar; nunca dá acesso a dado de cliente.

Cada item abaixo é requisito da fase 1.3 e tem teste que prova. Sem o teste, não está pronto.

## Produto ↔ Hub

| # | Regra | Como se prova |
|---|---|---|
| S1 | Do produto pro Hub só vai o id da empresa. Nada do negócio da cliente (produtos, pedidos, clientes, financeiro) sai do produto. | feito, `plataforma.test.ts` |
| S2 | Segredo do produto só em variável de ambiente do servidor. Nunca no front, no repositório, em log ou em resposta de API. | feito (env no servidor; `.env.example` avisa) |
| S3 | Webhook do Hub pro produto assinado com HMAC e carimbo de hora; assinatura errada, hora fora da janela (5 min) ou id de evento repetido é recusado. | feito, contrato + `plataforma.test.ts` |
| S4 | O produto só aceita webhook de empresa que ele conhece (`hubCompanyId` cadastrado) e só altera liberações. Nunca cria usuário, nunca muda papel, nunca muda `empresaId`. | feito, `plataforma.test.ts` |
| S5 | O cache de liberação guarda só: id da empresa no Hub, produto, situação da assinatura, chaves liberadas, limites, validade. Nenhum dado pessoal. | feito, `plataforma.test.ts` (registro sem dado pessoal) |
| S6 | Hub fora do ar: produto usa a última resposta; empresa sem resposta usa o padrão do produto (menos permissivo). | feito, `plataforma.test.ts` |
| S7 | Toda chamada entre produto e Hub é HTTPS; em produção o Hub recusa HTTP. | no deploy (Render/HTTPS) |
| S8 | Segredo do produto e segredo do webhook têm rotação (o Hub já tem "regenerar"); o produto aceita o antigo por uma janela curta pra trocar sem queda. | parcial: Hub regenera; Chef ainda aceita um segredo só, sem janela |

## Hub em si

| # | Regra | Situação |
|---|---|---|
| H1 | Senha forte, histórico de senhas, bloqueio após tentativas (modelos `PasswordHistory`, `failedLogins`, `lockedUntil` já existem). | Existe; confirmar na 1.3 que está ativo. |
| H2 | Segunda etapa de login (2FA) pra todo usuário com papel de Hub (SUPER_ADMIN, SUPPORT). | **Não existe (verificado 05/11). Tarefa 1.3b.** |
| H3 | Sessões listáveis e revogáveis (rotas `sessions` existem); token de acesso curto (15 min) e refresh guardado no banco. | Existe. |
| H4 | O painel não confia em cookie sem validade (corrigido em 05/11). | Feito. |
| H5 | Rate limit nas rotas de login, refresh e integração. | Verificar configuração em produção (hoje desligado em dev). |
| H6 | Helmet/CSP ligados (já em `main.ts`), CORS só pro painel. | Existe; conferir origens em produção. |
| H7 | Auditoria: toda mudança de plano, assinatura, segredo e usuário registra quem, quando e o quê (`AuditLog` existe). | Confirmar cobertura nas rotas de catálogo. |
| H8 | Logs sem dado pessoal: ids, nunca e-mail, telefone ou documento. | Varredura de logs. |
| H9 | Backup diário do banco do Hub e teste de restauração. | Entra no deploy (1.5). |
| H10 | LGPD: exportar e apagar os dados de uma empresa sob demanda (o Hub guarda cadastro, dona, plano, faturas; finalidade: contrato e cobrança). | Script na 1.5. |
| H11 | Dependências com vulnerabilidade conhecida bloqueiam o deploy (`pnpm audit` no pipeline). | Entra no deploy (1.5). |

## O que fica fora do Hub de propósito

Pagamento que a dona recebe da cliente dela (gateway da própria dona), dados operacionais dos produtos, senhas dos usuários finais dos produtos. Nada disso passa pelo Hub.
