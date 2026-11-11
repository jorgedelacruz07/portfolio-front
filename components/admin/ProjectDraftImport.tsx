import { useRef, useState } from "react";
import axios from "axios";
import { adminApi } from "@/lib/admin-api";
import { readProjectDraft, type ProjectDraftFile } from "@/lib/project-draft";
import type { TProject } from "@/types/project";

export function ProjectDraftImport({ onImported }: { onImported: (project: TProject) => void }) {
  const [draft, setDraft] = useState<ProjectDraftFile | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [technologyInput, setTechnologyInput] = useState("");
  const selection = useRef(0);
  const field = "w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm";

  function update(patch: Partial<ProjectDraftFile["project"]>) {
    if (!draft) return;
    setDraft({ ...draft, project: { ...draft.project, ...patch } });
    setReviewed(false);
    setMessage("");
  }

  async function importDraft() {
    if (!draft || !reviewed || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const imported = await adminApi.importProjectDraft(draft);
      onImported(imported);
      setDraft(null);
      setReviewed(false);
      setMessage("Draft imported. Review the project below before making it visible.");
    } catch (error) {
      setMessage(
        axios.isAxiosError(error)
          ? error.response?.data?.error?.message || "Could not import. Your draft is still here."
          : "Could not import. Your draft is still here.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-border p-4">
      <h3 className="font-semibold">Import a project draft</h3>
      <p className="text-sm text-muted-foreground">
        Choose a prepared draft, review its public text, then import it as hidden. Existing projects are never
        overwritten.
      </p>
      <label className="block space-y-2 text-sm">
        <span>Draft JSON</span>
        <input
          type="file"
          accept=".json,application/json"
          disabled={busy}
          className="block w-full text-sm"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            const current = ++selection.current;
            setDraft(null);
            setReviewed(false);
            setMessage("");
            event.target.value = "";
            if (!file) return;
            try {
              if (file.size > 40000) throw new Error("Choose a draft smaller than 40 KB.");
              const parsed = readProjectDraft(await file.text());
              if (current === selection.current) {
                setDraft(parsed);
                setTechnologyInput((parsed.project.technologyNames || []).join(", "));
              }
            } catch (error) {
              if (current === selection.current)
                setMessage(error instanceof Error ? error.message : "Invalid draft file.");
            }
          }}
        />
      </label>
      {draft ? (
        <fieldset disabled={busy} className="space-y-3">
          <label className="block space-y-1 text-sm">
            Name
            <input className={field} value={draft.project.name} onChange={(e) => update({ name: e.target.value })} />
          </label>
          <label className="block space-y-1 text-sm">
            Slug
            <input className={field} value={draft.project.slug} onChange={(e) => update({ slug: e.target.value })} />
          </label>
          <label className="block space-y-1 text-sm">
            Type
            <input
              className={field}
              value={draft.project.type || ""}
              onChange={(e) => update({ type: e.target.value })}
            />
          </label>
          <label className="block space-y-1 text-sm">
            Public summary
            <textarea
              className={`${field} min-h-24`}
              value={draft.project.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </label>
          <label className="block space-y-1 text-sm">
            Case study
            <textarea
              className={`${field} min-h-48`}
              value={draft.project.longDescription || ""}
              onChange={(e) => update({ longDescription: e.target.value })}
            />
          </label>
          <label className="block space-y-1 text-sm">
            Existing technology names (comma separated)
            <input
              className={field}
              value={technologyInput}
              onChange={(e) => {
                setTechnologyInput(e.target.value);
                update({
                  technologyNames: e.target.value
                    .split(",")
                    .map((name) => name.trim())
                    .filter(Boolean),
                });
              }}
            />
          </label>
          {(["live", "github", "caseStudy"] as const).map((key) => (
            <label key={key} className="block space-y-1 text-sm">
              {{ live: "Live demo", github: "GitHub", caseStudy: "Case study" }[key]} URL
              <input
                className={field}
                value={draft.project.links?.[key] || ""}
                onChange={(e) => {
                  const links = { ...draft.project.links };
                  if (e.target.value) links[key] = e.target.value;
                  else delete links[key];
                  update({ links });
                }}
              />
            </label>
          ))}
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} />I reviewed the
            text and links for public use, including personal information and claims.
          </label>
          <button
            type="button"
            disabled={!reviewed || busy}
            onClick={importDraft}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Importing..." : "Import as hidden draft"}
          </button>
        </fieldset>
      ) : null}
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
