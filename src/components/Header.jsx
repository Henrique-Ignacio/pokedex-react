import '../css/Header.css'

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
  </svg>
)

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

      <button
        type="button"
        className="app-header__theme"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  )
}
