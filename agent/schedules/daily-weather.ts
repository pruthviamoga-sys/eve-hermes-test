import { readFileSync } from "node:fs";
import path from "node:path";
import { defineSchedule } from "eve/schedules";
import { runFlow } from "../../lib/run-flow";

export default defineSchedule({
    cron: "0 0 * * *",
    run() {
        const flow = JSON.parse(
            readFileSync(path.resolve(process.cwd(), "flows/daily-weather.json"), "utf8"),
        );
        return runFlow(flow);
    },
});