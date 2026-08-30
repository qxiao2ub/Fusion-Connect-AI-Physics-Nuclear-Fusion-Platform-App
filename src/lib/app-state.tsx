import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type State = {
  anonId: string;
  interests: string[];
  level: string;
  onboarded: boolean;
  upvoted: string[];
  saved: string[];
  completed: string[];
};

type Ctx = State & {
  setProfile: (p: { interests: string[]; level: string }) => void;
  complete: () => void;
  toggleUpvote: (id: string) => void;
  toggleSave: (id: string) => void;
  toggleComplete: (slug: string) => void;
};

const AppStateContext = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({
    anonId: "anon-7f3c-quark",
    interests: ["Nuclear fusion", "Plasma physics"],
    level: "Undergraduate",
    onboarded: false,
    upvoted: [],
    saved: ["p3"],
    completed: ["electromagnetism"],
  });

  const setProfile = useCallback((p: { interests: string[]; level: string }) => {
    setState((s) => ({ ...s, interests: p.interests, level: p.level }));
  }, []);
  const complete = useCallback(() => setState((s) => ({ ...s, onboarded: true })), []);
  const toggle = (key: "upvoted" | "saved" | "completed") => (id: string) =>
    setState((s) => ({
      ...s,
      [key]: s[key].includes(id) ? s[key].filter((x) => x !== id) : [...s[key], id],
    }));

  const toggleUpvote = useCallback(toggle("upvoted"), []);
  const toggleSave = useCallback(toggle("saved"), []);
  const toggleComplete = useCallback(toggle("completed"), []);

  const value = useMemo(
    () => ({ ...state, setProfile, complete, toggleUpvote, toggleSave, toggleComplete }),
    [state, setProfile, complete, toggleUpvote, toggleSave, toggleComplete],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
