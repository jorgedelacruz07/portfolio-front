import { useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/svgs/Github";
import { cn } from "@/lib/utils";
import { Check, ExternalLink, Globe, Loader2, Save } from "lucide-react";
import type { TProject } from "@/types/project";

export function ProjectEditor({ project, onChange }: { project: TProject; onChange: (project: TProject) => void }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const fieldClass =
    "w-full rounded-xl border border-border bg-card/60 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary font-sans";

  function update(patch: Partial<TProject>) {
    onChange({ ...project, ...patch });
    setState("idle");
  }

  async function save() {
    setState("saving");
    try {
      await adminApi.saveProject(project);
      setState("saved");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
    }
  }

  return (
    <fieldset
      disabled={state === "saving"}
      className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-sm transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/50 pb-3">
        <div className="flex items-center gap-2.5">
          <Globe className="h-4 w-4 text-primary" />
          <legend className="px-0 text-base font-bold text-foreground font-sans">{project.name || "Sin título"}</legend>
          {project.type ? (
            <Badge variant="outline" className="font-mono text-[10px]">
              {project.type}
            </Badge>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px]">
            Orden: #{project.displayOrder || 0}
          </Badge>
          <Badge variant={project.status ? "default" : "secondary"} className="font-mono text-[10px]">
            {project.status ? "Visible en web" : "Oculto"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Nombre del Proyecto</span>
          <input
            className={fieldClass}
            value={project.name}
            placeholder="Ej: FinTrackingApp, RutinAI..."
            onChange={(e) => update({ name: e.target.value })}
          />
        </label>
        <label className="block space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Slug Identificador</span>
          <input
            className={fieldClass}
            value={project.slug || ""}
            placeholder="fintracking-app"
            onChange={(e) => update({ slug: e.target.value })}
          />
        </label>
      </div>

      <label className="block space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Resumen Corto (Portada)</span>
        <textarea
          rows={3}
          className={`${fieldClass} resize-y font-sans`}
          value={project.description}
          placeholder="Descripción concisa mostrada en la tarjeta principal del portafolio..."
          onChange={(e) => update({ description: e.target.value })}
        />
      </label>

      <label className="block space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Caso de Estudio Detallado (Long Description)</span>
        <textarea
          rows={6}
          className={`${fieldClass} resize-y font-sans`}
          value={project.longDescription || ""}
          placeholder="Arquitectura, decisiones técnicas, métricas de rendimiento y stack implementado..."
          onChange={(e) => update({ longDescription: e.target.value })}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ExternalLink className="h-3 w-3" />
            <span>URL en Producción (Live)</span>
          </span>
          <input
            className={fieldClass}
            value={project.url || ""}
            placeholder="https://..."
            onChange={(e) => update({ url: e.target.value, links: { ...project.links, live: e.target.value || null } })}
          />
        </label>

        <label className="block space-y-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <GithubIcon width={12} height={12} />
            <span>Repositorio GitHub</span>
          </span>
          <input
            className={fieldClass}
            value={project.links?.github || ""}
            placeholder="https://github.com/..."
            onChange={(e) => update({ links: { ...project.links, github: e.target.value || null } })}
          />
        </label>

        <div className="space-y-1.5">
          <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Orden y Visibilidad
          </label>
          <div className="flex items-center gap-3">
            <input
              className="w-24 rounded-xl border border-border bg-card/60 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              type="number"
              value={project.displayOrder || 0}
              onChange={(e) => update({ displayOrder: Number(e.target.value) })}
            />
            <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                checked={project.status ?? false}
                onChange={(e) => update({ status: e.target.checked })}
              />
              <span>Visible</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/50 pt-3">
        <div role="status" className="text-xs font-mono">
          {state === "saved" ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Proyecto guardado correctamente.
            </span>
          ) : state === "error" ? (
            <span className="text-destructive">Error al guardar. Tus cambios se mantienen en el formulario.</span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={save}
          disabled={state === "saving"}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold font-mono transition-all duration-150 disabled:opacity-60",
            state === "saved"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : state === "error"
                ? "bg-destructive/10 text-destructive border border-destructive/30"
                : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
          )}
        >
          {state === "saving" ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              <span>Guardar proyecto</span>
            </>
          )}
        </button>
      </div>
    </fieldset>
  );
}
