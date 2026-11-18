import Link from "next/link";
import { Container } from "./container";
import { Brand } from "./brand";
import { ThemeSelect } from "@/components/theme/theme-select";
export function Footer() {
  return (
    <footer className="border-t bg-card py-8">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <Brand />
          <nav
            aria-label="Navegação do rodapé"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
          >
            <Link
              href="/#sobre"
              className="inline-flex min-h-11 items-center rounded-md text-primary"
            >
              Sobre
            </Link>
            <Link
              href="/privacidade"
              className="inline-flex min-h-11 items-center rounded-md text-primary"
            >
              Privacidade
            </Link>
            <Link
              href="/termos"
              className="inline-flex min-h-11 items-center rounded-md text-primary"
            >
              Termos
            </Link>
          </nav>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-4 border-t pt-6 text-xs leading-relaxed text-muted-foreground">
          <p className="max-w-3xl">
            Aplicativo de teste, sem fins financeiros. Orientação informativa:
            não substitui assessoria oficial, não oferecemos aconselhamento
            jurídico nem garantimos elegibilidade ou aprovação. As informações
            podem mudar; confirme sempre nos sites oficiais do governo.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p>Meu Visto Fácil: clareza para o seu próximo passo.</p>
            <ThemeSelect />
          </div>
        </div>
      </Container>
    </footer>
  );
}
