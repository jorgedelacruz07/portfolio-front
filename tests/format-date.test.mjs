import process from "node:process";
import assert from "node:assert/strict";
import { test } from "node:test";
import { formatDateRange } from "../lib/utils.ts";

test("month labels do not shift with the viewer's time zone", () => {
  for (const timeZone of ["America/Lima", "America/Los_Angeles", "UTC", "Asia/Tokyo"]) {
    process.env.TZ = timeZone;
    assert.equal(formatDateRange("2026-05-01", null), "May 2026 - Present", timeZone);
    assert.equal(formatDateRange("2022-12-01", "2026-05-31"), "Dec 2022 - May 2026", timeZone);
    assert.equal(formatDateRange("2021-11-01", "2022-08-31"), "Nov 2021 - Aug 2022", timeZone);
  }
});
