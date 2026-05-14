"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Loader2,
  RefreshCw,
  UserCheck,
  UserX,
  Crown,
  Mail,
  Phone,
  ShoppingBag,
} from "lucide-react";

interface CustomerRow {
  type: "registered" | "guest";
  id: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  email_confirmed: boolean;
  last_sign_in_at: string | null;
  newsletter_opt_in: boolean;
  order_count: number;
  total_spent: number;
  last_order_at: string | null;
  is_vip: boolean;
}

interface StatsRow {
  total: number;
  registered: number;
  guests: number;
  vip: number;
  with_orders: number;
}

type FilterTab = "all" | "registered" | "guests" | "vip" | "no_orders";

const TAB_LABEL: Record<FilterTab, string> = {
  all: "Tutti",
  registered: "Registrati",
  guests: "Guest",
  vip: "VIP (€500+)",
  no_orders: "Solo iscritti",
};

export function CustomersAdminSection() {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [stats, setStats] = useState<StatsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/customers", { cache: "no-store" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Errore");
      setRows(body.data ?? []);
      setStats(body.stats ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    let out = rows;
    if (tab === "registered") out = out.filter((r) => r.type === "registered");
    else if (tab === "guests") out = out.filter((r) => r.type === "guest");
    else if (tab === "vip") out = out.filter((r) => r.is_vip);
    else if (tab === "no_orders") out = out.filter((r) => r.order_count === 0);

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (r) =>
          r.email.includes(q) ||
          (r.full_name ?? "").toLowerCase().includes(q) ||
          (r.phone ?? "").includes(q),
      );
    }
    return out;
  }, [rows, tab, search]);

  return (
    <div className="space-y-4">
      {/* Header + stats */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2
            className="text-2xl font-semibold text-neutral-900"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Clienti
          </h2>
          {stats && (
            <p className="text-sm text-neutral-500 mt-1">
              {stats.total} totali · {stats.registered} registrati · {stats.guests} guest · {stats.vip} VIP
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca email, nome, telefono…"
            className="px-3 py-1.5 text-sm rounded-lg border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-300 min-w-[220px]"
          />
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
            aria-label="Ricarica"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-lg border border-neutral-200 bg-white overflow-hidden flex-wrap">
        {(["all", "registered", "guests", "vip", "no_orders"] as FilterTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t ? "bg-emerald-900 text-white" : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      {loading && rows.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 bg-white rounded-2xl border border-neutral-100">
          Nessun cliente per i filtri selezionati.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-left">
                  <th className="py-3 px-4 font-medium text-neutral-500 text-xs uppercase tracking-wider">Cliente</th>
                  <th className="py-3 px-4 font-medium text-neutral-500 text-xs uppercase tracking-wider">Tipo</th>
                  <th className="py-3 px-4 font-medium text-neutral-500 text-xs uppercase tracking-wider text-center">Ordini</th>
                  <th className="py-3 px-4 font-medium text-neutral-500 text-xs uppercase tracking-wider text-right">LTV</th>
                  <th className="py-3 px-4 font-medium text-neutral-500 text-xs uppercase tracking-wider">Registrato</th>
                  <th className="py-3 px-4 font-medium text-neutral-500 text-xs uppercase tracking-wider text-center">Newsletter</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={`${c.type}-${c.id ?? c.email}`} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold uppercase shrink-0 ${
                            c.is_vip ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {c.is_vip ? <Crown className="w-4 h-4" /> : c.email.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900 truncate">
                            {c.full_name ?? c.email.split("@")[0]}
                          </p>
                          <p className="text-xs text-neutral-500 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {c.email}
                          </p>
                          {c.phone && (
                            <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" />
                              {c.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {c.type === "registered" ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <UserCheck className="w-3 h-3" />
                          Registrato
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                          <UserX className="w-3 h-3" />
                          Guest
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 text-sm">
                        {c.order_count > 0 ? (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-medium text-neutral-900">{c.order_count}</span>
                          </>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-sm font-semibold tabular-nums ${c.is_vip ? "text-amber-700" : "text-neutral-900"}`}>
                        €{c.total_spent.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-500">
                      {new Date(c.created_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {c.newsletter_opt_in ? (
                        <span className="text-emerald-600">✓</span>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
