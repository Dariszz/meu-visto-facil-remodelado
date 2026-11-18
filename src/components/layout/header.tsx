import { readSessionHint } from "@/lib/auth/session-hint";
import { HeaderView } from "./header-view";

export async function Header() {
  return <HeaderView signedIn={await readSessionHint()} />;
}
