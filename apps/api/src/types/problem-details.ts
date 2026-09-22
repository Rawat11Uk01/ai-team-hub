// RFC 7807 — used by error middleware
export type ProblemDetails = {
  type: string; // e.g. "about:blank" or a URI
  title: string; // short summary
  status: number; // HTTP status
  detail?: string; // human-readable explanation
  instance?: string; // request path
  // optional extras:
  requestId?: string;
};
