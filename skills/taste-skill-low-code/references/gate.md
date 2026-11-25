# O gate final

No taste-skill original o gate abre a página num navegador e mede. Num app low-code a tela vive
dentro do modelo da plataforma, então o gate tem duas metades: o que os scripts conseguem medir
em arquivos, e o que é conferido à mão no app em execução ou em prints. Nenhuma entrega é
declarada pronta sem a linha do gate.

## Metade 1: scripts

```bash
node <skill>/scripts/check-theme.mjs <pasta>        # pasta do app, de theme/ ou de themesource/<módulo>
node <skill>/scripts/domain-model.mjs lint modelo.json
```

`check-theme.mjs` lê todo `.scss` e todo `design-properties.json` sob a pasta (ignora
`atlas_core` e outros módulos de terceiros, a menos que a pasta apontada seja a deles) e emite:

| Id | Nível | O que acusa |
|---|---|---|
| `instance-selector` | FAIL | seletor `.mx-name-*`: estilo de uma instância, não de um padrão |
| `important` | FAIL | `!important` |
| `raw-colour` | FAIL | cor literal (hex, rgb, hsl) fora dos arquivos de tokens |
| `violet` | FAIL | cor com matiz entre 250° e 310° em qualquer arquivo |
| `off-scale` | FAIL | margin, padding ou gap em px fora da escala 0, 1, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96 |
| `small-type` | FAIL | `font-size` abaixo de 13px |
| `pure-black` | WARN | `#000` como cor |
| `transition-all` | WARN | `transition: all` |
| `dp-json` | FAIL | `design-properties.json` inválido ou propriedade sem nome, tipo ou classe |
| `dp-class-missing` | FAIL | design property aponta para classe que nenhum SCSS define |
| `dp-orphan-class` | WARN | classe `tk-*` definida mas sem design property que a exponha |

Arquivos de tokens são `_tokens.scss`, `custom-variables*.scss` e `exclusion-variables*.scss`.
Uma linha com `// tk-allow: <motivo>` é dispensada da checagem; cada dispensa vai para o
relatório com o motivo. Nunca edite o script nem esconda arquivos para passar.

`domain-model.mjs lint`: ver `domain-model.md`. FAIL bloqueia; WARN é corrigido ou justificado.

## Metade 2: no app

Com o app rodando (ou com prints em 1440, 1024, 768 e 390 de cada página), leia cada tela contra
a checklist de `SKILL.md` seção 5. O que os scripts não veem e precisa de olhos:

1. **Hard code escondido no modelo.** Peça ao desenvolvedor (ou confira no Studio Pro): busca
   avançada por widgets com a propriedade *Style* preenchida e por uso do campo *Class*; nenhum
   HTML/JavaScript Snippet desenhando tela. Cada ocorrência é FAIL até virar design property.
2. **Reuso.** Um mesmo arranjo em mais de duas páginas sem building block ou snippet é FAIL.
3. **Primeira tela** de cada página: título, fato, ação principal visíveis sem rolar.
4. **Bordas** e colunas alinhadas; nenhuma rolagem lateral em 390.
5. **Estados:** abra cada lista vazia, com filtro sem resultado e com erro simulado.
6. **Teclado:** percorra uma página de cada template só com Tab; o foco sempre aparece.
7. **Roles:** entre com cada user role; nada quebra, nada vaza.
8. **Diagrama** do domain model no Studio Pro: sem linhas cruzadas, mestres no topo.

## A linha do gate

- `GATE: PASS`: scripts sem FAIL e a metade 2 conferida no app em execução.
- `GATE: OPEN`: restam FAILs depois de três rodadas; cada um listado com o motivo.
- `GATE: NÃO VERIFICADO`: a metade 2 não pôde ser feita (sem acesso ao app nem a prints). Diga
  exatamente o que falta conferir e por quem. Nunca escreva PASS sem ter visto o app.
- `GATE: DONE "<o que o usuário disse>"`: o usuário mandou parar ou entregar como está; os FAILs
  em aberto seguem no relatório.
