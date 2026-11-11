import { FormEvent, ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { adminApi } from "@/lib/admin-api";
import { ProjectDraftImport } from "@/components/admin/ProjectDraftImport";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { ExperienceEditor } from "@/components/admin/ExperienceEditor";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  FolderGit2,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import type { TPortfolioContent, TProfile, TSiteSettings, TSkill } from "@/types/portfolio";
import type { TExperience } from "@/types/experience";
import type { TProject } from "@/types/project";

type Session = {
  email: string;
  csrfToken: string;
  expiresAt: string;
};

type SaveState = "idle" | "saving" | "saved" | "error";
type AdminTab = "articles" | "projects" | "experience" | "skills" | "profile";

const inputClass =
  "w-full rounded-xl border border-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary font-sans";

function ModernField({
  label,
  value,
  onChange,
  textarea,
  helperText,
  placeholder,
  rows = 4,
  recommendedLength,
  id: customId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  helperText?: string;
  placeholder?: string;
  rows?: number;
  recommendedLength?: { min: number; max: number };
  id?: string;
}) {
  const generatedId = useId();
  const inputId = customId || generatedId;
  const currentLength = value?.length || 0;

  let lengthStatusColor = "text-muted-foreground";
  if (recommendedLength) {
    if (currentLength >= recommendedLength.min && currentLength <= recommendedLength.max) {
      lengthStatusColor = "text-emerald-400";
    } else if (currentLength > recommendedLength.max) {
      lengthStatusColor = "text-amber-400";
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
        {recommendedLength ? (
          <span className={cn("font-mono text-[10px]", lengthStatusColor)}>
            {currentLength}/{recommendedLength.max} caracteres
          </span>
        ) : null}
      </div>
      {textarea ? (
        <textarea
          id={inputId}
          rows={rows}
          className={`${inputClass} resize-y normal-case tracking-normal`}
          value={value || ""}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={inputId}
          className={`${inputClass} normal-case tracking-normal`}
          value={value || ""}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {helperText ? <p className="text-[11px] text-muted-foreground leading-relaxed">{helperText}</p> : null}
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6 backdrop-blur-sm shadow-sm transition-all">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground font-sans">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {action ? <div className="flex items-center gap-2">{action}</div> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SaveButton({
  state,
  onClick,
  label = "Guardar cambios",
}: {
  state: SaveState;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "saving"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold font-mono transition-all duration-150 disabled:opacity-60 shadow-sm",
        state === "saved"
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
          : state === "error"
            ? "bg-destructive/10 text-destructive border border-destructive/30"
            : "bg-primary text-primary-foreground hover:opacity-90",
      )}
    >
      {state === "saving" ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Guardando...</span>
        </>
      ) : state === "saved" ? (
        <>
          <Check className="h-3.5 w-3.5" />
          <span>Guardado con éxito</span>
        </>
      ) : state === "error" ? (
        <span>Error al guardar</span>
      ) : (
        <>
          <Save className="h-3.5 w-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

function SerpPreview({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-background/90 p-4 font-sans space-y-1.5 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          J
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-medium text-foreground">Jorge de la Cruz</span>
          <span className="text-[10px] text-muted-foreground/80 truncate max-w-[280px]">{url}</span>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-primary hover:underline line-clamp-1 cursor-pointer pt-0.5">
        {title || "Jorge de la Cruz Padilla | Senior Software Engineer"}
      </h3>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {description ||
          "Senior Software Engineer specializing in React.js, TypeScript, Node.js, and Native MongoDB Architecture. Building scalable full-stack applications."}
      </p>
    </div>
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
  const [showTokenText, setShowTokenText] = useState(false);
  const [isManualExpanded, setIsManualExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "denied" | "unconfigured" | "script_error";
    text: string;
  } | null>(null);
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);

  const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const clientId =
    rawClientId
      ?.trim()
      .replace(/^https?:\/\//, "")
      .replace(/\/+$/, "") || undefined;

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
          text: "Acceso denegado. Tu cuenta de Google no está en la lista de administradores autorizados de este portafolio.",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: "No se pudo completar la verificación del inicio de sesión. Por favor, comprueba tu conexión y vuelve a intentarlo.",
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
        text: "Google Sign-In no está configurado. La variable VITE_GOOGLE_CLIENT_ID es obligatoria.",
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
        if (isMounted) {
          setIsGsiLoaded(true);
        }
      } catch {
        if (isMounted) {
          setStatusMessage({
            type: "script_error",
            text: "No se pudo inicializar el botón de Google Sign-In en el navegador.",
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
              text: "No se pudo cargar el servicio de Google Sign-In. Comprueba tu conexión o si tienes un bloqueador de contenido activo.",
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
    <div className="relative flex min-h-[calc(100vh-14rem)] w-full items-center justify-center px-4 py-8">
      {/* Ambient Radial Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[440px] w-[440px] rounded-full bg-primary/10 blur-[110px]" />
      </div>

      <div className="craft-card relative w-full max-w-md rounded-3xl border border-border/80 bg-card/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl transition-all">
        {/* Card Header & Badge */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[11px] font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Portfolio Studio</span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">Admin CMS</span>
        </div>

        <div className="pt-5">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Iniciar Sesión</h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Accede con tu cuenta autorizada de Google para gestionar proyectos, artículos técnicos, experiencia y
            ajustes SEO.
          </p>
        </div>

        {/* Security Informational Banner */}
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border/70 bg-muted/40 p-3 text-xs text-muted-foreground">
          <Lock className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <span className="leading-snug">
            Acceso protegido con Google OAuth 2.0. Solo las identidades verificadas en la lista blanca del servidor
            tienen permisos de administración.
          </span>
        </div>

        {/* Session Expired Alert */}
        {sessionExpired && !statusMessage ? (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200"
          >
            <Clock className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Tu sesión ha expirado</p>
              <p className="mt-0.5 text-amber-200/90 leading-relaxed">
                Por motivos de seguridad, por favor identifícate nuevamente con Google para continuar trabajando.
              </p>
            </div>
          </div>
        ) : null}

        {/* Dynamic Status / Error Messages */}
        {statusMessage ? (
          <div
            role="alert"
            aria-live="assertive"
            className={cn(
              "mt-4 flex flex-col gap-2 rounded-xl border p-3.5 text-xs",
              statusMessage.type === "denied"
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : statusMessage.type === "unconfigured"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                  : "border-destructive/30 bg-destructive/10 text-destructive",
            )}
          >
            <div className="flex items-start gap-2.5">
              {statusMessage.type === "denied" ? (
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed">
                <p className="font-medium">{statusMessage.text}</p>
              </div>
            </div>
            {statusMessage.type !== "unconfigured" ? (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setStatusMessage(null)}
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-medium underline hover:opacity-80 transition-opacity"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Reintentar</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Main Google Button Container */}
        <div className="mt-6 flex flex-col items-center justify-center">
          {isSubmitting ? (
            <div
              role="status"
              aria-live="polite"
              className="flex min-h-[50px] w-full flex-col items-center justify-center gap-2.5 rounded-2xl border border-primary/20 bg-primary/5 py-4 text-xs font-mono text-primary"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Verificando credenciales con el servidor...</span>
            </div>
          ) : (
            <div className="relative flex min-h-[44px] w-full items-center justify-center overflow-hidden">
              {!isGsiLoaded && !statusMessage ? (
                <div className="flex h-[44px] w-[320px] items-center justify-center gap-2.5 rounded-lg border border-border bg-card/60 font-mono text-xs text-muted-foreground animate-pulse">
                  <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <span>Cargando Google Sign-In...</span>
                </div>
              ) : null}
              <div
                ref={buttonContainerRef}
                role="region"
                aria-label="Botón de inicio de sesión con Google"
                className={cn(
                  "flex min-h-[44px] w-full items-center justify-center transition-opacity duration-200",
                  !isGsiLoaded ? "opacity-0 absolute" : "opacity-100",
                )}
              />
            </div>
          )}
        </div>

        {/* Alternative Access (Manual ID Token) */}
        <div className="mt-6 border-t border-border/60 pt-4">
          <button
            type="button"
            onClick={() => setIsManualExpanded(!isManualExpanded)}
            className="flex w-full items-center justify-between font-mono text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-primary" />
              <span>Acceso alternativo / Token de depuración</span>
            </span>
            {isManualExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {isManualExpanded ? (
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                handleCredential(manualToken);
              }}
              className="mt-3 space-y-3 rounded-2xl border border-border/70 bg-card/40 p-4 animate-in fade-in-50 duration-200"
            >
              <div>
                <label
                  htmlFor="manual-token-input"
                  className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                >
                  Token de Identidad Google (ID Token)
                </label>
                <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                  Usa esta opción para pruebas locales o en navegadores con bloqueadores estrictos de Google.
                </p>
              </div>

              <div className="relative">
                <input
                  id="manual-token-input"
                  type={showTokenText ? "text" : "password"}
                  className={`${inputClass} pr-10 font-mono text-xs`}
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Pega aquí el Google ID token para autenticarte..."
                  disabled={isSubmitting}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowTokenText(!showTokenText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  title={showTokenText ? "Ocultar token" : "Mostrar token"}
                >
                  {showTokenText ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !manualToken.trim()}
                className="w-full rounded-xl bg-foreground px-4 py-2.5 font-mono text-xs font-semibold text-background hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Autenticando token...</span>
                  </>
                ) : (
                  <span>Validar token e ingresar</span>
                )}
              </button>
            </form>
          ) : null}
        </div>

        {/* Back Link */}
        <div className="mt-6 border-t border-border/60 pt-4 flex items-center justify-between text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Volver al portafolio</span>
          </Link>
          <span className="font-mono text-[10px] text-muted-foreground">Lima, PE</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [content, setContent] = useState<TPortfolioContent | null>(null);
  const [projects, setProjects] = useState<TProject[]>([]);
  const [experiences, setExperiences] = useState<TExperience[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>("all");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Engineering");

  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab: AdminTab =
    rawTab === "projects" ||
    rawTab === "experience" ||
    rawTab === "skills" ||
    rawTab === "profile" ||
    rawTab === "articles"
      ? rawTab
      : "articles";

  const setTab = (tab: AdminTab) => {
    setSearchParams({ tab }, { replace: true });
  };

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

  const skillCategories = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => {
      if (s.category?.trim()) set.add(s.category.trim());
    });
    return Array.from(set).sort();
  }, [skills]);

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

  function addSkill() {
    if (!content) return;
    const name = newSkillName.trim() || "Nueva Habilidad";
    const category =
      newSkillCategory.trim() || (selectedSkillCategory !== "all" ? selectedSkillCategory : "Engineering");

    setContent({
      ...content,
      skills: [
        ...skills,
        {
          name,
          category,
          priority: skills.length,
          displayOrder: skills.length + 1,
          visible: true,
        },
      ],
    });
    setNewSkillName("");
  }

  function removeSkill(index: number) {
    if (!content) return;
    const nextSkills = skills.filter((_, idx) => idx !== index);
    setContent({ ...content, skills: nextSkills });
  }

  function addExperience() {
    const newExp: TExperience = {
      id: `exp-${Date.now()}`,
      slug: `posicion-${experiences.length + 1}`,
      company: "Nueva Empresa",
      jobTitle: "Senior Software Engineer",
      companyFrom: "2024",
      companyDescription: "",
      companyLogo: "",
      companyUrl: "",
      jobDescription: "",
      from: "2024-01",
      to: "Presente",
      displayOrder: experiences.length + 1,
      visible: true,
      technologyIds: [],
      technologies: [],
      image: { src: "", alt: "" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setExperiences((current) => [newExp, ...current]);
  }

  async function persist(action: () => Promise<unknown>, successMessage = "Cambios guardados correctamente") {
    setSaveState("saving");
    setSaveFeedback(null);
    try {
      await action();
      setSaveState("saved");
      setSaveFeedback(successMessage);
      setTimeout(() => {
        setSaveState("idle");
        setSaveFeedback(null);
      }, 2500);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setSession(null);
        setContent(null);
        setSessionExpired(true);
      }
      setSaveState("error");
      setSaveFeedback("Ocurrió un error al guardar. Verifica que tu sesión siga activa.");
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
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center text-muted-foreground gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="font-mono text-xs">Cargando panel de administración...</p>
      </div>
    );
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

  const tabsConfig = [
    { id: "articles" as const, label: "Artículos & Canales", icon: FileText },
    { id: "projects" as const, label: "Proyectos", icon: FolderGit2, count: projects.length },
    { id: "experience" as const, label: "Experiencia", icon: Briefcase, count: experiences.length },
    { id: "skills" as const, label: "Habilidades", icon: Sparkles, count: skills.length },
    { id: "profile" as const, label: "Perfil & SEO", icon: User },
  ];

  return (
    <>
      <Helmet>
        <title>Portfolio Studio Admin | Jorge de la Cruz</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-20 pt-2">
        {/* Top Studio Header */}
        <header className="rounded-3xl border border-border/80 bg-card/75 p-5 sm:p-6 backdrop-blur-md shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-inner">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl font-serif">
                    Portfolio Studio
                  </h1>
                  <Badge variant="default" className="font-mono text-[10px] tracking-wider uppercase">
                    Admin CMS
                  </Badge>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-foreground font-medium">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {session.email}
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    Expira a las{" "}
                    {new Date(session.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3.5 py-2 font-mono text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 shadow-xs"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Web pública</span>
              </Link>
              <button
                onClick={logout}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3.5 py-2 font-mono text-xs text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-all duration-150 shadow-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>

          {/* Studio Navigation Bar */}
          <nav
            aria-label="Secciones del Administrador"
            className="mt-6 flex flex-wrap gap-1.5 border-t border-border/60 pt-4"
          >
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTab(tab.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined ? (
                    <span
                      className={cn(
                        "ml-0.5 rounded-full px-1.5 py-0.2 font-mono text-[10px]",
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground font-semibold"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {tab.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </header>

        {/* Global Save Feedback Banner */}
        {saveFeedback ? (
          <div
            role="status"
            className={cn(
              "rounded-xl border p-3.5 text-xs font-mono flex items-center gap-2 animate-in fade-in-50 duration-200 shadow-sm",
              saveState === "saved"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-destructive/30 bg-destructive/10 text-destructive",
            )}
          >
            {saveState === "saved" ? <Check className="h-4 w-4" /> : null}
            <span>{saveFeedback}</span>
          </div>
        ) : null}

        {/* TAB 1: Artículos & Canales */}
        {activeTab === "articles" ? (
          <div className="space-y-6">
            <ArticleEditor />
          </div>
        ) : null}

        {/* TAB 2: Proyectos */}
        {activeTab === "projects" ? (
          <div className="space-y-6">
            <SectionCard
              title="Importar Borrador de Proyecto"
              subtitle="Carga archivos JSON de proyectos preparados para incorporarlos como borradores protegidos."
            >
              <ProjectDraftImport onImported={(project) => setProjects((current) => [project, ...current])} />
            </SectionCard>

            <SectionCard
              title="Proyectos en Portafolio"
              subtitle={`Total: ${projects.length} proyecto(s). Edita resúmenes, enlaces a producción, GitHub y visibilidad pública.`}
            >
              <div className="grid gap-4">
                {projects.map((project) => (
                  <ProjectEditor
                    key={project.id}
                    project={project}
                    onChange={(updated) => {
                      setProjects((current) => current.map((item) => (item.id === updated.id ? updated : item)));
                    }}
                  />
                ))}
              </div>
            </SectionCard>
          </div>
        ) : null}

        {/* TAB 3: Experiencia */}
        {activeTab === "experience" ? (
          <div className="space-y-6">
            <SectionCard
              title="Historial de Experiencia Profesional"
              subtitle={`Total: ${experiences.length} puesto(s). Configura empresas, roles, fechas y visibilidad pública.`}
              action={
                <button
                  type="button"
                  onClick={addExperience}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3.5 py-2 font-mono text-xs text-foreground hover:bg-muted transition-colors shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5 text-primary" />
                  <span>Añadir nuevo puesto</span>
                </button>
              }
            >
              <div className="grid gap-4">
                {experiences.map((experience) => (
                  <ExperienceEditor
                    key={experience.id}
                    experience={experience}
                    onChange={(updated) => {
                      setExperiences((current) => current.map((item) => (item.id === updated.id ? updated : item)));
                    }}
                  />
                ))}
              </div>
            </SectionCard>
          </div>
        ) : null}

        {/* TAB 4: Habilidades */}
        {activeTab === "skills" ? (
          <div className="space-y-6">
            <SectionCard
              title="Habilidades y Competencias"
              subtitle={`Total: ${skills.length} habilidad(es). Gestiona las tecnologías mostradas en tu perfil.`}
              action={
                <SaveButton
                  state={saveState}
                  label="Guardar todas las habilidades"
                  onClick={() => persist(() => adminApi.saveSkills(skills), "Habilidades actualizadas con éxito")}
                />
              }
            >
              {/* Add Skill Quick Bar */}
              <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-3">
                <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Añadir Nueva Habilidad
                </span>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    className={`${inputClass} sm:flex-1`}
                    placeholder="Nombre (ej: React, TypeScript, Kubernetes, Go...)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <input
                    type="text"
                    className="w-full sm:w-48 rounded-xl border border-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="Categoría (ej: Frontend)"
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    disabled={!newSkillName.trim()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-foreground px-4 py-2.5 font-mono text-xs font-semibold text-background hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Añadir</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedSkillCategory("all")}
                  className={cn(
                    "rounded-xl px-3 py-1.5 font-mono text-[11px] transition-colors",
                    selectedSkillCategory === "all"
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  Todas ({skills.length})
                </button>
                {skillCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedSkillCategory(cat)}
                    className={cn(
                      "rounded-xl px-3 py-1.5 font-mono text-[11px] transition-colors",
                      selectedSkillCategory === cat
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {cat} ({skills.filter((s) => s.category?.trim() === cat).length})
                  </button>
                ))}
              </div>

              {/* Skills Grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill, index) => {
                  if (selectedSkillCategory !== "all" && skill.category?.trim() !== selectedSkillCategory) {
                    return null;
                  }
                  return (
                    <div
                      key={skill.id || index}
                      className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-3 shadow-xs hover:border-border transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          className="font-semibold text-sm text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none w-full px-1 py-0.5"
                          value={skill.name}
                          placeholder="Nombre de habilidad"
                          onChange={(e) => updateSkill(index, { name: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          title="Eliminar habilidad"
                          className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                            Categoría
                          </label>
                          <input
                            className="w-full rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                            value={skill.category}
                            placeholder="Categoría"
                            onChange={(e) => updateSkill(index, { category: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                            Orden
                          </label>
                          <input
                            type="number"
                            className="w-full rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                            value={skill.displayOrder}
                            onChange={(e) => updateSkill(index, { displayOrder: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
                          <input
                            type="checkbox"
                            checked={skill.visible}
                            className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                            onChange={(e) => updateSkill(index, { visible: e.target.checked })}
                          />
                          <span className="font-mono text-[11px]">{skill.visible ? "Visible" : "Oculto"}</span>
                        </label>
                        {skill.visible ? (
                          <Eye className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-border/60">
                <SaveButton
                  state={saveState}
                  label="Guardar todas las habilidades"
                  onClick={() => persist(() => adminApi.saveSkills(skills), "Habilidades guardadas con éxito")}
                />
              </div>
            </SectionCard>
          </div>
        ) : null}

        {/* TAB 5: Perfil & SEO */}
        {activeTab === "profile" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {!profile ? (
              <div className="flex items-center justify-center p-12 text-muted-foreground text-xs font-mono">
                Cargando datos de perfil...
              </div>
            ) : (
              <SectionCard
                title="Perfil del Desarrollador"
                subtitle="Información principal visible en la portada y cabeceras del portafolio."
                action={
                  <SaveButton
                    state={saveState}
                    label="Guardar Perfil"
                    onClick={() => persist(() => adminApi.saveProfile(profile), "Perfil guardado con éxito")}
                  />
                }
              >
                <ModernField
                  label="Nombre Completo"
                  value={profile.name}
                  onChange={(name) => updateProfile({ name })}
                />
                <ModernField
                  label="Titular Profesional (Headline)"
                  value={profile.headline}
                  placeholder="Ej: Senior Software Engineer | Distributed Systems & Web"
                  onChange={(headline) => updateProfile({ headline })}
                  textarea
                  rows={2}
                />
                <ModernField
                  label="Biografía Breve"
                  value={profile.shortBio}
                  onChange={(shortBio) => updateProfile({ shortBio })}
                  textarea
                  rows={3}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <ModernField
                    label="Ubicación"
                    value={profile.location}
                    placeholder="Lima, PE (UTC-5)"
                    onChange={(location) => updateProfile({ location })}
                  />
                  <ModernField
                    label="Disponibilidad Laboral"
                    value={profile.availability}
                    placeholder="Available for select advisory"
                    onChange={(availability) => updateProfile({ availability })}
                  />
                </div>
                <ModernField
                  label="Email de Contacto"
                  value={profile.contactEmail}
                  onChange={(contactEmail) => updateProfile({ contactEmail })}
                />
              </SectionCard>
            )}

            {!settings ? (
              <div className="flex items-center justify-center p-12 text-muted-foreground text-xs font-mono">
                Cargando ajustes SEO...
              </div>
            ) : (
              <SectionCard
                title="Configuración Global & SEO"
                subtitle="Metadatos indexables por buscadores y vista previa en redes sociales."
                action={
                  <SaveButton
                    state={saveState}
                    label="Guardar SEO"
                    onClick={() => persist(() => adminApi.saveSettings(settings), "Ajustes SEO guardados con éxito")}
                  />
                }
              >
                {/* Live Google Search Preview */}
                <div className="space-y-1.5 pb-2">
                  <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-primary" />
                    <span>Vista Previa en Google SERP</span>
                  </span>
                  <SerpPreview
                    title={settings.seoTitle}
                    description={settings.seoDescription}
                    url="https://jorgedelacruzpadilla.dev"
                  />
                </div>

                <ModernField
                  label="Título SEO (<title>)"
                  value={settings.seoTitle}
                  helperText="Recomendado: 50 a 60 caracteres para óptima visualización en resultados de Google."
                  recommendedLength={{ min: 50, max: 60 }}
                  onChange={(seoTitle) => updateSettings({ seoTitle })}
                />
                <ModernField
                  label="Descripción SEO (<meta description>)"
                  value={settings.seoDescription}
                  helperText="Recomendado: 120 a 160 caracteres resumiendo tu especialidad y experiencia."
                  recommendedLength={{ min: 120, max: 160 }}
                  textarea
                  rows={3}
                  onChange={(seoDescription) => updateSettings({ seoDescription })}
                />
                <ModernField
                  label="Imagen Open Graph (og:image)"
                  value={settings.openGraphImage || ""}
                  placeholder="https://jorgedelacruzpadilla.dev/images/og-image.png"
                  helperText="URL absoluta de la imagen mostrada al compartir enlaces en LinkedIn, X y Slack."
                  onChange={(openGraphImage) => updateSettings({ openGraphImage })}
                />
                <ModernField
                  label="Texto del Pie de Página (Footer)"
                  value={settings.footerText}
                  onChange={(footerText) => updateSettings({ footerText })}
                />
              </SectionCard>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
