import assert from "node:assert/strict";
import { test } from "node:test";
import { experienceGroupMatches, groupExperiences, visibleHighlights } from "../lib/experience-groups.ts";

function role(partial) {
  return {
    id: partial.slug,
    slug: partial.slug,
    company: partial.company,
    companyFrom: partial.companyFrom ?? "Remote",
    companyDescription: partial.companyDescription ?? "",
    companyLogo: "",
    jobTitle: partial.jobTitle ?? "Engineer",
    jobDescription: partial.jobDescription ?? "",
    from: partial.from,
    to: partial.to ?? null,
    technologies: partial.technologies ?? [],
    highlights: partial.highlights ?? [],
    image: { src: "" },
    technologyIds: [],
    createdAt: "",
    updatedAt: "",
  };
}

const portfolioRoles = [
  role({
    slug: "coforge",
    company: "Coforge",
    jobTitle: "Senior Software Engineer",
    companyDescription: "Global digital services and IT consulting company.",
    jobDescription: "At Coforge, I worked on various projects.",
    from: "2026-05-01",
    to: null,
  }),
  role({
    slug: "opis-dow-jones",
    company: "OPIS · Dow Jones",
    jobTitle: "Senior Software Engineer",
    jobDescription: "Building and maintaining web applications for OPIS.",
    from: "2026-05-01",
    to: null,
    technologies: [{ id: "react", name: "React.js" }],
  }),
  role({
    slug: "godaddy",
    company: "GoDaddy",
    jobTitle: "Software Developer",
    jobDescription: "I am dedicated to the Conversations team.",
    from: "2022-12-05",
    to: "2026-04-30",
    technologies: [{ id: "ts", name: "TypeScript" }],
  }),
  role({
    slug: "encora",
    company: "Encora",
    jobTitle: "Senior Software Engineer",
    companyDescription: "Encora accelerates business outcomes for clients.",
    jobDescription: "At Encora, I worked on various projects.",
    from: "2022-12-01",
    to: "2026-05-31",
  }),
  role({
    slug: "seeri",
    company: "Seeri",
    jobTitle: "Software Engineer",
    from: "2021-11-01",
    to: "2022-08-31",
  }),
];

test("groups Encora and Coforge as one employer and nests GoDaddy and OPIS as clients", () => {
  const originalOrder = portfolioRoles.map((item) => item.slug);
  const groups = groupExperiences(portfolioRoles);

  assert.deepEqual(
    groups.map((group) => group.companyLabel),
    ["Coforge (formerly Encora)", "Seeri"],
  );
  assert.deepEqual(originalOrder, ["coforge", "opis-dow-jones", "godaddy", "encora", "seeri"]);

  const employer = groups[0];
  assert.equal(employer.jobTitle, "Senior Software Engineer");
  assert.equal(employer.from, "2022-12-01");
  assert.equal(employer.to, null);
  assert.equal(employer.summary, "Employer since Dec 2022. Encora became Coforge in May 2026.");
  assert.deepEqual(
    employer.clients.map((client) => client.company),
    ["OPIS · Dow Jones", "GoDaddy"],
  );
  assert.equal(employer.logoExperience.slug, "coforge");
  assert.equal(groups[1].clients.length, 0);
  assert.equal(groups[1].experience.slug, "seeri");
});

test("keeps a single Coforge record addressable after the employer entries are merged", () => {
  const groups = groupExperiences([
    role({
      slug: "coforge",
      company: "Coforge",
      from: "2022-12-01",
      to: null,
      jobTitle: "Senior Software Engineer",
    }),
    role({
      slug: "godaddy",
      company: "GoDaddy",
      from: "2022-12-05",
      to: "2026-04-30",
    }),
    role({
      slug: "opis-dow-jones",
      company: "OPIS - Dow Jones",
      from: "2026-05-01",
      to: null,
    }),
  ]);

  assert.equal(groups.length, 1);
  assert.equal(groups[0].companyLabel, "Coforge (formerly Encora)");
  assert.equal(groups[0].from, "2022-12-01");
  assert.deepEqual(
    groups[0].clients.map((client) => client.slug),
    ["opis-dow-jones", "godaddy"],
  );
});

test("keeps client and employer highlights available for the grouped card", () => {
  const groups = groupExperiences([
    role({
      slug: "coforge",
      company: "Coforge",
      from: "2026-05-01",
      highlights: ["Led the platform", " led the platform "],
    }),
    role({
      slug: "godaddy",
      company: "GoDaddy",
      from: "2022-12-05",
      to: "2026-04-30",
      highlights: ["Shipped Conversations", "Shipped Conversations"],
    }),
    role({
      slug: "opis-dow-jones",
      company: "OPIS · Dow Jones",
      from: "2026-05-01",
      highlights: ["  Maintained pricing tools  "],
    }),
  ]);
  const employer = groups[0];
  const godaddy = employer.clients.find((client) => client.slug === "godaddy");
  const opis = employer.clients.find((client) => client.slug === "opis-dow-jones");

  assert.deepEqual(visibleHighlights([employer.experience]), ["Led the platform"]);
  assert.deepEqual(visibleHighlights([godaddy]), ["Shipped Conversations"]);
  assert.deepEqual(visibleHighlights([opis]), ["Maintained pricing tools"]);
  assert.equal(experienceGroupMatches(employer, "conversations"), true);
});

test("search matches a nested client without dropping the employer card", () => {
  const groups = groupExperiences(portfolioRoles);
  const employer = groups[0];

  assert.equal(experienceGroupMatches(employer, "godaddy"), true);
  assert.equal(experienceGroupMatches(employer, "encora"), true);
  assert.equal(experienceGroupMatches(employer, "seeri"), false);
  assert.equal(experienceGroupMatches(employer, "", "TypeScript"), true);
  assert.equal(experienceGroupMatches(employer, "", "PHP"), false);
  assert.equal(experienceGroupMatches(groups[1], "seeri"), true);
});
