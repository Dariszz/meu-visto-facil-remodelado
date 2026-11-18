import { germanyContent } from "./germany";
import { netherlandsContent } from "./netherlands";
import { portugalContent } from "./portugal";
import { spainContent } from "./spain";
import type { CountryContent } from "./types";

// Destinos publicados com conteúdo revisado (além da Irlanda).
export const destinationContents: readonly CountryContent[] = [
  portugalContent,
  spainContent,
  germanyContent,
  netherlandsContent,
];
