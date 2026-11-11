import { Search, X } from "lucide-react";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
};

export function SearchField({ value, onChange, label, placeholder }: SearchFieldProps) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-10 w-full rounded-md border border-input bg-background py-2 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-1.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
