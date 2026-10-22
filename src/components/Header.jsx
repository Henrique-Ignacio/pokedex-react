import '../css/Header.css'

export default function Header({ view, onChangeView, theme, onToggleTheme, total, shown }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <img
          className="app-header__logo"
          src={`${import.meta.env.BASE_URL}pokeball.png`}
          alt=""
          width="46"
          height="46"
        />
        <div>
          <h1>Pokédex</h1>
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
