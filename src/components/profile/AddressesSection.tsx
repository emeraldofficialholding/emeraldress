"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, MapPin, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

const supabase = getSupabaseBrowserClient();

export interface UserAddress {
  id: string;
  user_id: string;
  label: string | null;
  first_name: string;
  last_name: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  postal_code: string;
  state: string | null;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

type FormState = Omit<UserAddress, "id" | "user_id" | "created_at" | "updated_at">;

const EMPTY_FORM: FormState = {
  label: "",
  first_name: "",
  last_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  postal_code: "",
  state: "",
  country: "IT",
  is_default: false,
};

export function AddressesSection({ userId }: { userId: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("user_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true });
    setLoading(false);
    if (error) {
      toast({ title: "Errore", description: "Impossibile caricare gli indirizzi.", variant: "destructive" });
      return;
    }
    setAddresses((data as UserAddress[]) ?? []);
  }, [userId, toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchAddresses();
  }, [fetchAddresses]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, is_default: addresses.length === 0 });
    setDialogOpen(true);
  };

  const openEdit = (addr: UserAddress) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label ?? "",
      first_name: addr.first_name,
      last_name: addr.last_name,
      phone: addr.phone ?? "",
      line1: addr.line1,
      line2: addr.line2 ?? "",
      city: addr.city,
      postal_code: addr.postal_code,
      state: addr.state ?? "",
      country: addr.country,
      is_default: addr.is_default,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const required: (keyof FormState)[] = ["first_name", "last_name", "line1", "city", "postal_code", "country"];
    for (const key of required) {
      if (!String(form[key] ?? "").trim()) {
        toast({ title: "Campi mancanti", description: "Compila tutti i campi obbligatori.", variant: "destructive" });
        return;
      }
    }
    setSaving(true);
    const payload = {
      ...form,
      label: form.label?.trim() || null,
      phone: form.phone?.trim() || null,
      line2: form.line2?.trim() || null,
      state: form.state?.trim() || null,
      user_id: userId,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = (supabase as any).from("user_addresses");
    const { error } = editingId
      ? await table.update(payload).eq("id", editingId)
      : await table.insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editingId ? "Indirizzo aggiornato" : "Indirizzo aggiunto" });
    setDialogOpen(false);
    void fetchAddresses();
  };

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("user_addresses").delete().eq("id", id);
    setDeleteId(null);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Indirizzo eliminato" });
    void fetchAddresses();
  };

  const handleSetDefault = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("user_addresses")
      .update({ is_default: true })
      .eq("id", id);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
      return;
    }
    void fetchAddresses();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-emerald-900/70">
          {addresses.length === 0
            ? "Nessun indirizzo salvato."
            : `${addresses.length} ${addresses.length === 1 ? "indirizzo" : "indirizzi"}`}
        </p>
        <Button onClick={openAdd} size="sm" className="bg-emerald-900 hover:bg-emerald-950 text-white">
          <Plus className="w-4 h-4 mr-1" />
          Aggiungi
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8 text-emerald-900/60 text-sm">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-emerald-700/40" />
          Salva un indirizzo per ritrovarlo al prossimo ordine.
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-emerald-100 bg-white p-4 flex items-start gap-3"
            >
              <MapPin className="w-4 h-4 text-emerald-700 mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-medium text-emerald-950">
                    {a.label || `${a.first_name} ${a.last_name}`}
                  </p>
                  {a.is_default && (
                    <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                      <Star className="w-2.5 h-2.5 fill-emerald-700" />
                      Predefinito
                    </span>
                  )}
                </div>
                <p className="text-sm text-emerald-900/80 leading-snug">
                  {a.first_name} {a.last_name}
                  <br />
                  {a.line1}
                  {a.line2 ? `, ${a.line2}` : ""}
                  <br />
                  {a.postal_code} {a.city}
                  {a.state ? `, ${a.state}` : ""} · {a.country}
                  {a.phone ? (
                    <>
                      <br />
                      <span className="text-emerald-900/60">{a.phone}</span>
                    </>
                  ) : null}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {!a.is_default && (
                    <button
                      onClick={() => handleSetDefault(a.id)}
                      className="text-[10px] tracking-[0.2em] uppercase text-emerald-700 hover:text-emerald-950 underline-offset-2 hover:underline"
                    >
                      Imposta predefinito
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(a)}
                    className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-emerald-700 hover:text-emerald-950"
                  >
                    <Pencil className="w-3 h-3" />
                    Modifica
                  </button>
                  <button
                    onClick={() => setDeleteId(a.id)}
                    className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-red-600/80 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifica indirizzo" : "Nuovo indirizzo"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <Label htmlFor="addr-label" className="text-xs">Etichetta (es. Casa, Ufficio)</Label>
              <Input
                id="addr-label"
                value={form.label ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="addr-fn" className="text-xs">Nome *</Label>
              <Input
                id="addr-fn"
                autoComplete="given-name"
                value={form.first_name}
                onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="addr-ln" className="text-xs">Cognome *</Label>
              <Input
                id="addr-ln"
                autoComplete="family-name"
                value={form.last_name}
                onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="addr-l1" className="text-xs">Indirizzo *</Label>
              <Input
                id="addr-l1"
                autoComplete="address-line1"
                value={form.line1}
                onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                className="mt-1"
                placeholder="Via, numero civico"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="addr-l2" className="text-xs">Indirizzo 2</Label>
              <Input
                id="addr-l2"
                autoComplete="address-line2"
                value={form.line2 ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
                className="mt-1"
                placeholder="Scala, interno, c/o"
              />
            </div>
            <div>
              <Label htmlFor="addr-zip" className="text-xs">CAP *</Label>
              <Input
                id="addr-zip"
                autoComplete="postal-code"
                inputMode="numeric"
                value={form.postal_code}
                onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="addr-city" className="text-xs">Città *</Label>
              <Input
                id="addr-city"
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="addr-state" className="text-xs">Provincia</Label>
              <Input
                id="addr-state"
                autoComplete="address-level1"
                value={form.state ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                className="mt-1"
                placeholder="MI, RM, ..."
              />
            </div>
            <div>
              <Label htmlFor="addr-country" className="text-xs">Paese *</Label>
              <Input
                id="addr-country"
                autoComplete="country"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value.toUpperCase() }))}
                className="mt-1"
                maxLength={2}
                placeholder="IT"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="addr-phone" className="text-xs">Telefono</Label>
              <Input
                id="addr-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="mt-1"
                placeholder="+39 ..."
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                id="addr-default"
                type="checkbox"
                checked={form.is_default}
                onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
                className="w-4 h-4 accent-emerald-700"
              />
              <Label htmlFor="addr-default" className="text-xs cursor-pointer">
                Imposta come indirizzo predefinito
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Annulla
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-900 hover:bg-emerald-950 text-white"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Salva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare l&apos;indirizzo?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
