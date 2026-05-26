import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { adminApi } from "@/lib/api";
import type {
  TPortfolioContent,
  TProfile,
  TSiteSettings,
  TSkill,
} from "@/types/portfolio";
import type { TExperience } from "@/types/experience";
import type { TProject } from "@/types/project";

type Session = {
  email: string;
  csrfToken: string;
  expiresAt: string;
};

type SaveState = "idle" | "saving" | "saved" | "error";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70";
const labelClass =
  "space-y-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground";

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
          className={`${inputClass} min-h-28 resize-y normal-case tracking-normal`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={`${inputClass} normal-case tracking-normal`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function LoginForm({ onSession }: { onSession: (session: Session) => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      if (step === "email") {
        await adminApi.requestCode(email);
        setStep("code");
        setMessage("If access is allowed, a sign-in code will arrive shortly.");
      } else {
        const session = await adminApi.verifyCode(email, code);
        onSession({ email, ...session });
      }
    } catch {
      setMessage("The sign-in attempt could not be completed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-12 max-w-md rounded-2xl border border-white/10 bg-card/80 p-6 shadow-premium"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        Admin access
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Manage portfolio content
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Use your primary admin email. Access is restricted server-side.
      </p>
      <div className="mt-6 space-y-4">
        <Field label="Email" value={email} onChange={setEmail} />
        {step === "code" ? (
          <Field label="Six-digit code" value={code} onChange={setCode} />
        ) : null}
      </div>
      {message ? (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {message}
        </p>
      ) : null}
      <button
        className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting
          ? "Working..."
          : step === "email"
            ? "Request code"
            : "Sign in"}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-card/75 p-5 shadow-premium">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function SaveButton({
  state,
  onClick,
}: {
  state: SaveState;
  onClick: () => void;
}) {
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
  const [content, setContent] = useState<TPortfolioContent | null>(null);
  const [projects, setProjects] = useState<TProject[]>([]);
  const [experiences, setExperiences] = useState<TExperience[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getSession()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!session) return;

    Promise.all([
      adminApi.getPortfolio(),
      adminApi.listProjects(),
      adminApi.listExperiences(),
    ]).then(([portfolio, projectList, experienceList]) => {
      setContent(portfolio);
      setProjects(projectList);
      setExperiences(experienceList);
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
    } catch {
      setSaveState("error");
    }
  }

  async function logout() {
    await adminApi.logout();
    setSession(null);
    setContent(null);
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading admin...
      </div>
    );
  }

  if (!session) {
    return <LoginForm onSession={setSession} />;
  }

  return (
    <>
      <Helmet>
        <title>Admin | Jorge de la Cruz</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-14">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-card/75 p-5 shadow-premium md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              CMS dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Portfolio content
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Signed in as {session.email}. Session expires{" "}
              {new Date(session.expiresAt).toLocaleString()}.
            </p>
          </div>
          <button
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </header>

        {!content || !profile || !settings ? (
          <div className="rounded-2xl border border-white/10 bg-card/75 p-6 text-muted-foreground">
            Loading content...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Profile">
              <Field
                label="Name"
                value={profile.name}
                onChange={(name) => updateProfile({ name })}
              />
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
              <Field
                label="Location"
                value={profile.location}
                onChange={(location) => updateProfile({ location })}
              />
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
              <SaveButton
                state={saveState}
                onClick={() => persist(() => adminApi.saveProfile(profile))}
              />
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
                onChange={(seoDescription) =>
                  updateSettings({ seoDescription })
                }
                textarea
              />
              <Field
                label="Open Graph image"
                value={settings.openGraphImage || ""}
                onChange={(openGraphImage) =>
                  updateSettings({ openGraphImage })
                }
              />
              <Field
                label="Footer text"
                value={settings.footerText}
                onChange={(footerText) => updateSettings({ footerText })}
              />
              <SaveButton
                state={saveState}
                onClick={() => persist(() => adminApi.saveSettings(settings))}
              />
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
                    onChange={(event) =>
                      updateSkill(index, { name: event.target.value })
                    }
                  />
                  <input
                    className={inputClass}
                    value={skill.category}
                    onChange={(event) =>
                      updateSkill(index, { category: event.target.value })
                    }
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
                      onChange={(event) =>
                        updateSkill(index, { visible: event.target.checked })
                      }
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
                <SaveButton
                  state={saveState}
                  onClick={() => persist(() => adminApi.saveSkills(skills))}
                />
              </div>
            </Section>

            <Section title="Projects">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-3 md:grid-cols-[1fr_5rem_auto]"
                >
                  <input
                    className={inputClass}
                    value={project.name}
                    onChange={(event) => {
                      const next = [...projects];
                      next[index] = { ...project, name: event.target.value };
                      setProjects(next);
                    }}
                  />
                  <input
                    className={inputClass}
                    type="number"
                    value={project.displayOrder || 0}
                    onChange={(event) => {
                      const next = [...projects];
                      next[index] = {
                        ...project,
                        displayOrder: Number(event.target.value),
                      };
                      setProjects(next);
                    }}
                  />
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={project.status ?? true}
                      onChange={(event) => {
                        const next = [...projects];
                        next[index] = {
                          ...project,
                          status: event.target.checked,
                        };
                        setProjects(next);
                      }}
                    />
                    Visible
                  </label>
                  <textarea
                    className={`${inputClass} md:col-span-3`}
                    value={project.description}
                    onChange={(event) => {
                      const next = [...projects];
                      next[index] = {
                        ...project,
                        description: event.target.value,
                      };
                      setProjects(next);
                    }}
                  />
                  <SaveButton
                    state={saveState}
                    onClick={() => persist(() => adminApi.saveProject(project))}
                  />
                </div>
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
                  <SaveButton
                    state={saveState}
                    onClick={() =>
                      persist(() => adminApi.saveExperience(experience))
                    }
                  />
                </div>
              ))}
            </Section>
          </div>
        )}

        {saveState === "error" ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            Save failed. Check that your session is still valid.
          </p>
        ) : null}
      </div>
    </>
  );
}
