import { ReactNode } from "react";
import { Header } from "./Header";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
      <footer className="border-t border-border bg-muted py-6 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 JobTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
