import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, LogOut, Plus, X, Upload,
  TrendingUp, DollarSign, Archive, ChevronRight, Edit2, Trash2, Eye, EyeOff,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  status: string;
  category: string;
  images: string[];
  sizes: string[] | null;
  fabric_details: string | null;
  shipping_info: string | null;
  created_at: string;
}

interface Order {
  id: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
}

type AdminSection = "dashboard" | "products" | "orders";

// ── Sales chart mock data helper ───────────────────────────────────────────────
function buildChartData(orders: Order[]) {
  const map: Record<string, number> = {};
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    map[d.toISOString().slice(0, 10)] = 0;
  }
  orders.forEach((o) => {
    const day = o.created_at.slice(0, 10);
    if (day in map) map[day] = (map[day] || 0) + Number(o.total_amount);
  });
  return Object.entries(map).map(([date, revenue]) => ({
    date: date.slice(5),
    revenue,
  }));
}

// ── Empty product form ─────────────────────────────────────────────────────────
const emptyForm = {
  name: "",
  description: "",
  price: "",
  sale_price: "",
  stock: "0",
  category: "classics",
  fabric_details: "",
  shipping_info: "",
  sizes: "S,M,L",
  status: "active" as "active" | "draft",
  imageFile: null as File | null,
  imagePreview: "",
};

// ══════════════════════════════════════════════════════════════════════════════
export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [section, setSection] = useState<AdminSection>("dashboard");

  // data
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<{ date: string; revenue: number }[]>([]);

  // product drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Auth check ───────────────────────────────────────────────────────────────
  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/"); return; }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!data) { navigate("/"); return; }
      setIsAdmin(true);
      setLoading(false);
      fetchAll();
    }
    checkAdmin();
  }, [navigate]);

  // ── Data fetching ────────────────────────────────────────────────────────────
  async function fetchAll() {
    const [{ data: prods }, { data: ords }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]);
    setProducts((prods as Product[]) || []);
    const ordList = (ords as Order[]) || [];
    setOrders(ordList);
    setChartData(buildChartData(ordList));
  }

  // ── KPIs ─────────────────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount), 0);
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);

  // ── Product CRUD ─────────────────────────────────────────────────────────────
  function openNewProduct() {
    setEditingProduct(null);
    setForm({ ...emptyForm });
    setDrawerOpen(true);
  }

  function openEditProduct(p: Product) {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      sale_price: p.sale_price ? String(p.sale_price) : "",
      stock: String(p.stock ?? 0),
      category: p.category,
      fabric_details: p.fabric_details || "",
      shipping_info: p.shipping_info || "",
      sizes: (p.sizes || []).join(","),
      status: (p.status === "draft" ? "draft" : "active") as "active" | "draft",
      imageFile: null,
      imagePreview: p.images?.[0] || "",
    });
    setDrawerOpen(true);
  }

  async function handleSubmit() {
    if (!form.name || !form.price) {
      toast.error("Nome e prezzo sono obbligatori");
      return;
    }
    setSubmitting(true);
    try {
      let images: string[] = editingProduct?.images || [];

      // upload image if selected
      if (form.imageFile) {
        const ext = form.imageFile.name.split(".").pop();
        const path = `${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("product-images")
          .upload(path, form.imageFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);
        images = [publicUrl, ...images.slice(1)];
      }

      const payload = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        stock: parseInt(form.stock) || 0,
        category: form.category,
        fabric_details: form.fabric_details || null,
        shipping_info: form.shipping_info || null,
        sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()) : [],
        status: form.status,
        images,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);
        if (error) throw error;
        toast.success("Prodotto aggiornato");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("Prodotto creato");
      }

      setDrawerOpen(false);
      fetchAll();
    } catch (e: unknown) {
      toast.error((e as Error).message || "Errore");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Eliminare questo prodotto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Prodotto eliminato");
    fetchAll();
  }

  async function toggleStatus(p: Product) {
    const newStatus = p.status === "active" ? "draft" : "active";
    await supabase.from("products").update({ status: newStatus }).eq("id", p.id);
    fetchAll();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  // ── Loading / auth guard ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAdmin) return null;

  // ── Sidebar nav items ────────────────────────────────────────────────────────
  const nav = [
    { id: "dashboard" as AdminSection, icon: LayoutDashboard, label: "Dashboard" },
    { id: "products" as AdminSection, icon: Package, label: "Prodotti" },
    { id: "orders" as AdminSection, icon: ShoppingBag, label: "Ordini" },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-emerald-100 text-emerald-800",
    delivered: "bg-emerald-200 text-emerald-900",
    cancelled: "bg-red-100 text-red-800",
  };

  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 lg:p-8" style={{ fontFamily: "var(--font-sans)" }}>
      {/* ── iPad Frame ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl"
        style={{
          background: "#1a1a1a",
          borderRadius: "2.5rem",
          padding: "clamp(12px, 2vw, 20px)",
          boxShadow: "0 0 0 1px #333, 0 40px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
          minHeight: "85vh",
        }}
      >
        {/* Notch bar */}
        <div className="flex items-center justify-center mb-3">
          <div className="w-24 h-1 rounded-full bg-neutral-700" />
        </div>

        {/* Screen */}
        <div
          className="rounded-2xl overflow-hidden flex"
          style={{
            background: "#f9fafb",
            minHeight: "78vh",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)",
          }}
        >
          {/* ── Sidebar ── */}
          <aside className="w-16 lg:w-56 bg-white border-r border-neutral-100 flex flex-col py-6 shrink-0">
            {/* Brand */}
            <div className="px-4 mb-8 hidden lg:block">
              <p className="text-xs tracking-[0.2em] text-neutral-400 uppercase font-sans">Admin</p>
              <h1 style={{ fontFamily: "var(--font-serif)" }} className="text-lg font-semibold text-neutral-900 leading-tight">
                Emeraldress
              </h1>
            </div>
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center">
                <span className="text-white text-xs font-serif font-bold">E</span>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 space-y-1">
              {nav.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                    section === id
                      ? "bg-emerald-950 text-white shadow-sm"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:block text-sm font-medium">{label}</span>
                  {section === id && <ChevronRight className="w-3 h-3 ml-auto hidden lg:block" />}
                </button>
              ))}
            </nav>

            {/* Sign out */}
            <div className="px-2 mt-4">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="hidden lg:block text-sm">Esci</span>
              </button>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">

              {/* ══ DASHBOARD ══════════════════════════════════════════════════ */}
              {section === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-6">
                    <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-2xl font-semibold text-neutral-900">
                      Panoramica
                    </h2>
                    <p className="text-sm text-neutral-400 mt-0.5">Benvenuto nella dashboard di amministrazione</p>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                      {
                        icon: ShoppingBag,
                        label: "Totale Ordini",
                        value: orders.length.toString(),
                        sub: "ordini totali",
                        color: "text-emerald-700",
                        bg: "bg-emerald-50",
                      },
                      {
                        icon: DollarSign,
                        label: "Fatturato",
                        value: `€${totalRevenue.toFixed(2)}`,
                        sub: "ultimi 30 giorni",
                        color: "text-emerald-700",
                        bg: "bg-emerald-50",
                      },
                      {
                        icon: Archive,
                        label: "Prodotti in Stock",
                        value: totalStock.toString(),
                        sub: `su ${products.length} prodotti`,
                        color: "text-emerald-700",
                        bg: "bg-emerald-50",
                      },
                    ].map(({ icon: Icon, label, value, sub, color, bg }) => (
                      <div key={label} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
                        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider font-sans">{label}</p>
                        <p style={{ fontFamily: "var(--font-serif)" }} className="text-2xl font-semibold text-neutral-900 mt-1">{value}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 style={{ fontFamily: "var(--font-serif)" }} className="text-base font-semibold text-neutral-900">
                          Andamento Vendite
                        </h3>
                        <p className="text-xs text-neutral-400">Ultimi 30 giorni</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Fatturato</span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} interval={4} />
                        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(v) => `€${v}`} />
                        <Tooltip
                          contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                          formatter={(v: number) => [`€${v.toFixed(2)}`, "Fatturato"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#064e3b"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 5, fill: "#064e3b", strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* ══ PRODUCTS ═══════════════════════════════════════════════════ */}
              {section === "products" && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-2xl font-semibold text-neutral-900">
                        Prodotti
                      </h2>
                      <p className="text-sm text-neutral-400 mt-0.5">{products.length} prodotti totali</p>
                    </div>
                    <Button
                      onClick={openNewProduct}
                      className="bg-emerald-950 hover:bg-emerald-900 text-white rounded-xl gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" /> Nuovo Prodotto
                    </Button>
                  </div>

                  {/* Products table */}
                  <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-neutral-100">
                            {["Prodotto", "Prezzo", "Stock", "Stato", "Azioni"].map((h) => (
                              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                          {products.map((p) => (
                            <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                              {/* Product */}
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                                    {p.images?.[0] ? (
                                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                        <Package className="w-4 h-4" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-neutral-900 line-clamp-1">{p.name}</p>
                                    <p className="text-xs text-neutral-400 capitalize">{p.category}</p>
                                  </div>
                                </div>
                              </td>
                              {/* Price */}
                              <td className="px-4 py-3">
                                <div>
                                  {p.sale_price ? (
                                    <>
                                      <span className="text-sm font-medium text-emerald-700">€{p.sale_price.toFixed(2)}</span>
                                      <span className="text-xs text-neutral-400 line-through ml-1.5">€{p.price.toFixed(2)}</span>
                                    </>
                                  ) : (
                                    <span className="text-sm font-medium text-neutral-900">€{p.price.toFixed(2)}</span>
                                  )}
                                </div>
                              </td>
                              {/* Stock */}
                              <td className="px-4 py-3">
                                <span className={`text-sm font-medium ${p.stock === 0 ? "text-red-500" : "text-neutral-900"}`}>
                                  {p.stock ?? 0}
                                </span>
                              </td>
                              {/* Status */}
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                                  p.status === "active"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-neutral-100 text-neutral-500"
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${p.status === "active" ? "bg-emerald-500" : "bg-neutral-400"}`} />
                                  {p.status === "active" ? "Attivo" : "Bozza"}
                                </span>
                              </td>
                              {/* Actions */}
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => toggleStatus(p)}
                                    className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                                    title={p.status === "active" ? "Nascondi" : "Pubblica"}
                                  >
                                    {p.status === "active" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={() => openEditProduct(p)}
                                    className="p-1.5 text-neutral-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteProduct(p.id)}
                                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {products.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-4 py-12 text-center text-sm text-neutral-400">
                                Nessun prodotto. Crea il tuo primo prodotto!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══ ORDERS ═════════════════════════════════════════════════════ */}
              {section === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-6">
                    <h2 style={{ fontFamily: "var(--font-serif)" }} className="text-2xl font-semibold text-neutral-900">
                      Ordini
                    </h2>
                    <p className="text-sm text-neutral-400 mt-0.5">{orders.length} ordini totali</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-neutral-100">
                            {["Data", "Cliente", "Totale", "Stato"].map((h) => (
                              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                          {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-neutral-600">
                                {new Date(o.created_at).toLocaleDateString("it-IT")}
                              </td>
                              <td className="px-4 py-3 text-sm text-neutral-900">{o.customer_email}</td>
                              <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                                €{Number(o.total_amount).toFixed(2)}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[o.status] || "bg-neutral-100 text-neutral-600"}`}>
                                  {o.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {orders.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-4 py-12 text-center text-sm text-neutral-400">
                                Nessun ordine ancora
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </div>

        {/* Bottom home indicator */}
        <div className="flex items-center justify-center mt-3">
          <div className="w-32 h-1 rounded-full bg-neutral-700" />
        </div>
      </motion.div>

      {/* ══ Product Drawer (rendered outside iPad, overlays it) ════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                <h3 style={{ fontFamily: "var(--font-serif)" }} className="text-lg font-semibold text-neutral-900">
                  {editingProduct ? "Modifica Prodotto" : "Nuovo Prodotto"}
                </h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-500" />
                </button>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                {/* Image upload */}
                <div>
                  <Label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Immagine Prodotto</Label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="relative w-full h-40 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 hover:bg-emerald-50 transition-colors overflow-hidden"
                  >
                    {form.imagePreview ? (
                      <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-neutral-300 mb-2" />
                        <p className="text-xs text-neutral-400">Clicca per caricare un'immagine</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setForm((f) => ({
                        ...f,
                        imageFile: file,
                        imagePreview: URL.createObjectURL(file),
                      }));
                    }}
                  />
                </div>

                {/* Name */}
                <div>
                  <Label className="text-xs text-neutral-500 uppercase tracking-wider mb-1.5 block">Nome *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="es. Abito Smeraldo"
                    className="rounded-xl border-neutral-200 focus:ring-emerald-600"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="text-xs text-neutral-500 uppercase tracking-wider mb-1.5 block">Descrizione</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Descrizione del prodotto..."
                    rows={3}
                    className="rounded-xl border-neutral-200 resize-none focus:ring-emerald-600"
                  />
                </div>

                {/* Price row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-neutral-500 uppercase tracking-wider mb-1.5 block">Prezzo (€) *</Label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      placeholder="0.00"
                      className="rounded-xl border-neutral-200"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-neutral-500 uppercase tracking-wider mb-1.5 block">Prezzo Scontato (€)</Label>
                    <Input
                      type="number"
                      value={form.sale_price}
                      onChange={(e) => setForm((f) => ({ ...f, sale_price: e.target.value }))}
                      placeholder="Opzionale"
                      className="rounded-xl border-neutral-200"
                    />
                  </div>
                </div>

                {/* Stock & Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-neutral-500 uppercase tracking-wider mb-1.5 block">Stock</Label>
                    <Input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                      className="rounded-xl border-neutral-200"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-neutral-500 uppercase tracking-wider mb-1.5 block">Categoria</Label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="classics">Classics</option>
                      <option value="emerald-touch">Emerald Touch</option>
                    </select>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <Label className="text-xs text-neutral-500 uppercase tracking-wider mb-1.5 block">Taglie (separate da virgola)</Label>
                  <Input
                    value={form.sizes}
                    onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
                    placeholder="XS, S, M, L, XL"
                    className="rounded-xl border-neutral-200"
                  />
                </div>

                {/* Fabric */}
                <div>
                  <Label className="text-xs text-neutral-500 uppercase tracking-wider mb-1.5 block">Composizione Tessuto</Label>
                  <Input
                    value={form.fabric_details}
                    onChange={(e) => setForm((f) => ({ ...f, fabric_details: e.target.value }))}
                    placeholder="es. 100% Lino Biologico"
                    className="rounded-xl border-neutral-200"
                  />
                </div>

                {/* Shipping */}
                <div>
                  <Label className="text-xs text-neutral-500 uppercase tracking-wider mb-1.5 block">Info Spedizione</Label>
                  <Input
                    value={form.shipping_info}
                    onChange={(e) => setForm((f) => ({ ...f, shipping_info: e.target.value }))}
                    placeholder="es. Spedizione gratuita in 2-3 giorni"
                    className="rounded-xl border-neutral-200"
                  />
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between py-3 px-4 bg-neutral-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Prodotto Attivo</p>
                    <p className="text-xs text-neutral-400">Visibile sulla piattaforma</p>
                  </div>
                  <Switch
                    checked={form.status === "active"}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, status: v ? "active" : "draft" }))}
                    className="data-[state=checked]:bg-emerald-700"
                  />
                </div>
              </div>

              {/* Drawer footer */}
              <div className="px-6 py-4 border-t border-neutral-100 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 rounded-xl border-neutral-200"
                >
                  Annulla
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-emerald-950 hover:bg-emerald-900 text-white rounded-xl"
                >
                  {submitting ? "Salvataggio..." : editingProduct ? "Aggiorna" : "Crea Prodotto"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
