import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { adminApi } from "@/lib/admin-api";

type Provider = "linkedin" | "x";

interface AccountState {
  configured: boolean;
  connected: boolean;
  valid: boolean;
  expiresAt: number | null;
  ownerVerified: boolean;
}

interface SocialAccounts {
  linkedin: AccountState;
  x: AccountState & { costApproved: boolean };
}

function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error?.message || error.response?.data?.message || "The request failed.";
  }
  return error instanceof Error ? error.message : "The request failed.";
}

export function SocialAccountConnections() {
  const [accounts, setAccounts] = useState<SocialAccounts | null>(null);
  const [busy, setBusy] = useState<Provider | null>(null);
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    const result = await adminApi.getSocialIntegrations();
    setAccounts(result.accounts);
  }, []);

  useEffect(() => {
    refresh().catch((error: unknown) => setMessage(`Could not load social account status: ${errorMessage(error)}`));
  }, [refresh]);

  async function connect(provider: Provider) {
    setBusy(provider);
    setMessage("");
    try {
      const url = await adminApi.getSocialAuthorizationUrl(provider);
      window.location.assign(url);
    } catch (error: unknown) {
      setMessage(`Could not connect ${provider === "x" ? "X" : "LinkedIn"}: ${errorMessage(error)}`);
      setBusy(null);
    }
  }

  async function disconnect(provider: Provider) {
    const name = provider === "x" ? "X" : "LinkedIn";
    if (!window.confirm(`Disconnect the Portfolio ${name} account?`)) return;
    setBusy(provider);
    setMessage("");
    try {
      await adminApi.disconnectSocial(provider);
      await refresh();
      setMessage(`${name} disconnected.`);
    } catch (error: unknown) {
      setMessage(`Could not disconnect ${name}: ${errorMessage(error)}`);
    } finally {
      setBusy(null);
    }
  }

  function accountCard(provider: Provider, account: AccountState, costApproved = true) {
    const name = provider === "x" ? "X" : "LinkedIn";
    const canConnect = account.configured && costApproved;
    const label = !account.configured
      ? "Not configured"
      : account.connected && account.valid && account.ownerVerified
        ? "Connected"
        : account.connected
          ? "Reconnect required"
          : "Not connected";

    return (
      <div
        key={provider}
        className="flex flex-col gap-3 rounded-lg border border-border bg-background/40 p-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          {provider === "x" && !costApproved ? (
            <p className="mt-1 text-xs text-amber-400">
              Connect and publishing are disabled until X API spend is approved.
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          {account.connected ? (
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => disconnect(provider)}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground disabled:opacity-50"
            >
              {busy === provider ? "Working…" : "Disconnect"}
            </button>
          ) : (
            <button
              type="button"
              disabled={!canConnect || busy !== null}
              onClick={() => connect(provider)}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy === provider ? "Opening…" : `Connect ${name}`}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="social-account-connections-heading"
      className="space-y-3 rounded-xl border border-border bg-card/60 p-4"
    >
      <div>
        <h3 id="social-account-connections-heading" className="text-sm font-semibold text-foreground">
          Social accounts
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Connect the owner accounts used for article delivery. Access tokens stay server-side.
        </p>
      </div>
      {accounts ? (
        <div className="grid gap-3 md:grid-cols-2">
          {accountCard("linkedin", accounts.linkedin)}
          {accountCard("x", accounts.x, accounts.x.costApproved)}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Loading connection status…</p>
      )}
      {message ? (
        <p role="status" aria-live="polite" className="text-xs text-amber-400">
          {message}
        </p>
      ) : null}
    </section>
  );
}
