"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Eye,
  Users,
  ShoppingBag,
  Euro,
  TrendingUp,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface DailyPoint {
  date: string;
  visits: number;
  unique_visitors: number;
  orders: number;
  revenue: number;
}

interface TopPage {
  page_path: string;
  views: number;
  unique_visitors: number;
}

interface AnalyticsSummary {
  visits_today: number;
  visits_7d: number;
  visits_30d: number;
  visits_total: number;
  unique_visitors_today: number;
  unique_visitors_7d: number;
  unique_visitors_30d: number;
  unique_visitors_total: number;
  orders_today: number;
  orders_7d: number;
  orders_30d: number;
  orders_total: number;
  revenue_today: number;
  revenue_7d: number;
  revenue_30d: number;
  revenue_total: number;
  daily_trend: DailyPoint[];
  top_pages: TopPage[];
  funnel: {
    total_visits: number;
    unique_visitors: number;
    pdp_visits: number;
    collection_visits: number;
    checkout_attempts: number;
    orders_completed: number;
  };
}

type Period = 7 | 30 | 90;

const PERIOD_LABEL: Record<Period, string> = {
  7: "7 giorni",
  30: "30 giorni",
  90: "90 giorni",
};

function formatEur(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<Period>(30);
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics?days=${period}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Errore" }));
        throw new Error(body.error || "Caricamento fallito");
      }
      const json = await res.json();
      setData(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const kpis = useMemo(() => {
    if (!data) return null;
    const key = period === 7 ? "7d" : period === 30 ? "30d" : "30d";
    return {
      visits: (data[`visits_${key}` as keyof AnalyticsSummary] as number) ?? 0,
      uniqueVisitors:
        (data[`unique_visitors_${key}` as keyof AnalyticsSummary] as number) ?? 0,
      orders: (data[`orders_${key}` as keyof AnalyticsSummary] as number) ?? 0,
      revenue: (data[`revenue_${key}` as keyof AnalyticsSummary] as number) ?? 0,
    };
  }, [data, period]);

  const conversionRate = useMemo(() => {
    if (!kpis || kpis.uniqueVisitors === 0) return 0;
    return (kpis.orders / kpis.uniqueVisitors) * 100;
  }, [kpis]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2
            className="text-2xl font-semibold text-neutral-900"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Analytics
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Visite reali del sito · dati interni Supabase
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="inline-flex rounded-lg border border-neutral-200 bg-white overflow-hidden">
            {([7, 30, 90] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  period === p
                    ? "bg-emerald-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {PERIOD_LABEL[p]}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
            aria-label="Ricarica"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!data && loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
        </div>
      )}

      {data && kpis && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <KpiCard
              icon={Eye}
              label="Visite"
              value={kpis.visits.toLocaleString("it-IT")}
              sub={`${data.visits_today.toLocaleString("it-IT")} oggi`}
              color="emerald"
            />
            <KpiCard
              icon={Users}
              label="Visitatori unici"
              value={kpis.uniqueVisitors.toLocaleString("it-IT")}
              sub={`${data.unique_visitors_today.toLocaleString("it-IT")} oggi`}
              color="blue"
            />
            <KpiCard
              icon={ShoppingBag}
              label="Ordini"
              value={kpis.orders.toLocaleString("it-IT")}
              sub={`${data.orders_today.toLocaleString("it-IT")} oggi`}
              color="amber"
            />
            <KpiCard
              icon={Euro}
              label="Fatturato"
              value={formatEur(kpis.revenue)}
              sub={`${formatEur(data.revenue_today)} oggi`}
              color="green"
            />
          </div>

          {/* Conversion rate banner */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-900 text-white flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-700/70 font-medium">
                    Conversion rate
                  </p>
                  <p
                    className="text-2xl font-semibold text-emerald-950"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {conversionRate.toFixed(2)}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-emerald-900/60">
                {kpis.orders} ordini su {kpis.uniqueVisitors} visitatori unici (
                {PERIOD_LABEL[period]})
              </p>
            </div>
          </div>

          {/* Trend chart */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
            <h3
              className="text-sm font-medium text-neutral-900 mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Andamento giornaliero
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.daily_trend.slice(-period)}>
                  <defs>
                    <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDateShort}
                    tick={{ fontSize: 10, fill: "#737373" }}
                    stroke="#e5e5e5"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#737373" }}
                    stroke="#e5e5e5"
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid #e5e5e5",
                      fontSize: "0.75rem",
                    }}
                    labelFormatter={(d) => `Giorno: ${formatDateShort(d)}`}
                  />
                  <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    name="Visite"
                    stroke="#059669"
                    fill="url(#visitsGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="unique_visitors"
                    name="Visitatori unici"
                    stroke="#3b82f6"
                    fill="url(#visitorsGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Funnel + Top pages: 2 colonne lg, 1 mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Funnel */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
              <h3
                className="text-sm font-medium text-neutral-900 mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Funnel conversione (30 giorni)
              </h3>
              <FunnelRow
                label="Visite totali"
                value={data.funnel.total_visits}
                max={data.funnel.total_visits}
              />
              <FunnelRow
                label="Visitatori unici"
                value={data.funnel.unique_visitors}
                max={data.funnel.total_visits}
              />
              <FunnelRow
                label="Visite collezione"
                value={data.funnel.collection_visits}
                max={data.funnel.total_visits}
              />
              <FunnelRow
                label="Visite prodotto (PDP)"
                value={data.funnel.pdp_visits}
                max={data.funnel.total_visits}
              />
              <FunnelRow
                label="Tentativi checkout"
                value={data.funnel.checkout_attempts}
                max={data.funnel.total_visits}
              />
              <FunnelRow
                label="Ordini completati"
                value={data.funnel.orders_completed}
                max={data.funnel.total_visits}
                highlight
              />
            </div>

            {/* Top pages */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
              <h3
                className="text-sm font-medium text-neutral-900 mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Top 10 pagine (30 giorni)
              </h3>
              <ul className="space-y-2.5">
                {data.top_pages.length === 0 && (
                  <li className="text-sm text-neutral-400 italic">
                    Nessun dato.
                  </li>
                )}
                {data.top_pages.map((p, i) => (
                  <li
                    key={p.page_path}
                    className="flex items-center justify-between gap-3 py-1.5 border-b border-neutral-50 last:border-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-neutral-400 w-5 shrink-0">
                        {i + 1}.
                      </span>
                      <span
                        className="text-xs sm:text-sm text-neutral-700 truncate font-mono"
                        title={p.page_path}
                      >
                        {p.page_path}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-neutral-400">
                        {p.unique_visitors} uniq
                      </span>
                      <span className="text-sm font-semibold text-emerald-900 tabular-nums">
                        {p.views.toLocaleString("it-IT")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer info */}
          <p className="text-xs text-neutral-400 text-center pt-2">
            Dati raccolti via tracking interno (no Google Analytics) ·{" "}
            {data.visits_total.toLocaleString("it-IT")} visite all-time da{" "}
            {data.unique_visitors_total.toLocaleString("it-IT")} visitatori unici
          </p>
        </>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  sub: string;
  color: "emerald" | "blue" | "amber" | "green";
}) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-green-50 text-green-700",
  };
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl border border-neutral-100 p-3 lg:p-5 shadow-sm">
      <div
        className={`w-9 h-9 lg:w-10 lg:h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2 lg:mb-3`}
      >
        <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
      </div>
      <p className="text-[10px] lg:text-xs text-neutral-400 uppercase tracking-wider font-sans">
        {label}
      </p>
      <p
        style={{ fontFamily: "var(--font-serif)" }}
        className="text-lg lg:text-2xl font-semibold text-neutral-900 truncate"
      >
        {value}
      </p>
      <p className="text-[10px] lg:text-xs text-neutral-400">{sub}</p>
    </div>
  );
}

function FunnelRow({
  label,
  value,
  max,
  highlight = false,
}: {
  label: string;
  value: number;
  max: number;
  highlight?: boolean;
}) {
  const pct = max === 0 ? 0 : (value / max) * 100;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-neutral-600">{label}</span>
        <span
          className={`text-sm tabular-nums font-semibold ${
            highlight ? "text-emerald-900" : "text-neutral-800"
          }`}
        >
          {value.toLocaleString("it-IT")}
          <span className="text-xs text-neutral-400 ml-1.5">
            ({pct.toFixed(1)}%)
          </span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            highlight ? "bg-emerald-700" : "bg-emerald-400"
          }`}
          style={{ width: `${Math.max(pct, 1)}%` }}
        />
      </div>
    </div>
  );
}
