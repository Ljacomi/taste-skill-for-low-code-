# Domain model

O domain model é parte do design: uma tela boa sobre um modelo ruim não se sustenta. Ele é
especificado antes das páginas, validado por script e desenhado para ser lido. As regras de gosto
são as mesmas da interface: nomes claros, um conceito por coisa, nada decorativo, nada duplicado.

## Fluxo

1. Escreva o modelo em JSON no formato de `assets/templates/domain-model.json`.
2. `node <skill>/scripts/domain-model.mjs lint modelo.json` e corrija todo FAIL; cada WARN é
   corrigido ou justificado no relatório.
3. `node <skill>/scripts/domain-model.mjs mermaid modelo.json` gera um `erDiagram` para revisão
   com o usuário antes de qualquer coisa ser criada no Studio Pro.
4. Só então o modelo é criado na plataforma (à mão, por Maia ou pelo Model SDK), seguindo a
   disposição visual abaixo.

## Entidades

- **Nome no singular, UpperCamelCase, substantivo do negócio:** `Order`, `OrderLine`, `Customer`.
  Nunca plural, nunca prefixo técnico (`tbl`, `Ent`), nunca abreviação que o usuário não fala.
- Escolha um idioma para o modelo (em geral inglês) e mantenha; os rótulos na interface são
  traduzidos, o modelo não mistura.
- Uma entidade, um conceito. Se a documentação precisa de "e" para explicar, são duas.
- **Toda entidade tem documentação** de uma frase: o que é uma instância dela.
- Persistível só o que precisa sobreviver à sessão. Filtros de tela, parâmetros de wizard e
  objetos de integração são **não persistíveis** e ficam agrupados à parte no diagrama.
- Especialize (`generalization`) só para ganhar comportamento da plataforma (`System.Image`,
  `System.FileDocument`, `Administration.Account`). Hierarquia de negócio profunda custa
  desempenho e clareza: prefira associação 1-1 ou uma enumeration de tipo.
- Dados de referência (categorias, status configuráveis pelo cliente) são entidades; valores
  fixos que a lógica conhece são enumerations.
- Até 15 entidades por módulo. Passou disso, o módulo tem dois subdomínios.

## Atributos

- UpperCamelCase, **sem repetir o nome da entidade:** `Order.Number`, não `Order.OrderNumber`.
- Boolean começa com `Is`, `Has`, `Can` ou `Should` e tem default explícito.
- Datas terminam em `Date` (só dia) ou `On`/`At` (instante): `DueDate`, `SubmittedOn`.
- Dinheiro e quantidades fracionadas em `Decimal`; contagens em `Integer`; identificador de
  negócio em `AutoNumber` ou `String` (nunca calcule com ele).
- Texto com tamanho pensado: nomes 200, códigos o tamanho real, texto livre ilimitado.
- Enumeration em vez de `String` para todo conjunto fechado; nome `ENUM_<Conceito>`, valores em
  UpperCamelCase, legendas traduzidas.
- Não armazene o que se deriva barato; quando armazenar por desempenho, um microflow só mantém.
  Evite atributos calculados em entidades listadas em grades.
- Até 20 atributos por entidade. Mais que isso costuma esconder uma segunda entidade.
- Use os *system members* (`createdDate`, `changedDate`, `owner`, `changedBy`) em vez de recriar
  auditoria à mão.
- Nomes reservados pela plataforma (`Id`, `Type`, `Guid`, `Owner`, `Context`…) não são usados.

## Associações

- O nome padrão `<Dono>_<Alvo>` é mantido: `OrderLine_Order`. Duas associações entre as mesmas
  entidades ganham papel no fim: `Order_Customer_Billing`, `Order_Customer_Shipping`.
- Em 1-para-muitos, o dono é o lado "muitos" (a linha aponta para o pedido). Muitos-para-muitos
  só quando a relação não tem dados próprios; se tem (quantidade, data, papel), vira entidade.
- Decida o **delete behavior** de cada uma: filhos que não vivem sozinhos são apagados junto
  (linhas de pedido); o que é referenciado bloqueia a exclusão (cliente com pedidos).
- Associação entre módulos aponta do módulo específico para o genérico, nunca nos dois sentidos.
- Índice nos atributos usados em busca, filtro e ordenação das grades.

## Segurança e validação

- Toda entidade persistível tem **access rules por module role**, com leitura e escrita por
  atributo e XPath de restrição onde o dado é por dono, equipe ou tenant. Tela escondida não é
  segurança.
- Obrigatoriedade, unicidade e faixa como **validation rules** na entidade; regra que cruza
  objetos em `VAL_<Entidade>`.
- Mensagens de validação seguem `copy.md`: dizem o que fazer.

## Visualização: o diagrama também tem gosto

O diagrama é lido por pessoas; trate-o como uma tela.

- **Leitura de cima para baixo e da esquerda para a direita:** entidades-mestre (de quem os
  outros dependem) no topo ou à esquerda; detalhes abaixo ou à direita do seu mestre.
- **Nenhuma linha cruzada,** nenhuma linha passando por trás de uma entidade. Se não dá, o módulo
  está grande demais ou a entidade está no lugar errado.
- Alinhe em grade: mesma largura para entidades de uma fileira, espaços iguais entre elas.
- A entidade central do módulo no centro; referência e configuração numa faixa à parte;
  não persistíveis num canto, juntas.
- Mantenha as cores da plataforma (persistível, não persistível, externa): elas já comunicam.
  Nada de colorir por gosto.
- Uma **annotation** por agrupamento, com o nome do subdomínio; nada de comentário longo no
  diagrama (isso vai na documentação da entidade).
- Atributos na ordem em que o negócio fala: identificação, estado, valores, datas, flags.
- Entidade de outro módulo aparece só quando há associação com ela, na borda do diagrama.

O `erDiagram` gerado por `domain-model.mjs mermaid` já ordena mestres antes de detalhes e
separa não persistíveis; use-o como rascunho da disposição.

## Formato do JSON

```json
{
  "module": "Orders",
  "entities": [
    {
      "name": "Order",
      "doc": "Um pedido de compra feito por um cliente.",
      "persistable": true,
      "attributes": [
        { "name": "Number", "type": "AutoNumber" },
        { "name": "Status", "type": "Enumeration", "enumeration": "ENUM_OrderStatus" },
        { "name": "Total", "type": "Decimal" },
        { "name": "IsUrgent", "type": "Boolean", "default": false }
      ],
      "access": ["Sales", "Manager"]
    }
  ],
  "associations": [
    { "name": "OrderLine_Order", "from": "OrderLine", "to": "Order", "multiplicity": "*-1", "onDeleteOfTarget": "delete" }
  ],
  "enumerations": [
    { "name": "ENUM_OrderStatus", "values": ["Draft", "Submitted", "Approved", "Cancelled"] }
  ]
}
```

- `type`: `String`, `Integer`, `Long`, `Decimal`, `Boolean`, `DateTime`, `Enumeration`,
  `AutoNumber`, `Binary`, `HashString`.
- `multiplicity`: `*-1` (muitos `from` para um `to`), `1-1`, `*-*`. `from` é o dono.
- `onDeleteOfTarget`: `delete` (apaga os `from` junto), `prevent` (bloqueia), `keep` (só desfaz
  o vínculo).
- `generalization` (opcional): `"System.Image"` etc. `to` pode citar entidade de outro módulo
  como `"Modulo.Entidade"`.
