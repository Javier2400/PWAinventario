export default function Sidebar({ onSelect, activeModule }: { onSelect: (name: string) => void, activeModule: string }) {
  const modules = [
    { name: "Inventario" },
    { name: "Cobros (Stripe)" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>JAVIERSIP</span>
      </div>
      <nav className="sidebar-nav">
        {modules.map((mod) => (
          <div
            key={mod.name}
            className={`nav-item ${activeModule === mod.name ? "active" : ""}`}
            onClick={() => onSelect(mod.name)}
            style={{ cursor: 'pointer' }}
          >
            <span className="nav-text">{mod.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
