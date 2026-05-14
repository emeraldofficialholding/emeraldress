-- Realtime su returns + reservations per pannello /admin.
-- - returns: nuove richieste reso appaiono live nel pannello "Resi"
-- - reservations: counter "clienti in checkout adesso" nella dashboard

ALTER PUBLICATION supabase_realtime ADD TABLE public.returns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
