import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Fingerprint, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started anonymously — Fusion Connect AI" },
      { name: "description", content: "Pick your interests and education level. Stay anonymous or create a profile." },
      { property: "og:title", content: "Get started anonymously" },
      { property: "og:description", content: "Interest selection, education level and a plain-language privacy screen." },
    ],
  }),
  component: Onboarding,
});

const INTERESTS = [
  "Nuclear fusion",
  "Plasma physics",
  "Tokamaks",
  "Stellarators",
  "Materials science",
  "Diagnostics",
  "Numerical methods",
  "Energy policy",
  "Astrophysical plasmas",
];

const LEVELS = ["Secondary school", "Undergraduate", "Postgraduate", "Researcher", "Educator", "Curious public"];

function Onboarding() {
  const navigate = useNavigate();
  const { setProfile, complete } = useAppState();
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>(["Nuclear fusion"]);
  const [level, setLevel] = useState("Undergraduate");
  const [analyticsOn, setAnalyticsOn] = useState(true);

  const steps = ["Identity", "Interests", "Level", "Privacy"];

  const finish = (anonymous: boolean) => {
    setProfile({ interests, level });
    complete();
    toast.success(anonymous ? "Continuing anonymously" : "Anonymous profile created");
    navigate({ to: "/learn" });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Step {step + 1} of 4 · {steps[step]}</p>
      <Progress value={((step + 1) / 4) * 100} className="mt-4 h-1" />

      <div className="mt-10 rounded-lg border border-border bg-card p-8">
        {step === 0 && (
          <div>
            <Fingerprint className="size-6 text-primary" />
            <h1 className="mt-5 text-3xl font-semibold">You are anonymous by default</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              No email, no name, no social login. We generate a local identifier so your progress persists on this
              device. You can attach a profile later — or never.
            </p>
            <p className="mt-6 hairline inline-block rounded-md px-3 py-2 font-mono text-xs text-primary">
              anon-7f3c-quark
            </p>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-3xl font-semibold">What pulls you in?</h1>
            <p className="mt-3 text-sm text-muted-foreground">Pick as many as you like. This only shapes recommendations.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {INTERESTS.map((i) => {
                const on = interests.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => setInterests((s) => (on ? s.filter((x) => x !== i) : [...s, i]))}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      on ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {on && <Check className="mr-1 inline size-3" />}
                    {i}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-3xl font-semibold">Where are you starting from?</h1>
            <p className="mt-3 text-sm text-muted-foreground">Used to set default module difficulty. Change it anytime.</p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                    level === l ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <Lock className="size-6 text-primary" />
            <h1 className="mt-5 text-3xl font-semibold">Your data, plainly stated</h1>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="hairline rounded-md p-4">
                <strong className="text-foreground">Public:</strong> posts, comments and project proposals you choose to
                publish, under your anonymous handle.
              </li>
              <li className="hairline rounded-md p-4">
                <strong className="text-foreground">Private:</strong> module progress, quiz answers and saved resources.
                Never shown to others.
              </li>
              <li className="hairline rounded-md p-4">
                <strong className="text-foreground">Aggregated:</strong> anonymised counts that help improve the
                curriculum — never linked back to you.
              </li>
            </ul>
            <label className="mt-6 flex items-center justify-between rounded-md border border-border p-4">
              <span className="text-sm">Contribute anonymised engagement statistics</span>
              <Switch checked={analyticsOn} onCheckedChange={setAnalyticsOn} />
            </label>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => finish(true)}>
                Continue anonymously
              </Button>
              <Button onClick={() => finish(false)}>Create profile</Button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Prefer to browse first? <Link to="/learn" className="text-primary">Skip to the modules</Link>.
      </p>
    </div>
  );
}
