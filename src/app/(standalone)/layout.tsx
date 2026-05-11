// Layout standalone: nessuna navbar/footer.
// Usato per /login, /reset-password, /coming-soon, /unsubscribe.
export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
