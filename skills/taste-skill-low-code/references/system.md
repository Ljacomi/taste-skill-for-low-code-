# Sistema

Um sistema visual para o app inteiro. As regras são as do taste-skill original; o que muda é
**onde elas moram**: em vez de um `system.css` escrito para uma página, elas viram variáveis do
tema e tokens de um módulo de UI resources, consumidos por design properties. Nunca crie uma
segunda escala de espaço, de tipo, de raio, um segundo botão, card ou fio.

## Onde cada coisa mora (Mendix)

| Camada | Arquivo | Quem edita | Para quê |
|---|---|---|---|
| Variáveis do tema | `theme/web/custom-variables.scss` | o app | reconfigura o Atlas: marca, fontes, fundo, inputs, botões |
| Tokens do sistema | `themesource/tastekit/web/_tokens.scss` | o módulo | `--tk-*`: escala de espaço, tipo, raio, movimento |
| Padrões | `themesource/tastekit/web/_*.scss` | o módulo | classes `tk-*` de superfície, texto, botão, lista, estado |
| Vocabulário | `themesource/tastekit/web/design-properties.json` | o módulo | expõe as classes como opções no Studio Pro |
| Exceções do app | `theme/web/main.scss` | o app | só o que é deste app e não é padrão; idealmente vazio |

**Atlas 3 x Atlas 4.** No Atlas 3 (Mendix 9 e 10) as variáveis são Sass (`$brand-primary: #...;`).
No Atlas 4 são variáveis CSS dentro de `:root { --brand-primary: #...; }` no mesmo arquivo. Os
nomes são quase os mesmos; abra o arquivo do app, veja qual sintaxe ele usa e altere **apenas
variáveis que já existem nele**. Modelos prontos: `assets/theme/custom-variables.atlas3.scss` e
`custom-variables.atlas4.scss`. O módulo `tastekit` só usa `var(--tk-*)`, então compila igual nas
duas versões.

Depois de editar SCSS: no Studio Pro, *App > Show App Directory* para conferir os arquivos e F4
(Synchronize App Directory) para recompilar o tema; alterações em `design-properties.json` pedem
F4 também.

## Espaço

- Escala única: 4, 8, 12, 16, 24, 32, 48, 64, 96 (`--tk-s-1` a `--tk-s-9`). Toda margem, gap e
  padding sai dela. No Atlas ela casa com `spacing-smaller` (4), `small` (8), `medium` (16),
  `large` (24), `larger` (32), `largest` (48).
- Espaço é dado pelo **contêiner** (`tk-stack-*`, gap), não por margem em cada filho. Dois
  widgets com margens somadas à mão é sinal de padrão faltando.
- Título de página até o conteúdo: 32px (24 no telefone). Cards 24px entre si (12 no telefone).
  Padding de card: 24 (16 em `interno` compacto).
- Largura de conteúdo: `tk-wrap`, 1280px no máximo, margem lateral 32px (16 no telefone);
  formulários e texto em `tk-wrap-narrow` (720px).
- Uma altura por tipo de linha e por tipo de card no app inteiro.

## Tipo

- Uma família para tudo (duas no máximo: uma para títulos, uma para texto). Evite o Poppins
  padrão do Atlas quando a marca tem fonte própria; fonte de sistema é melhor que fonte errada.
- Escala (`--tk-t-*`): título de página 28, de seção 20, de card 16 (peso 600), lead 18, corpo
  16 (14 em `interno` compacto), rótulo 13 (peso 500), meta 13, número de KPI 32.
- Texto de leitura em `--tk-ink`, contraste 7:1 ou mais; `--tk-muted` (4.5:1 ou mais) só para
  rótulos, datas e meta. Nada abaixo de 13px.
- Sentence case em tudo: títulos, botões, colunas, menus. Nunca caixa alta espaçada.
- Destaque por contraste e peso, nunca por cor: sem marca-texto, sem palavra colorida.
- Um tamanho por tipo de elemento no app inteiro. Números tabulares em colunas e KPIs
  (`font-variant-numeric: tabular-nums`, já nas classes `tk-text-figure` e `tk-grid`).
- Um número nunca quebra da sua unidade; uma data nunca quebra no meio.

## Cor

- **A interface fica 90 a 95% neutra.** A cor vem do dado: status, gráficos, fotos, logos.
- Um quase-preto para texto (`--tk-ink`), frequentemente quente, nunca `#000`. Fios a 12 a 15%
  dele (`--tk-line`).
- **Um acento só,** vindo do cliente: botão primário (o único preenchido), foco, links, item
  ativo do menu. Fora disso, menos de 3% da tela. Rótulo sobre o acento a 4.5:1.
- Fundos: `--tk-g-main` (a página), `--tk-g-alt` (superfície de card e painel) e `--tk-g-band`
  (uma faixa de marca, uma por página no máximo). Topbar e sidebar em cor chapada, **sem o
  gradiente padrão do Atlas**.
- Cores de status (`brand-success`, `-warning`, `-danger`) só comunicam status e sempre com texto
  ou ícone junto, nunca só a cor.
- Sem violeta ou lavanda (matiz 250° a 310°) em nenhum token.
- Tema escuro só quando o uso pede (sala de controle, campo noturno); é um segundo conjunto de
  tokens, nunca cores trocadas widget a widget.

## Raio, fio e sombra

- Uma família de raio por app: `sharp` (0 e 2px), `soft` (6 e 8px) ou `round` (12px), aplicada a
  botão, input, card e imagem pela mesma variável (`--tk-radius`, `--tk-radius-lg`).
- Separe com fio de 1px ou com fundo, não com sombra. Sombra só em algo que flutua (popup,
  dropdown, menu), uma só (`--tk-shadow`).
- **Dois níveis de caixa no máximo:** página > card. Dentro do card, divida com fio ou espaço.

## Botões

- Três papéis, por design property *Taste: papel do botão*: **primário** (preenchido com o
  acento, um por tela), **secundário** (contorno), **discreto** (só texto, para cancelar e ações
  de linha). **Perigo** só em ação destrutiva e sempre com confirmação.
- Altura 40px (48 em `campo`), mesma altura dos inputs ao lado. Ícone só quando ajuda a
  reconhecer; sem botão só de ícone sem `title`/texto alternativo.
- Ordem: primário primeiro, cancelar por último, alinhados à esquerda do formulário; em popup,
  alinhados à direita com o primário mais à direita. Escolha uma convenção e mantenha.

## Movimento

- Três lugares, todos discretos: hover (linha de lista, card clicável, botão), foco e abertura
  de popup/sidebar. Duração `--tk-fast` 120ms e `--tk-base` 200ms, curva `--tk-ease`.
- Card clicável sobe 2px (`tk-lift`); botão escurece um passo no hover e afunda 1px no clique.
- Nada aparece por rolagem, nada pisca, nada gira além do indicador de progresso da plataforma.
- `prefers-reduced-motion`: tudo em repouso, nada escondido (o módulo já trata).

## Acesso

- Foco visível de 2px no acento com 2px de afastamento em todo controle (`_a11y.scss`).
- Alvos de 44px (48 em `campo`); 8px entre alvos vizinhos.
- Todo input com rótulo visível (*Label* do widget, não um texto solto ao lado); mensagens de
  validação pelo mecanismo da plataforma, sob o campo.
- Imagem com significado tem texto alternativo; decorativa, vazio.
- Idioma do app configurado em *Languages*; textos pelo sistema de tradução, nunca fixos numa
  expressão.
