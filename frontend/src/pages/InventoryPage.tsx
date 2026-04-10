import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Filter,
  ArrowUpDown,
  X,
  CheckCircle2,
  AlertCircle,
  Package2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Product } from "../types";

type Category = "Todos" | "Electrónica" | "Ropa" | "Alimentos" | "Hogar" | "Juguetes";

const CATEGORIES: Category[] = ["Todos", "Electrónica", "Ropa", "Alimentos", "Hogar", "Juguetes"];

const statusStylesInline = {
  activo: {
    backgroundColor: '#ecfdf5',
    color: '#047857',
    border: '1px solid #a7f3d0'
  },
  agotado: {
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca'
  },
  "bajo stock": {
    backgroundColor: '#fffbeb',
    color: '#b45309',
    border: '1px solid #fde68a'
  }
};

const EMPTY: Product = { id: 0, name: "", sku: "", category: "Electrónica" as const, stock: 0, minStock: 0, price: 0 };

export function InventoryPage() {
  const { products, loadProducts, addProduct, updateProduct: updateProductCtx, deleteProduct: deleteProductCtx } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>(EMPTY);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Todos" || p.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (typeof av === "string" && typeof bv === "string") return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
      return 0;
    });

  const handleSave = async () => {
    try {
      if (editing) {
        await updateProductCtx(editing.id, form);
      } else {
        await addProduct(form);
      }
      setModalOpen(false);
      setEditing(null);
      setForm(EMPTY);
      loadProducts();
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await deleteProductCtx(id);
      setDeleteId(null);
      loadProducts();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const totalActive = products.filter((p) => p.status === "activo").length;
  const totalLow = products.filter((p) => p.status === "bajo stock").length;
  const totalOut = products.filter((p) => p.status === "agotado").length;
  const totalValue = products.reduce((acc, p) => acc + p.stock * p.price, 0);

  const styles = {
    main: {
      padding: isLargeScreen ? '32px' : '24px',
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box' as const
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: isLargeScreen ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: (bg: string) => ({
      backgroundColor: bg === 'bg-white border-zinc-200' ? 'white' : 
                     bg.includes('emerald') ? '#f0fdf4' : 
                     bg.includes('amber') ? '#fffbeb' : '#fef2f2',
      border: '1px solid #e4e4e7',
      borderRadius: '8px',
      padding: '16px'
    }),
    statLabel: {
      fontSize: '10px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      color: '#71717a',
      marginBottom: '4px'
    },
    statValue: (color: string) => ({
      fontSize: '24px',
      fontWeight: 700,
      color: color.includes('emerald') ? '#059669' : 
             color.includes('amber') ? '#d97706' : 
             color.includes('red') ? '#dc2626' : '#4a044e'
    }),
    toolbar: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e4e4e7',
      padding: '16px',
      marginBottom: '16px',
      display: 'flex',
      flexDirection: (isLargeScreen ? 'row' : 'column') as any,
      gap: '12px',
      alignItems: isLargeScreen ? 'center' : 'stretch',
      justifyContent: 'space-between'
    },
    searchBox: {
      position: 'relative' as const,
      flex: 1,
      minWidth: '200px'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '36px',
      paddingRight: '12px',
      paddingTop: '8px',
      paddingBottom: '8px',
      fontSize: '14px',
      border: '1px solid #e4e4e7',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      outline: 'none',
      boxSizing: 'border-box' as const
    },
    filterSelect: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: '#f9fafb',
      border: '1px solid #e4e4e7',
      borderRadius: '8px',
      padding: '0 8px'
    },
    addButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      backgroundColor: '#09090b',
      color: 'white',
      fontSize: '14px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      padding: '8px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e4e4e7',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const
    },
    th: {
      textAlign: 'left' as const,
      padding: '12px 16px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      color: '#71717a',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e4e4e7',
      cursor: 'pointer'
    },
    td: {
      padding: '12px 16px',
      fontSize: '14px',
      borderBottom: '1px solid #f4f4f5'
    },
    statusBadge: (status: string) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.025em',
      ...statusStylesInline[(status || 'activo') as keyof typeof statusStylesInline]
    }),
    modalOverlay: {
      position: 'fixed' as const,
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      padding: '16px'
    },
    modalContent: {
      backgroundColor: 'white',
      width: '100%',
      maxWidth: '512px',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid #e4e4e7',
      overflow: 'hidden',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column' as const
    },
    modalHeader: (bg: string) => ({
      backgroundColor: bg === 'primary' ? '#09090b' : '#ef4444',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'white'
    }),
    modalBody: {
      padding: '24px',
      overflowY: 'auto' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px'
    },
    label: {
      display: 'block',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.025em',
      color: '#71717a',
      marginBottom: '4px'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #e4e4e7',
      borderRadius: '8px',
      backgroundColor: '#fafafa',
      outline: 'none',
      boxSizing: 'border-box' as const
    },
    modalFooter: {
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      borderTop: '1px solid #e4e4e7'
    },
    buttonCancel: {
      padding: '8px 20px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      backgroundColor: 'transparent',
      border: '1px solid #d4d4d8',
      borderRadius: '8px',
      cursor: 'pointer'
    },
    buttonSave: (disabled: boolean) => ({
      padding: '8px 20px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      backgroundColor: '#09090b',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    })
  };

  return (
    <main style={styles.main}>
      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Productos Activos", value: totalActive, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Bajo Stock", value: totalLow, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
          { label: "Agotados", value: totalOut, color: "text-red-600", bg: "bg-red-50 border-red-100" },
          { label: "Valor Total", value: `$${totalValue.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, color: "text-fuchsia-900", bg: "bg-white border-zinc-200" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard(s.bg)}>
            <p style={styles.statLabel}>{s.label}</p>
            <p style={styles.statValue(s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
          <div style={styles.searchBox}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa' }} />
            <input
              type="text"
              placeholder="Buscar producto o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterSelect}>
            <Filter size={13} color="#a1a1aa" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              style={{ fontSize: '12px', backgroundColor: 'transparent', border: 'none', outline: 'none', padding: '8px 4px', cursor: 'pointer', fontWeight: 500 }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => { setEditing(null); setForm(EMPTY); setModalOpen(true); }}
          style={styles.addButton}
        >
          <Plus size={14} />
          Agregar Producto
        </button>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                {[
                  { label: "Producto", field: "name" },
                  { label: "SKU", field: "sku" },
                  { label: "Categoría", field: "category" },
                  { label: "Stock", field: "stock" },
                  { label: "Min. Stock", field: "minStock" },
                  { label: "Precio", field: "price" },
                  { label: "Estado", field: "status" },
                ].map((col) => (
                  <th
                    key={col.field}
                    style={styles.th}
                    onClick={() => {
                      if (sortField === col.field) setSortAsc(!sortAsc);
                      else {
                        setSortField(col.field as keyof Product);
                        setSortAsc(true);
                      }
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {col.label}
                      <ArrowUpDown size={10} style={{ opacity: 0.5 }} />
                    </span>
                  </th>
                ))}
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '64px 0', color: '#a1a1aa' }}>
                    <Package2 size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>Sin resultados</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                    <td style={{ ...styles.td, fontWeight: 500 }}>{p.name}</td>
                    <td style={{ ...styles.td, color: '#71717a', fontFamily: 'monospace' }}>{p.sku}</td>
                    <td style={{ ...styles.td, color: '#52525b' }}>{p.category}</td>
                    <td style={{ ...styles.td, fontWeight: 700, color: p.stock === 0 ? '#ef4444' : p.stock < p.minStock ? '#f59e0b' : '#09090b' }}>
                      {p.stock}
                    </td>
                    <td style={{ ...styles.td, color: '#71717a' }}>{p.minStock}</td>
                    <td style={{ ...styles.td, fontWeight: 500 }}>${p.price.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge(p.status || 'activo')}>
                        {p.status === 'activo' && <CheckCircle2 size={12} />}
                        {(p.status === 'agotado' || p.status === 'bajo stock') && <AlertCircle size={12} />}
                        {p.status || 'activo'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => { setEditing(p); setForm(p); setModalOpen(true); }}
                          style={{ padding: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '8px', color: '#71717a' }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          style={{ padding: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '8px', color: '#71717a' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '8px 16px', backgroundColor: '#f9fafb', borderTop: '1px solid #e4e4e7', fontSize: '12px', color: '#a1a1aa', fontWeight: 500 }}>
          {filtered.length} de {products.length} productos
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader('primary')}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
                {editing ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ backgroundColor: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div>
                <label style={styles.label}>Nombre del producto</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  style={styles.input}
                  placeholder="Ej. Laptop Dell XPS 13"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={styles.label}>SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({...form, sku: e.target.value})}
                    style={styles.input}
                    placeholder="DELL-XPS13-2023"
                  />
                </div>
                <div>
                  <label style={styles.label}>Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({...form, price: parseFloat(e.target.value) || 0})}
                    style={styles.input}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={styles.label}>Stock actual</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({...form, stock: parseInt(e.target.value) || 0})}
                    style={styles.input}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label style={styles.label}>Stock mínimo</label>
                  <input
                    type="number"
                    value={form.minStock}
                    onChange={(e) => setForm({...form, minStock: parseInt(e.target.value) || 0})}
                    style={styles.input}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label style={styles.label}>Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value as Product['category']})}
                  style={styles.input}
                >
                  <option value="Electrónica">Electrónica</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Hogar">Hogar</option>
                  <option value="Juguetes">Juguetes</option>
                </select>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => setModalOpen(false)} style={styles.buttonCancel}>Cancelar</button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.sku.trim()}
                style={styles.buttonSave(!form.name.trim() || !form.sku.trim())}
              >
                {editing ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: '384px' }}>
            <div style={styles.modalHeader('destructive')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Trash2 size={20} color="white" />
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Eliminar producto</h2>
              </div>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', color: '#52525b', margin: 0 }}>¿Estás seguro? Esta acción no se puede deshacer.</p>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => setDeleteId(null)} style={styles.buttonCancel}>Cancelar</button>
              <button
                onClick={() => handleDeleteConfirm(deleteId)}
                style={{ ...styles.buttonSave(false), backgroundColor: '#ef4444' }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
