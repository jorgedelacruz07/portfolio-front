import { useState } from "react";
import { adminApi } from "@/lib/admin-api";
import type { TProject } from "@/types/project";

export function ProjectEditor({ project, onChange }: { project: TProject; onChange: (project: TProject) => void }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const field = "w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm";
  function update(patch: Partial<TProject>) {
    onChange({ ...project, ...patch });
    setState("idle");
  }
  async function save() {
    setState("saving");
    try {
      await adminApi.saveProject(project);
      setState("saved");
    } catch {
      setState("error");
    }
  }
  return (
    <fieldset disabled={state === "saving"} className="space-y-3 rounded-xl border border-border p-4">
      <legend className="px-1 text-sm font-semibold">{project.name}</legend>
      <label className="block space-y-1 text-sm">
        Name
        <input className={field} value={project.name} onChange={(e) => update({ name: e.target.value })} />
      </label>
      <label className="block space-y-1 text-sm">
        Summary
        <textarea
          className={`${field} min-h-24`}
          value={project.description}
          onChange={(e) => update({ description: e.target.value })}
        />
      </label>
      <label className="block space-y-1 text-sm">
        Case study
        <textarea
          className={`${field} min-h-48`}
          value={project.longDescription || ""}
          onChange={(e) => update({ longDescription: e.target.value })}
        />
      </label>
      <label className="block space-y-1 text-sm">
        Live URL
        <input
          className={field}
          value={project.url || ""}
          onChange={(e) => update({ url: e.target.value, links: { ...project.links, live: e.target.value || null } })}
        />
      </label>
      {(["github", "caseStudy"] as const).map((key) => (
        <label key={key} className="block space-y-1 text-sm">
          {{ github: "GitHub", caseStudy: "Case study" }[key]} URL
          <input
            className={field}
            value={project.links?.[key] || ""}
            onChange={(e) => update({ links: { ...project.links, [key]: e.target.value || null } })}
          />
        </label>
      ))}
      <label className="block space-y-1 text-sm">
        Display order
        <input
          className={field}
          type="number"
          value={project.displayOrder || 0}
          onChange={(e) => update({ displayOrder: Number(e.target.value) })}
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={project.status ?? false}
          onChange={(e) => update({ status: e.target.checked })}
        />
        Visible on the public website after saving
      </label>
      <button
        type="button"
        onClick={save}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        {state === "saving" ? "Saving..." : "Save project"}
      </button>
      <p role="status" className="text-sm text-muted-foreground">
        {state === "saved" ? "Project saved." : state === "error" ? "Could not save. Your edits are still here." : ""}
      </p>
    </fieldset>
  );
}
