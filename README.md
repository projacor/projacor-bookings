# Overture — clone (Projaçor Bookings)

Plataforma de gestão de bookings de artistas, com a estrutura do Overture
clonada e a paleta adaptada à Projaçor (nav coral; azul/verde funcionais
mantidos como no original). **Sem módulo de faturação.**

Next.js 16 + Tailwind v4, em Português de Portugal.

## Arrancar

```bash
cd overture-clone
npm install
npm run dev
```

Abre em http://localhost:3000

## Estrutura (igual ao Overture)

- **Header** preto com ícones (tema, ajuda, conta, notificações, definições, sair)
- **Nav horizontal** coral: Painel · Contactos · Tarefas · Bookings · Docs · Mail ▾ · Calendário · Relatórios ▾

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Painel — KPIs, próximos eventos, bookings por estado, tarefas pendentes |
| `/contacts` | Lista com pesquisa, etiquetas e filtro; Adicionar pessoa / empresa |
| `/contacts/new` | Formulário "Adicionar nova pessoa" (nome, alias, empresa, grupo, cargo) |
| `/tasks` | Tarefas por fazer / concluídas, com prioridade e prazo |
| `/bookings` | Lista de bookings (ID, data, nome, artista, cachet, estado) |
| `/bookings/[id]` | Detalhe: estado, agente/assistente, promotor/sala/artista, ações |
| `/docs` + `/docs/[id]` | Páginas de artista (bio + media), visível/oculto |
| `/calendar` | Calendário mensal por estado, Adicionar booking + Subscrever + legenda |
| `/reports` | Filtrar por contacto, tabela, pesquisa guardada, legenda, totais |
| `/mail` | Caixa de entrada (demonstração) |

## Estados de booking

Pedido de informação · Pré-reserva · Pendente · A aguardar confirmação ·
Confirmado · Contrato enviado · Contrato assinado · Totalmente executado ·
Reagendado · Cancelado (cada um com a sua cor, usada em badges e no calendário).

## Notas

- **Faturação removida** — não há faturas nem registo de pagamentos.
- **Dados de demonstração:** artistas, contactos, cachets e eventos são fictícios.
- Estado em memória (React Context) — reinicia ao recarregar a página.
