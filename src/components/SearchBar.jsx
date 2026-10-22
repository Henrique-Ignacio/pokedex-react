import '../css/SearchBar.css'

export default function SearchBar({ value, onChange }) {
  return (
    <label className="search-bar">
      <span className="search-bar__label">Buscar Pokémon</span>
      <input
        type="search"
        value={value}
        placeholder="Pesquisar Pokémon... (nome ou ID)"
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
