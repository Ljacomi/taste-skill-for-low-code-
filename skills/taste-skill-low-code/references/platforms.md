# Outras plataformas low-code

A skill é escrita para o Mendix. Em outra plataforma, as regras de gosto e o contrato modular
são os mesmos; troque a peça pelo equivalente. Confirme os nomes na documentação da versão em
uso antes de afirmar: eles mudam entre versões, e esta tabela é um mapa, não uma referência.

| Conceito (Mendix) | OutSystems | Power Apps (canvas / model-driven) | Appian |
|---|---|---|---|
| Variáveis do tema (`custom-variables.scss`) | Theme do app, variáveis CSS do OutSystems UI | Theme / variáveis nomeadas no `App.OnStart` (canvas); tema do ambiente (model-driven) | Branding do site e estilos de interface |
| Módulo de UI resources | Módulo/Library de tema e padrões | Component library | Aplicação de componentes comuns |
| Design properties | Style classes expostas como parâmetros de bloco | Propriedades personalizadas de componente | Parâmetros de interface |
| Layout | Layout (bloco com placeholders) | Tela-modelo / componente de cabeçalho | Page template do site |
| Page template | Screen template | Modelo de tela | Interface-modelo |
| Building block | Bloco pré-montado / UI pattern | Componente copiado da biblioteca | Padrão de design |
| Snippet | Block (web block) | Componente (component library) | Interface reutilizável (rule) |
| Domain model | Entities e diagramas de entidades | Tabelas do Dataverse | Record types |
| Enumeration | Static entity | Choice (opção) | Constante / lista de referência |
| Microflow / nanoflow | Server action / client action | Power Automate / fórmulas Power Fx | Process model / expression rule |
| Access rules | Roles e checagens por tela e ação | Security roles do Dataverse | Record-level security |

O que vale em qualquer uma:

- Nenhum estilo por instância: sem CSS inline, sem cor ou tamanho digitado no controle. Em canvas
  apps isso significa **toda** cor, fonte e espaçamento vindo de variáveis de tema ou de
  propriedades de componente, nunca de um valor solto na fórmula do controle.
- Padrão repetido vira componente/bloco antes da terceira cópia.
- Modelo de dados antes da tela, com os mesmos critérios de nome e de leitura do diagrama.
- O gate tem as mesmas duas metades: o que dá para medir em arquivo exportado e o que se confere
  no app rodando. Os scripts desta skill leem SCSS e JSON; `domain-model.mjs` serve a qualquer
  plataforma, `check-theme.mjs` só onde o tema é CSS/SCSS (Mendix, OutSystems).
