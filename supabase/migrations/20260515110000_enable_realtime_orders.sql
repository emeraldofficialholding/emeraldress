-- Abilita Supabase Realtime su tabella orders.
-- Pannello /admin riceve INSERT in tempo reale via WebSocket, senza polling.
-- Eventi Realtime rispettano RLS, quindi solo admin ricevono i payload.

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
