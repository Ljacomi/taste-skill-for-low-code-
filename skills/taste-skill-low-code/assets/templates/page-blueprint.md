# Blueprint de página

> **Contrato modular.** Este blueprint substitui o código de tela. Ele não contém HTML, CSS nem
> JSX: cada nó é um widget da plataforma, vindo de um layout, page template, building block ou
> snippet, com as design properties marcadas. Nenhum nó tem estilo próprio.

## Identificação

- **Página:** `<Entidade>_<Tipo>` (ex.: `Order_Overview`)
- **Módulo:** `<Módulo>`
- **Layout:** `TK_Layout_<Moldura>`
- **Page template:** `PT_<Tarefa>`
- **Roles que veem:** …
- **Tarefa da página (uma):** …
- **Ação principal (uma, botão primário):** …
- **Parâmetro da página:** `<Entidade>` ou nenhum

## Árvore de widgets

Notação: `Widget "texto" [design property: opção, …] (fonte de dados) → ação   ← origem`

```
Container [Taste: largura = Conteúdo; Taste: espaço entre filhos = 24]          ← PT_…
├─ BB_PageHeader
│  ├─ Text "…" [Taste: papel do texto = Título de página]
│  ├─ Text "…" [Taste: papel do texto = Meta]                (…)
│  └─ Button "Verbo objeto" [Taste: papel do botão = Primário]   → …
├─ …
└─ …
```

## Dados

| Widget | Fonte | Entidade | Restrição / ordenação |
|---|---|---|---|
| … | Database / Microflow `DS_…` / Contexto / Associação | `Módulo.Entidade` | … |

## Ações

| Gatilho | Faz | Artefato |
|---|---|---|
| Botão "…" | … | página `…` / microflow `ACT_…` / nanoflow `ACT_…` |

## Estados

| Estado | Bloco | Texto |
|---|---|---|
| Vazio | `SNIP_EmptyState_…` | … |
| Filtro sem resultado | `SNIP_EmptyState_…` | … |
| Carregando | `Taste: carregando` | n/a |
| Erro | … | … |
| Sem permissão | visibilidade por role | … |

## Larguras

- **1440 / 1024:** colunas do layout grid (somam 12): …
- **768:** …
- **390:** uma coluna; o que troca (ex.: grade vira List View com `SNIP_…_Card`): …

## Peças novas que este blueprint exige

Entram em `module-plan.md` antes de a página ser montada.

| Peça | Tipo | Por que não serve uma existente |
|---|---|---|
| … | building block / snippet / design property | … |

## Dívidas

Todo uso do campo *Class* e todo desvio do contrato modular, com o motivo e o plano para virar
design property. "Nenhuma" quando não há.
