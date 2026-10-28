import assert from "node:assert/strict";
import { test } from "node:test";
import { orderPublicProjects } from "../lib/project-order.ts";

test("CMS featured selection takes precedence over legacy API order without mutating its cache", () => {
  const projects = [
    { name: "Portfolio", displayOrder: 40 },
    { name: "IdeaDesk", featured: true, displayOrder: 30 },
    { name: "AcademyDB", featured: true, displayOrder: 20 },
    { name: "FinTracking", featured: true, displayOrder: 10 },
    { name: "UnaLuka", displayOrder: 70 },
  ];
  assert.deepEqual(
    orderPublicProjects(projects).map((p) => p.name),
    ["FinTracking", "AcademyDB", "IdeaDesk", "Portfolio", "UnaLuka"],
  );
  assert.equal(projects[0].name, "Portfolio");
});

test("unranked and tied projects retain their existing order and missing flags are supported", () => {
  const projects = [{ name: "A" }, { name: "B", displayOrder: null }, { name: "C", featured: false }];
  assert.deepEqual(orderPublicProjects(projects), projects);
});
