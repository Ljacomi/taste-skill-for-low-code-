# Páginas

Uma página nunca é desenhada do zero: é um **layout** + um **page template** + **building
blocks** e **snippets**, descrita num **blueprint**. O critério visual é o do taste-skill original
(uma ideia por tela, bordas iguais, um sistema); a forma de construir é composição.

## Page templates por tarefa

| Template | Tarefa | Estrutura (de cima para baixo) |
|---|---|---|
| `PT_Overview` | achar e abrir um registro | `BB_PageHeader` (título, contagem, "Criar …") · `BB_FilterBar` · Data Grid 2 ou List View · `SNIP_EmptyState` |
| `PT_Detail` | ler um registro | `SNIP_<Entidade>_Summary` · abas ou seções (`tk-section`) · listas relacionadas · `SNIP_AuditLine` |
| `PT_NewEdit` | criar ou alterar | título da tarefa · `BB_FormSection` × n em `tk-wrap-narrow` · `SNIP_FormActions` |
| `PT_Dashboard` | acompanhar | `BB_PageHeader` (período) · `BB_KpiRow` · 1 ou 2 gráficos · lista "precisa de atenção" |
| `PT_Wizard` | concluir um fluxo | progresso (passo n de m) · um grupo de campos · voltar / continuar · resumo no último passo |
| `PT_MasterDetail` | triagem em sequência | lista à esquerda (4 colunas) · detalhe à direita (8) · empilha abaixo de 1024 |
| `PT_Select` (popup) | escolher um registro | busca · lista curta · selecionar / cancelar |
| `PT_Confirm` (popup) | confirmar ação destrutiva | o que acontece em uma frase · ação nomeada (perigo) / cancelar |

Regras por template:

- **Overview.** A grade mostra de 4 a 7 colunas, a primeira identifica o registro e abre o
  detalhe (a linha inteira é clicável). Texto à esquerda, números e valores à direita, status
  como `SNIP_StatusBadge`. Ordenação padrão declarada (em geral, o mais recente ou o mais
  urgente primeiro). Filtros acima da grade, nunca num popup. Em 390, a grade vira List View com
  `SNIP_<Entidade>_Card`: planeje as duas visões no blueprint.
- **Detail.** O resumo no topo responde "o que é, em que estado está, o que posso fazer agora".
  A ação que avança o processo é o primário; as demais num menu discreto. Abas só para conjuntos
  de dados realmente distintos (no máximo 5); senão, seções numa coluna.
- **NewEdit.** Uma coluna. Campo do tamanho do dado (CEP curto, descrição larga). Opcional é
  marcado, não o obrigatório, quando a maioria é obrigatória. Enumeration de até 4 valores vira
  radio; acima, dropdown; associação com muitas opções vira combo box com busca. O primário diz o
  que faz ("Salvar pedido"), não "OK".
- **Dashboard.** Cada número responde a uma pergunta do role que abre a página, tem unidade,
  período e, quando existe, comparação. No máximo 5 KPIs e 2 gráficos; o resto é link para um
  overview filtrado. Gráfico: uma mensagem por gráfico, sem 3D, sem pizza acima de 4 fatias,
  cores dos tokens.
- **Wizard.** Um assunto por passo, progresso sempre visível, voltar nunca perde dados, o último
  passo é um resumo com editar por seção.
- **Popup.** Só para escolher, confirmar ou editar até 5 campos. Mais que isso é página.

## Grade e larguras

- Layout grid de 12 colunas. Combinações permitidas: 12 · 6/6 · 8/4 · 4/8 · 4/4/4 · 3/3/3/3.
  Nada de 5/7 ou 7/5, nada de coluna vazia para "empurrar".
- Cada coluna declara tablet e telefone: em geral 6 no tablet e 12 no telefone.
- Todo conteúdo dentro de um contêiner `tk-wrap` (ou `tk-wrap-narrow` em formulário e leitura).
- Confira em 1440, 1024, 768 e 390. Em 390: uma coluna, botões na largura total, barra de ação
  fixa embaixo em `campo` e `fluxo`.

## Estados

Toda lista, grade, gráfico e formulário tem os cinco, cada um um bloco do kit:

| Estado | Bloco | Conteúdo |
|---|---|---|
| Vazio (nunca houve dado) | `SNIP_EmptyState` | o que aparece aqui e a ação que cria o primeiro |
| Vazio (filtro sem resultado) | `SNIP_EmptyState` variante | o filtro aplicado e "Limpar filtros" |
| Carregando | `tk-skeleton` ou o indicador da plataforma | nunca tela em branco acima de 300 ms |
| Erro | mensagem no lugar do conteúdo | o que falhou em palavras simples e "Tentar de novo" |
| Sem permissão | visibilidade por role | o bloco some; a página inteira nega com explicação |

No Mendix: use a região de *empty placeholder* do Data Grid 2 / Gallery quando existir; senão,
visibilidade condicional sobre a contagem.

## Blueprint de página

Formato em `assets/templates/page-blueprint.md`. É o que o agente entrega no lugar de código:
uma árvore de widgets em que **cada nó cita a peça modular de origem** e as design properties
marcadas. Convenções:

- `Widget "nome" [propriedade: opção, …] ← origem` onde origem é `layout`, `PT_…`, `BB_…`,
  `SNIP_…` ou `nativo`/`Marketplace`.
- Fonte de dados na linha do widget: `(Database: Orders.Order, XPath …, ordenado por …)`,
  `(Microflow: DS_…)`, `(Contexto)`.
- Ação na linha do botão: `→ página Order_NewEdit`, `→ ACT_Order_Submit`.
- Nenhum nó tem `style:`. Um nó com `class:` é dívida e aparece na seção *Dívidas* do blueprint.
- Ao final: estados, comportamento em 390, roles que veem a página, e a lista de peças novas que
  o blueprint exige (elas entram em `module-plan.md` antes de a página ser montada).

Exemplo curto:

```
Página Order_Overview · layout TK_Layout_Sidebar · template PT_Overview · roles: Vendas, Gestor
Container [Taste: largura = Conteúdo; Taste: espaço = 24]                       ← PT_Overview
├─ BB_PageHeader
│  ├─ Text "Pedidos" [Taste: papel = Título de página]
│  ├─ Text "{n} em aberto" [Taste: papel = Meta]            (Microflow: DS_Order_CountOpen)
│  └─ Button "Criar pedido" [Taste: papel = Primário]       → página Order_NewEdit
├─ BB_FilterBar (busca por número e cliente; filtro de status; filtro de período)
├─ Data Grid 2 [Taste: grade]            (Database: Orders.Order, ordenado por CreatedOn desc)
│  colunas: Número · Cliente · Criado em · Status (SNIP_StatusBadge) · Total (direita)
│  linha → página Order_View
│  vazio → SNIP_EmptyState_Orders
└─ (390) List View [Taste: estilo = Cards] com SNIP_Order_Card, no lugar da grade
Dívidas: nenhuma.
```
