# Plano de módulos

> **Contrato modular.** O app é construído com as peças listadas aqui. Nenhuma tela é escrita em
> HTML/CSS/React; nenhum widget recebe estilo próprio. Um padrão que aparece duas vezes entra
> nesta lista antes da terceira.

## Plataforma

- **Plataforma e versão:** Mendix …
- **Atlas:** 3 (variáveis Sass) / 4 (variáveis CSS)
- **Destino:** web responsivo / PWA / native
- **Tipo de app (SKILL.md, seção 2):** interno / portal / painel / fluxo / campo
- **Widgets do Marketplace usados:** …
- **Suposições:** …

## Tokens

| Token | Valor | De onde veio |
|---|---|---|
| Acento (`brand-primary`) | … | logo / produto / material do cliente |
| Tinta (`font-color-default`) | … | … |
| Fundo da página (`bg-color`) | … | … |
| Superfície (`bg-color-secondary`) | … | … |
| Fonte (`font-family-base`) | … | … |
| Raio | sharp / soft / round | por que serve ao setor |
| Corpo de texto | 14 / 16 | densidade do tipo de app |

Uma frase: por que esta paleta serve a este cliente.

## Módulos do app

| Módulo | Papel | Depende de |
|---|---|---|
| `TasteKit` | UI resources: tema, design properties, layouts, templates, blocos | `Atlas_Core` |
| `<Negócio>` | domain model, páginas e lógica de … | `TasteKit` |

## Layouts

| Nome | Baseado em | Usado por (roles / páginas) |
|---|---|---|
| `TK_Layout_…` | … | … |

## Page templates

| Nome | Tarefa | Páginas que usam |
|---|---|---|
| `PT_…` | … | … |

## Building blocks

| Nome | Conteúdo | Páginas que usam |
|---|---|---|
| `BB_…` | … | … |

## Snippets

| Nome | Módulo | Parâmetro | Conteúdo | Usado em |
|---|---|---|---|---|
| `SNIP_…` | … | … | … | … |

## Design properties novas (além das do kit)

| Widget | Propriedade | Opção → classe | Partial SCSS |
|---|---|---|---|
| … | Taste: … | … → `tk-…` | `_….scss` |

## Navegação

| Role | Página inicial | Itens de menu (até 7) |
|---|---|---|
| … | … | … |

## Páginas

| Página | Template | Layout | Roles | Blueprint |
|---|---|---|---|---|
| `<Entidade>_Overview` | `PT_Overview` | … | … | `blueprints/….md` |
