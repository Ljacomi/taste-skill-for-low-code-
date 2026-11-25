---
name: taste-skill-low-code
description: >-
  Taste Skill para low-code (Mendix em primeiro lugar): o mesmo bom gosto e as mesmas regras
  anti-slop do taste-skill original, mas a entrega é sempre MODULAR, nunca hard code. Em vez de
  HTML/CSS/React escritos à mão, a skill produz tokens de tema (Atlas), um módulo de UI resources
  com design properties, layouts, page templates, building blocks e snippets, blueprints de página
  compostos só por esses módulos, e domain models especificados, validados e desenhados. Use
  sempre que for criar, redesenhar, padronizar, polir ou revisar telas, temas, módulos de UI ou
  domain models em Mendix (ou OutSystems, Power Apps e similares), ou quando o usuário disser que
  um app low-code parece genérico, "cara de template Atlas" ou "feito por IA".
---

# Taste Skill para low-code

Adaptação do [taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT) para plataformas
low-code, com o Mendix como alvo principal. `<skill>` é esta pasta. Os scripts pedem Node 18+.

## 0. O contrato: o gosto não muda, o meio de criação muda

**O que NÃO muda.** A estrutura de visualização e o critério de design são os do taste-skill
original: um sistema só, interface 90 a 95% neutra com um acento, escala de espaçamento única,
texto legível, bordas alinhadas, dois níveis de caixa, movimento discreto, copy direta, nada
inventado, nada com cara de template.

**O que MUDA.** A criação deixa de ser código de UX escrito à mão e passa a ser feita com
**itens modulares da plataforma low-code**. Esta skill:

- **NÃO entrega** páginas em HTML, CSS avulso, React, Vue, Tailwind ou qualquer front-end
  hard-coded como produto final. Um mock em HTML só serve de rascunho descartável quando o usuário
  pede para "ver antes"; ele nunca é a entrega e isso é dito no relatório.
- **ENTREGA** artefatos que vivem dentro do modelo do app e são reutilizados por configuração:

| No taste-skill original (hard code) | Nesta skill (modular, Mendix) |
|---|---|
| `:root` com tokens em `system.css` | `theme/web/custom-variables.scss` (variáveis do Atlas) + tokens `--tk-*` do módulo |
| Classes utilitárias escritas na página | **Design properties** (`design-properties.json`) escolhidas no painel do Studio Pro |
| `starter.html`, nav, footer | **Layouts** e **navigation** do app |
| Receitas de seção (`sections-library.md`) | **Page templates** e **building blocks** |
| Fragmentos de UI colados e reescritos | **Snippets** parametrizados e widgets nativos/Marketplace |
| CSS de página | Partial SCSS no módulo de UI resources (`themesource/<módulo>/web`) |
| Estrutura de dados implícita no markup | **Domain model** (entidades, atributos, associações, enumerations) |
| `consistency.mjs`, `gate.mjs` no navegador | `check-theme.mjs`, `domain-model.mjs` e o gate manual (`references/gate.md`) |

Regra de bolso: **se algo foi estilizado ou montado duas vezes, vira módulo; se foi estilizado
direto num widget, está errado.** Tudo o que esta skill escreve em disco (SCSS, JSON) é
infraestrutura de módulo reutilizável, nunca a tela em si. A tela é sempre composição.

Equivalentes em outras plataformas (OutSystems, Power Apps, Appian): `references/platforms.md`.
Onde este texto diz "Mendix", aplique o equivalente e mantenha as mesmas regras.

## 1. Regras da casa

Estas dez vencem tudo o mais nesta skill.

1. **Nada de hard code.** Proibido: a propriedade *Style* (CSS inline) de um widget; seletor
   `.mx-name-*` (estiliza uma instância, não um padrão); widget HTML/JavaScript Snippet para
   montar interface; `!important`; cor, tamanho ou espaçamento literal fora do arquivo de tokens.
2. **Um sistema só.** Um par de botões, um estilo de card, uma família de raio, um fio (hairline),
   uma escala de títulos, um jeito de link. Todos saem dos tokens e das design properties.
3. **Compor, não desenhar.** Uma página é um layout + um page template + building blocks +
   snippets. Um padrão que aparece em duas páginas vira building block ou snippet antes da terceira.
4. **Classe só por design property.** O campo *Class* de um widget recebe apenas classes `tk-*` ou
   do Atlas que ainda não têm design property, e cada uso é listado no relatório como dívida.
5. **Uma tarefa por página, uma ação principal por tela.** O botão primário (o único preenchido
   com o acento) aparece uma vez por tela; o resto é secundário ou discreto.
6. **Bordas iguais.** Todo bloco na mesma largura de conteúdo e nas colunas do layout grid; nada
   deslocado para um lado, nenhuma rolagem lateral em 1440, 1024, 768 e 390.
7. **Todo estado é desenhado.** Vazio, carregando, erro, sem permissão e lista longa têm bloco
   próprio (building block), nunca uma grade vazia ou a mensagem padrão da plataforma.
8. **Domain model antes da tela.** Nenhuma página é planejada antes de o modelo estar
   especificado, validado e desenhado (`references/domain-model.md`).
9. **Nada inventado.** Sem dados fictícios vendidos como reais, sem métricas, clientes ou
   depoimentos inventados. Dado de exemplo é marcado como exemplo e sai antes da entrega.
10. **Sem violeta.** Nada de roxo ou lavanda como acento, fundo ou gradiente (logos reais de
    terceiros mantêm suas cores). E sem o azul padrão do Atlas deixado como está: o acento vem do
    cliente.

## 2. O tipo de app decide tudo

Escreva o tipo na primeira linha do plano. Ele define densidade, layout e o que lidera a tela.

| Brief | Tipo | Layout base | O que lidera | Densidade |
|---|---|---|---|---|
| Back-office, ERP, cadastro, operação interna | `interno` | sidebar + topbar | data grid, formulário | compacta (linha 40px) |
| Portal de cliente, parceiro ou fornecedor | `portal` | topbar | status do pedido/processo, uma ação | confortável (linha 48px) |
| Painel gerencial, KPIs, monitoramento | `painel` | topbar ou sidebar fina | 3 a 5 números e 1 ou 2 gráficos | confortável |
| Fluxo guiado: solicitação, onboarding, aprovação | `fluxo` | topbar mínima, sem menu | um passo por tela, progresso | ampla (linha 56px) |
| Campo, chão de fábrica, tablet/telefone | `campo` | native ou PWA, barra de ação embaixo | a tarefa do turno, alvos de 48px | ampla |

Um app pode ter mais de um tipo por perfil de usuário (user role): planeje por role, cada um com
seu ponto de entrada na navigation.

## 3. O que serve a quê

Abra a referência de cada família antes de usar. Leia `system.md`, `modules.md` e
`domain-model.md` inteiros antes da primeira entrega.

| Necessidade | Artefato modular | Onde está | Referência |
|---|---|---|---|
| Cores, tipo, espaço, raio, sombra | variáveis do tema + tokens `--tk-*` | `assets/theme/`, `assets/themesource/tastekit/web/_tokens.scss` | `system.md` |
| Vocabulário visual clicável | design properties | `assets/themesource/tastekit/web/design-properties.json` | `modules.md` |
| Estrutura do app, menu, cabeçalho | layouts + navigation | plano em `assets/templates/module-plan.md` | `modules.md` |
| Esqueleto de página por tarefa | page templates | catálogo em `pages.md` | `pages.md` |
| Blocos repetidos (cabeçalho, card, vazio, KPI) | building blocks e snippets | catálogo em `modules.md` | `modules.md` |
| Telas | blueprint de página | `assets/templates/page-blueprint.md` | `pages.md` |
| Dados | domain model | `assets/templates/domain-model.json`, `scripts/domain-model.mjs` | `domain-model.md` |
| Textos, rótulos, mensagens | copy | n/a | `copy.md` |
| Conferência final | checagens + gate | `scripts/check-theme.mjs` | `gate.md` |

## 4. A execução

0. **Inventário da plataforma.** Antes de qualquer coisa, anote: plataforma e versão (Mendix 9,
   10 ou 11), versão do Atlas (Atlas 3 usa variáveis Sass `$brand-primary`; Atlas 4 usa variáveis
   CSS `--brand-primary`), módulos de UI resources já existentes, widgets do Marketplace
   instalados (Data Widgets, Charts, etc.) e se o destino é web responsivo, PWA ou native. Se a
   pasta do app está disponível, leia `theme/web/custom-variables.scss` e
   `themesource/*/web/design-properties.json`; se não está, pergunte uma vez e siga com Atlas 3 +
   web responsivo como suposição declarada no relatório.

1. **Leia o brief.** Anote o tipo (seção 2), quem usa (user roles), a tarefa principal de cada
   role, a ação principal de cada página e o material real: logo, cores da marca, dados de
   exemplo verdadeiros, regras de negócio.

2. **Domain model primeiro.** Escreva o modelo em JSON (`assets/templates/domain-model.json` é o
   formato), valide e gere o diagrama:

   ```bash
   node <skill>/scripts/domain-model.mjs lint modelo.json
   node <skill>/scripts/domain-model.mjs mermaid modelo.json > modelo.mmd
   ```

   Corrija todo FAIL. O modelo segue `references/domain-model.md`: nomes, tipos, associações,
   segurança e a disposição visual do diagrama no Studio Pro.

3. **Escreva toda a copy antes das telas** (`references/copy.md`): títulos de página, rótulos de
   campo, botões (verbo + objeto), mensagens de validação, estados vazios, confirmações.

4. **Defina os tokens, nunca "a gosto".** A paleta sai do cliente (logo, produto, material).
   Preencha `assets/theme/custom-variables.atlas3.scss` ou `.atlas4.scss` e copie os valores para
   o `custom-variables.scss` do app, alterando só variáveis que já existem lá. Raio: `sharp`
   (0/2px) para financeiro e industrial, `soft` (6/8px) por padrão, `round` (12px) para consumo.

5. **Planeje os módulos** (`assets/templates/module-plan.md`): quais layouts, page templates,
   building blocks e snippets o app precisa, com nome, propósito, parâmetros e onde são usados.
   Instale o módulo `tastekit` (`assets/themesource/tastekit`) em `themesource/` do app, crie no
   Studio Pro um módulo de mesmo nome marcado como *UI resources module* e ordene-o depois do
   Atlas em *App Settings > Theme*. Padrão novo entra como partial + design property, nunca como
   CSS solto.

6. **Componha as páginas como blueprints** (`assets/templates/page-blueprint.md`): uma árvore de
   widgets em que cada nó cita o módulo de onde vem (layout, template, building block, snippet) e
   as design properties marcadas. Nenhum nó tem estilo próprio. Blueprint é o que o desenvolvedor
   monta no Studio Pro; se houver automação disponível (Mendix Model SDK, Maia), ela executa o
   mesmo blueprint, sem liberdade de estilo.

7. **Confira.**

   ```bash
   node <skill>/scripts/check-theme.mjs <pasta-do-app-ou-do-módulo>
   node <skill>/scripts/domain-model.mjs lint modelo.json
   ```

   Depois o gate manual de `references/gate.md`, lido contra a checklist abaixo, nas larguras
   1440, 1024, 768 e 390 no app em execução (ou nos prints que o usuário enviar). Três rodadas no
   máximo; o que sobrar aberto vai para o relatório.

8. **Relatório:** a linha do gate primeiro (`GATE: PASS`, `OPEN` ou `NÃO VERIFICADO`); o tipo; a
   versão da plataforma e as suposições; os tokens e por que a paleta serve ao cliente; a lista de
   módulos criados e reutilizados; o diagrama do domain model; todo uso do campo *Class* (regra
   4); todo FAIL em aberto; o que não pôde ser conferido (em geral, o app rodando); e o que o
   cliente precisa fornecer (logo, dados reais, textos legais).

## 5. Checklist

Entre colchetes, o id da checagem de script quando existe; o resto é conferido no gate manual.

- **Modular:** nenhum widget com *Style* preenchido; nenhum `.mx-name-*`, `!important` ou cor
  literal fora dos tokens [instance-selector, important, raw-colour]; todo padrão repetido é
  building block ou snippet; toda classe usada existe numa design property [dp-class-missing].
- **Um sistema:** um par de botões, um card, uma família de raio, uma escala de títulos; espaços
  só na escala 4, 8, 12, 16, 24, 32, 48, 64, 96 [off-scale]; duas caixas de profundidade no máximo.
- **Primeira tela:** o título diz o que a página é (substantivo), a ação principal está visível
  sem rolar, um fato concreto do dado (contagem, status, data) aparece junto do título.
- **Bordas iguais:** todo conteúdo na mesma largura (`tk-wrap`), colunas do layout grid somando
  12, nada mais largo que a tela em 390.
- **Texto:** corpo 14px no mínimo em app denso e 16px em portal, fluxo e campo; nada abaixo de
  13px [small-type]; contraste 4.5:1 no mínimo, 7:1 para texto de leitura; sentence case; linha de
  texto corrido com no máximo 62 caracteres (`tk-measure`).
- **Cor:** interface neutra, um acento, sem violeta [violet]; o acento preenchido só no botão
  primário; status (sucesso, aviso, perigo) só para status, nunca decoração; `#000` puro nunca
  [pure-black].
- **Estados:** vazio, carregando, erro e sem permissão desenhados em toda lista, grade e
  formulário; validação sob o próprio campo; confirmação só depois de um commit real.
- **Dados:** grade com no máximo 7 colunas visíveis, números alinhados à direita, datas num
  formato só, coluna de ação por último; paginação ou carregamento sob demanda acima de 20 linhas.
- **Formulários:** uma coluna (duas só em 1024+ para campos curtos e pareados), rótulo acima do
  campo, grupos de até 7 campos, obrigatório marcado, botão primário à esquerda do cancelar e com
  o mesmo texto do título da tarefa.
- **Movimento:** hover discreto em linha, card e botão (`tk-lift`: 2px); 120 a 200 ms; nada
  pisca, desliza por rolagem ou gira; `prefers-reduced-motion` respeitado [transition-all].
- **Acesso:** foco visível em todo controle, alvos de 44px (48 em `campo`), rótulo em todo campo,
  texto alternativo em toda imagem com significado, ordem de tabulação igual à ordem visual.
- **Domain model:** todo FAIL de `domain-model.mjs lint` resolvido; diagrama sem linhas cruzadas;
  access rules por role em toda entidade persistível; nenhuma entidade órfã sem motivo.
- **Copy:** títulos nomeiam coisas, botões são verbo + objeto, um nome por conceito no app
  inteiro, mensagens de erro dizem o que fazer; nenhum "Lorem ipsum", "Novo item" ou texto padrão
  do template.
- **Seus olhos:** ao lado do Atlas padrão, parece um produto desenhado para este cliente; nada
  torto, desalinhado, cortado ou sobreposto.

## 6. Nunca

- HTML, CSS, React ou Tailwind como entrega; CSS inline em widget; estilo por instância.
- Um padrão copiado e colado em três páginas em vez de building block ou snippet.
- O tema Atlas intacto (azul padrão, gradiente no topbar, cards com sombra em tudo) apresentado
  como design.
- Página antes do domain model; entidade sem documentação, sem access rule ou com nome no plural.
- Card dentro de card dentro de card; ícone decorativo em cada rótulo; emoji como ícone.
- Dashboard genérico com seis gráficos sem pergunta; KPI sem unidade e sem período.
- Dados, clientes, números ou depoimentos inventados; logo de terceiro redesenhado.
- Violeta ou lavanda; gradiente decorativo; sombra pesada; `#000` puro.
- Editar arquivos do Atlas (`themesource/atlas_core`) ou de módulos do Marketplace: sobrescreva
  no seu módulo, que carrega depois.
- Copiar código, texto, imagens ou o efeito-assinatura de um site ou app de referência.

## Referências

Todas em `references/`: `system.md` (tokens e sistema visual), `modules.md` (arquitetura modular,
design properties, building blocks, snippets, nomes), `pages.md` (page templates e blueprints),
`domain-model.md` (modelagem e visualização), `copy.md` (texto de interface), `gate.md` (o gate
final), `platforms.md` (equivalências fora do Mendix).
