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
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/api";

type Category = "Todos" | "Electrónica" | "Ropa" | "Alimentos" | "Hogar" | "Juguetes";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: Exclude<Category, "Todos">;
  stock: number;
  minStock: number;
  price: number;
  status?: "activo" | "agotado" | "bajo stock";
}

const CATEGORIES: Category[] = ["Todos", "Electrónica", "Ropa", "Alimentos", "Hogar", "Juguetes"];

const statusStyles: Record<string, string> = {
  activo: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  agotado: "bg-red-100 text-red-700 border border-red-200",
  "bajo stock": "bg-amber-100 text-amber-700 border border-amber-200",
};

const statusIcon: Record<string, React.ReactNode> = {
  activo: <CheckCircle2 size={11} />,
  agotado: <AlertCircle size={11} />,
  "bajo stock": <AlertCircle size={11} />,
};

const EMPTY: Product = { id: 0, name: "", sku: "", category: "Electrónica", stock: 0, minStock: 0, price: 0 };

function deriveStatus(stock: number, minStock: number): "activo" | "agotado" | "bajo stock" {
  if (stock === 0) return "agotado";
  if (stock < minStock) return "bajo stock";
  return "activo";
}

export const InventoryView = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>(EMPTY);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const loadProductsData = async () => {
    try {
      const data = await getProducts();
      setProducts(data.map((p: any) => ({
        ...p,
        price: parseFloat(p.price),
        stock: parseInt(p.stock),
        minStock: parseInt(p.minStock || 0),
        status: deriveStatus(parseInt(p.stock), parseInt(p.minStock || 0))
      })));
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    loadProductsData();
  }, []);

  const filtered = products
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Todos" || p.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (typeof av === "string" && typeof bv === "string")
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      if (typeof av === "number" && typeof bv === "number")
        return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
      return 0;
    });

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateProduct(editing.id, form);
      } else {
        await createProduct(form);
      }
      setModalOpen(false);
      loadProductsData();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await deleteProduct(id);
      setDeleteId(null);
      loadProductsData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSort = (field: keyof Product) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const totalActive = products.filter((p) => p.status === "activo").length;
  const totalLow = products.filter((p) => p.status === "bajo stock").length;
  const totalOut = products.filter((p) => p.status === "agotado").length;
  const totalValue = products.reduce((acc, p) => acc + p.stock * p.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Productos Activos", value: totalActive, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Bajo Stock", value: totalLow, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
          { label: "Agotados", value: totalOut, color: "text-red-600", bg: "bg-red-50 border-red-100" },
          { label: "Valor Total", value: `$${totalValue.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, color: "text-fuchsia-900", bg: "bg-white border-zinc-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-md border p-4 ${s.bg}`}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-md border border-zinc-200 p-4 mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex gap-2 flex-wrap flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar producto o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded-[3px] bg-zinc-50 focus:outline-none focus:border-fuchsia-950 focus:ring-1 focus:ring-fuchsia-950 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-[3px] px-2">
            <Filter size={13} className="text-zinc-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="text-xs bg-transparent border-none outline-none text-zinc-700 font-medium py-2 pr-1 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-fuchsia-950 text-white text-xs font-semibold uppercase tracking-widest px-5 py-2 rounded-[3px] hover:bg-fuchsia-900 transition-colors"
        >
          <Plus size={14} />
          Agregar Producto
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                {[
                  { label: "Producto", field: "name" as keyof Product },
                  { label: "SKU", field: "sku" as keyof Product },
                  { label: "Categoría", field: "category" as keyof Product },
                  { label: "Stock", field: "stock" as keyof Product },
                  { label: "Min. Stock", field: "minStock" as keyof Product },
                  { label: "Precio", field: "price" as keyof Product },
                  { label: "Estado", field: "status" as keyof Product },
                ].map((col) => (
                  <th
                    key={col.field}
                    onClick={() => handleSort(col.field)}
                    className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 cursor-pointer select-none hover:text-fuchsia-950 transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      <ArrowUpDown size={10} className="opacity-40" />
                    </span>
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-zinc-400">
                    <Package2 size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Sin resultados</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${i % 2 === 0 ? "" : "bg-zinc-50/40"}`}
                  >
                    <td className="px-4 py-3 font-medium text-zinc-800">{p.name}</td>
                    <td className="px-4 py-3 text-zinc-500 font-mono">{p.sku}</td>
                    <td className="px-4 py-3 text-zinc-600">{p.category}</td>
                    <td className={`px-4 py-3 font-bold ${p.stock === 0 ? "text-red-600" : p.stock < p.minStock ? "text-amber-600" : "text-zinc-800"}`}>
                      {p.stock}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{p.minStock}</td>
                    <td className="px-4 py-3 text-zinc-800 font-medium">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${p.status ? statusStyles[p.status] : ""}`}>
                        {p.status ? statusIcon[p.status] : null}
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-[3px] text-zinc-500 hover:bg-fuchsia-100 hover:text-fuchsia-950 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-1.5 rounded-[3px] text-zinc-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-zinc-50 border-t border-zinc-200 text-[10px] text-zinc-400 font-medium">
          {filtered.length} de {products.length} productos
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg mx-4 rounded-md shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-fuchsia-950 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white text-sm font-semibold uppercase tracking-widest">
                {editing ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: "Nombre del producto", key: "name", type: "text", full: true },
                { label: "SKU", key: "sku", type: "text", full: false },
                { label: "Precio ($)", key: "price", type: "number", full: false },
                { label: "Stock actual", key: "stock", type: "number", full: false },
                { label: "Stock mínimo", key: "minStock", type: "number", full: false },
              ].map(({ label, key, type, full }) => (
                <div key={key} className={full ? "col-span-2" : ""}>
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">{label}</label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-[3px] bg-zinc-50 focus:outline-none focus:border-fuchsia-950 focus:ring-1 focus:ring-fuchsia-950 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Product["category"] }))}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-[3px] bg-zinc-50 focus:outline-none focus:border-fuchsia-950 focus:ring-1 focus:ring-fuchsia-950 transition-colors"
                >
                  {CATEGORIES.filter((c) => c !== "Todos").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-widest border border-zinc-300 text-zinc-600 rounded-[3px] hover:bg-zinc-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.sku}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-widest bg-fuchsia-950 text-white rounded-[3px] hover:bg-fuchsia-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editing ? "Guardar Cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm mx-4 rounded-md shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-red-600 px-6 py-4 flex items-center gap-3">
              <Trash2 size={18} className="text-white" />
              <h2 className="text-white text-sm font-semibold uppercase tracking-widest">Eliminar Producto</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-zinc-600">¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
            </div>
            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-widest border border-zinc-300 text-zinc-600 rounded-[3px] hover:bg-zinc-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteConfirm(deleteId!)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-widest bg-red-600 text-white rounded-[3px] hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
