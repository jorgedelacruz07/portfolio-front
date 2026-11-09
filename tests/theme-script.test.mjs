import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const html = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../index.html"),
  "utf8",
);
const script = html.match(
  /<script>\s*(\(function \(\) \{[\s\S]*?\}\)\(\);)\s*<\/script>/,
)?.[1];

function boot(storage) {
  const classes = new Set();
  const root = {
    classList: {
      toggle(name, on) {
        if (on) classes.add(name);
        else classes.delete(name);
      },
    },
    style: { colorScheme: "" },
  };
  vm.runInNewContext(script, {
    window: {
      matchMedia: () => ({ matches: storage.systemDark }),
      localStorage: {
        getItem() {
          if (storage.throws) throw new Error("storage blocked");
          return storage.value;
        },
      },
    },
    document: { documentElement: root },
    localStorage: {
      getItem() {
        if (storage.throws) throw new Error("storage blocked");
        return storage.value;
      },
    },
  });
  return { dark: classes.has("dark"), colorScheme: root.style.colorScheme };
}

test("the index.html theme script is present", () => {
  assert.ok(script);
});

test("theme script follows an explicit choice, system, and a throwing store", () => {
  assert.deepEqual(boot({ value: "light", systemDark: true }), {
    dark: false,
    colorScheme: "light",
  });
  assert.deepEqual(boot({ value: "dark", systemDark: false }), {
    dark: true,
    colorScheme: "dark",
  });
  assert.deepEqual(boot({ value: null, systemDark: true }), {
    dark: true,
    colorScheme: "dark",
  });
  assert.deepEqual(boot({ value: "sepia", systemDark: false }), {
    dark: false,
    colorScheme: "light",
  });
  assert.deepEqual(boot({ throws: true, systemDark: true }), {
    dark: true,
    colorScheme: "dark",
  });
  assert.deepEqual(boot({ throws: true, systemDark: false }), {
    dark: false,
    colorScheme: "light",
  });
});
