import { appendFileSync } from "node:fs";
import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  cron: "0 0 * * *",
  run() {
    appendFileSync("fixed-report.log", `Fixed flow ran without AI at ${new Date().toISOString()}\n`);
  },
});