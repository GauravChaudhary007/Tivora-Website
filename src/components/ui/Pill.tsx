export function Pill({ kind }: { kind: "available" | "coming" }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-small font-bold ${
        kind === "available"
          ? "bg-ok-tint text-ok"
          : "bg-tint text-muted in-data-[tone=night]:bg-night-3 in-data-[tone=night]:text-muted-dark"
      }`}
    >
      {kind === "available" ? "Available now" : "Coming"}
    </span>
  );
}
