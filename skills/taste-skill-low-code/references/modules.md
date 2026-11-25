# Módulos

Esta é a diferença central para o taste-skill original: lá, o agente escreve a página; aqui, o
agente **projeta e mantém um kit de peças** e a página é montada com elas. Nada de UX hard-coded.

## A escada da modularidade

Use sempre o degrau mais alto que resolve. Só desça com motivo escrito no relatório.

1. **Widget nativo ou do Marketplace já configurável** (Data Grid 2, List View, Gallery, Charts).
2. **Design property** numa peça existente (um toggle ou dropdown no painel *Design*).
3. **Building block** (estrutura pronta que se arrasta e depois se edita na página).
4. **Snippet** (estrutura viva: muda num lugar, muda em todo lugar; aceita parâmetros).
5. **Page template** (esqueleto de página inteira para uma tarefa).
6. **Layout** (moldura do app: navegação, cabeçalho, regiões).
7. **Partial SCSS novo + design property nova** no módulo de UI resources.
8. **Pluggable widget** próprio: só quando nenhum degrau acima atende, com justificativa.

Fora da escada, e proibido: CSS inline (*Style*), seletor `.mx-name-*`, HTML/JavaScript Snippet
para desenhar tela, CSS colado no `index.html`.

**Building block ou snippet?** Building block é cópia: bom para ponto de partida que cada página
ajusta (um cabeçalho de página, um formulário de endereço). Snippet é referência: bom para o que
deve ficar idêntico em todo lugar (rodapé de ações, cartão de resumo do pedido, bloco de estado
vazio). Em dúvida entre os dois, snippet.

## Anatomia do módulo de UI resources

```
themesource/tastekit/web/
  main.scss                 importa os partials, nesta ordem
  _tokens.scss              --tk-*  (a única fonte de números do módulo)
  _layout.scss              tk-wrap, tk-section, tk-stack-*, tk-actionbar
  _surfaces.scss            tk-card, tk-panel, tk-band
  _type.scss                tk-text-*
  _buttons.scss             tk-btn-*
  _lists.scss               tk-list-*, tk-grid
  _states.scss              tk-empty, tk-skeleton, tk-status
  _motion.scss              tk-lift, reduced motion
  _a11y.scss                foco, alvos de toque
  design-properties.json    expõe as classes no Studio Pro
```

No Studio Pro: crie o módulo `TasteKit`, marque *Mark as UI resources module*, e em *App
Settings > Theme* coloque-o depois de `Atlas_Core` (carrega depois, vence). É nesse módulo que
ficam também os layouts, page templates, building blocks e snippets de UI. Ele não tem domain
model nem lógica de negócio, então pode ser exportado (`.mpk`) e reutilizado em outros apps.

Regras do SCSS do módulo:

- Só `var(--tk-*)` e variáveis do Atlas; nenhum número de cor ou tamanho fora de `_tokens.scss`.
- Toda classe começa com `tk-`. Uma classe nova só existe se entrar numa design property.
- Seletores curtos, ancorados na classe `tk-*` e nas classes estáveis dos widgets (`.mx-button`,
  `.mx-listview`, `.widget-datagrid`); nunca em `.mx-name-*` nem em estrutura profunda do DOM.
- Sem `!important`. Se o Atlas vence, aumente a especificidade com a própria classe `tk-*`.

## Design properties: o vocabulário

Uma design property é a forma modular de aplicar estilo: o desenvolvedor escolhe uma opção num
painel, a plataforma aplica a classe. Formato (`design-properties.json`), por tipo de widget:

```json
{
  "DivContainer": [
    {
      "name": "Taste: superfície",
      "type": "Dropdown",
      "description": "Papel visual do contêiner.",
      "options": [
        { "name": "Card", "class": "tk-card" },
        { "name": "Painel", "class": "tk-panel" }
      ]
    },
    { "name": "Taste: largura de leitura", "type": "Toggle", "description": "…", "class": "tk-measure" }
  ]
}
```

`Toggle` e `Dropdown` funcionam do Mendix 9 em diante. Versões recentes do Atlas também têm
`ToggleButtonGroup`, `ColorPicker` e `Spacing`: use-os só depois de confirmar no
`design-properties.json` do `atlas_core` do app que a versão os suporta. Chaves comuns: `Widget`
(todos), `DivContainer`, `Button`, `ListView`, `DynamicText`, `Label`, `LayoutGrid`, `DataView`,
`GroupBox`, `TabContainer`; pluggable widgets usam o id completo
(`com.mendix.widget.web.datagrid.Datagrid`).

O kit entrega este vocabulário (todos com prefixo "Taste:" para ficarem juntos no painel):

| Widget | Propriedade | Opções → classe |
|---|---|---|
| Container | Superfície | Seção `tk-section`, Card `tk-card`, Painel `tk-panel`, Faixa de marca `tk-band` |
| Container | Largura | Conteúdo `tk-wrap`, Estreita `tk-wrap-narrow` |
| Container | Espaço entre filhos | 8 `tk-stack-2`, 16 `tk-stack-4`, 24 `tk-stack-5`, 32 `tk-stack-6`, 48 `tk-stack-7` |
| Container | Direção | Linha `tk-row`, Linha com extremos `tk-row-between` |
| Container | Largura de leitura | `tk-measure` |
| Container | Barra de ações | `tk-actionbar` |
| Container | Estado vazio | `tk-empty` |
| Container | Elevação no hover | `tk-lift` |
| Button | Papel | Primário `tk-btn-primary`, Secundário `tk-btn-secondary`, Discreto `tk-btn-quiet`, Perigo `tk-btn-danger` |
| Text | Papel | Título de página `tk-text-page`, de seção `tk-text-section`, de card `tk-text-card`, Lead `tk-text-lead`, Corpo `tk-text-body`, Rótulo `tk-text-label`, Meta `tk-text-meta`, Número `tk-text-figure` |
| Text | Status | Neutro, Sucesso, Aviso, Perigo `tk-status-*` |
| List view | Estilo | Linhas com fio `tk-list-rows`, Cards `tk-list-cards` |
| Data Grid 2 | Grade Taste | `tk-grid` |

Antes de criar uma propriedade, confira se o Atlas já tem uma que serve (*Spacing*, *Align*,
*Hide on phone*). Não duplique: o kit cobre o que o Atlas não cobre ou cobre com gosto errado.

## Catálogo mínimo de peças

Crie só as que o app usa; cada uma entra em `module-plan.md` com nome, propósito e parâmetros.

**Layouts**

| Nome | Para | Regiões |
|---|---|---|
| `TK_Layout_Sidebar` | `interno` | menu lateral, topbar fina, conteúdo |
| `TK_Layout_Topbar` | `portal`, `painel` | topbar com navegação, conteúdo |
| `TK_Layout_Focus` | `fluxo` | só logo e sair, conteúdo estreito |
| `TK_Layout_Popup` | popups modais | conteúdo, rodapé de ações |
| `TK_Layout_Phone` | `campo` | conteúdo, barra de ação embaixo |

Um layout mestre com os recursos comuns (logo, feedback, scroll container) e os outros baseados
nele, para que a mudança de moldura aconteça num lugar só.

**Building blocks** (`BB_`)

| Nome | Conteúdo |
|---|---|
| `BB_PageHeader` | título de página, um fato do dado, ação primária à direita |
| `BB_SectionHeader` | título de seção e link de ação discreto |
| `BB_KpiRow` | 3 a 5 números com rótulo, unidade e período |
| `BB_FormSection` | título de grupo e até 7 campos numa coluna |
| `BB_DetailSummary` | pares rótulo/valor em duas colunas |
| `BB_FilterBar` | busca e até 3 filtros numa linha |

**Snippets** (`SNIP_`)

| Nome | Parâmetro | Conteúdo |
|---|---|---|
| `SNIP_EmptyState` | n/a (um por contexto) | ícone discreto, uma frase do que falta, a ação que resolve |
| `SNIP_FormActions` | objeto do formulário | salvar (primário) e cancelar (discreto) |
| `SNIP_StatusBadge` | entidade com enumeration de status | texto do status com `tk-status-*` por valor |
| `SNIP_<Entidade>_Card` | a entidade | o cartão dessa entidade, usado em listas e detalhes |
| `SNIP_<Entidade>_Summary` | a entidade | o resumo fixo no topo das páginas da entidade |
| `SNIP_AuditLine` | entidade com `changedDate`/`changedBy` | "Alterado por … em …" em `tk-text-meta` |

**Page templates** (`PT_`): catálogo em `pages.md`.

## Nomes

Siga as convenções da plataforma e não invente dialeto.

| Artefato | Padrão | Exemplo |
|---|---|---|
| Módulo | UpperCamelCase, substantivo | `Orders`, `TasteKit` |
| Página | `<Entidade>_<Tipo>` | `Order_Overview`, `Order_NewEdit`, `Order_View`, `Order_Select` |
| Snippet | `SNIP_<Entidade>_<Papel>` | `SNIP_Order_Card` |
| Building block | `BB_<Papel>` | `BB_PageHeader` |
| Page template | `PT_<Tarefa>` | `PT_Overview` |
| Layout | `TK_Layout_<Moldura>` | `TK_Layout_Sidebar` |
| Microflow de ação | `ACT_<Entidade>_<Verbo>` | `ACT_Order_Submit` |
| Microflow data source | `DS_<Entidade>_<Critério>` | `DS_Order_GetOpen` |
| Microflow de validação | `VAL_<Entidade>` | `VAL_Order` |
| Sub-microflow | `SUB_<…>` | `SUB_Order_CalculateTotal` |
| Nanoflow | mesmo prefixo, pasta separada | `ACT_Order_Scan` |
| Enumeration | `ENUM_<Conceito>` | `ENUM_OrderStatus` |
| Classe CSS | `tk-<papel>` | `tk-card` |

Pastas por módulo: `Pages/`, `Snippets/`, `Microflows/<Entidade>/`, `Resources/` (enumerations,
constantes, imagens). Um módulo de negócio por subdomínio; UI compartilhada só no `TasteKit`.

## Separação que mantém o kit reutilizável

- `TasteKit` não referencia entidades de negócio. Um snippet que precisa de entidade mora no
  módulo de negócio e usa as classes e building blocks do kit.
- Lógica nunca mora em página: visibilidade e editabilidade por expressão simples ou por role;
  regra de negócio em microflow; validação em `VAL_` e validation rules do domain model.
- Imagens e ícones numa *image collection* / *icon collection* do módulo, nunca soltos em página.
