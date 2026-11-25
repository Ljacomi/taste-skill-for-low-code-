# Taste Skill para low-code

Uma skill de agente baseada no [taste-skill](https://github.com/Leonxlnx/taste-skill) de Leonxlnx,
adaptada para desenvolvimento em **plataformas low-code, com o Mendix como alvo principal**.

```bash
npx skills add ljacomi/taste-skill-for-low-code-
```

## O que muda e o que não muda

**Não muda:** a estrutura de visualização e o bom gosto. Um sistema só, interface neutra com um
acento, uma escala de espaço, texto legível, bordas alinhadas, dois níveis de caixa, movimento
discreto, copy direta, nada inventado, nada com cara de template.

**Muda:** o meio de criação. A skill original escreve front-end à mão (HTML, CSS, React). Esta
**não entrega UX hard-coded**: ela cria e compõe **itens modulares** da plataforma.

| Taste-skill original | Esta skill |
|---|---|
| Tokens em CSS da página | Variáveis do tema (Atlas `custom-variables.scss`) e tokens `--tk-*` |
| Classes escritas no markup | Design properties escolhidas no Studio Pro |
| HTML de seções e componentes | Layouts, page templates, building blocks e snippets |
| Página em código | Blueprint de página: árvore de widgets que cita o módulo de cada nó |
| Dados implícitos | Domain model especificado, validado e desenhado antes das telas |
| Checker em navegador | `check-theme.mjs`, `domain-model.mjs` e um gate manual no app |

Proibido pelo contrato da skill: CSS inline na propriedade *Style* de um widget, seletor
`.mx-name-*`, HTML/JavaScript Snippet para desenhar tela, `!important`, cor ou tamanho literal
fora dos tokens.

## Conteúdo

```
skills/taste-skill-low-code/
  SKILL.md                      o contrato, as regras da casa, a execução, a checklist
  references/
    system.md                   tokens e sistema visual (Atlas 3 e Atlas 4)
    modules.md                  arquitetura modular, design properties, catálogo de peças, nomes
    pages.md                    page templates por tarefa e o formato de blueprint
    domain-model.md             modelagem e visualização do domain model
    copy.md                     texto de interface
    gate.md                     o gate final (scripts + conferência no app)
    platforms.md                equivalências em OutSystems, Power Apps e Appian
  assets/
    theme/                      modelos de custom-variables (Atlas 3 e 4) e a ponte para Atlas 3
    themesource/tastekit/web/   módulo de UI resources: SCSS em partials + design-properties.json
    templates/                  blueprint de página, plano de módulos, domain model de exemplo
  scripts/
    check-theme.mjs             confere o contrato modular nos arquivos de tema
    domain-model.mjs            valida o domain model (lint) e gera o diagrama (mermaid)
```

## Uso rápido dos scripts

Node 18+, sem dependências.

```bash
# valida e desenha um domain model especificado em JSON
node skills/taste-skill-low-code/scripts/domain-model.mjs lint    skills/taste-skill-low-code/assets/templates/domain-model.json
node skills/taste-skill-low-code/scripts/domain-model.mjs mermaid skills/taste-skill-low-code/assets/templates/domain-model.json

# confere o tema de um app Mendix (ou só um módulo de themesource/)
node skills/taste-skill-low-code/scripts/check-theme.mjs /caminho/do/app
```

## Instalar o kit de tema num app Mendix

1. Copie `assets/themesource/tastekit` para `themesource/tastekit` na pasta do app.
2. No Studio Pro, crie o módulo `TasteKit`, marque *Mark as UI resources module* e, em
   *App Settings > Theme*, deixe-o depois de `Atlas_Core`.
3. Leve os valores de `assets/theme/custom-variables.atlas3.scss` (variáveis Sass) ou
   `.atlas4.scss` (variáveis CSS) para o `theme/web/custom-variables.scss` do app, trocando a
   paleta pela do cliente. No Atlas 3, cole também `main.atlas3-bridge.scss` em
   `theme/web/main.scss`.
4. Sincronize a pasta do app (F4). As opções "Taste: …" aparecem no painel de design dos widgets.

## Limites conhecidos

- Os scripts leem SCSS e JSON; eles não leem o modelo do app (`.mpr`). Estilo inline em widget e
  reuso de blocos são conferidos no gate manual descrito em `references/gate.md`.
- O kit de tema foi compilado com Dart Sass e validado pelos scripts, mas **ainda não foi
  carregado num app Mendix em execução**: confira os seletores de widget (`.mx-listview`,
  `.widget-datagrid`) contra a versão do Atlas e dos Data Widgets do seu app.
- Nomes de variáveis do Atlas variam entre versões: altere apenas as que já existem no
  `custom-variables.scss` do app.

## Créditos e licença

Baseada no [taste-skill](https://github.com/Leonxlnx/taste-skill) de Leonxlnx (MIT). Esta
adaptação reescreve o conteúdo para low-code e não redistribui o kit de front-end original.
Licença MIT, ver [LICENSE](LICENSE).
