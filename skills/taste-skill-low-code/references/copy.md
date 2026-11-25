# Copy

Diga o que é e o que faz, em palavras que um usuário novo entende em cinco segundos. As regras
são as do taste-skill original, aplicadas a texto de aplicação: títulos, rótulos, botões,
mensagens. No low-code, o texto mora no sistema de tradução da plataforma (*Languages* no
Mendix), nunca fixo dentro de uma expressão ou de CSS.

## Cinco regras

1. **O título da página nomeia a coisa ou a tarefa,** em 1 a 5 palavras: "Pedidos", "Pedido
   10482", "Criar pedido". Nunca "Bem-vindo", "Visão geral" sozinho ou "Dashboard".
2. **A primeira tela traz um fato do dado:** uma contagem, um status, um valor, uma data.
3. **Todo título de seção tem um substantivo que nomeia uma coisa:** "Itens do pedido",
   "Endereço de entrega", "Histórico". Nunca "Informações", "Detalhes" ou "Outros" sozinhos.
4. **Botão é verbo + objeto,** 1 a 4 palavras: "Criar pedido", "Enviar para aprovação",
   "Exportar lista". Nunca "OK", "Sim", "Enviar", "Clique aqui", "Saiba mais". Em confirmação,
   o botão repete a ação: "Excluir pedido" / "Manter pedido".
5. **Um nome por conceito no app inteiro.** Se é "pedido" no menu, é "pedido" no título, no
   botão, na mensagem e na coluna. O nome vem do negócio, não do domain model.

## Rótulos e campos

- Rótulo curto, sem dois-pontos, sentence case: "Data de entrega". O rótulo fica acima do campo.
- Placeholder mostra formato, nunca substitui o rótulo: "dd/mm/aaaa".
- Texto de ajuda só quando evita um erro provável, numa linha sob o campo.
- Colunas de grade: o substantivo mais curto que não perde sentido; unidade no cabeçalho
  ("Total (R$)"), não em cada célula.
- Datas, números e moeda no formato do idioma do usuário, um formato só por tipo de dado.

## Mensagens

| Momento | Forma | Exemplo |
|---|---|---|
| Validação de campo | o que fazer, sob o campo | "Informe a data de entrega." |
| Validação de regra | o que impede e como resolver | "O pedido precisa de pelo menos um item para ser enviado." |
| Erro de sistema | o que falhou, o que o usuário pode fazer | "Não foi possível salvar o pedido. Tente de novo em alguns minutos." |
| Confirmação destrutiva | o que acontece, sem "tem certeza?" | "O pedido 10482 e seus 3 itens serão excluídos." |
| Sucesso | o que aconteceu, só quando não é visível na tela | "Pedido enviado para aprovação." |
| Vazio | o que aparece aqui e como começar | "Nenhum pedido ainda. Crie o primeiro pedido." |
| Filtro sem resultado | o que foi buscado e a saída | "Nenhum pedido com status Cancelado em março." |

Nunca culpe o usuário, nunca mostre código de erro sem explicação, nunca "Ops!", "Algo deu
errado" ou ponto de exclamação. A mensagem padrão da plataforma é sempre substituída.

## Proibido

- Texto de template deixado na tela: "Lorem ipsum", "Title", "New item", "Button", "Text".
- Nomes do modelo vazando para a interface: `OrderLine_Order`, `ENUM_OrderStatus`, "IsUrgent".
- Jargão de sistema: "registro", "objeto", "entidade", "commit", "microflow".
- Enfeite de marketing dentro do app: "poderoso", "inteligente", "simples e rápido", emoji.
- Dados inventados apresentados como reais. Dado de exemplo é plausível, marcado como exemplo no
  blueprint e removido antes da entrega.
- Caixa alta para ênfase; dois-pontos no fim de rótulo; reticências em botão que não abre outro
  passo.
