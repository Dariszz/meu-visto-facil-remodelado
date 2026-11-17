import Link from "next/link";
import { Brand } from "./brand";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
export function Header() {
  return (
    <header className="border-b bg-card">
      <Container className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4">
        <Brand />
        <nav
          aria-label="Navegação principal"
          className="order-3 flex w-full flex-wrap gap-x-5 gap-y-1 lg:order-none lg:w-auto"
        >
          {[
            ["como-funciona", "Como funciona"],
            ["por-que-usar", "Por que usar"],
            ["irlanda", "Irlanda"],
            ["sobre", "Sobre"],
          ].map(([id, label]) => (
            <Link
              key={id}
              href={id === "irlanda" ? "/ireland" : `/#${id}`}
              className="inline-flex min-h-11 items-center rounded-md text-sm text-muted-foreground hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium hover:text-primary"
          >
            Entrar
          </Link>
        </div>
        <Button asChild className="hidden sm:inline-flex">
          <Link href="/ireland">Explorar Irlanda</Link>
        </Button>
      </Container>
    </header>
  );
}
