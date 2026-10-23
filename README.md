# Pokédex React + Vite

Atividade 03 — Desenvolvimento e Integração de Aplicações Web (PUC Minas).
Pokédex interativa feita com **React + Vite** para explorar os 151 Pokémon de Kanto e seus treinadores.

**Autores:** Henrique Ignacio Ferreira Souza e João Pedro Oliveira Monteiro Moura

## Funcionalidades

- Lista com os 151 Pokémon (ID, nome, tipos e os 6 atributos em cada card)
- Pesquisa por **nome** ou **ID** (atualiza enquanto você digita)
- Filtro por **um ou mais tipos** ao mesmo tempo (mostra os Pokémon que têm qualquer um dos tipos selecionados)
- Detalhes do Pokémon em **modal** com:
  - **cadeia de evolução** com a condição de cada etapa (nível, pedra ou troca); clique em um estágio para abrir os detalhes dele
  - barras de atributos e total
  - **fraquezas, resistências e imunidades** (×4, ×2, ×½, ×¼, ×0), calculadas a partir dos tipos
  - treinadores que o possuem
  - **cartas do Pokémon TCG** (via TCGdex), ordenadas da mais rara para a mais comum
- **Comparação** entre dois Pokémon (botão "Comparar" nos detalhes): atributos lado a lado com o vencedor de cada um e fraquezas/resistências dos dois
- Seção de **Treinadores** com o sprite de cada um (via Pokémon Showdown), insígnias e Pokémon; clique no card para abrir os **detalhes do treinador** (time completo, tipos do time, média de atributos e Pokémon mais forte)
- Mensagem amigável quando nenhum Pokémon é encontrado
- Layout responsivo (desktop, tablet e smartphone)
- Desafios opcionais: **favoritos** (salvos no navegador), **ordenação** por ID, nome e atributos, **Pokémon aleatório**, **tema claro/escuro** (claro por padrão, alternado pelo botão de sol/lua) e **imagens** via PokéAPI

## Como executar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (por padrão **http://localhost:5173**).

Para gerar a versão de produção: `npm run build` (e `npm run preview` para testá-la).

## Dados

Os dados principais ficam em `src/data/pokedex-data.json` (Pokémon, tipos e treinadores) e são importados diretamente pelo `App.jsx`. Não há banco de dados.

Cada treinador tem uma lista `teams` com uma ou mais versões do time. O primeiro time é o padrão, mostrado no card. Quando há mais de um, os detalhes do treinador mostram uma caixa para escolher a versão (o texto da opção é o `label`):

```json
{
  "id": 1,
  "name": "Ash",
  "badges": 9,
  "teams": [
    { "label": "Time principal", "pokemonIds": [25, 3, 6, 9, 131, 143] },
    { "label": "Outra versão", "pokemonIds": [25, 1, 7] }
  ]
}
```

A tabela de efetividade de tipos fica em `src/data/typechart.json`. Ela foi gerada uma única vez a partir de `https://play.pokemonshowdown.com/data/typechart.js` (Pokémon Showdown) e guarda, para cada tipo defensor, o multiplicador de dano recebido de cada tipo de ataque. Como fica salva no projeto, as fraquezas funcionam sem internet.

As cadeias de evolução ficam em `src/data/evolutions.json`, geradas uma única vez a partir da **PokéAPI** (`pokemon-species` e `evolution-chain`). Só entram os 151 de Kanto (por exemplo, o Pikachu aparece sem o Pichu, e o Eevee só com Vaporeon, Jolteon e Flareon), e a condição de cada evolução é a dos jogos Red/Blue.

## Fontes externas

Todas são públicas, sem chave de acesso, e o app continua funcionando se alguma delas estiver fora do ar.

| Fonte | Uso | Endereço |
|---|---|---|
| **PokéAPI** (sprites) | Imagens dos Pokémon, pelo ID | `https://raw.githubusercontent.com/PokeAPI/sprites/...` |
| **TCGdex** (API GraphQL) | Cartas do Pokémon TCG e raridade de cada uma | `https://api.tcgdex.net/v2/graphql` |
| **Pokémon Showdown** | Sprites dos treinadores | `https://play.pokemonshowdown.com/sprites/trainers/<nome>.png` |

- **Imagens dos Pokémon:** se a imagem oficial não carregar, o app tenta o sprite pequeno e, por fim, mostra um placeholder.
- **Cartas TCG:** buscadas pelo número da Pokédex (`dexId`) quando o modal é aberto, com cache em memória para não repetir a requisição. Cartas sem imagem são descartadas. A ordem de raridade é definida em `RARITY_ORDER` (`src/hooks/useTcgCards.js`).
- **Sprites dos treinadores:** o arquivo é o nome do treinador em minúsculas, sem espaços nem pontuação (`Lt. Surge` → `ltsurge`). Treinadores com outro nome nos jogos ficam em `SPRITE_OVERRIDES` (`src/utils/trainers.js`); por exemplo, Gary → `blue`. Se o sprite não existir, aparece a inicial do nome.

A Pokébola do cabeçalho e o favicon usam a imagem local `public/pokeball.png`.

## Organização do projeto

```
public/
└── pokeball.png  logo do cabeçalho e favicon
src/
├── components/   Header, SearchBar, Filters, PokemonList, PokemonCard,
│                 PokemonDetails, PokemonImage, StatBar, TypeBadge,
│                 TypeMatchups, EvolutionChain, TcgCards, CompareModal,
│                 TrainerList, TrainerCard, TrainerDetails, TrainerImage, Badges
├── css/          um arquivo de estilo por componente + App.css
├── data/         pokedex-data.json, typechart.json e evolutions.json
├── hooks/        useLocalStorage (favoritos e tema) e useTcgCards (cartas da TCGdex)
├── utils/        pokemon.js (busca, ordenação, atributos), typeColors.js,
│                 typeMatchups.js (fraquezas e resistências), evolutions.js (cadeias de evolução)
│                 e trainers.js (sprites e estatísticas do time)
├── App.jsx       estado global (busca, filtros, favoritos, modais) e composição
├── main.jsx
└── index.css     variáveis de tema e estilos globais
```

## Conceitos de React utilizados

Componentes funcionais, props, `useState`, `useEffect` (inclusive para buscar dados de API com `fetch` e cancelar com `AbortController`), `useMemo` (lista derivada filtrada/ordenada), renderização de listas com `map()`, eventos, hooks customizados (`useLocalStorage`, `useTcgCards`) e componentização/reutilização (`TypeBadge`, `StatBar`, `PokemonImage`, `Badges`).

## Dependências

`react`, `react-dom`, `vite` e `@vitejs/plugin-react` (todas registradas no `package.json`). As APIs externas são acessadas com o `fetch` nativo do navegador, sem bibliotecas extras. Fontes: Bricolage Grotesque e IBM Plex Sans (Google Fonts, com fallback para fontes do sistema).
