import { FILMS, filmReady, fmtTime, videoUrls, type FilmId } from "@/content/videos";
import { VideoPlayer } from "./VideoPlayer";

/**
 * A film in the site frame: player, caption line, demo caption, transcript (WCAG 1.2.1 media alternative).
 * Files missing (renders not made yet): nothing in production, so a deploy never ships a dead player;
 * in dev an empty 16:9 slot, so the layout can still be reviewed.
 */
export function VideoBlock({ id, className = "" }: { id: FilmId; className?: string }) {
  const f = FILMS[id];
  const length = fmtTime(f.duration);
  if (!filmReady(id)) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div className={className}>
        <div className="flex aspect-video w-full items-center justify-center rounded-frame border border-rule bg-tint p-4 text-center text-small text-muted in-data-[tone=night]:border-rule-dark in-data-[tone=night]:bg-night-3 in-data-[tone=night]:text-muted-dark">
          Film not rendered yet: {f.title} ({length}). Run npm run video:render.
        </div>
      </div>
    );
  }
  const u = videoUrls(id);
  return (
    <figure className={className}>
      <VideoPlayer title={f.title} length={length} poster={u.poster} posterAlt={f.posterAlt} src1080={u.src1080} src720={u.src720} vtt={u.vtt} />
      <details className="mt-3 rounded-lg border border-rule px-4 py-2 in-data-[tone=night]:border-rule-dark">
        <summary className="min-h-11 cursor-pointer py-2 font-bold">Read the video as text</summary>
        <ol className="space-y-1 pb-3 text-small">
          {f.transcript.map(([t, text]) => (
            <li key={`${t}-${text}`} className="flex gap-3">
              <span className="w-10 shrink-0 font-mono text-muted in-data-[tone=night]:text-muted-dark">{fmtTime(t)}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </details>
    </figure>
  );
}
