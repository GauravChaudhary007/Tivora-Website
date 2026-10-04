/** Liveness probe for Docker and the deploy script. */
export function GET() {
  return Response.json({ ok: true });
}
