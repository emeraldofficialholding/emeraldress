"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, RefreshCw, Euro } from "lucide-react";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface ReturnItemRow {
  id: string;
  quantity: number;
  reason: string | null;
  refund_amount: number;
  order_items?: { product_name?: string | null; size?: string | null; unit_price?: number | null } | null;
}

interface OrderJoin {
  id: string;
  order_number: string | null;
  customer_email: string | null;
  customer_name: string | null;
  total_amount: number;
  payment_id: string | null;
}

interface ReturnRow {
  id: string;
  order_id: string;
  status: "requested" | "approved" | "rejected" | "refunded";
  reason: string | null;
  customer_notes: string | null;
  admin_notes: string | null;
  estimated_refund: number | null;
  requested_at: string;
  approved_at: string | null;
  refunded_at: string | null;
  orders: OrderJoin | null;
  return_items: ReturnItemRow[];
}

type FilterStatus = "all" | "requested" | "approved" | "rejected" | "refunded";

const STATUS_STYLES: Record<ReturnRow["status"], string> = {
  requested: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-blue-50 text-blue-800 border-blue-200",
  rejected: "bg-rose-50 text-rose-800 border-rose-200",
  refunded: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

const STATUS_LABEL: Record<ReturnRow["status"], string> = {
  requested: "Da approvare",
  approved: "Approvato",
  rejected: "Rifiutato",
  refunded: "Rimborsato",
};

export function ReturnsAdminSection() {
  const [filter, setFilter] = useState<FilterStatus>("requested");
  const [rows, setRows] = useState<ReturnRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/admin/returns${filter !== "all" ? `?status=${filter}` : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Errore");
      setRows(body.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Realtime: nuova richiesta reso → refetch + toast + badge "NUOVO" 8s
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("admin-returns-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "returns" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          const r = payload.new;
          if (!r) return;
          // Refetch (la lista è con JOIN, non posso ricostruire il payload completo)
          void fetchData();
          setFreshIds((prev) => new Set(prev).add(r.id));
          setTimeout(() => {
            setFreshIds((prev) => {
              const next = new Set(prev);
              next.delete(r.id);
              return next;
            });
          }, 8000);
          toast.success("🆕 Nuova richiesta reso", {
            description: `Rimborso stimato: €${Number(r.estimated_refund ?? 0).toFixed(2)}`,
            duration: 6000,
          });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const handleAction = async (
    returnId: string,
    action: "approve" | "reject" | "complete",
    confirmMessage?: string,
  ) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    const adminNotes =
      action === "reject" || action === "approve"
        ? window.prompt(action === "reject" ? "Motivo del rifiuto (verrà inviato al cliente):" : "Note interne (opzionali):")
        : null;
    if (action === "reject" && !adminNotes) return; // motivazione obbligatoria su rifiuto

    setActingId(returnId);
    try {
      const res = await fetch(`/api/admin/returns/${returnId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, admin_notes: adminNotes }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Errore");
      void fetchData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Errore");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900" style={{ fontFamily: "var(--font-serif)" }}>
            Gestione resi
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Approva, rifiuta e completa i resi con rimborso Stripe automatico
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-neutral-200 bg-white overflow-hidden">
            {(["requested", "approved", "refunded", "rejected", "all"] as FilterStatus[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f ? "bg-emerald-900 text-white" : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {f === "all" ? "Tutti" : STATUS_LABEL[f as ReturnRow["status"]]}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Lista resi */}
      {loading && rows.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 bg-white rounded-2xl border border-neutral-100">
          Nessun reso nello stato selezionato.
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const orderNum = r.orders?.order_number ?? r.order_id.slice(0, 8);
            const totalItems = r.return_items.reduce((a, i) => a + i.quantity, 0);
            const isFresh = freshIds.has(r.id);
            return (
              <li
                key={r.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
                  isFresh ? "border-emerald-400 ring-2 ring-emerald-100 animate-pulse" : "border-neutral-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {isFresh && (
                        <span className="inline-flex items-center text-[9px] tracking-[0.2em] uppercase px-1.5 py-0.5 rounded-full bg-emerald-700 text-white font-bold">
                          Nuovo
                        </span>
                      )}
                      <span className={`inline-flex items-center text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border ${STATUS_STYLES[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {new Date(r.requested_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <p className="font-mono text-sm text-neutral-900 font-medium">{orderNum}</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      {r.orders?.customer_name ?? "—"} · {r.orders?.customer_email ?? "—"}
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">
                      {totalItems} {totalItems === 1 ? "articolo" : "articoli"}: {r.return_items.map((i) => `${i.quantity}× ${i.order_items?.product_name ?? "?"} (${i.order_items?.size ?? "?"})`).join(", ")}
                    </p>
                    {r.customer_notes && (
                      <p className="text-xs italic text-neutral-600 mt-2">
                        <strong>Note cliente:</strong> {r.customer_notes}
                      </p>
                    )}
                    {r.admin_notes && (
                      <p className="text-xs italic text-emerald-700/80 mt-1">
                        <strong>Note admin:</strong> {r.admin_notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-neutral-400">Rimborso stimato</p>
                      <p className="text-xl font-semibold text-emerald-900" style={{ fontFamily: "var(--font-serif)" }}>
                        €{Number(r.estimated_refund ?? 0).toFixed(2)}
                      </p>
                    </div>

                    {r.status === "requested" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(r.id, "reject")}
                          disabled={actingId === r.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs hover:bg-rose-50 disabled:opacity-60"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Rifiuta
                        </button>
                        <button
                          onClick={() => handleAction(r.id, "approve")}
                          disabled={actingId === r.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-700 disabled:opacity-60"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approva
                        </button>
                      </div>
                    )}

                    {r.status === "approved" && (
                      <button
                        onClick={() =>
                          handleAction(
                            r.id,
                            "complete",
                            `Confermi il rimborso di €${Number(r.estimated_refund ?? 0).toFixed(2)} via Stripe? L'operazione è irreversibile.`,
                          )
                        }
                        disabled={actingId === r.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs hover:bg-emerald-800 disabled:opacity-60"
                      >
                        {actingId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Euro className="w-3.5 h-3.5" />}
                        Rimborsa
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
