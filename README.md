# Pokédex React + Vite

Atividade 03 — Desenvolvimento e Integração de Aplicações Web (PUC Minas).
Pokédex interativa feita com **React + Vite** para explorar os 151 Pokémon de Kanto e seus treinadores.

**Autores:** Henrique Ignacio Ferreira Souza e João Pedro Oliveira Monteiro Moura

## Funcionalidades

- Lista com os 151 Pokémon (ID, nome, tipos e os 6 atributos em cada card)
- Pesquisa por **nome** ou **ID** (atualiza enquanto você digita)
- Filtro por **tipo** (usa os tipos presentes no `pokedex-data.json`)
- Detalhes do Pokémon em **modal** com barras de atributos, total e treinadores que o possuem
- Seção de **Treinadores** (nome, insígnias e Pokémon de cada um; clique no Pokémon para abrir os detalhes)
- Mensagem amigável quando nenhum Pokémon é encontrado
- Layout responsivo (desktop, tablet e smartphone)
- Desafios opcionais: **favoritos** (salvos no navegador), **ordenação** por ID, nome e atributos, **Pokémon aleatório**, **tema claro/escuro** e **imagens** via PokéAPI

## Como executar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (por padrão **http://localhost:5173**).

Para gerar a versão de produção: `npm run build` (e `npm run preview` para testá-la).

## Dados

Os dados ficam em `src/data/pokedex-data.json` (Pokémon, tipos e treinadores) e são importados diretamente pelo `App.jsx`. Não há banco de dados nem chamada de API para os dados.

## Imagens (fonte externa, opcional)

As imagens vêm do repositório de sprites da **PokéAPI**
(`https://raw.githubusercontent.com/PokeAPI/sprites/...`), usando o ID do Pokémon. Se a imagem não carregar, o app tenta o sprite pequeno e, por fim, mostra um placeholder — ou seja, a Pokédex continua funcionando sem rede.

## Organização do projeto

```
src/
├── components/   Header, SearchBar, Filters, PokemonList, PokemonCard,
│                 PokemonDetails, PokemonImage, StatBar, TypeBadge,
│                 TrainerList, TrainerCard
├── css/          um arquivo de estilo por componente + App.css
├── data/         pokedex-data.json
├── hooks/        useLocalStorage (favoritos e tema)
├── utils/        pokemon.js (busca, ordenação, atributos) e typeColors.js
├── App.jsx       estado global (busca, filtros, favoritos, modal) e composição
├── main.jsx
└── index.css     variáveis de tema e estilos globais
```

## Conceitos de React utilizados

Componentes funcionais, props, `useState`, `useEffect`, `useMemo` (lista derivada filtrada/ordenada), renderização de listas com `map()`, eventos, hook customizado e componentização/reutilização (`TypeBadge`, `StatBar`, `PokemonImage`).

## Dependências

`react`, `react-dom`, `vite` e `@vitejs/plugin-react` (todas registradas no `package.json`). Fontes: Bricolage Grotesque e IBM Plex Sans (Google Fonts, com fallback para fontes do sistema).
