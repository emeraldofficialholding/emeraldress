-- Aggiunge colonna newsletter_opt_in al profilo (usata dalla pagina /profilo
-- per il toggle iscrizione newsletter). Default false per backward compat.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS newsletter_opt_in boolean NOT NULL DEFAULT false;
