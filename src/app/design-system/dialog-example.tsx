"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir exemplo de diálogo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Um passo de cada vez</DialogTitle>
          <DialogDescription>
            Este é um exemplo de diálogo da interface. Nenhuma informação será
            enviada ou salva.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Use Tab para navegar entre os controles e Escape para fechar. O foco
          retorna ao botão que abriu esta janela.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Entendi</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
