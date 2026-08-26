/**
 * Stand-alone language shim, shared by every exported widget.
 *
 * The widgets import `useLang` from the site's i18n module, but that provider
 * fetches `/api/site-content` and reads `localStorage` — neither of which
 * exists in a single HTML file or in someone else's project. This shim exposes
 * the same hook shape (`{ lang, t }` plus a setter) backed by nothing more than
 * React state, so a widget can be dropped anywhere.
 *
 * It is used twice: every export build aliases `@/lib/i18n` to this file, and a
 * copy of it ships next to the copyable React sources.
 */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "nl" | "en";

export type LangValue = {
  lang: Lang;
  setLang: (next: Lang) => void;
  /**
   * Present only so the hook matches the site's contract. The exported
   * widgets never call it — all of their copy is passed in or read from a
   * content module — so an unknown key simply returns itself rather than
   * throwing.
   */
  t: (key: string) => string;
};

const LangContext = createContext<LangValue | null>(null);

export function LangProvider({
  children,
  initialLang = "nl",
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const value = useMemo<LangValue>(
    () => ({ lang, setLang, t: (key: string) => key }),
    [lang],
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
