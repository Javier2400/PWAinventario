export default function Sidebar({ onSelect, activeModule }: { onSelect: (name: string) => void, activeModule: string }) {
  const modules = [
    { name: "Ventas" },
    { name: "Compras" },
    { name: "Inventarios" },
    { name: "Cuentas por cobrar" },
    { name: "Cuentas por pagar" },
    { name: "Cobros (Stripe)" },
    { name: "Bancos" },
    { name: "Nómina" },
    { name: "Contabilidad" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>MICROSIP</span>
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
