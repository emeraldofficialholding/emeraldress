import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/external-client";
import { Star, Loader2, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const Stars = ({
  value,
  onChange,
  size = 16,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) => (
  <div className="flex items-center gap-1" role="radiogroup" aria-label="Valutazione">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type={onChange ? "button" : undefined}
        onClick={onChange ? () => onChange(n) : undefined}
        disabled={!onChange}
        aria-label={`${n} stelle`}
        className={onChange ? "cursor-pointer" : "cursor-default"}
      >
        <Star
          size={size}
          className={n <= value ? "fill-emerald-600 text-emerald-600" : "text-emerald-200"}
        />
      </button>
    ))}
  </div>
);

const ProductReviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("id, customer_name, rating, comment, created_at")
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    setReviews((data as Review[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [productId]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || rating < 1 || rating > 5) {
      toast.error("Inserisci nome e valutazione");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      customer_name: name.trim(),
      rating,
      comment: comment.trim() || null,
      is_approved: false,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Errore. Riprova.");
      return;
    }
    toast.success("Grazie. La recensione è in attesa di moderazione.");
    setName("");
    setComment("");
    setRating(5);
    setShowForm(false);
  };

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="mt-24 border-t border-border pt-16" aria-labelledby="reviews-heading">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-2">
              Cosa dicono di noi
            </p>
            <h2 id="reviews-heading" className="font-serif text-3xl text-foreground">
              Recensioni
            </h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-3 mt-3">
                <Stars value={Math.round(avg)} size={14} />
                <span className="font-sans text-sm text-muted-foreground">
                  {avg.toFixed(1)} · {reviews.length}{" "}
                  {reviews.length === 1 ? "recensione" : "recensioni"}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="self-start sm:self-end px-5 py-2.5 border border-emerald-950 text-emerald-950 font-sans text-[10px] tracking-[0.25em] uppercase hover:bg-[#e4ffec] transition-colors"
          >
            {showForm ? "Annulla" : "Scrivi una recensione"}
          </button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submit}
            className="mb-12 p-6 border border-emerald-100 bg-[#e4ffec]/20 rounded-lg space-y-4"
          >
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-sans text-muted-foreground mb-2">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={80}
                className="w-full px-3 py-2.5 border border-border bg-white text-sm font-sans outline-none focus:border-emerald-700"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-sans text-muted-foreground mb-2">
                Valutazione
              </label>
              <Stars value={rating} onChange={setRating} size={22} />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-sans text-muted-foreground mb-2">
                Commento (opzionale)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={1000}
                className="w-full px-3 py-2.5 border border-border bg-white text-sm font-sans outline-none focus:border-emerald-700 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-950 text-white font-sans text-[11px] tracking-[0.25em] uppercase hover:bg-emerald-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
              Invia recensione
            </button>
            <p className="text-[10px] text-muted-foreground font-sans italic text-center">
              La recensione sarà pubblicata dopo l'approvazione.
            </p>
          </motion.form>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="font-sans text-sm">
              Nessuna recensione ancora. Sii la prima a scriverne una.
            </p>
          </div>
        ) : (
          <ul className="space-y-8">
            {reviews.map((r) => (
              <li key={r.id} className="border-b border-border pb-8 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <Stars value={r.rating} size={13} />
                  <span className="font-serif text-base text-foreground">
                    {r.customer_name}
                  </span>
                  <span className="ml-auto text-[11px] font-sans text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {r.comment && (
                  <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                    {r.comment}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
