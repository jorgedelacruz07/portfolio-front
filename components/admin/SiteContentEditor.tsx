import { SITE_COPY_GROUPS, type TSiteCopy } from "@/lib/site-copy";

const inputClass =
  "w-full rounded-xl border border-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary";

export function SiteContentEditor({ value, onChange }: { value: TSiteCopy; onChange: (next: TSiteCopy) => void }) {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Administra el contenido editorial que aparece en el sitio público. Los campos conservan el texto actual cuando
        todavía no se han personalizado.
      </p>
      {SITE_COPY_GROUPS.map((group) => (
        <section key={group.title} className="rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6">
          <h3 className="mb-4 border-b border-border/60 pb-3 text-base font-bold tracking-tight text-foreground">
            {group.title}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {group.fields.map(([key, label]) => {
              const isLongText =
                key.endsWith("description") ||
                key.endsWith("Description") ||
                key.endsWith(".items") ||
                key.includes("copyright") ||
                key.includes("privateRepos") ||
                key.includes("companiesLabel");
              return (
                <div className="space-y-1.5" key={key}>
                  <label
                    htmlFor={`site-copy-${key}`}
                    className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {label}
                  </label>
                  {isLongText ? (
                    <textarea
                      id={`site-copy-${key}`}
                      rows={3}
                      className={`${inputClass} resize-y`}
                      value={value[key]}
                      onChange={(event) => onChange({ ...value, [key]: event.target.value })}
                    />
                  ) : (
                    <input
                      id={`site-copy-${key}`}
                      className={inputClass}
                      value={value[key]}
                      onChange={(event) => onChange({ ...value, [key]: event.target.value })}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
