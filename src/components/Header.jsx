import '../css/Header.css'

export default function Header({ view, onChangeView, theme, onToggleTheme, total, shown }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__ball" aria-hidden="true" />
        <div>
          <h1>Pokédex</h1>
          <p>{view === 'pokedex' ? `${shown} de ${total} Pokémon` : 'Treinadores de Kanto'}</p>
        </div>
      </div>

      <nav className="app-header__nav" aria-label="Seções">
        <button
          type="button"
          className={view === 'pokedex' ? 'is-active' : ''}
          aria-current={view === 'pokedex' ? 'page' : undefined}
          onClick={() => onChangeView('pokedex')}
        >
          Pokémon
        </button>
        <button
          type="button"
          className={view === 'trainers' ? 'is-active' : ''}
          aria-current={view === 'trainers' ? 'page' : undefined}
          onClick={() => onChangeView('trainers')}
        >
          Treinadores
        </button>
      </nav>

      <button type="button" className="btn" onClick={onToggleTheme} aria-label="Alternar tema claro/escuro">
        {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
      </button>
    </header>
  )
}
