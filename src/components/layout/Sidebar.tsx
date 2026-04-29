import { navItems, PageKey } from '../../app/navigation';

type Props = {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
};

export function Sidebar({ activePage, onNavigate }: Props) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">RS</div>
        <div className="logo-title">
  LA BORNE CHURCH
  <span>CAPE DURBANVILLE</span>
</div>
      </div>

      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              className={`nav-button ${activePage === item.key ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
