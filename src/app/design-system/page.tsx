import type { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, Info } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageSection } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogExample } from "./dialog-example";

export const metadata: Metadata = {
  title: "Design system | Meu Visto Fácil",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Container>
        <PageSection aria-labelledby="foundation-title" className="pb-10">
          <Badge variant="secondary">Design foundation · 01</Badge>
          <h1
            id="foundation-title"
            className="mt-5 max-w-reading text-display font-semibold"
          >
            Um caminho claro.
            <br />
            <span className="text-primary">Desde o primeiro passo.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            A linguagem visual do Meu Visto Fácil: espaço para respirar,
            informação organizada e orientação em cada detalhe.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Demonstração de componentes. Os exemplos não representam dados ou
            funcionalidades migratórias.
          </p>
        </PageSection>
        <PageSection aria-labelledby="palette-title" className="border-t py-8">
          <h2
            id="palette-title"
            className="mb-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground"
          >
            01 / Identidade
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Petróleo", "Orientação", "bg-primary text-primary-foreground"],
              ["Névoa", "Respiro", "bg-muted text-foreground"],
              ["Sálvia", "Acolhimento", "bg-accent text-accent-foreground"],
              ["Tinta", "Clareza", "bg-foreground text-background"],
            ].map(([name, detail, color]) => (
              <div
                key={name}
                className={`flex min-h-32 flex-col justify-end rounded-xl p-5 ${color}`}
              >
                <p className="font-semibold">{name}</p>
                <p className="mt-1 text-sm">{detail}</p>
              </div>
            ))}
          </div>
        </PageSection>
        <PageSection aria-labelledby="components-title" className="pt-8">
          <h2
            id="components-title"
            className="mb-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground"
          >
            02 / Componentes em contexto
          </h2>
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  <h3>Ações com intenção</h3>
                </CardTitle>
                <CardDescription>
                  Hierarquia clara para a próxima decisão.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Button>
                    Continuar <ArrowUpRight aria-hidden="true" />
                  </Button>
                  <Button variant="secondary">Secundário</Button>
                  <Button variant="outline">Contorno</Button>
                  <Button variant="ghost">Discreto</Button>
                  <Button variant="destructive">Remover</Button>
                  <Button disabled>Indisponível</Button>
                  <Button disabled aria-busy="true">
                    Preparando…
                  </Button>
                </div>
                <DialogExample />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <h3>Informação bem organizada</h3>
                </CardTitle>
                <CardDescription>
                  Campos demonstrativos, sem envio de dados.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="example-name" className="text-sm font-medium">
                    Nome de exibição
                  </label>
                  <Input
                    id="example-name"
                    placeholder="Como você prefere ser chamado?"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="example-select"
                    className="text-sm font-medium"
                  >
                    Densidade da interface
                  </label>
                  <Select defaultValue="comfortable">
                    <SelectTrigger id="example-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comfortable">Confortável</SelectItem>
                      <SelectItem value="compact">Compacta</SelectItem>
                      <SelectItem value="unavailable" disabled>
                        Personalizada (indisponível)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="example-notes"
                    className="text-sm font-medium"
                  >
                    Anotações
                  </label>
                  <Textarea
                    id="example-notes"
                    placeholder="Um espaço para suas ideias."
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="example-error"
                    className="text-sm font-medium"
                  >
                    Exemplo de campo com erro
                  </label>
                  <Input
                    id="example-error"
                    aria-invalid="true"
                    aria-describedby="example-error-message"
                    defaultValue="a"
                  />
                  <p
                    id="example-error-message"
                    className="text-sm text-destructive"
                  >
                    Use pelo menos dois caracteres neste exemplo.
                  </p>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="example-disabled"
                    className="text-sm font-medium"
                  >
                    Campo indisponível
                  </label>
                  <Input
                    id="example-disabled"
                    disabled
                    placeholder="Não disponível neste momento"
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <h3>Estados que orientam</h3>
                </CardTitle>
                <CardDescription>
                  Contexto visível, sem depender apenas da cor.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge>Em andamento</Badge>
                  <Badge variant="secondary">Rascunho</Badge>
                  <Badge variant="outline">Informativo</Badge>
                  <Badge variant="destructive">Precisa de atenção</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span id="progress-label">Progresso demonstrativo</span>
                    <span>60%</span>
                  </div>
                  <Progress aria-labelledby="progress-label" value={60} />
                </div>
                <Alert role="status">
                  <Info aria-hidden="true" className="size-4" />
                  <AlertTitle>Uma informação de cada vez</AlertTitle>
                  <AlertDescription>
                    Mensagens curtas ajudam a entender o próximo passo.
                  </AlertDescription>
                </Alert>
                <Alert
                  role="status"
                  className="border-success/30 bg-success-subtle text-success"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-4 !text-success"
                  />
                  <AlertTitle>Exemplo concluído</AlertTitle>
                  <AlertDescription>
                    O resultado aparece com texto e ícone.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <h3>Tempo para carregar</h3>
                </CardTitle>
                <CardDescription>
                  A estrutura permanece reconhecível enquanto o conteúdo chega.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  role="status"
                  aria-label="Exemplo: carregando conteúdo"
                  className="space-y-4"
                >
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  Foco visível, navegação por teclado e movimento reduzido fazem
                  parte da base.
                </p>
              </CardContent>
            </Card>
          </div>
        </PageSection>
      </Container>
    </main>
  );
}
