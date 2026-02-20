import { Suspense } from "react";
import { Navbar } from "./navbar";
import { NavbarSkeleton } from "./navbar-skeleton";
import { Footer } from "./footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
