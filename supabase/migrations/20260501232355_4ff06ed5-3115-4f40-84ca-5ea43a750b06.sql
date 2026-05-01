-- Permette al pubblico (visitatori non loggati) di iscriversi alla newsletter
CREATE POLICY "Anyone can subscribe"
ON public.subscribers
FOR INSERT
TO public
WITH CHECK (true);