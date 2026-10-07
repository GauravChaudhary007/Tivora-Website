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
    <Section tone={tone} size="md">
      <div className="container-x grid items-center gap-stack lg:grid-cols-12 lg:gap-8">
        <div data-reveal="" className="max-w-prose lg:col-span-4">
          {eyebrow && <p className="font-mono text-eyebrow font-medium uppercase text-gold">{eyebrow}</p>}
          <h2 className={eyebrow ? "mt-3" : ""}>{title}</h2>
          <p className={`mt-4 text-lead ${night ? "text-muted-dark" : "text-muted"}`}>{body}</p>
        </div>
        <VideoBlock id={id} className="lg:col-span-8" />
      </div>
    </Section>
  );
}
