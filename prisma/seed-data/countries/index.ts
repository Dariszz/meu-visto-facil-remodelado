import { australiaContent } from "./australia";
import { canadaContent } from "./canada";
import { germanyContent } from "./germany";
import { netherlandsContent } from "./netherlands";
import { portugalContent } from "./portugal";
import { spainContent } from "./spain";
import type { CountryContent } from "./types";
import { unitedKingdomContent } from "./united-kingdom";
import { unitedStatesContent } from "./united-states";

// Destinos publicados com conteúdo revisado (além da Irlanda).
export const destinationContents: readonly CountryContent[] = [
  portugalContent,
  spainContent,
  germanyContent,
  netherlandsContent,
  unitedKingdomContent,
  canadaContent,
  unitedStatesContent,
  australiaContent,
];
