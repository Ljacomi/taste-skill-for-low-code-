---
name: taste-skill-low-code
description: >-
  tasteskill adaptada para low-code (Mendix em primeiro lugar), a skill anti-slop de design. Mesma
  estrutura de visualização e mesmo bom gosto da tasteskill original: copy direta com voz própria,
  um sistema só, uma seção por tela, bordas iguais, fotografias reais e UI real do produto,
  microinterações discretas. O que muda é a criação: nada de UX em hard code (HTML, CSS, React,
  Tailwind); tudo é construído com itens modulares da plataforma (tema, design properties,
  layouts, page templates, building blocks, snippets, widgets) e com o domain model. Use sempre
  que for criar, desenhar, redesenhar, polir ou revisar telas, páginas, portais, temas ou domain
  models em Mendix ou outra plataforma low-code, ou quando o usuário disser que um app parece
  genérico, de template ou "feito por IA".
---

# tasteskill para low-code

Adaptação da [tasteskill](https://github.com/Leonxlnx/taste-skill) de Leonxlnx (MIT).

Construa a tela que uma boa empresa entregaria: ela diz com clareza o que é oferecido, mostra a
coisa real em cada tela e parece feita para este cliente, não saída de um template e não uma
peça de arte.

## O que não muda e o que muda

**Não muda:** a estrutura de visualização e o critério de design. Todas as regras de gosto
abaixo são as da tasteskill original.

**Muda:** o meio de criação. A original escreve a página em código (HTML/CSS estático ou dentro
de React, Next.js, Vue, Svelte, Astro, Tailwind). **Esta skill não escreve UX em hard code.**
Toda visualização é criada com **itens modulares da plataforma low-code**, e os dados com o
**domain model**:

| Na tasteskill original (hard code) | Nesta skill (modular, Mendix) |
|---|---|
| Tokens em `system.css` (`:root`) | Variáveis do tema Atlas em `theme/web/custom-variables.scss` |
| Classes escritas no markup | **Design properties** marcadas no Studio Pro |
| `starter.html`, nav, footer | **Layouts** e **navigation** do app |
| Receitas de seção | **Page templates** e **building blocks** |
| Fragmentos de UI colados na página | **Snippets** e widgets nativos ou do Marketplace |
| CSS de página | Partial SCSS num **módulo de UI resources** (`themesource/<módulo>/web`), exposto por design property |
| Dados fixos no markup | **Domain model**: entidades, atributos, associações, enumerations |
| A página entregue como arquivo | A página montada no Studio Pro a partir de um **blueprint** (árvore de widgets que cita o módulo de cada nó) |

Proibido, por ser hard code: a propriedade *Style* (CSS inline) de um widget; seletor
`.mx-name-*`; widget HTML/JavaScript Snippet para desenhar tela; `!important`; cor, tamanho ou
espaço literal fora das variáveis do tema; entregar HTML, CSS ou React como produto final.

Em outra plataforma (OutSystems, Power Apps, Appian), use o equivalente de cada item e mantenha
as mesmas regras.

## Regras da casa

Estas nove vencem tudo o mais nesta skill.

1. **Nenhuma legenda ou descrição sob imagem, render ou visual.** Créditos de licença numa única
   linha de rodapé.
2. **Todo visual renderiza, nunca um fundo vazio,** em 1440, 1024, 768 e 390.
3. **Uma seção por tela:** o hero sozinho na primeira tela, cada seção com exatamente uma ou duas
   telas de altura em 1440x900, sem o título da próxima seção aparecendo. Em telas de aplicação
   (lista, detalhe, formulário, painel): uma tarefa por página e uma ação principal por tela.
4. **Bordas esquerda e direita do conteúdo iguais.**
5. **Microanimações de hover:** um card com link sobe 2px, uma foto dá zoom de 1.02 a 1.03 dentro
   da moldura, botões reagem no hover e afundam no clique, sublinhados se desenham. Sem
   inclinação, carrosséis ou abas com tempo. Todo hero entra uma vez no carregamento. Tudo isso
   vem de uma classe do módulo de UI resources ligada a uma design property, nunca de CSS num
   widget.
6. **Mais e melhores fotografias reais onde cabem;** fundos, heros, layouts e fontes melhores.
7. **Ícones reais em cores reais** (o ícone verdadeiro de um produto conhecido, nunca um
   desenhado), guardados numa image ou icon collection do módulo; pequenos diagramas em cards.
8. **As grandes cenas e os momentos criativos fazem parte da skill,** mas efeitos de shader e
   cenas só onde o negócio tem assunto técnico (tech, IA, ferramentas de desenvolvimento, games,
   fintech, hardware), nunca num café, padaria, pousada ou loja: esses recebem fotografias. Em
   low-code, um efeito só entra por um pluggable widget (Marketplace ou próprio), nunca por
   script colado na página.
9. **Endereços:** só rua e bairro (sem rua: o bairro), sem número, CEP ou coordenadas; sem CNPJ
   ou inscrição; sem telefone em formato real; contatos em `.example`.

## 1. O tipo de negócio decide tudo

Escreva o tipo na primeira linha do plano.

| Brief | Tipo |
|---|---|
| App, SaaS, IA, ferramenta de desenvolvimento, fintech ou banco, estúdio que vende o próprio software | software |
| Um jogo, um estúdio lançando seu jogo | gaming |
| Hardware ou dispositivo (drone, braço robótico, teclado) | tech |
| Qualquer outro produto físico ou marca (cadeira, bicicleta, café vendido online) | product |
| Pessoas são contratadas: clínica, escritório de advocacia, agência, estúdio criativo, ofício | service |
| Pessoas vão até lá: café, bar, padaria, restaurante, pousada, hotel pequeno, loja, academia | place |

"Tech" abaixo significa software, gaming ou tech; "outros" é todo o resto. Efeitos, cenas,
loops, contadores, fundos em CSS, páginas escuras e heros escuros são só de tech. Uma página de
"outros" é fotografia, cor chapada, tipo, ícones reais, a entrada do hero e a camada de hover.

Num app de operação interna (back-office, cadastro, aprovação), o tipo continua sendo o do
negócio do cliente e define paleta, tom e imagens; a densidade vem da tarefa: grade e formulário
compactos para quem usa o dia todo, telas amplas para portal e fluxo guiado.

## 2. O plano da página por tipo

- **Place.** Fotografias lideram. O hero é uma fotografia sempre que houver um quadro que caiba;
  o bloco de visita na segunda tela; a oferta, o lugar, pedidos ou reserva. Variedade sem
  efeitos: a oferta e o lugar usam composições diferentes; um momento de tipo (o endereço ou o
  nome em grande); uma ação principal por tela; texto de lista em 16px. Fundos chapados, fotos
  quadradas, um estilo de botão.
- **Product e service.** Fotografias lideram: o produto, as pessoas, os ambientes, o trabalho.
  Ícones reais das ferramentas que o estúdio usa; no máximo um diagrama estático; fundos chapados
  e uma faixa de marca. Sem efeito de shader, grão, gradiente, cena ou loop. Um produto físico
  sem fotos é mostrado em fotografias substitutas do mesmo tipo de coisa, cada uma listada no
  relatório; nunca um desenho ou banco de imagens de clima.
- **Toda página de produto:** o produto **grande** onde aparece inteiro, nunca em tamanho médio
  num painel cinza arredondado sobre fundo cinza; **uma imagem diferente em cada seção**; **toda
  promessa de título mostrada em imagem**; nenhuma estrutura repetida; **nenhum fato duas vezes**.
- **Tech.** O assunto do próprio cliente lidera em tamanho real. Software: a própria UI, viva,
  mostrando aquilo em que trabalha, num único quadro; nunca um dashboard genérico. Em Mendix isso
  é a tela real do app ou um snippet com dados reais do domain model, não uma imagem de mock.
  **60 a 80 palavras por tela** fora da UI. No máximo um efeito e um ou dois momentos.
- **Um objeto nunca carrega a página.** O produto ou objeto do hero aparece inteiro no hero e em
  no máximo mais duas seções; outro tipo de visual carrega o resto.
- **Os materiais do cliente ganham lugar.** Trailer, key art, screenshots ou vídeo que o brief
  cita recebem cada um um quadro que já parece pronto, nunca vazio.

## 3. O que serve a qual página

Cada necessidade da original, agora atendida por um item modular. Um traço significa nunca.

| Necessidade | Item modular (Mendix) | Software, gaming | Hardware | Product, service | Place |
|---|---|---|---|---|---|
| Alturas, bordas, heros, tipo | **Layout** + **page template** de hero | sim | sim | sim | hero de lugar |
| Seções e receitas | **Building blocks**, um por receita de seção | seu plano | plano de produto | seu plano | plano de lugar |
| Tokens, grid, botões, nav, rodapé, cor | `custom-variables.scss`, **layout grid**, **navigation**, snippet de rodapé | sim | sim | sim | tokens de lugar |
| Formulários, teclado | **Data view** + inputs nativos, validação pelo domain model | sim | sim | sim | sim |
| Copy, contatos, créditos | Textos traduzíveis (*Languages*), nunca fixos em expressão | sim | sim | sim | sim |
| Entrada do hero, hover, clique, foco | Classes do módulo de UI resources via **design property** | sim | sim | sim | sim |
| Loops de card, contador | Pluggable widget | sim | sim | - | - |
| Fotografias | **Image collection** ou entidade que herda de `System.Image` | pessoas, clientes | lideram | lideram | lideram, 12 a 20 |
| Ícones reais de ferramentas e apps | **Icon/image collection** do módulo | sim | sim | os realmente usados | - |
| Cards de recurso, fragmentos de UI | **Snippets** com dados reais | lideram | seu app | um app que o cliente usa | - |
| Cards de diagrama | Snippet ou pluggable widget | 0 a 2 | 0 a 2 | 0 a 1, estático | - |
| Fundos | Variáveis do tema e uma design property de fundo | 0 a 2 | 0 a 2 | chapado | chapado |
| Efeitos, objetos, cenas | Pluggable widget (Marketplace ou próprio) | um efeito | um efeito | - | - |
| Dados de qualquer tela | **Domain model** | sim | sim | sim | sim |

## 4. A execução

0. **A stack.** A plataforma é o Mendix (ou a que o usuário indicar). Anote a versão do Studio
   Pro e do Atlas (Atlas 3 usa variáveis Sass, `$brand-primary`; Atlas 4 usa variáveis CSS,
   `--brand-primary`), se o destino é web responsivo, PWA ou native, e os módulos e widgets do
   Marketplace já instalados. Um app existente é construído no próprio tema e nos próprios
   módulos dele. Nunca saia da plataforma para escrever a tela em código.

1. **Leia o brief.** Anote o tipo (seção 1), o que é oferecido, quem usa (user roles), a ação
   principal (a transação: Reservar um quarto, Criar pedido, Enviar para aprovação) e o material
   real: logo, telas, fotografias, preços, endereço, horários, regras de negócio.

2. **Domain model antes da tela.** Liste as entidades, atributos, associações e enumerations que
   as páginas mostram e alteram, e mostre o diagrama ao usuário (Mermaid `erDiagram` serve de
   rascunho) antes de criar qualquer coisa:
   - entidade no singular, UpperCamelCase, com uma frase de documentação (`Order`, `OrderLine`);
   - atributo sem repetir o nome da entidade (`Order.Number`); Boolean com `Is`/`Has`/`Can`;
     dinheiro em Decimal; conjunto fechado como enumeration (`ENUM_OrderStatus`);
   - associação com o nome padrão `<Dono>_<Alvo>` e delete behavior decidido;
   - não persistível só para o que não sobrevive à sessão (filtros, passos de wizard);
   - access rules por role em toda entidade persistível;
   - o diagrama com o mesmo gosto da tela: mestres no topo ou à esquerda, detalhes abaixo,
     alinhado em grade, nenhuma linha cruzada, até cerca de 15 entidades por módulo.

3. **Escreva toda a copy primeiro:** o título nomeia a categoria e quem compra, ou o lugar (numa
   tela de app: a coisa ou a tarefa); um fato concreto na primeira tela; um substantivo em cada
   título; botões como verbo + objeto. Nada é inventado.

4. **Planeje a página como telas.** Linha 1: o tipo. Linha 2: paleta, fontes, raio, com uma frase
   sobre por que servem ao negócio. Depois uma linha por seção: a ideia única, a imagem, as telas
   (1 ou 2) e **o item modular que a constrói** (qual layout, page template, building block,
   snippet). Um padrão que aparece duas vezes vira building block ou snippet antes da terceira.

5. **Defina os tokens no tema, nunca na página.** A paleta sai do cliente (logo, produto,
   fachada), nunca violeta, e entra só em `theme/web/custom-variables.scss`, alterando variáveis
   que já existem lá (marca, fonte, fundos, raio, botões, inputs). Raio: `sharp` para fintech e
   ferramentas de desenvolvimento, `soft` por padrão, `round` para apps de consumo, quadrado em
   place. O que o Atlas não cobre vira uma classe num módulo de UI resources
   (`themesource/<módulo>/web`), exposta em `design-properties.json`.

6. **Construa com módulos.** Entregue o **blueprint** de cada página: a árvore de widgets, cada
   nó citando sua origem (layout, page template, building block, snippet, widget nativo ou do
   Marketplace), as design properties marcadas, a fonte de dados (entidade, XPath, microflow) e a
   ação de cada botão. Nenhum nó tem estilo próprio. Convenções de nome: páginas
   `<Entidade>_Overview`, `_NewEdit`, `_View`; snippets `SNIP_…`; building blocks `BB_…`;
   microflows `ACT_…`, `DS_…`, `VAL_…`. O desenvolvedor (ou uma automação como Maia ou o Model
   SDK) monta exatamente o blueprint no Studio Pro.

7. **Confira e olhe.** Com o app rodando, ou em prints, em 1440, 1024, 768 e 390, leia cada tela
   contra a checklist. No Studio Pro: nenhum widget com *Style* preenchido, nenhum uso do campo
   *Class* que não seja uma classe do módulo ainda sem design property, nenhum HTML Snippet
   desenhando tela. Corrija e confira de novo, três rodadas no máximo.

8. **Relatório:** o tipo; a paleta e por que serve; os módulos criados e reutilizados; o diagrama
   do domain model; todo desvio do contrato modular e por quê; o que não pôde ser conferido (em
   geral, o app rodando); todo fato assumido; as fotografias e os materiais que o cliente precisa
   fornecer, substitutos incluídos.

## 5. Checklist

- **Modular:** nenhum hard code (lista no topo); toda cor, fonte e espaço vem do tema; todo
  padrão repetido é building block ou snippet; todo estilo é uma design property.
- **Primeira tela:** diz o que é oferecido, para quem ou onde, com um fato concreto; o hero a
  preenche sozinho em toda largura, com o botão principal dentro.
- **Uma seção por tela:** cada seção com 1 ou 2 telas, título primeiro e alinhado no topo, nada
  do vizinho aparecendo, nada esparso, nenhuma seção meio vazia.
- **Bordas iguais:** todo bloco nas mesmas margens ou nas colunas do layout grid, nada deslocado
  para um lado, nenhuma rolagem lateral.
- **Todo visual desenha** em 1440, 1024, 768 e 390.
- **Nenhuma legenda** explica, se desculpa ou rotula uma imagem; créditos numa linha de rodapé;
  nenhum placeholder, texto de template ou dado de exemplo deixado na tela.
- **As coisas certas para o tipo:** fora de tech, nenhum efeito, grão ou cena; o assunto aparece:
  o produto grande, inteiro em no máximo três seções, uma imagem nova em cada; fotografias reais
  onde cabem, nenhuma duas vezes; ícones reais em suas cores; fundos chapados em "outros".
- **Movimento:** todo botão, link, card e foto com link responde visivelmente ao ponteiro, nada
  inclina; o hero entra uma vez; nada se move porque a página rolou; sob *reduced motion* tudo
  repousa e nada fica escondido.
- **Contatos** como a regra 9.
- **Teclado:** todo controle com nome, alt nas imagens, rótulos visíveis, títulos um nível por
  vez, foco sempre visível.
- **Um sistema:** um par de botões, um estilo de card, uma escala de raio, um jeito de link; no
  máximo duas caixas de profundidade; uma escala de títulos; contraste de texto.
- **Copy e links:** títulos nomeiam coisas, botões são verbo + objeto, no máximo duas ações no
  hero; um fato, uma redação; todo link chega, formulários enviam, confirmação só depois de um
  commit real, cada erro sob o próprio campo; nenhuma palavra de slop, frase de banco ou sobra.
- **Domain model:** nomes no padrão, documentação em toda entidade, access rules por role,
  diagrama sem linhas cruzadas.
- **820, 768, 390 e 320:** seções em suas telas; nada sobre outra coisa nem sob uma barra fixa;
  todo link e controle fora de texto corrido com 44px de altura; nada além da tela em 320; uma
  coluna em 390, botões na largura total.
- **Seus olhos:** parece um produto profissional feito para este cliente, não o Atlas padrão;
  nada inclinado, desalinhado, cortado ou sobreposto; o hero é o trabalho, não um clima.

## 6. Nunca

- UX em hard code: HTML, CSS, React ou Tailwind como entrega; CSS inline em widget; estilo por
  instância; HTML/JavaScript Snippet para montar tela.
- O mesmo arranjo copiado em três páginas em vez de building block ou snippet.
- O tema Atlas intacto (azul padrão, gradiente no topbar) apresentado como design.
- Página antes do domain model.
- Um card, linha ou bloco que aparece com fade na rolagem; parallax em texto; scroll-jacking;
  piscar aleatório.
- Fotos de banco passadas como produto, pessoas ou lugar do cliente; página de produto que nunca
  mostra o produto.
- Imitação desenhada de um logo real; avaliações, citações, clientes ou números inventados.
- Violeta ou lavanda no design da página: acento, fundo, gradiente, cor de efeito ou matiz (um
  logo real de terceiro mantém suas cores).
- Copiar código, texto, imagens ou o efeito-assinatura de um site de referência.
- Editar arquivos do Atlas (`themesource/atlas_core`) ou de módulos do Marketplace: sobrescreva
  no seu módulo de UI resources, que carrega depois.
