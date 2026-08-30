export function TokamakDiagram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 260" className={className} role="img" aria-label="Tokamak cross-section diagram">
      <defs>
        <radialGradient id="plasmaCore" cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.9" />
          <stop offset="60%" stopColor="var(--plasma)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--plasma-deep)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g stroke="var(--color-border)" fill="none" strokeWidth="1">
        <rect x="0.5" y="0.5" width="399" height="259" />
        <line x1="200" y1="10" x2="200" y2="250" strokeDasharray="4 6" />
      </g>
      <g fill="none" stroke="var(--plasma)" strokeWidth="1.2" opacity="0.85">
        <ellipse cx="285" cy="130" rx="52" ry="80" />
        <ellipse cx="115" cy="130" rx="52" ry="80" />
        <ellipse cx="285" cy="130" rx="34" ry="52" opacity="0.6" />
        <ellipse cx="115" cy="130" rx="34" ry="52" opacity="0.6" />
      </g>
      <ellipse cx="285" cy="130" rx="42" ry="66" fill="url(#plasmaCore)" />
      <ellipse cx="115" cy="130" rx="42" ry="66" fill="url(#plasmaCore)" />
      <g stroke="var(--color-muted-foreground)" strokeWidth="1" fill="none" opacity="0.7">
        <rect x="188" y="30" width="24" height="200" rx="2" />
      </g>
      <g fill="var(--color-muted-foreground)" fontSize="9" fontFamily="var(--font-mono)">
        <text x="176" y="24" textAnchor="middle">CS</text>
        <text x="285" y="222" textAnchor="middle">PLASMA</text>
        <text x="115" y="222" textAnchor="middle">PLASMA</text>
        <text x="340" y="40">TF COIL</text>
      </g>
    </svg>
  );
}

export function FieldLines({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden="true">
      <g fill="none" stroke="var(--plasma)" strokeWidth="0.6" opacity="0.35">
        {Array.from({ length: 14 }).map((_, i) => (
          <ellipse key={i} cx="300" cy="300" rx={60 + i * 18} ry={20 + i * 16} transform={`rotate(${i * 12} 300 300)`} />
        ))}
      </g>
    </svg>
  );
}

export function LawsonChart({ className = "" }: { className?: string }) {
  const pts = [
    [20, 220],
    [80, 180],
    [140, 150],
    [200, 110],
    [260, 78],
    [320, 50],
  ];
  return (
    <svg viewBox="0 0 360 260" className={className} role="img" aria-label="Triple product progress chart">
      <g stroke="var(--color-border)" strokeWidth="1">
        <line x1="30" y1="20" x2="30" y2="240" />
        <line x1="30" y1="240" x2="345" y2="240" />
      </g>
      <line x1="30" y1="60" x2="345" y2="60" stroke="var(--plasma)" strokeDasharray="4 5" strokeWidth="1" opacity="0.7" />
      <text x="36" y="52" fontSize="9" fontFamily="var(--font-mono)" fill="var(--plasma)">
        IGNITION
      </text>
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="1.6"
      />
      {pts.map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r="3" fill="var(--signal)" />
      ))}
      <text x="188" y="256" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)" fill="var(--color-muted-foreground)">
        YEAR →
      </text>
    </svg>
  );
}

export function StabilityDiagram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 200" className={className} role="img" aria-label="MHD stability boundary diagram">
      <rect x="0.5" y="0.5" width="359" height="199" fill="none" stroke="var(--color-border)" />
      <path d="M30 170 C120 160 200 120 330 30" fill="none" stroke="var(--plasma)" strokeWidth="1.4" />
      <path d="M30 170 C120 160 200 120 330 30 L330 170 Z" fill="var(--plasma)" opacity="0.08" />
      <text x="80" y="150" fontSize="10" fontFamily="var(--font-mono)" fill="var(--color-muted-foreground)">
        STABLE
      </text>
      <text x="230" y="70" fontSize="10" fontFamily="var(--font-mono)" fill="var(--destructive)">
        UNSTABLE
      </text>
    </svg>
  );
}

export function Diagram({ kind, className = "" }: { kind?: string; className?: string }) {
  if (kind === "tokamak") return <TokamakDiagram className={className} />;
  if (kind === "lawson") return <LawsonChart className={className} />;
  if (kind === "stability") return <StabilityDiagram className={className} />;
  return <TokamakDiagram className={className} />;
}
