import { Section } from "@/components/layout/Section";
import { filmReady, type FilmId } from "@/content/videos";
import { VideoBlock } from "./VideoBlock";

/** Heading + film in a full-width section. Omitted in production until the film's files exist (dev shows the empty slot). */
export function VideoSection({
  id,
  tone,
  eyebrow,
  title,
  body,
}: {
  id: FilmId;
  tone: "night" | "ground" | "paper";
  eyebrow?: string;
  title: string;
  body: string;
}) {
  if (process.env.NODE_ENV === "production" && !filmReady(id)) return null;
  const night = tone === "night";
  return (
    <Section tone={tone} size="lg">
      <div className="container-x">
        <div data-reveal="" className="max-w-prose">
          {eyebrow && <p className="font-mono text-eyebrow font-medium uppercase text-gold">{eyebrow}</p>}
          <h2 className={eyebrow ? "mt-3" : ""}>{title}</h2>
          <p className={`mt-5 text-lead ${night ? "text-muted-dark" : "text-muted"}`}>{body}</p>
        </div>
        <VideoBlock id={id} className="mx-auto mt-stack-lg max-w-5xl" />
      </div>
    </Section>
  );
}
