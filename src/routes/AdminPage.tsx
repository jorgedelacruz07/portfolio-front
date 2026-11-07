import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { adminApi } from "@/lib/admin-api";
import { ProjectDraftImport } from "@/components/admin/ProjectDraftImport";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import type { TPortfolioContent, TProfile, TSiteSettings, TSkill } from "@/types/portfolio";
import type { TExperience } from "@/types/experience";
import type { TProject } from "@/types/project";

type Session = {
  email: string;
  csrfToken: string;
  expiresAt: string;
};

type SaveState = "idle" | "saving" | "saved" | "error";

const inputClass =
  "w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50";
const labelClass = "space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground";

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className={labelClass}>
      {label}
      {textarea ? (
        <textarea
          className={`${inputClass} min-h-28 resize-y normal-case tracking-normal font-sans`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={`${inputClass} normal-case tracking-normal font-sans`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function GoogleLoginForm({
  onSession,
  sessionExpired,
}: {
  onSession: (session: Session) => void;
  sessionExpired?: boolean;
}) {
  const [manualToken, setManualToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "denied" | "unconfigured" | "script_error";
    text: string;
  } | null>(null);
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleCredential = async (credential: string) => {
    if (!credential || !credential.trim()) return;
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await adminApi.loginWithGoogle(credential.trim());
      const session = await adminApi.getSession();
      onSession(session);
    } catch (err: unknown) {
      const is401 = axios.isAxiosError(err) && err.response?.status === 401;
      if (is401) {
        setStatusMessage({
          type: "denied",
          text: "Access denied. Your Google account is not authorized to access this administration console.",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: "The sign-in attempt could not be completed. Please check your connection and try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!clientId) {
      setStatusMessage({
        type: "unconfigured",
        text: "Google Sign-In is not configured. VITE_GOOGLE_CLIENT_ID is required.",
      });
      return;
    }

    let isMounted = true;

    function renderGsiButton() {
      if (!window.google?.accounts?.id || !buttonContainerRef.current) return;
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              handleCredential(response.credential);
            }
          },
          cancel_on_tap_outside: true,
        });

        buttonContainerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonContainerRef.current, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: 320,
        });
      } catch {
        if (isMounted) {
          setStatusMessage({
            type: "script_error",
            text: "Google Sign-In button could not be initialized.",
          });
        }
      }
    }

    if (window.google?.accounts?.id) {
      renderGsiButton();
    } else {
      const existingScript = document.getElementById("google-gsi-client");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-gsi-client";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (isMounted) renderGsiButton();
        };
        script.onerror = () => {
          if (isMounted) {
            setStatusMessage({
              type: "script_error",
              text: "Google Sign-In service could not be loaded. Please check your network or content blocker.",
            });
          }
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener("load", renderGsiButton);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  return (
    <div className="craft-card mx-auto mt-12 max-w-md rounded-xl p-6">
      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">Admin Access</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Manage Portfolio Content</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in with an authorized Google account. Access is restricted server-side against the allowlist.
      </p>

      {sessionExpired && !statusMessage ? (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200"
        >
          Your session has expired. Please sign in again with your Google account.
        </div>
      ) : null}

      {statusMessage ? (
        <div
          role="alert"
          aria-live="assertive"
          className={`mt-4 rounded-lg border p-3 text-xs ${
            statusMessage.type === "denied"
              ? "border-red-500/30 bg-red-500/10 text-red-200"
              : statusMessage.type === "unconfigured"
                ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
                : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          <p>{statusMessage.text}</p>
          {statusMessage.type !== "unconfigured" ? (
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="mt-2 font-mono text-[11px] underline hover:opacity-80"
            >
              Dismiss and retry
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col items-center gap-3">
        {isSubmitting ? (
          <div role="status" aria-live="polite" className="flex items-center gap-2 py-4 text-xs text-muted-foreground">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Verifying credentials with server...
          </div>
        ) : (
          <div
            ref={buttonContainerRef}
            role="region"
            aria-label="Google Sign-In"
            className="flex min-h-[44px] w-full items-center justify-center"
          />
        )}
      </div>

      <details className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
        <summary className="cursor-pointer font-mono hover:text-foreground">
          Manual ID token input (testing / fallback)
        </summary>
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            handleCredential(manualToken);
          }}
          className="mt-3 space-y-3"
        >
          <label htmlFor="manual-token-input" className="block font-mono text-[11px] uppercase text-muted-foreground">
            Google ID Token
          </label>
          <input
            id="manual-token-input"
            type="password"
            className={inputClass}
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Paste Google ID token for manual sign-in"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !manualToken.trim()}
            className="w-full rounded-lg bg-foreground px-4 py-2 font-mono text-xs font-semibold text-background hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Authenticating..." : "Sign in with token"}
          </button>
        </form>
      </details>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="craft-card rounded-xl p-6">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function SaveButton({ state, onClick }: { state: SaveState; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "saving"}
      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
    >
      {state === "saving" ? "Saving..." : state === "saved" ? "Saved" : "Save"}
    </button>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [content, setContent] = useState<TPortfolioContent | null>(null);
  const [projects, setProjects] = useState<TProject[]>([]);
  const [experiences, setExperiences] = useState<TExperience[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getSession()
      .then((s) => {
        setSession(s);
        setSessionExpired(false);
      })
      .catch(() => setSession(null))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!session) return;

    Promise.all([adminApi.getPortfolio(), adminApi.listProjects(), adminApi.listExperiences()])
      .then(([portfolio, projectList, experienceList]) => {
        setContent(portfolio);
        setProjects(projectList);
        setExperiences(experienceList);
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setSession(null);
          setContent(null);
          setSessionExpired(true);
        }
      });
  }, [session]);

  const profile = content?.profile;
  const settings = content?.settings;
  const skills = useMemo(() => content?.skills ?? [], [content?.skills]);

  function updateProfile(next: Partial<TProfile>) {
    if (!content) return;
    setContent({ ...content, profile: { ...content.profile, ...next } });
  }

  function updateSettings(next: Partial<TSiteSettings>) {
    if (!content) return;
    setContent({ ...content, settings: { ...content.settings, ...next } });
  }

  function updateSkill(index: number, next: Partial<TSkill>) {
    if (!content) return;
    const nextSkills = [...skills];
    nextSkills[index] = { ...nextSkills[index], ...next };
    setContent({ ...content, skills: nextSkills });
  }

  async function persist(action: () => Promise<unknown>) {
    setSaveState("saving");
    try {
      await action();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1400);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setSession(null);
        setContent(null);
        setSessionExpired(true);
      }
      setSaveState("error");
    }
  }

  async function logout() {
    try {
      await adminApi.logout();
    } catch {
      // Ignore network errors on logout
    }
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    setSession(null);
    setContent(null);
    setSessionExpired(false);
  }

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">Loading admin...</div>;
  }

  if (!session) {
    return (
      <GoogleLoginForm
        onSession={(nextSession) => {
          setSession(nextSession);
          setSessionExpired(false);
        }}
        sessionExpired={sessionExpired}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin | Jorge de la Cruz</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-14">
        <header className="craft-card flex flex-col gap-4 rounded-xl p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">CMS Dashboard</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Portfolio Content</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Signed in as {session.email} • Session expires {new Date(session.expiresAt).toLocaleTimeString()}.
            </p>
          </div>
          <button
            className="rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </header>

        {!content || !profile || !settings ? (
          <div className="craft-card rounded-xl p-6 text-sm text-muted-foreground">Loading content...</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Profile">
              <Field label="Name" value={profile.name} onChange={(name) => updateProfile({ name })} />
              <Field
                label="Headline"
                value={profile.headline}
                onChange={(headline) => updateProfile({ headline })}
                textarea
              />
              <Field
                label="Short bio"
                value={profile.shortBio}
                onChange={(shortBio) => updateProfile({ shortBio })}
                textarea
              />
              <Field label="Location" value={profile.location} onChange={(location) => updateProfile({ location })} />
              <Field
                label="Availability"
                value={profile.availability}
                onChange={(availability) => updateProfile({ availability })}
              />
              <Field
                label="Contact email"
                value={profile.contactEmail}
                onChange={(contactEmail) => updateProfile({ contactEmail })}
              />
              <SaveButton state={saveState} onClick={() => persist(() => adminApi.saveProfile(profile))} />
            </Section>

            <Section title="Site settings">
              <Field
                label="SEO title"
                value={settings.seoTitle}
                onChange={(seoTitle) => updateSettings({ seoTitle })}
              />
              <Field
                label="SEO description"
                value={settings.seoDescription}
                onChange={(seoDescription) => updateSettings({ seoDescription })}
                textarea
              />
              <Field
                label="Open Graph image"
                value={settings.openGraphImage || ""}
                onChange={(openGraphImage) => updateSettings({ openGraphImage })}
              />
              <Field
                label="Footer text"
                value={settings.footerText}
                onChange={(footerText) => updateSettings({ footerText })}
              />
              <SaveButton state={saveState} onClick={() => persist(() => adminApi.saveSettings(settings))} />
            </Section>

            <Section title="Skills">
              {skills.map((skill, index) => (
                <div
                  key={skill.id || index}
                  className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-3 md:grid-cols-[1fr_1fr_5rem_auto]"
                >
                  <input
                    className={inputClass}
                    value={skill.name}
                    onChange={(event) => updateSkill(index, { name: event.target.value })}
                  />
                  <input
                    className={inputClass}
                    value={skill.category}
                    onChange={(event) => updateSkill(index, { category: event.target.value })}
                  />
                  <input
                    className={inputClass}
                    type="number"
                    value={skill.displayOrder}
                    onChange={(event) =>
                      updateSkill(index, {
                        displayOrder: Number(event.target.value),
                      })
                    }
                  />
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={skill.visible}
                      onChange={(event) => updateSkill(index, { visible: event.target.checked })}
                    />
                    Visible
                  </label>
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold"
                  onClick={() =>
                    setContent({
                      ...content,
                      skills: [
                        ...skills,
                        {
                          name: "New skill",
                          category: "Engineering",
                          priority: skills.length,
                          displayOrder: skills.length,
                          visible: true,
                        },
                      ],
                    })
                  }
                >
                  Add skill
                </button>
                <SaveButton state={saveState} onClick={() => persist(() => adminApi.saveSkills(skills))} />
              </div>
            </Section>

            <Section title="Projects">
              <ProjectDraftImport onImported={(project) => setProjects((current) => [project, ...current])} />
              {projects.map((project) => (
                <ProjectEditor
                  key={project.id}
                  project={project}
                  onChange={(updated) => {
                    setProjects((current) => current.map((item) => (item.id === updated.id ? updated : item)));
                  }}
                />
              ))}
            </Section>

            <Section title="Experience">
              {experiences.map((experience, index) => (
                <div
                  key={experience.id}
                  className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-3 md:grid-cols-[1fr_1fr_5rem_auto]"
                >
                  <input
                    className={inputClass}
                    value={experience.company}
                    onChange={(event) => {
                      const next = [...experiences];
                      next[index] = {
                        ...experience,
                        company: event.target.value,
                      };
                      setExperiences(next);
                    }}
                  />
                  <input
                    className={inputClass}
                    value={experience.jobTitle}
                    onChange={(event) => {
                      const next = [...experiences];
                      next[index] = {
                        ...experience,
                        jobTitle: event.target.value,
                      };
                      setExperiences(next);
                    }}
                  />
                  <input
                    className={inputClass}
                    type="number"
                    value={experience.displayOrder || 0}
                    onChange={(event) => {
                      const next = [...experiences];
                      next[index] = {
                        ...experience,
                        displayOrder: Number(event.target.value),
                      };
                      setExperiences(next);
                    }}
                  />
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={experience.visible ?? true}
                      onChange={(event) => {
                        const next = [...experiences];
                        next[index] = {
                          ...experience,
                          visible: event.target.checked,
                        };
                        setExperiences(next);
                      }}
                    />
                    Visible
                  </label>
                  <textarea
                    className={`${inputClass} md:col-span-4`}
                    value={experience.jobDescription || ""}
                    onChange={(event) => {
                      const next = [...experiences];
                      next[index] = {
                        ...experience,
                        jobDescription: event.target.value,
                      };
                      setExperiences(next);
                    }}
                  />
                  <SaveButton state={saveState} onClick={() => persist(() => adminApi.saveExperience(experience))} />
                </div>
              ))}
            </Section>
          </div>
        )}

        <ArticleEditor />

        {saveState === "error" ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            Save failed. Check that your session is still valid.
          </p>
        ) : null}
      </div>
    </>
  );
}
