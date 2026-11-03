import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  cron: "* * * * *",
  run() {
    const key = process.env.OPENROUTER_API_KEY ?? "";
    console.log(`ENVCHECK key_set=${key.length > 0} length=${key.length}`);
  },
});
