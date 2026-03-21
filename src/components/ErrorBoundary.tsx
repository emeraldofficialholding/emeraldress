import React from "react";

interface State { hasError: boolean }

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center px-4">
            <p className="font-serif text-2xl text-neutral-400 italic mb-6">
              Qualcosa è andato storto.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors border border-border px-6 py-3"
            >
              Riprova
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
