import { useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Briefcase, Check, ExternalLink, Eye, EyeOff, Loader2, Save } from "lucide-react";
import type { TExperience } from "@/types/experience";

export function ExperienceEditor({
  experience,
  onChange,
}: {
  experience: TExperience;
  onChange: (experience: TExperience) => void;
}) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const fieldClass =
    "w-full rounded-xl border border-border bg-card/60 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary font-sans";

  function update(patch: Partial<TExperience>) {
    onChange({ ...experience, ...patch });
    setState("idle");
  }

  async function save() {
    setState("saving");
    try {
      await adminApi.saveExperience(experience);
      setState("saved");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
    }
  }

  const isVisible = experience.visible ?? true;

  return (
    <fieldset
      disabled={state === "saving"}
      className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-sm transition-all hover:border-border"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <legend className="px-0 text-base font-bold text-foreground font-sans">
              {experience.company || "Empresa no especificada"}
            </legend>
            <p className="text-xs text-muted-foreground font-normal">{experience.jobTitle || "Rol sin definir"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px]">
            Orden: #{experience.displayOrder ?? 0}
          </Badge>
          <Badge variant={isVisible ? "default" : "secondary"} className="font-mono text-[10px]">
            {isVisible ? "Visible en web" : "Oculto"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Empresa</span>
          <input
            className={fieldClass}
            value={experience.company || ""}
            placeholder="Ej: GoDaddy, Encora, Indra..."
            onChange={(e) => update({ company: e.target.value })}
          />
        </label>
        <label className="block space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Cargo o Rol</span>
          <input
            className={fieldClass}
            value={experience.jobTitle || ""}
            placeholder="Ej: Senior Fullstack Engineer"
            onChange={(e) => update({ jobTitle: e.target.value })}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Fecha Inicio</span>
          <input
            className={fieldClass}
            value={experience.from || ""}
            placeholder="2023-01"
            onChange={(e) => update({ from: e.target.value })}
          />
        </label>
        <label className="block space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Fecha Fin</span>
          <input
            className={fieldClass}
            value={experience.to || ""}
            placeholder="2024-06 o Presente"
            onChange={(e) => update({ to: e.target.value })}
          />
        </label>
        <label className="block space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Sitio Web Empresa</span>
          <div className="relative">
            <input
              className={fieldClass}
              value={experience.companyUrl || ""}
              placeholder="https://..."
              onChange={(e) => update({ companyUrl: e.target.value })}
            />
            {experience.companyUrl ? (
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </label>
        <div className="space-y-1.5">
          <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Orden y Visibilidad
          </span>
          <div className="flex items-center gap-3 pt-1">
            <input
              type="number"
              className="w-20 rounded-xl border border-border bg-card/60 px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
              value={experience.displayOrder ?? 0}
              onChange={(e) => update({ displayOrder: Number(e.target.value) })}
            />
            <button
              type="button"
              onClick={() => update({ visible: !isVisible })}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs font-medium transition-colors",
                isVisible
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                  : "border-border bg-muted/50 text-muted-foreground hover:text-foreground",
              )}
            >
              {isVisible ? (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>Visible</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>Oculto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <label className="block space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Descripción del Rol y Logros</span>
        <textarea
          rows={4}
          className={`${fieldClass} resize-y font-sans`}
          value={experience.jobDescription || ""}
          placeholder="Responsabilidades, impacto, arquitectura y tecnologías utilizadas..."
          onChange={(e) => update({ jobDescription: e.target.value })}
        />
      </label>

      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <span className="text-[11px] font-mono text-muted-foreground">
          {experience.updatedAt ? `Actualizado: ${new Date(experience.updatedAt).toLocaleDateString()}` : ""}
        </span>
        <button
          type="button"
          onClick={save}
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
              <span>Guardando puesto...</span>
            </>
          ) : state === "saved" ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Puesto guardado</span>
            </>
          ) : state === "error" ? (
            <span>Error al guardar</span>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              <span>Guardar puesto</span>
            </>
          )}
        </button>
      </div>
    </fieldset>
  );
}
