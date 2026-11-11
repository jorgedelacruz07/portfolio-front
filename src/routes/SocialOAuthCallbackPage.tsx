import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminApi } from "@/lib/admin-api";

export default function SocialOAuthCallbackPage() {
  const { provider: routeProvider } = useParams();
  const [status, setStatus] = useState("Completing account connection…");
  const [accountId, setAccountId] = useState("");
  const startedRef = useRef(false);
  const provider = routeProvider === "linkedin" || routeProvider === "x" ? routeProvider : null;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code") || undefined;
    const state = url.searchParams.get("state") || undefined;
    const error = url.searchParams.get("error") || undefined;

    // The authorization code is short-lived. Remove it from browser history before making requests.
    window.history.replaceState(null, document.title, url.pathname);

    if (!provider) {
      setStatus("Unknown social provider.");
      return;
    }

    let active = true;
    adminApi
      .getSession()
      .then(() => adminApi.completeSocialOAuth(provider, { code, state, error }))
      .then((result) => {
        if (active) {
          setStatus(`${provider === "x" ? "X" : "LinkedIn"} account connected.`);
          setAccountId(result.accountId);
        }
      })
      .catch((reason: unknown) => {
        if (active) setStatus(reason instanceof Error ? reason.message : "Could not complete account connection.");
      });

    return () => {
      active = false;
    };
  }, [provider]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-bold text-foreground">Social account connection</h1>
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
        {status}
      </p>
      {accountId ? (
        <p className="max-w-full break-all rounded-md border border-border bg-card px-3 py-2 font-mono text-xs text-foreground">
          Account ID to pin in the server environment: {accountId}
        </p>
      ) : null}
      <Link to="/admin" className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-muted">
        Return to admin
      </Link>
    </main>
  );
}
